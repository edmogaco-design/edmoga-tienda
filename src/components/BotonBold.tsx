"use client";

import { useEffect, useRef } from "react";

export type ParametrosBold = {
  orden: string;
  monto: number;
  moneda: string;
  descripcion: string;
  llave: string;
  firma: string;
  urlRetorno: string;
  urlOrigen: string;
};

const LIBRERIA = "https://checkout.bold.co/library/boldPaymentButton.js";

// Inserta el botón oficial de Bold. Según la documentación de Bold, en React el script del botón
// debe estar en el DOM antes de cargar la librería.
export function BotonBold({ p }: { p: ParametrosBold }) {
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = contenedor.current;
    if (!caja) return;
    caja.innerHTML = "";

    const boton = document.createElement("script");
    const atributos: Record<string, string> = {
      "data-bold-button": "dark-L",
      "data-api-key": p.llave,
      "data-order-id": p.orden,
      "data-amount": String(p.monto),
      "data-currency": p.moneda,
      "data-integrity-signature": p.firma,
      "data-description": p.descripcion,
      "data-redirection-url": p.urlRetorno,
      "data-origin-url": p.urlOrigen,
    };
    for (const [k, v] of Object.entries(atributos)) boton.setAttribute(k, v);
    caja.appendChild(boton);

    document.querySelectorAll(`script[src="${LIBRERIA}"]`).forEach((s) => s.remove());
    const libreria = document.createElement("script");
    libreria.src = LIBRERIA;
    libreria.async = true;
    document.body.appendChild(libreria);

    return () => {
      caja.innerHTML = "";
    };
  }, [p]);

  return <div ref={contenedor} className="flex min-h-14 justify-center" />;
}
