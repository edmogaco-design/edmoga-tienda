import { z } from "zod";
import { PRODUCTOS } from "./catalogo";
import { formatoCOP } from "./config";
import { DEPARTAMENTOS } from "./departamentos";

const slugs = PRODUCTOS.map((p) => p.slug) as [string, ...string[]];

export const pedidoSchema = z.object({
  // Identificador único por envío del formulario: evita pedidos duplicados por doble clic o reintento.
  idSolicitud: z.string().uuid(),
  producto: z.enum(slugs),
  cantidad: z.coerce.number().int().min(1, "Mínimo 1").max(10, "Máximo 10 por pedido"),
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

export type Pedido = z.infer<typeof pedidoSchema>;

/** Código visible del pedido: EDM-XXXXXXXX (derivado de idSolicitud). */
export function codigoDesde(idSolicitud: string): string {
  return `EDM-${idSolicitud.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function mensajePedidoPagado(
  p: Pedido,
  total: number,
  nombreProducto: string,
  codigoPedido: string,
  transaccion: string | null,
): string {
  return [
    `Hola EDMOGA, ya PAGUÉ en línea mi pedido ${codigoPedido}:`,
    `• Producto: ${nombreProducto} x${p.cantidad}`,
    `• Pagado: ${formatoCOP(total)} (envío gratis)`,
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

export function mensajePedido(
  p: Pedido,
  total: number,
  nombreProducto: string,
  codigoPedido: string,
): string {
  return [
    `Hola EDMOGA, quiero confirmar mi pedido ${codigoPedido} (pago contra entrega):`,
    `• Producto: ${nombreProducto} x${p.cantidad}`,
    `• Total: ${formatoCOP(total)} + envío`,
    `• Nombre: ${p.nombre}`,
    `• Celular: ${p.telefono}`,
    `• Ciudad: ${p.ciudad}, ${p.departamento}`,
    `• Dirección: ${p.direccion}`,
    p.notas ? `• Notas: ${p.notas}` : "",
    "¿Me confirman el pedido y el valor del envío?",
  ]
    .filter(Boolean)
    .join("\n");
}
