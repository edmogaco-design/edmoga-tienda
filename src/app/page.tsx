import Link from "next/link";
import { PRODUCTOS } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { ImagenProducto } from "@/components/ImagenProducto";

// Lo que más le preocupa a quien compra por internet en Colombia, dicho en una frase cada uno.
const garantias = [
  { titulo: "Pagas cuando te llega", texto: "En efectivo, al recibir en tu casa. Revisa el paquete antes de pagar." },
  { titulo: "Ves el envío antes de pedir", texto: "El valor depende de tu departamento y aparece al finalizar el pedido." },
  { titulo: "Te responde una persona", texto: "Confirmamos cada pedido por WhatsApp antes de despacharlo." },
];

// Es un proceso real en orden, por eso va numerado.
const pasos = [
  { titulo: "Elige tu producto", texto: "Mira fotos, beneficios y precio final." },
  { titulo: "Deja tus datos de entrega", texto: "Sin crear cuenta ni pagar nada todavía." },
  { titulo: "Confirma y recibe", texto: "Te escribimos por WhatsApp y despachamos." },
];

export default function Inicio() {
  const destacado = PRODUCTOS[0];

  return (
    <>
      {/* Franja azul: el producto estrella y la promesa de pago contra entrega */}
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:py-16 lg:gap-16 lg:px-10">
          <div className="max-w-xl">
            <h1 className="text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[56px] lg:text-[68px]">
              Pica en segundos. Paga cuando te llegue.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
              {destacado.resumen} Te la llevamos a cualquier lugar de Colombia.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href={`/producto/${destacado.slug}`} className="btn-oro">
                Ver la picadora
              </Link>
              <p className="font-titulos text-2xl font-bold">
                {formatoCOP(destacado.precio)}
                <span className="ml-2 font-sans text-sm font-normal text-white/70">precio final</span>
              </p>
            </div>
          </div>
          <Link href={`/producto/${destacado.slug}`} aria-label={destacado.nombre} className="block rounded-lg bg-white p-3">
            <ImagenProducto src={destacado.imagen} alt={destacado.nombre} className="aspect-square" prioridad />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Garantías de compra */}
        <section aria-label="Cómo te protegemos al comprar" className="grid border-b border-hairline sm:grid-cols-3">
          {garantias.map((g, i) => (
            <div
              key={g.titulo}
              className={`py-6 sm:px-6 sm:py-8 ${i > 0 ? "border-t border-hairline sm:border-l sm:border-t-0" : "sm:pl-0"}`}
            >
              <h2 className="text-lg font-bold text-primary">{g.titulo}</h2>
              <p className="mt-1 text-base text-body">{g.texto}</p>
            </div>
          ))}
        </section>

        {/* Productos */}
        <section id="productos" className="scroll-mt-24 py-14">
          <h2 className="text-[28px] font-bold leading-tight text-ink">Productos</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {PRODUCTOS.map((p) => (
              <TarjetaProducto key={p.slug} p={p} />
            ))}
          </div>
        </section>

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
