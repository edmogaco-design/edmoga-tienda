import { NextResponse } from "next/server";
import { pedidoSchema, codigoDesde, lineasDe, resumenLineas, subtotalDe } from "@/lib/pedido";
import { catalogoVigente } from "@/lib/precios";
import { claveCotizacion, cotizar } from "@/lib/cotizacion";
import { SITE } from "@/lib/config";
import { boldConfigurado, firmaIntegridad, llaveIdentidad } from "@/lib/bold";
import { guardarResultado, ipCliente, limitado } from "@/lib/unaVez";

// Prepara el botón de Bold. El monto SIEMPRE se calcula aquí, nunca se toma del navegador.
export async function POST(req: Request) {
  if (!boldConfigurado()) {
    return NextResponse.json({ error: "El pago en línea aún no está disponible." }, { status: 503 });
  }
  if (await limitado(`pago-iniciar:${ipCliente(req)}`, 10, 600)) {
    return NextResponse.json({ error: "Demasiados intentos. Intenta de nuevo en unos minutos." }, { status: 429 });
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

  const lineas = lineasDe(r.data.items, await catalogoVigente());
  if (!lineas) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const codigo = codigoDesde(r.data.idSolicitud);
  // Cada intento de pago tiene su propio identificador (Bold no permite reutilizarlo).
  const orden = `${codigo}-${Date.now().toString(36).toUpperCase()}`;
  const monto = subtotalDe(lineas); // envío gratis pagando en línea
  const moneda = "COP";

  // Se guarda con qué productos y precios se cotizó esta orden. Si el dueño cambia un precio
  // mientras el cliente paga, /api/pago/confirmar valida contra esta cotización y no contra el
  // precio nuevo. Si el almacén falla, se sigue: confirmar recalcula con los precios vigentes.
  await guardarResultado(claveCotizacion(orden), cotizar(lineas)).catch((e) =>
    console.error("cotizacion_no_guardada", { orden, error: String(e) }),
  );

  console.info("pago_iniciado", { codigo, orden, monto });

  // Volver al mismo sitio desde donde se pagó (edmoga.com o una versión de prueba): los datos
  // de entrega quedaron guardados en el navegador para ese dominio. En producción, edmoga.com.
  const origen =
    process.env.VERCEL_ENV === "production" ? SITE.url : new URL(req.url).origin;

  return NextResponse.json({
    codigo,
    orden,
    monto,
    moneda,
    descripcion: `${resumenLineas(lineas)} - EDMOGA`.slice(0, 100),
    llave: llaveIdentidad(),
    firma: firmaIntegridad(orden, monto, moneda),
    urlRetorno: `${origen}/pago/resultado`,
    urlOrigen: lineas.length === 1 ? `${origen}/checkout?producto=${lineas[0].producto.slug}` : `${origen}/checkout`,
  });
}
