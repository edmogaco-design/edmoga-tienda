"use client";

import { useState } from "react";
import { ImagenProducto } from "./ImagenProducto";

// Foto grande y miniaturas debajo para cambiarla. Con una sola foto no muestra miniaturas.
export function GaleriaProducto({ imagenes, alt }: { imagenes: string[]; alt: string }) {
  const [actual, setActual] = useState(0);

  return (
    <div>
      <ImagenProducto src={imagenes[actual]} alt={alt} className="aspect-square md:aspect-[4/3]" prioridad />
      {imagenes.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Más fotos">
          {imagenes.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActual(i)}
                aria-label={`Ver foto ${i + 1} de ${imagenes.length}`}
                aria-current={i === actual}
                className={`block rounded-md border-2 ${i === actual ? "border-primary" : "border-transparent"}`}
              >
                <ImagenProducto src={src} alt="" className="h-16 w-16 sm:h-20 sm:w-20" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
