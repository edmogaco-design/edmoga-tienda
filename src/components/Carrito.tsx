"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatoCOP } from "@/lib/config";
import { ImagenProducto } from "./ImagenProducto";
import { useTienda } from "./TiendaProvider";

/** − cantidad +, compartido por el panel del carrito y el resumen del checkout. */
export function SelectorCantidad({ cantidad, alCambiar, nombre }: { cantidad: number; alCambiar: (n: number) => void; nombre: string }) {
  const boton = "flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-lg text-ink disabled:opacity-30";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={boton} onClick={() => alCambiar(cantidad - 1)} disabled={cantidad <= 1} aria-label={`Quitar una unidad de ${nombre}`}>
        −
      </button>
      <span className="w-6 text-center text-base text-ink" aria-live="polite">
        {cantidad}
      </span>
      <button type="button" className={boton} onClick={() => alCambiar(cantidad + 1)} disabled={cantidad >= 10} aria-label={`Agregar una unidad de ${nombre}`}>
        +
      </button>
    </div>
  );
}

/** Iconos del encabezado: favoritos y carrito, con su contador. */
export function AccionesEncabezado() {
  const { listo, unidades, favoritos, abrirPanel } = useTienda();
  const globo = "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-oro px-1 text-xs font-bold text-primary";
  const icono = "relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-soft";
  return (
    <div className="flex items-center gap-1">
      <Link href="/favoritos" className={icono} aria-label={`Favoritos${listo && favoritos.length ? `, ${favoritos.length}` : ""}`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" strokeLinejoin="round" />
        </svg>
        {listo && favoritos.length > 0 && <span className={globo}>{favoritos.length}</span>}
      </Link>
      <button type="button" onClick={abrirPanel} className={icono} aria-label={`Abrir carrito${listo && unidades ? `, ${unidades} productos` : ""}`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 4h2.2l2.3 11h10.2l2-8H6.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="19.5" r="1.4" />
          <circle cx="16.5" cy="19.5" r="1.4" />
        </svg>
        {listo && unidades > 0 && <span className={globo}>{unidades}</span>}
      </button>
    </div>
  );
}

/** Panel lateral del carrito. Se cierra con Esc, con la X o tocando fuera. */
export function PanelCarrito() {
  const { catalogo, carrito, subtotal, panelAbierto, cerrarPanel, cambiarCantidad, quitar } = useTienda();
  const cerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!panelAbierto) return;
    cerrar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrarPanel();
    document.addEventListener("keydown", tecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
    };
  }, [panelAbierto, cerrarPanel]);

  return (
    <div className={`fixed inset-0 z-50 ${panelAbierto ? "" : "pointer-events-none"}`} aria-hidden={!panelAbierto} inert={!panelAbierto}>
      <div
        onClick={cerrarPanel}
        className={`absolute inset-0 bg-primary/50 transition-opacity duration-200 ${panelAbierto ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-canvas shadow-card transition-transform duration-300 ease-out ${
          panelAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="text-xl font-bold text-ink">Tu carrito</h2>
          <button ref={cerrar} type="button" onClick={cerrarPanel} aria-label="Cerrar carrito" className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface-soft">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-base text-body">Tu carrito está vacío.</p>
            <Link href="/#productos" onClick={cerrarPanel} className="btn-secondary">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-5">
              {carrito.map((item) => {
                const p = catalogo[item.slug];
                if (!p) return null;
                return (
                  <li key={item.slug} className="flex gap-4 py-4">
                    <Link href={`/producto/${p.slug}`} onClick={cerrarPanel} className="shrink-0">
                      <ImagenProducto src={p.imagen} alt={p.nombre} className="h-20 w-20" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold leading-tight text-ink">{p.nombre}</p>
                      <p className="mt-0.5 text-sm text-muted">{formatoCOP(p.precio)} c/u</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <SelectorCantidad cantidad={item.cantidad} alCambiar={(n) => cambiarCantidad(p.slug, n)} nombre={p.nombre} />
                        <button type="button" onClick={() => quitar(p.slug)} className="text-sm font-medium text-muted underline hover:text-error">
                          Quitar
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 font-titulos text-base font-bold text-primary">{formatoCOP(p.precio * item.cantidad)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-hairline px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-base text-body">Subtotal</span>
                <span className="font-titulos text-2xl font-extrabold text-primary">{formatoCOP(subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-muted">El envío se calcula al finalizar, según tu ciudad.</p>
              <Link href="/checkout" onClick={cerrarPanel} className="btn-primary mt-4 w-full">
                Finalizar pedido
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/** Botón "Agregar al carrito": suma el producto y abre el panel. */
export function BotonAgregar({ slug, className = "btn-primary", texto = "Agregar al carrito" }: { slug: string; className?: string; texto?: string }) {
  const { agregar, abrirPanel } = useTienda();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!agregar(slug)) alert("Tu carrito ya tiene 10 productos distintos. Finaliza ese pedido o quita alguno.");
        abrirPanel();
      }}
    >
      {texto}
    </button>
  );
}

/** Corazón de favoritos. `flotante`: redondo y blanco, para ir sobre la foto de la tarjeta. */
export function BotonFavorito({ slug, nombre, flotante }: { slug: string; nombre: string; flotante?: boolean }) {
  const { listo, favoritos, alternarFavorito } = useTienda();
  const activo = listo && favoritos.includes(slug);
  return (
    <button
      type="button"
      onClick={() => alternarFavorito(slug)}
      aria-pressed={activo}
      aria-label={activo ? `Quitar ${nombre} de favoritos` : `Guardar ${nombre} en favoritos`}
      className={
        flotante
          ? "flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-primary shadow-card transition-transform hover:scale-110"
          : "btn-secondary gap-2"
      }
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${activo ? "text-error" : ""}`} fill={activo ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" strokeLinejoin="round" />
      </svg>
      {!flotante && (activo ? "Guardado" : "Guardar")}
    </button>
  );
}
