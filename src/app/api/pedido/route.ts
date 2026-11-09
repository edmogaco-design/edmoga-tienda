import { NextResponse } from "next/server";
import { pedidoSchema, mensajePedido, codigoDesde } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/config";
import { crearPedidoDropi, dropiConfigurado } from "@/lib/dropi";
import { costoEnvio } from "@/lib/envios";

// Límite simple en memoria (por instancia). Se reemplazará por uno persistente en la Fase 2.
const intentos = new Map<string, { n: number; desde: number }>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 5;

// Idempotencia: la misma solicitud (idSolicitud) devuelve la misma respuesta y no crea
// un segundo pedido en Dropi. En memoria por instancia; pasará a Supabase en la Fase 2.
const respuestas = new Map<string, { cuerpo: Record<string, unknown>; en: number }>();
const VIGENCIA_MS = 30 * 60 * 1000;

function limitado(ip: string): boolean {
  const ahora = Date.now();
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

  const previa = respuestas.get(r.data.idSolicitud);
  if (previa && Date.now() - previa.en < VIGENCIA_MS) {
    return NextResponse.json(previa.cuerpo);
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
  const envio = costoEnvio(r.data.departamento);
  const codigo = codigoDesde(r.data.idSolicitud);

  // Contra entrega: el pedido se registra en Dropi como pendiente de confirmación.
  // La venta NO se da por cerrada aquí: un asesor la confirma por WhatsApp.
  // Si Dropi falla, el cliente igual llega a WhatsApp y el pedido se carga a mano.
  const dropi = dropiConfigurado() ? await crearPedidoDropi(r.data, producto, codigo, { envio }) : null;

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
  respuestas.set(r.data.idSolicitud, { cuerpo, en: Date.now() });
  return NextResponse.json(cuerpo);
}
