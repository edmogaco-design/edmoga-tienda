import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultadoPago } from "./ResultadoPago";

export const metadata: Metadata = { title: "Resultado del pago", robots: { index: false } };

export default function PaginaResultado() {
  return (
    <div className="mx-auto max-w-[560px] px-4 py-12 sm:px-6">
      <Suspense fallback={<p className="text-center text-base text-muted">Verificando tu pago…</p>}>
        <ResultadoPago />
      </Suspense>
    </div>
  );
}
