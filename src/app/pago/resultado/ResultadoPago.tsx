"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { enlaceWhatsApp } from "@/lib/config";

type Respuesta = {
  estado?: string;
  codigo?: string;
  transaccion?: string | null;
  whatsapp?: string;
  error?: string;
};

const MAX_REINTENTOS = 6;

export function ResultadoPago() {
  const params = useSearchParams();
  const orden = params.get("bold-order-id") ?? "";
  const [r, setR] = useState<Respuesta | null>(null);
  const [intento, setIntento] = useState(0);

  const verificar = useCallback(async () => {
    let pedido: unknown = null;
    try {
      pedido = JSON.parse(sessionStorage.getItem(`edmoga-pago-${orden}`) ?? "null");
    } catch {
      pedido = null;
    }
    if (!orden || !pedido) {
      setR({ estado: "SIN_DATOS" });
      return;
    }
    try {
      const res = await fetch("/api/pago/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden, pedido }),
      });
      setR(await res.json());
    } catch {
      setR({ estado: "sin_verificar" });
    }
  }, [orden]);

  useEffect(() => {
    void verificar();
  }, [verificar, intento]);

  // Bold puede tardar unos segundos en registrar la transacción: se reintenta solo.
  useEffect(() => {
    const enProceso = ["PROCESSING", "PENDING", "NO_TRANSACTION_FOUND", "sin_verificar"];
    if (r?.estado && enProceso.includes(r.estado) && intento < MAX_REINTENTOS) {
      const t = setTimeout(() => setIntento((n) => n + 1), 5000);
      return () => clearTimeout(t);
    }
  }, [r, intento]);

  if (!r) return <p className="text-center text-base text-muted">Verificando tu pago con Bold…</p>;

  const ayuda = enlaceWhatsApp(`Hola EDMOGA, necesito ayuda con mi pago en línea. Orden: ${orden || "sin número"}`);

  if (r.estado === "APPROVED") {
    return (
      <div className="rounded-md border border-hairline p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-5 text-[28px] font-bold leading-tight text-ink">¡Pago confirmado!</h1>
        <dl className="mx-auto mt-5 max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Pedido</dt>
            <dd className="font-semibold text-ink">{r.codigo}</dd>
          </div>
          {r.transaccion && (
            <div className="flex justify-between">
              <dt className="text-muted">Transacción Bold</dt>
              <dd className="font-semibold text-ink">{r.transaccion}</dd>
            </div>
          )}
        </dl>
        <p className="mt-5 text-base text-body">Envíanos el resumen por WhatsApp para coordinar el despacho.</p>
        <a href={r.whatsapp} className="btn-primary mt-6 w-full sm:w-auto">
          Enviar resumen por WhatsApp
        </a>
      </div>
    );
  }

  const textos: Record<string, [string, string]> = {
    PROCESSING: ["⏳", "Tu pago se está procesando. Esperamos la confirmación de Bold…"],
    PENDING: ["⏳", "Tu pago está pendiente (PSE). Esperamos la confirmación de Bold…"],
    NO_TRANSACTION_FOUND: ["⏳", "Aún no vemos el pago en Bold. Esperamos unos segundos…"],
    sin_verificar: ["⏳", "No pudimos consultar Bold en este momento. Reintentando…"],
    REJECTED: ["❌", "El pago fue rechazado. No se hizo ningún cobro."],
    FAILED: ["❌", "El pago falló. No se hizo ningún cobro."],
    VOIDED: ["❌", "El pago fue anulado."],
    REVISION_MANUAL: ["⚠️", "Recibimos un pago que no coincide con tu pedido. Un asesor lo revisará contigo."],
    SIN_DATOS: ["⚠️", "No encontramos los datos de tu pedido en este navegador."],
  };
  const [icono, texto] = textos[r.estado ?? ""] ?? ["⚠️", r.error ?? "No pudimos verificar el pago."];
  const agotado = intento >= MAX_REINTENTOS;

  return (
    <div className="rounded-md border border-hairline p-8 text-center shadow-card">
      <p className="text-4xl" aria-hidden="true">
        {icono}
      </p>
      <p className="mt-4 text-xl font-semibold tracking-[-0.18px] text-ink">
        {agotado && icono === "⏳" ? "Tu pago aún no está confirmado." : texto}
      </p>
      {r.codigo && <p className="mt-2 text-sm text-muted">Pedido {r.codigo}</p>}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {(agotado || icono !== "⏳") && (
          <Link href="/checkout" className="btn-primary">
            Volver a intentar
          </Link>
        )}
        <a href={ayuda} className="btn-secondary">
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
