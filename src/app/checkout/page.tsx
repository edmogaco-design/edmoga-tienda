import type { Metadata } from "next";
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
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Finalizar pedido</h1>
      <p className="mt-2 text-sm text-stone-600">
        {pagoEnLinea
          ? "Paga contra entrega o en línea con Bold (envío gratis). Una persona de EDMOGA confirma tu pedido por WhatsApp."
          : "Llena tus datos y te abrimos WhatsApp con el pedido listo. Una persona de EDMOGA lo confirma contigo y te dice el valor del envío. Pagas al recibir."}
      </p>
      <FormularioPedido
        producto={{ slug: p.slug, nombre: p.nombre, precio: p.precio }}
        pagoEnLinea={pagoEnLinea}
      />
    </div>
  );
}
