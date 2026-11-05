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
        className="aspect-square transition-transform duration-200 group-hover:scale-[1.01]"
        insignia="Pago contra entrega"
        prioridad={prioridad}
      />
      <div className="mt-3 space-y-0.5">
        <p className="text-base font-semibold leading-tight text-ink">{p.nombre}</p>
        <p className="text-sm leading-snug text-muted">{p.categoria} · Envío a toda Colombia</p>
        <p className="pt-1 text-sm text-ink">
          <span className="font-semibold">{formatoCOP(p.precio)}</span>
        </p>
      </div>
    </Link>
  );
}
