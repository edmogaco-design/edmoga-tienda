import type { Metadata } from "next";
import { ListaFavoritos } from "./ListaFavoritos";

export const metadata: Metadata = { title: "Tus favoritos", robots: { index: false } };

export default function Favoritos() {
  return (
    <div className="mx-auto max-w-[880px] px-4 py-10 sm:px-6">
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">Tus favoritos</h1>
      <p className="mt-2 text-base text-muted">Se guardan en este celular o computador. Pásalos al carrito cuando quieras.</p>
      <ListaFavoritos />
    </div>
  );
}
