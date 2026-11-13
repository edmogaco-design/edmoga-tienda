import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIAS, PRODUCTOS, obtenerProducto } from "@/lib/catalogo";
import { SITE, formatoCOP } from "@/lib/config";
import { boldConfigurado } from "@/lib/bold";
import { GaleriaProducto } from "@/components/GaleriaProducto";
import { BotonAgregar, BotonFavorito } from "@/components/Carrito";
import { productoVigente } from "@/lib/precios";

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
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: {
      url: `/producto/${p.slug}`,
      title: `${p.nombre} | EDMOGA`,
      description: p.resumen,
      images: p.imagenes.length ? [p.imagenes[0]] : undefined,
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
  const p = await productoVigente(slug);
  if (!p) notFound();
  const enLinea = boldConfigurado();
  const urlPedido = `/checkout?producto=${p.slug}`;
  const categoria = CATEGORIAS[p.categoria];
  const url = `${SITE.url}/producto/${p.slug}`;
  // Datos estructurados (schema.org). Sin calificaciones: la tienda todavía no recoge reseñas.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.nombre,
        description: p.descripcion,
        image: p.imagenes,
        sku: String(p.dropiId),
        category: p.categoria,
        url,
        offers: {
          "@type": "Offer",
          url,
          price: p.precio,
          priceCurrency: "COP",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: SITE.nombre },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
          { "@type": "ListItem", position: 2, name: p.categoria, item: `${SITE.url}/categoria/${categoria.slug}` },
          { "@type": "ListItem", position: 3, name: p.nombre, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-28 pt-6 sm:px-6 md:pb-16">
      <script
        type="application/ld+json"
        // "<" escapado para que ningún texto del catálogo pueda cerrar la etiqueta.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link
        href={`/categoria/${categoria.slug}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-strong text-ink"
        aria-label={`Volver a ${p.categoria}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <p className="mt-4 text-sm text-muted">
        <Link href={`/categoria/${categoria.slug}`} className="hover:underline">
          {p.categoria}
        </Link>
      </p>
      <h1 className="mt-1 text-[30px] font-extrabold leading-[1.1] text-ink sm:text-[38px]">{p.nombre}</h1>
      <p className="mt-2 max-w-xl text-base text-body">{p.resumen}</p>
      <div className="mt-4 md:hidden">
        <BotonFavorito slug={p.slug} nombre={p.nombre} />
      </div>

      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        {/* Columna principal */}
        <div>
          <GaleriaProducto imagenes={p.imagenes} alt={p.nombre} />

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
            <p className="font-titulos text-[32px] font-extrabold leading-none text-primary">{formatoCOP(p.precio)}</p>
            <p className="mt-1.5 text-sm text-muted">Precio final por unidad</p>

            <ul className="mt-5 divide-y divide-hairline rounded-sm border border-border-strong text-sm">
              <li className="px-3 py-2.5">
                <span className="block font-bold text-ink">Contra entrega</span>
                <span className="text-body">Pagas al recibir. El envío depende de tu departamento.</span>
              </li>
              {enLinea && (
                <li className="px-3 py-2.5">
                  <span className="block font-bold text-ink">Pago en línea</span>
                  <span className="text-body">Tarjeta, PSE y más, con envío gratis.</span>
                </li>
              )}
            </ul>

            <BotonAgregar slug={p.slug} className="btn-primary mt-5 w-full" />
            <Link href={urlPedido} className="btn-secondary mt-3 w-full">
              Comprar ahora
            </Link>
            <div className="mt-3 flex justify-center">
              <BotonFavorito slug={p.slug} nombre={p.nombre} />
            </div>
            <p className="mt-3 text-center text-sm text-muted">Aún no se te cobrará nada</p>
          </div>
        </aside>
      </div>

      {/* Barra inferior fija (móvil) */}
      <div className="barra-compra fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas md:hidden">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-3">
          <div className="shrink-0">
            <p className="text-base font-semibold text-ink">{formatoCOP(p.precio)}</p>
            <Link href={urlPedido} className="text-xs font-bold text-primary underline">
              Comprar ahora
            </Link>
          </div>
          <BotonAgregar slug={p.slug} className="btn-primary px-4" />
        </div>
      </div>
    </div>
  );
}
