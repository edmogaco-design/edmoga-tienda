"use client";

import Link from "next/link";
import { formatoCOP } from "@/lib/config";
import { ImagenProducto } from "@/components/ImagenProducto";
import { useTienda } from "@/components/TiendaProvider";

export function ListaFavoritos() {
  const { catalogo, listo, favoritos, alternarFavorito, agregar, abrirPanel } = useTienda();

  if (!listo) return <p className="mt-8 text-base text-muted">Cargando tus favoritos…</p>;
  if (favoritos.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-base text-body">Aún no has guardado productos. Toca el corazón de cualquier producto para guardarlo aquí.</p>
        <Link href="/#productos" className="btn-primary mt-6">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
      {favoritos.map((slug) => {
        const p = catalogo[slug];
        if (!p) return null;
        return (
          <li key={slug} className="flex flex-wrap items-center gap-4 py-5">
            <Link href={`/producto/${p.slug}`} className="shrink-0">
              <ImagenProducto src={p.imagen} alt={p.nombre} className="h-24 w-24" />
            </Link>
            <div className="min-w-[160px] flex-1">
              <p className="text-sm text-muted">{p.categoria}</p>
              <Link href={`/producto/${p.slug}`} className="text-lg font-bold leading-tight text-ink hover:underline">
                {p.nombre}
              </Link>
              <p className="mt-1 font-titulos text-xl font-bold text-primary">{formatoCOP(p.precio)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  // Pasa al carrito y sale de favoritos.
                  if (agregar(p.slug)) alternarFavorito(p.slug);
                  abrirPanel();
                }}
              >
                Pasar al carrito
              </button>
              <button type="button" onClick={() => alternarFavorito(p.slug)} className="text-sm font-medium text-muted underline hover:text-error">
                Quitar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
