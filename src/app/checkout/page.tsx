import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTOS, obtenerProducto } from "@/lib/catalogo";
import { boldConfigurado } from "@/lib/bold";
import { FormularioPedido } from "./FormularioPedido";

export const metadata: Metadata = { title: "Finalizar pedido", robots: { index: false } };

type Props = { searchParams: Promise<{ producto?: string }> };

export default async function Checkout({ searchParams }: Props) {
  const { producto } = await searchParams;
  const p = obtenerProducto(producto ?? PRODUCTOS[0].slug);
  if (!p) notFound();
  const pagoEnLinea = boldConfigurado();

  return (
    <div className="pagina-checkout mx-auto max-w-[1080px] px-4 pb-16 pt-6 sm:px-6">
      <Link
        href={`/producto/${p.slug}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-strong text-ink"
        aria-label="Volver al producto"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink">Finalizar pedido</h1>
      <p className="mt-1 max-w-2xl text-base text-muted">
        {pagoEnLinea
          ? "Paga contra entrega o en línea (envío gratis). Una persona de EDMOGA confirma tu pedido por WhatsApp."
          : "Llena tus datos y te abrimos WhatsApp con el pedido listo. Te confirmamos el envío y pagas al recibir."}
      </p>
      <FormularioPedido
        producto={{ slug: p.slug, nombre: p.nombre, precio: p.precio, imagen: p.imagen }}
        pagoEnLinea={pagoEnLinea}
      />
    </div>
  );
}
