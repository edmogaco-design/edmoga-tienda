import { NextResponse } from "next/server";
import { z } from "zod";
import { pedidoSchema, codigoDesde, mensajePedidoPagado } from "@/lib/pedido";
import { obtenerProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/config";
import { consultarPago } from "@/lib/bold";
import { crearPedidoDropi, dropiConfigurado } from "@/lib/dropi";

const entrada = z.object({
  orden: z.string().regex(/^EDM-[A-Z0-9]{8}-[A-Z0-9]{4,12}$/),
  pedido: pedidoSchema,
});

// Idempotencia por orden: el primer pago confirmado manda; reintentos devuelven lo mismo
// y no crean otro pedido en Dropi. En memoria por instancia; pasará a Supabase en la Fase 2.
const confirmados = new Map<string, Record<string, unknown>>();

export async function POST(req: Request) {
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

  const previo = confirmados.get(orden);
  if (previo) return NextResponse.json(previo);

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
  confirmados.set(orden, cuerpo);
  return NextResponse.json(cuerpo);
}
