import Link from "next/link";
import type { Producto } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { ImagenProducto } from "./ImagenProducto";

// Tarjeta foto primero: imagen 1:1 con esquinas suaves y 3 líneas de información debajo.
export function TarjetaProducto({ p, prioridad }: { p: Producto; prioridad?: boolean }) {
  return (
    <Link href={`/producto/${p.slug}`} className="group block" aria-label={`${p.nombre}, ${formatoCOP(p.precio)}`}>
      <ImagenProducto
        src={p.imagen}
        alt={p.nombre}
        className="aspect-square"
        insignia="Pago contra entrega"
        prioridad={prioridad}
      />
      <div className="mt-3">
        <p className="text-sm text-muted">{p.categoria}</p>
        <p className="mt-0.5 text-lg font-bold leading-tight text-ink group-hover:underline">{p.nombre}</p>
        <p className="mt-1 font-titulos text-xl font-bold text-primary">{formatoCOP(p.precio)}</p>
      </div>
    </Link>
  );
}
