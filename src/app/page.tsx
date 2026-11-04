import Link from "next/link";
import { PRODUCTOS } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { ImagenProducto } from "@/components/ImagenProducto";

const confianza = [
  { titulo: "Pago contra entrega", texto: "Pagas cuando recibes tu pedido en casa." },
  { titulo: "Envíos a toda Colombia", texto: "Te confirmamos el valor del envío antes de despachar." },
  { titulo: "Atención por WhatsApp", texto: "Una persona real confirma cada pedido contigo." },
];

export default function Inicio() {
  return (
    <>
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Bienestar · Hogar · Cocina
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-stone-900 sm:text-5xl">
            Productos que te hacen la vida más fácil, con pago contra entrega
          </h1>
          <p className="mt-4 max-w-xl text-stone-600">
            Elige, pide en un paso y confirma por WhatsApp. Pagas cuando lo recibes.
          </p>
          <Link
            href="#productos"
            className="mt-8 inline-block rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900"
          >
            Ver productos
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-10 sm:grid-cols-3">
        {confianza.map((c) => (
          <div key={c.titulo} className="rounded-xl border border-stone-200 p-5">
            <p className="font-semibold text-stone-900">{c.titulo}</p>
            <p className="mt-1 text-sm text-stone-600">{c.texto}</p>
          </div>
        ))}
      </section>

      <section id="productos" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-6">
        <h2 className="text-2xl font-bold text-stone-900">Productos</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTOS.map((p) => (
            <Link
              key={p.slug}
              href={`/producto/${p.slug}`}
              className="group rounded-2xl border border-stone-200 p-4 transition hover:shadow-md"
            >
              <ImagenProducto className="aspect-square" />
              <p className="mt-4 text-xs uppercase tracking-wider text-emerald-700">{p.categoria}</p>
              <p className="mt-1 font-semibold text-stone-900 group-hover:text-emerald-800">{p.nombre}</p>
              <p className="mt-1 text-sm text-stone-600">{p.resumen}</p>
              <p className="mt-3 text-lg font-bold text-stone-900">{formatoCOP(p.precio)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
