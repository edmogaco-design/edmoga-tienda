import { NextResponse } from "next/server";
import { pedidoSchema, mensajePedido, codigoDesde } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/config";
import { crearPedidoDropi, dropiConfigurado } from "@/lib/dropi";
import { costoEnvio } from "@/lib/envios";
import { guardarResultado, reservar } from "@/lib/unaVez";

// shortcut: límite en memoria por instancia (se salta cambiando de instancia); pasarlo al
// registro compartido (unaVez) si llegan pedidos basura.
const intentos = new Map<string, { n: number; desde: number }>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 5;

function limitado(ip: string): boolean {
  const ahora = Date.now();
  if (intentos.size > 1000) {
    for (const [k, v] of intentos) if (ahora - v.desde > VENTANA_MS) intentos.delete(k);
  }
  const r = intentos.get(ip);
  if (!r || ahora - r.desde > VENTANA_MS) {
    intentos.set(ip, { n: 1, desde: ahora });
    return false;
  }
  r.n += 1;
  return r.n > MAX_INTENTOS;
}

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

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limitado(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  const producto = obtenerProducto(r.data.producto);
  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const subtotal = producto.precio * r.data.cantidad;
  const envio = costoEnvio(r.data.departamento, r.data.ciudad);
  const codigo = codigoDesde(r.data.idSolicitud);

  // La misma solicitud (idSolicitud) no crea un segundo pedido en Dropi, aunque llegue a otra
  // instancia. Si el registro compartido falla, se sigue: el cliente igual llega a WhatsApp.
  const clave = `edmoga:pedido:${r.data.idSolicitud}`;
  let crearEnDropi = dropiConfigurado();
  try {
    const reserva = await reservar<Record<string, unknown>>(clave);
    if (!reserva.nueva && reserva.cuerpo) return NextResponse.json(reserva.cuerpo);
    if (!reserva.nueva) crearEnDropi = false; // otra petición lo está creando ahora mismo
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
    dropiId: producto.dropiId,
    cantidad: r.data.cantidad,
    departamento: r.data.departamento,
    dropi: dropi === null ? "no_configurado" : dropi.ok ? "creado" : `fallo:${dropi.motivo}`,
    dropiPedido: dropi?.ok ? dropi.dropiId : null,
  });

  if (dropi && !dropi.ok) console.error("dropi_fallo", { codigo, motivo: dropi.motivo });

  const cuerpo = {
    estado: "pendiente_confirmacion_whatsapp",
    codigo,
    registradoEnDropi: dropi?.ok === true,
    whatsapp: enlaceWhatsApp(mensajePedido(r.data, subtotal, envio, producto.nombre, codigo)),
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
