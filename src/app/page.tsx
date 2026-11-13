import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIAS, SECCIONES } from "@/lib/catalogo";
import { catalogoVigente } from "@/lib/precios";
import { TarjetaProducto, aTarjeta } from "@/components/TarjetaProducto";
import { ImagenProducto } from "@/components/ImagenProducto";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Lo que más le preocupa a quien compra por internet en Colombia, dicho en una frase cada uno.
const garantias = [
  { titulo: "Pagas cuando te llega", texto: "En efectivo, al recibir en tu casa. Revisa el paquete antes de pagar." },
  { titulo: "Envíos a todo el país", texto: "El valor depende de tu departamento y lo ves antes de confirmar." },
  { titulo: "Pagos protegidos", texto: "Si prefieres pagar en línea, lo haces con Bold: tarjeta, PSE y más." },
  { titulo: "Te responde una persona", texto: "Confirmamos cada pedido por WhatsApp antes de despacharlo." },
];

// Es un proceso real en orden, por eso va numerado.
const pasos = [
  { titulo: "Elige tu producto", texto: "Mira fotos, beneficios y precio final." },
  { titulo: "Deja tus datos de entrega", texto: "Sin crear cuenta ni pagar nada todavía." },
  { titulo: "Confirma y recibe", texto: "Te escribimos por WhatsApp y despachamos." },
];

const POR_SECCION = 4;

export default async function Inicio() {
  const PRODUCTOS = await catalogoVigente();

  return (
    <>
      {/* Franja azul: la promesa de la tienda */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-oro">Cocina · Belleza · Gimnasio · Tecnología · Audífonos</p>
            <h1 className="mt-3 text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[56px] lg:text-[68px]">
              Lo que te hace la vida más fácil. Pagas cuando te llegue.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Productos elegidos para tu casa, tu rutina y tu día a día, con envío a cualquier lugar de Colombia.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/#productos" className="btn-oro">
                Ver productos
              </Link>
              <Link href="/legal/envios" className="font-bold text-white underline underline-offset-4">
                Cómo funcionan los envíos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Garantías de compra */}
        <section aria-label="Cómo te protegemos al comprar" className="grid gap-x-8 border-b border-hairline py-4 sm:grid-cols-2 lg:grid-cols-4">
          {garantias.map((g) => (
            <div key={g.titulo} className="border-l-2 border-oro py-1 pl-4 my-4">
              <h2 className="text-lg font-bold text-primary">{g.titulo}</h2>
              <p className="mt-1 text-base text-body">{g.texto}</p>
            </div>
          ))}
        </section>

        {/* Categorías */}
        <section aria-labelledby="titulo-categorias" className="pt-14">
          <h2 id="titulo-categorias" className="text-[28px] font-bold leading-tight text-ink">
            Compra por categoría
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {SECCIONES.map((s) => {
              const c = CATEGORIAS[s];
              const foto = PRODUCTOS.find((p) => p.categoria === s)?.imagenes[0];
              return (
                <li key={s}>
                  <Link href={`/categoria/${c.slug}`} className="group block">
                    <ImagenProducto src={foto} alt={`Categoría ${s}`} className="aspect-[4/3]" />
                    <p className="mt-2 text-base font-bold text-ink group-hover:underline">{s}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Productos: una muestra de cada sección */}
        <div id="productos" className="scroll-mt-24 pb-14">
          {SECCIONES.map((s) => {
            const todos = PRODUCTOS.filter((p) => p.categoria === s);
            const c = CATEGORIAS[s];
            return (
              <section key={s} className="pt-14">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[28px] font-bold leading-tight text-ink">{s}</h2>
                    <p className="mt-1 text-base text-muted">{c.lema}</p>
                  </div>
                  {todos.length > POR_SECCION && (
                    <Link href={`/categoria/${c.slug}`} className="shrink-0 font-bold text-primary underline underline-offset-4">
                      Ver los {todos.length}
                    </Link>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {todos.slice(0, POR_SECCION).map((p) => (
                    <TarjetaProducto key={p.slug} p={aTarjeta(p)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Cómo comprar */}
        <section className="border-t border-hairline py-14">
          <h2 className="text-[28px] font-bold leading-tight text-ink">Así compras</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {pasos.map((s, i) => (
              <li key={s.titulo} className="flex gap-4">
                <span aria-hidden="true" className="font-titulos text-[44px] font-extrabold leading-none text-oro">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{s.titulo}</h3>
                  <p className="mt-1 text-base text-muted">{s.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
