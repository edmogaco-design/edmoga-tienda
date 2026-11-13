import type { Metadata } from "next";
import Link from "next/link";
import { buscarProductos, MAX_BUSQUEDA } from "@/lib/buscar";
import { Buscador } from "@/components/Buscador";
import { TarjetaProducto } from "@/components/TarjetaProducto";

export const metadata: Metadata = { title: "Buscar productos", robots: { index: false } };

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function Buscar({ searchParams }: Props) {
  const { q } = await searchParams;
  const texto = (Array.isArray(q) ? q[0] : (q ?? "")).trim().slice(0, MAX_BUSQUEDA);
  const resultados = buscarProductos(texto);

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <h1 className="text-[28px] font-bold leading-tight text-ink">Buscar productos</h1>
      <Buscador valor={texto} grande className="mt-5 max-w-xl" />

      {texto && (
        <p role="status" className="mt-8 text-base text-body">
          {resultados.length === 0
            ? `No encontramos productos para “${texto}”.`
            : `${resultados.length} ${resultados.length === 1 ? "producto" : "productos"} para “${texto}”`}
        </p>
      )}

      {resultados.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {resultados.map((p, i) => (
            <TarjetaProducto key={p.slug} p={p} prioridad={i < 4} />
          ))}
        </div>
      )}

      {texto && resultados.length === 0 && (
        <p className="mt-3 text-base text-muted">
          Prueba con otra palabra (por ejemplo “café” o “brochas”) o{" "}
          <Link href="/#productos" className="font-medium text-ink underline">
            mira todos los productos
          </Link>
          .
        </p>
      )}
    </div>
  );
}
