import { NextResponse, after } from "next/server";
import { pedidoSchema, mensajePedido, mensajePedidoTransferencia, codigoDesde } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { datosTransferencia, enlaceWhatsApp } from "@/lib/config";
import { crearPedidoDropi, dropiConfigurado } from "@/lib/dropi";
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

  const producto = obtenerProducto(r.data.producto);
  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  // Transferencia: el cliente paga antes con llave Bre-B (envío gratis, como Bold) y manda el
  // comprobante por WhatsApp. No va a Dropi hasta que el dueño verifique que el dinero entró.
  const esTransferencia = r.data.metodo === "transferencia";
  const transferencia = esTransferencia ? datosTransferencia() : null;
  if (esTransferencia && !transferencia) {
    return NextResponse.json({ error: "El pago por transferencia no está disponible." }, { status: 400 });
  }

  const subtotal = producto.precio * r.data.cantidad;
  const envio = esTransferencia ? 0 : costoEnvio(r.data.departamento, r.data.ciudad);
  const codigo = codigoDesde(r.data.idSolicitud);
  const estado = esTransferencia ? "pendiente_comprobante_transferencia" : "pendiente_confirmacion_whatsapp";

  // La misma solicitud (idSolicitud) no crea un segundo pedido en Dropi, aunque llegue a otra
  // instancia. Si el registro compartido falla, se sigue: el cliente igual llega a WhatsApp.
  const clave = `edmoga:pedido:${r.data.idSolicitud}`;
  let crearEnDropi = dropiConfigurado() && !esTransferencia;
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

  // Contra entrega: el pedido se registra en Dropi como pendiente de confirmación.
  // La venta NO se da por cerrada aquí: un asesor la confirma por WhatsApp.
  // Si Dropi falla, el cliente igual llega a WhatsApp y el pedido se carga a mano.
  const dropi = crearEnDropi ? await crearPedidoDropi(r.data, producto, codigo, { envio }) : null;

  // Logs sin datos personales.
  console.info("pedido_iniciado", {
    codigo,
    metodo: r.data.metodo,
    dropiId: producto.dropiId,
    cantidad: r.data.cantidad,
    departamento: r.data.departamento,
    dropi: dropi === null ? "no_configurado" : dropi.ok ? "creado" : `fallo:${dropi.motivo}`,
    dropiPedido: dropi?.ok ? dropi.dropiId : null,
  });

  if (dropi && !dropi.ok) console.error("dropi_fallo", { codigo, motivo: dropi.motivo });

  const estadoDropi = esTransferencia
    ? "espera_pago"
    : dropi === null
      ? "no_configurado"
      : dropi.ok ? "creado" : `fallo:${dropi.motivo}`.slice(0, 200);
  if (esNueva) {
    const fila = filaPedido(r.data, {
      codigo,
      metodo: esTransferencia ? "transferencia" : "contra_entrega",
      estado,
      producto: producto.nombre,
      subtotal,
      envio,
      total: subtotal + envio,
      orden_bold: null,
      transaccion_bold: null,
      dropi: estadoDropi,
      dropi_pedido: dropi?.ok ? dropi.dropiId : null,
    });
    after(registrarPedido(fila)); // se guarda después de responder, sin demorar al cliente
  }

  const cuerpo = {
    estado,
    codigo,
    registradoEnDropi: dropi?.ok === true,
    whatsapp: enlaceWhatsApp(
      esTransferencia
        ? mensajePedidoTransferencia(r.data, subtotal, producto.nombre, codigo)
        : mensajePedido(r.data, subtotal, envio, producto.nombre, codigo),
    ),
    ...(transferencia ? { transferencia: { ...transferencia, total: subtotal } } : {}),
    // Solo en entornos de prueba: motivo del fallo de Dropi para diagnosticar. Nunca en producción.
    ...(process.env.VERCEL_ENV !== "production" && dropi && !dropi.ok
      ? { diagnosticoDropi: dropi.motivo }
      : {}),
  };
  await guardarResultado(clave, cuerpo).catch((e) =>
    console.error("registro_no_guardado", { codigo, error: String(e) }),
  );
  return NextResponse.json(cuerpo);
}
