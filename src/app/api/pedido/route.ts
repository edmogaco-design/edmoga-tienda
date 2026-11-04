import { NextResponse } from "next/server";
import { pedidoSchema, mensajePedido } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/config";

// Límite simple en memoria (por instancia). Se reemplazará por uno persistente en la Fase 2.
const intentos = new Map<string, { n: number; desde: number }>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 5;

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limitado(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429 },
    );
  }

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

  const producto = obtenerProducto(r.data.producto);
  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const total = producto.precio * r.data.cantidad;

  // La venta NO se confirma aquí: se deriva al WhatsApp de ventas.
  // Pendiente Fase 1: crear el pedido en Dropi (DROPI_TOKEN) y registrar la fila en Google Sheets.
  // Log sin datos personales.
  console.info("pedido_iniciado", {
    dropiId: producto.dropiId,
    cantidad: r.data.cantidad,
    ciudad: r.data.ciudad,
  });

  return NextResponse.json({
    estado: "pendiente_confirmacion_whatsapp",
    whatsapp: enlaceWhatsApp(mensajePedido(r.data, total, producto.nombre)),
  });
}
