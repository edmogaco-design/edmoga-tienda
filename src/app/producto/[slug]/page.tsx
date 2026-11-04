import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTOS, obtenerProducto } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { ImagenProducto } from "@/components/ImagenProducto";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = obtenerProducto(slug);
  if (!p) return {};
  return {
    title: p.nombre,
    description: p.resumen,
    openGraph: { title: `${p.nombre} | EDMOGA`, description: p.resumen },
  };
}

export default async function FichaProducto({ params }: Props) {
  const { slug } = await params;
  const p = obtenerProducto(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <ImagenProducto className="aspect-square" />
      <div>
        <p className="text-xs uppercase tracking-wider text-emerald-700">{p.categoria}</p>
        <h1 className="mt-1 text-3xl font-bold text-stone-900">{p.nombre}</h1>
        <p className="mt-3 text-3xl font-bold text-emerald-800">{formatoCOP(p.precio)}</p>
        <p className="mt-1 text-sm font-medium text-stone-700">Pago contra entrega · Envío a toda Colombia</p>
        <p className="mt-5 text-stone-700">{p.descripcion}</p>

        <h2 className="mt-6 font-semibold text-stone-900">Beneficios</h2>
        <ul className="mt-2 space-y-1 text-stone-700">
          {p.beneficios.map((b) => (
            <li key={b}>✓ {b}</li>
          ))}
        </ul>

        <h2 className="mt-6 font-semibold text-stone-900">Incluye</h2>
        <ul className="mt-2 list-inside list-disc text-stone-700">
          {p.incluye.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>

        {p.invima && <p className="mt-4 text-sm text-stone-600">Registro INVIMA: {p.invima}</p>}
        <p className="mt-4 text-sm text-stone-600">{p.garantia}</p>

        <Link
          href={`/checkout?producto=${p.slug}`}
          className="mt-8 block rounded-full bg-emerald-800 px-6 py-4 text-center text-lg font-semibold text-white hover:bg-emerald-900"
        >
          Pedir ahora — pago contra entrega
        </Link>
      </div>
    </div>
  );
}
