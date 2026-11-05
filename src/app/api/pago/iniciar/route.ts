import { NextResponse } from "next/server";
import { pedidoSchema, codigoDesde } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { SITE } from "@/lib/config";
import { boldConfigurado, firmaIntegridad, llaveIdentidad } from "@/lib/bold";

// Prepara el botón de Bold. El monto SIEMPRE se calcula aquí, nunca se toma del navegador.
export async function POST(req: Request) {
  if (!boldConfigurado()) {
    return NextResponse.json({ error: "El pago en línea aún no está disponible." }, { status: 503 });
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
  if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const codigo = codigoDesde(r.data.idSolicitud);
  // Cada intento de pago tiene su propio identificador (Bold no permite reutilizarlo).
  const orden = `${codigo}-${Date.now().toString(36).toUpperCase()}`;
  const monto = producto.precio * r.data.cantidad; // envío gratis pagando en línea
  const moneda = "COP";

  console.info("pago_iniciado", { codigo, orden, monto });

  return NextResponse.json({
    codigo,
    orden,
    monto,
    moneda,
    descripcion: `${producto.nombre} x${r.data.cantidad} - EDMOGA`.slice(0, 100),
    llave: llaveIdentidad(),
    firma: firmaIntegridad(orden, monto, moneda),
    urlRetorno: `${SITE.url}/pago/resultado`,
    urlOrigen: `${SITE.url}/checkout?producto=${producto.slug}`,
  });
}
