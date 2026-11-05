import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultadoPago } from "./ResultadoPago";

export const metadata: Metadata = { title: "Resultado del pago", robots: { index: false } };

export default function PaginaResultado() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Suspense fallback={<p className="text-stone-600">Verificando tu pago…</p>}>
        <ResultadoPago />
      </Suspense>
    </div>
  );
}
