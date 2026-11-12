// Cotización de un pago en línea: con qué productos y precios se preparó una orden de Bold.
// Se guarda al iniciar el pago y se usa al confirmarlo, para que un cambio de precio hecho por el
// dueño mientras el cliente paga no deje el pago como "no cuadra".
import type { Producto } from "./catalogo";
import type { ItemPedido, Linea } from "./pedido";

export type Cotizacion = { monto: number; items: { producto: string; cantidad: number; precio: number }[] };

export const claveCotizacion = (orden: string) => `edmoga:cotizacion:${orden}`;

export function cotizar(lineas: Linea[]): Cotizacion {
  return {
    monto: lineas.reduce((suma, l) => suma + l.subtotal, 0),
    items: lineas.map((l) => ({ producto: l.producto.slug, cantidad: l.cantidad, precio: l.producto.precio })),
  };
}

/**
 * Renglones con los precios de la cotización. Devuelve null si los items que llegan no son
 * exactamente los cotizados (mismos productos y cantidades) o si un producto ya no está a la venta.
 */
export function lineasCotizadas(items: ItemPedido[], cotizacion: Cotizacion, productos: Producto[]): Linea[] | null {
  if (items.length !== cotizacion.items.length) return null;
  const lineas: Linea[] = [];
  for (const item of items) {
    const cotizado = cotizacion.items.find((c) => c.producto === item.producto);
    const producto = productos.find((p) => p.slug === item.producto);
    if (!cotizado || !producto || cotizado.cantidad !== item.cantidad) return null;
    lineas.push({
      producto: { ...producto, precio: cotizado.precio },
      cantidad: item.cantidad,
      subtotal: cotizado.precio * item.cantidad,
    });
  }
  return lineas;
}
