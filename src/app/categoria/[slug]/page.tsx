import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIAS, PRODUCTOS, SECCIONES, seccionPorSlug } from "@/lib/catalogo";
import { ListaProductos } from "@/components/ListaProductos";
import { aTarjeta } from "@/components/TarjetaProducto";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SECCIONES.map((s) => ({ slug: CATEGORIAS[s].slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seccion = seccionPorSlug(slug);
  if (!seccion) return {};
  const c = CATEGORIAS[seccion];
  const imagen = PRODUCTOS.find((p) => p.categoria === seccion)?.imagenes[0];
  return {
    title: c.titulo,
    description: c.descripcion,
    alternates: { canonical: `/categoria/${c.slug}` },
    openGraph: {
      title: `${c.titulo} | EDMOGA`,
      description: c.descripcion,
      url: `/categoria/${c.slug}`,
      images: imagen ? [imagen] : undefined,
    },
  };
}

export default async function PaginaCategoria({ params }: Props) {
  const { slug } = await params;
  const seccion = seccionPorSlug(slug);
  if (!seccion) notFound();
  const c = CATEGORIAS[seccion];
  const productos = PRODUCTOS.filter((p) => p.categoria === seccion).map(aTarjeta);

  return (
    <>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 md:py-14 lg:px-10">
          <nav aria-label="Ruta" className="text-sm text-white/70">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            / <span className="text-oro">{seccion}</span>
          </nav>
          <h1 className="mt-3 text-[36px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[52px]">{c.titulo}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">{c.lema}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-10">
        <h2 className="sr-only">Productos de {seccion}</h2>
        <ListaProductos productos={productos} />
      </div>
    </>
  );
}
