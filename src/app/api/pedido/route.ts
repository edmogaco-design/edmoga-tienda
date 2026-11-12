import { NextResponse, after } from "next/server";
import { pedidoSchema, mensajePedido, codigoDesde, lineasDe, resumenLineas, subtotalDe } from "@/lib/pedido";
import { catalogoVigente } from "@/lib/precios";
import { enlaceWhatsApp } from "@/lib/config";
import { crearPedidosDropi, dropiConfigurado, resumenDropi } from "@/lib/dropi";
import { costoEnvio } from "@/lib/envios";
import { guardarResultado, ipCliente, limitado, reservar } from "@/lib/unaVez";
import { filaPedido, registrarPedido } from "@/lib/registro";

export async function POST(req: Request) {
  let datos: unknown;
  try {
    datos = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const r = pedidoSchema.safeParse(datos);
  if (!r.success) {
    return NextResponse.json(
      { error: "Revisa los datos del formulario", campos: r.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // 5 pedidos cada 10 minutos por IP, compartido entre instancias (Redis).
  if (await limitado(`pedido:${ipCliente(req)}`, 5, 600)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  // Los precios SIEMPRE salen del servidor (catálogo + cambios del dueño en /admin).
  const lineas = lineasDe(r.data.items, await catalogoVigente());
  if (!lineas) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const subtotal = subtotalDe(lineas);
  // Un envío por producto distinto: cada uno viaja en su propio paquete.
  const envioPaquete = costoEnvio(r.data.departamento, r.data.ciudad);
  const envio = envioPaquete * lineas.length;
  const codigo = codigoDesde(r.data.idSolicitud);

  // La misma solicitud (idSolicitud) no crea un segundo pedido en Dropi, aunque llegue a otra
  // instancia. Si el registro compartido falla, se sigue: el cliente igual llega a WhatsApp.
  const clave = `edmoga:pedido:${r.data.idSolicitud}`;
  let crearEnDropi = dropiConfigurado();
  let esNueva = true;
  try {
    const reserva = await reservar<Record<string, unknown>>(clave);
    if (!reserva.nueva && reserva.cuerpo) return NextResponse.json(reserva.cuerpo);
    if (!reserva.nueva) {
      crearEnDropi = false; // otra petición lo está creando ahora mismo
      esNueva = false;
    }
  } catch (e) {
    console.error("registro_no_disponible", { codigo, error: String(e) });
  }

  // Contra entrega: cada renglón se registra en Dropi como pendiente de confirmación.
  // La venta NO se da por cerrada aquí: un asesor la confirma por WhatsApp.
  // Si Dropi falla, el cliente igual llega a WhatsApp y el pedido se carga a mano.
  const dropi = resumenDropi(
    crearEnDropi ? await crearPedidosDropi(r.data, lineas, codigo, { envio: envioPaquete }) : null,
  );

  // Logs sin datos personales.
  console.info("pedido_iniciado", {
    codigo,
    productos: lineas.map((l) => ({ dropiId: l.producto.dropiId, cantidad: l.cantidad })),
    departamento: r.data.departamento,
    dropi: dropi.estado,
    dropiPedido: dropi.pedido,
  });

  if (crearEnDropi && !dropi.todos) console.error("dropi_fallo", { codigo, motivo: dropi.estado });

  if (esNueva) {
    const fila = filaPedido(r.data, {
      codigo,
      metodo: "contra_entrega",
      estado: "pendiente_confirmacion_whatsapp",
      producto: resumenLineas(lineas).slice(0, 500),
      cantidad: lineas.reduce((n, l) => n + l.cantidad, 0),
      subtotal,
      envio,
      total: subtotal + envio,
      orden_bold: null,
      transaccion_bold: null,
      dropi: dropi.estado,
      dropi_pedido: dropi.pedido,
    });
    after(registrarPedido(fila)); // se guarda después de responder, sin demorar al cliente
  }

  const cuerpo = {
    estado: "pendiente_confirmacion_whatsapp",
    codigo,
    registradoEnDropi: dropi.todos,
    whatsapp: enlaceWhatsApp(mensajePedido(r.data, lineas, envio, codigo)),
    // Solo en entornos de prueba: motivo del fallo de Dropi para diagnosticar. Nunca en producción.
    ...(process.env.VERCEL_ENV !== "production" && crearEnDropi && !dropi.todos
      ? { diagnosticoDropi: dropi.estado }
      : {}),
  };
  await guardarResultado(clave, cuerpo).catch((e) =>
    console.error("registro_no_guardado", { codigo, error: String(e) }),
  );
  return NextResponse.json(cuerpo);
}
