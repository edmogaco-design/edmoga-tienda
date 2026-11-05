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

  if (!r) return <p className="text-stone-600">Verificando tu pago con Bold…</p>;

  const ayuda = enlaceWhatsApp(`Hola EDMOGA, necesito ayuda con mi pago en línea. Orden: ${orden || "sin número"}`);

  if (r.estado === "APPROVED") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-5xl">✅</p>
        <h1 className="text-2xl font-bold text-stone-900">¡Pago confirmado!</h1>
        <p className="text-stone-700">
          Pedido <strong>{r.codigo}</strong>
          {r.transaccion ? (
            <>
              {" "}
              · Transacción Bold <strong>{r.transaccion}</strong>
            </>
          ) : null}
        </p>
        <p className="text-stone-600">Envíanos el resumen por WhatsApp para coordinar el despacho.</p>
        <a
          href={r.whatsapp}
          className="inline-block rounded-full bg-emerald-800 px-6 py-4 font-semibold text-white hover:bg-emerald-900"
        >
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
    <div className="space-y-4 text-center">
      <p className="text-5xl">{icono}</p>
      <p className="text-lg text-stone-800">{agotado && icono === "⏳" ? "Tu pago aún no está confirmado." : texto}</p>
      {r.codigo && <p className="text-sm text-stone-600">Pedido {r.codigo}</p>}
      <div className="flex flex-col items-center gap-2">
        {(agotado || icono !== "⏳") && (
          <Link href="/checkout" className="font-semibold text-emerald-800 underline">
            Volver a intentar
          </Link>
        )}
        <a href={ayuda} className="text-sm text-stone-700 underline">
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
