import Link from "next/link";
import type { Producto } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { ImagenProducto } from "./ImagenProducto";
import { BotonFavorito } from "./Carrito";
import type { ProductoResumen } from "./TiendaProvider";

/** Lo mínimo que necesita la tarjeta (así las listas con filtros no cargan todo el producto). */
export type ProductoTarjeta = ProductoResumen;

export function aTarjeta(p: Producto): ProductoTarjeta {
  return { slug: p.slug, nombre: p.nombre, precio: p.precio, categoria: p.categoria, imagen: p.imagenes[0] };
}

// Tarjeta foto primero. Al pasar el mouse: la foto se acerca un poco y aparece "Ver producto".
export function TarjetaProducto({ p, prioridad }: { p: ProductoTarjeta; prioridad?: boolean }) {
  return (
    <article className="relative">
      <div className="absolute right-3 top-3 z-10">
        <BotonFavorito slug={p.slug} nombre={p.nombre} flotante />
      </div>
      <Link href={`/producto/${p.slug}`} className="group block" aria-label={`${p.nombre}, ${formatoCOP(p.precio)}`}>
        <div className="relative">
          <ImagenProducto
            src={p.imagen}
            alt={p.nombre}
            className="aspect-square"
            insignia="Pago contra entrega"
            prioridad={prioridad}
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-sm bg-oro py-2.5 text-center text-sm font-bold text-primary opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 md:block"
          >
            Ver producto
          </span>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted">{p.categoria}</p>
          <h3 className="mt-0.5 font-sans text-lg font-bold leading-tight tracking-normal text-ink group-hover:underline">
            {p.nombre}
          </h3>
          <p className="mt-1 font-titulos text-xl font-bold text-primary">{formatoCOP(p.precio)}</p>
        </div>
      </Link>
    </article>
  );
}
