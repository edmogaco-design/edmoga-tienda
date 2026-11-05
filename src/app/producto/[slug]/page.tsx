import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTOS, obtenerProducto } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { boldConfigurado } from "@/lib/bold";
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
    openGraph: {
      title: `${p.nombre} | EDMOGA`,
      description: p.resumen,
      images: p.imagen ? [p.imagen] : undefined,
    },
  };
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-oro" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function FichaProducto({ params }: Props) {
  const { slug } = await params;
  const p = obtenerProducto(slug);
  if (!p) notFound();
  const enLinea = boldConfigurado();
  const urlPedido = `/checkout?producto=${p.slug}`;

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-28 pt-6 sm:px-6 md:pb-16">
      <Link
        href="/"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-strong text-ink"
        aria-label="Volver al inicio"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <h1 className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.44px] text-ink sm:text-[26px]">
        {p.nombre}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {p.categoria} · Pago contra entrega · Envío a toda Colombia
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        {/* Columna principal */}
        <div>
          <ImagenProducto src={p.imagen} alt={p.nombre} className="aspect-square md:aspect-[4/3]" prioridad />

          <section className="border-b border-hairline py-8">
            <p className="text-base leading-relaxed text-body">{p.descripcion}</p>
          </section>

          <section className="border-b border-hairline py-8">
            <h2 className="text-xl font-semibold tracking-[-0.18px] text-ink">Lo que te ofrece</h2>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {p.beneficios.map((b) => (
                <li key={b} className="flex gap-3 py-3 text-base text-ink">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-xl font-semibold tracking-[-0.18px] text-ink">Debes saber</h2>
            <div className="mt-4 grid gap-6 text-sm text-body sm:grid-cols-3">
              <div>
                <p className="font-semibold text-ink">Incluye</p>
                <ul className="mt-1 space-y-1">
                  {p.incluye.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink">Garantía</p>
                <p className="mt-1">{p.garantia}</p>
                {p.invima && <p className="mt-1">Registro INVIMA: {p.invima}</p>}
              </div>
              <div>
                <p className="font-semibold text-ink">Devoluciones</p>
                <p className="mt-1">
                  5 días hábiles de retracto.{" "}
                  <Link href="/legal/devoluciones" className="font-medium text-ink underline">
                    Ver política
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Tarjeta de compra fija (escritorio) */}
        <aside className="hidden md:block">
          <div className="sticky top-28 rounded-md border border-hairline bg-canvas p-6 shadow-card">
            <p className="text-[22px] font-bold text-ink">{formatoCOP(p.precio)}</p>
            <p className="mt-0.5 text-sm text-muted">Precio final por unidad</p>

            <ul className="mt-5 divide-y divide-hairline rounded-sm border border-border-strong text-sm">
              <li className="px-3 py-2.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink">Contra entrega</span>
                <span className="text-body">Pagas al recibir · envío según ciudad</span>
              </li>
              {enLinea && (
                <li className="px-3 py-2.5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink">Pago en línea</span>
                  <span className="text-body">Tarjeta, PSE y más · envío gratis</span>
                </li>
              )}
            </ul>

            <Link href={urlPedido} className="btn-primary mt-5 w-full">
              Pedir ahora
            </Link>
            <p className="mt-3 text-center text-sm text-muted">Aún no se te cobrará nada</p>
          </div>
        </aside>
      </div>

      {/* Barra inferior fija (móvil) */}
      <div className="barra-compra fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas md:hidden">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-base font-semibold text-ink">{formatoCOP(p.precio)}</p>
            <p className="text-xs text-muted">Contra entrega{enLinea ? " o en línea" : ""}</p>
          </div>
          <Link href={urlPedido} className="btn-primary">
            Pedir ahora
          </Link>
        </div>
      </div>
    </div>
  );
}
