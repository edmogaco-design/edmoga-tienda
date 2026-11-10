import { NextResponse, after } from "next/server";
import { z } from "zod";
import { pedidoSchema, codigoDesde, mensajePedidoPagado } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/config";
import { consultarPago } from "@/lib/bold";
import { crearPedidoDropi, dropiConfigurado } from "@/lib/dropi";
import { guardarResultado, ipCliente, limitado, reservar } from "@/lib/unaVez";
import { filaPedido, registrarPedido } from "@/lib/registro";

const entrada = z.object({
  orden: z.string().regex(/^EDM-[A-Z0-9]{8}-[A-Z0-9]{4,12}$/),
  pedido: pedidoSchema,
});

export async function POST(req: Request) {
  // Cada llamada consulta a Bold: límite holgado para no bloquear recargas legítimas.
  if (await limitado(`pago-confirmar:${ipCliente(req)}`, 20, 600)) {
    return NextResponse.json({ error: "Demasiados intentos. Intenta de nuevo en unos minutos." }, { status: 429 });
  }
  let datos: unknown;
  try {
    datos = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
  const r = entrada.safeParse(datos);
  if (!r.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const { orden, pedido } = r.data;
  const codigo = codigoDesde(pedido.idSolicitud);
  // La orden debe corresponder a estos datos de pedido.
  if (!orden.startsWith(`${codigo}-`)) {
    return NextResponse.json({ error: "La orden no corresponde al pedido" }, { status: 400 });
  }

  const producto = obtenerProducto(pedido.producto);
  if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  const esperado = producto.precio * pedido.cantidad;

  // Regla de oro: se verifica con Bold, no con lo que diga la URL de retorno.
  const pago = await consultarPago(orden);
  if (!pago.ok) {
    return NextResponse.json({ estado: "sin_verificar", codigo }, { status: 502 });
  }
  if (pago.estado !== "APPROVED") {
    return NextResponse.json({ estado: pago.estado, codigo });
  }
  if (pago.total !== esperado || (pago.referencia && pago.referencia !== orden)) {
    // Monto o referencia no cuadran: no se despacha. Revisión manual.
    console.error("pago_no_cuadra", { orden, esperado, recibido: pago.total });
    return NextResponse.json({ estado: "REVISION_MANUAL", codigo });
  }

  // Un pago = un pedido en Dropi, aunque la confirmación se repita en otra instancia.
  // Si el registro compartido no responde, no se arriesga un despacho doble: el cliente reintenta.
  const clave = `edmoga:pago:${orden}`;
  let reserva;
  try {
    reserva = await reservar<Record<string, unknown>>(clave);
  } catch (e) {
    console.error("registro_no_disponible", { orden, error: String(e) });
    return NextResponse.json({ estado: "sin_verificar", codigo }, { status: 502 });
  }
  if (!reserva.nueva) {
    // Otra petición ya lo creó (se devuelve lo mismo) o lo está creando (el cliente reintenta).
    return NextResponse.json(reserva.cuerpo ?? { estado: "PROCESSING", codigo });
  }

  const dropi = dropiConfigurado()
    ? await crearPedidoDropi(pedido, producto, codigo, { pagoBold: { transaccion: pago.transaccion } })
    : null;

  console.info("pago_confirmado", {
    codigo,
    orden,
    total: pago.total,
    transaccion: pago.transaccion,
    dropi: dropi === null ? "no_configurado" : dropi.ok ? "creado" : `fallo:${dropi.motivo}`,
  });

  const fila = filaPedido(pedido, {
    codigo,
    metodo: "bold",
    estado: "pagado",
    producto: producto.nombre,
    subtotal: esperado,
    envio: 0,
    total: esperado,
    orden_bold: orden,
    transaccion_bold: pago.transaccion,
    dropi: dropi === null ? "no_configurado" : dropi.ok ? "creado" : `fallo:${dropi.motivo}`.slice(0, 200),
    dropi_pedido: dropi?.ok ? dropi.dropiId : null,
  });
  after(registrarPedido(fila)); // se guarda después de responder, sin demorar al cliente

  const cuerpo = {
    estado: "APPROVED",
    codigo,
    transaccion: pago.transaccion,
    total: pago.total,
    registradoEnDropi: dropi?.ok === true,
    whatsapp: enlaceWhatsApp(
      mensajePedidoPagado(pedido, esperado, producto.nombre, codigo, pago.transaccion),
    ),
  };
  await guardarResultado(clave, cuerpo).catch((e) =>
    console.error("registro_no_guardado", { orden, error: String(e) }),
  );
  return NextResponse.json(cuerpo);
}
