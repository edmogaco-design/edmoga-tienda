import { z } from "zod";
import { PRODUCTOS, type Producto } from "./catalogo";
import { formatoCOP } from "./config";
import { DEPARTAMENTOS } from "./departamentos";

const slugs = PRODUCTOS.map((p) => p.slug) as [string, ...string[]];

export const MAX_UNIDADES = 10;
export const MAX_PRODUCTOS = 10;

const itemSchema = z.object({
  producto: z.enum(slugs),
  cantidad: z.coerce.number().int().min(1, "Mínimo 1").max(MAX_UNIDADES, `Máximo ${MAX_UNIDADES} por producto`),
});

/**
 * Pedidos con la forma anterior ({ producto, cantidad }): un cliente que pagó con Bold justo antes
 * de esta versión vuelve con esos datos guardados en su navegador y debe poder confirmar su pago.
 */
function aItems(datos: unknown): unknown {
  if (datos && typeof datos === "object" && !("items" in datos) && "producto" in datos) {
    const { producto, cantidad, ...resto } = datos as Record<string, unknown>;
    return { ...resto, items: [{ producto, cantidad: cantidad ?? 1 }] };
  }
  return datos;
}

export const pedidoSchema = z.preprocess(aItems, pedidoBase());

function pedidoBase() {
  return z.object({
  // Identificador único por envío del formulario: evita pedidos duplicados por doble clic o reintento.
  idSolicitud: z.string().uuid(),
  // Uno o varios productos (carrito). Cada producto distinto viaja en su propio paquete.
  items: z
    .array(itemSchema)
    .min(1, "Tu carrito está vacío")
    .max(MAX_PRODUCTOS, `Máximo ${MAX_PRODUCTOS} productos distintos por pedido`)
    .refine((items) => new Set(items.map((i) => i.producto)).size === items.length, "Hay un producto repetido"),
  nombre: z.string().trim().min(3, "Escribe tu nombre completo").max(80),
  telefono: z
    .string()
    .trim()
    .regex(/^3\d{9}$/, "Celular colombiano de 10 dígitos que empiece por 3"),
  ciudad: z.string().trim().min(3, "Escribe tu ciudad").max(60),
  departamento: z.enum(DEPARTAMENTOS, { errorMap: () => ({ message: "Elige tu departamento" }) }),
  direccion: z.string().trim().min(6, "Escribe tu dirección completa").max(150),
  notas: z.string().trim().max(200).optional(),
  autorizaDatos: z.literal(true, {
    errorMap: () => ({ message: "Debes autorizar el tratamiento de datos" }),
  }),
  });
}

export type Pedido = z.infer<ReturnType<typeof pedidoBase>>;
export type ItemPedido = Pedido["items"][number];

/** Un renglón del pedido ya con su producto (precio vigente) y su valor. */
export type Linea = { producto: Producto; cantidad: number; subtotal: number };

/**
 * Convierte los items del pedido en renglones con el precio de `productos` (el catálogo vigente).
 * Devuelve null si algún producto no está a la venta.
 */
export function lineasDe(items: ItemPedido[], productos: Producto[]): Linea[] | null {
  const lineas: Linea[] = [];
  for (const item of items) {
    const producto = productos.find((p) => p.slug === item.producto);
    if (!producto) return null;
    lineas.push({ producto, cantidad: item.cantidad, subtotal: producto.precio * item.cantidad });
  }
  return lineas;
}

export function subtotalDe(lineas: Linea[]): number {
  return lineas.reduce((suma, l) => suma + l.subtotal, 0);
}

/** "Picadora x2 + Cafetera x1": texto corto para el registro de ventas y la descripción del pago. */
export function resumenLineas(lineas: Linea[]): string {
  return lineas.map((l) => `${l.producto.nombre} x${l.cantidad}`).join(" + ");
}

/** Código visible del pedido: EDM-XXXXXXXX (derivado de idSolicitud). */
export function codigoDesde(idSolicitud: string): string {
  return `EDM-${idSolicitud.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

const renglones = (lineas: Linea[]) =>
  lineas.map((l) => `• ${l.producto.nombre} x${l.cantidad} — ${formatoCOP(l.subtotal)}`);

export function mensajePedidoPagado(
  p: Pedido,
  lineas: Linea[],
  codigoPedido: string,
  transaccion: string | null,
): string {
  return [
    `Hola EDMOGA, ya PAGUÉ en línea mi pedido ${codigoPedido}:`,
    ...renglones(lineas),
    `• Pagado: ${formatoCOP(subtotalDe(lineas))} (envío gratis)`,
    transaccion ? `• Transacción Bold: ${transaccion}` : "",
    `• Nombre: ${p.nombre}`,
    `• Celular: ${p.telefono}`,
    `• Ciudad: ${p.ciudad}, ${p.departamento}`,
    `• Dirección: ${p.direccion}`,
    p.notas ? `• Notas: ${p.notas}` : "",
    "¿Me confirman el despacho?",
  ]
    .filter(Boolean)
    .join("\n");
}

/** `envio`: total del envío (ya multiplicado por el número de paquetes). */
export function mensajePedido(p: Pedido, lineas: Linea[], envio: number, codigoPedido: string): string {
  const subtotal = subtotalDe(lineas);
  const paquetes = lineas.length;
  return [
    `Hola EDMOGA, quiero confirmar mi pedido ${codigoPedido} (pago contra entrega):`,
    ...renglones(lineas),
    `• Envío: ${formatoCOP(envio)}${paquetes > 1 ? ` (${paquetes} paquetes)` : ""}`,
    `• Total a pagar al recibir: ${formatoCOP(subtotal + envio)}`,
    paquetes > 1 ? "• Entiendo que cada producto llega en un paquete aparte y se paga al recibirlo." : "",
    `• Nombre: ${p.nombre}`,
    `• Celular: ${p.telefono}`,
    `• Ciudad: ${p.ciudad}, ${p.departamento}`,
    `• Dirección: ${p.direccion}`,
    p.notas ? `• Notas: ${p.notas}` : "",
    "¿Me confirman el pedido?",
  ]
    .filter(Boolean)
    .join("\n");
}
