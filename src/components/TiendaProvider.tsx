"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Lo que el navegador necesita saber de cada producto. Los precios llegan del servidor. */
export type ProductoResumen = { slug: string; nombre: string; precio: number; categoria: string; imagen?: string };
export type ItemCarrito = { slug: string; cantidad: number };

const MAX_UNIDADES = 10; // igual que en lib/pedido.ts
const MAX_PRODUCTOS = 10;
const CLAVE_CARRITO = "edmoga-carrito";
const CLAVE_FAVORITOS = "edmoga-favoritos";

type Tienda = {
  catalogo: Record<string, ProductoResumen>;
  /** false hasta leer lo guardado en este navegador. */
  listo: boolean;
  carrito: ItemCarrito[];
  unidades: number;
  subtotal: number;
  favoritos: string[];
  panelAbierto: boolean;
  abrirPanel: () => void;
  cerrarPanel: () => void;
  /** Suma al carrito. false si ya no caben más productos distintos. */
  agregar: (slug: string, cantidad?: number) => boolean;
  cambiarCantidad: (slug: string, cantidad: number) => void;
  quitar: (slug: string) => void;
  vaciar: () => void;
  alternarFavorito: (slug: string) => void;
};

const Contexto = createContext<Tienda | null>(null);

export function useTienda(): Tienda {
  const t = useContext(Contexto);
  if (!t) throw new Error("useTienda se usa dentro de <TiendaProvider>");
  return t;
}

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento (modo privado): el carrito vive mientras la pestaña esté abierta */
  }
}

const limitar = (n: number) => Math.max(1, Math.min(MAX_UNIDADES, Math.floor(n) || 1));

export function TiendaProvider({ productos, children }: { productos: ProductoResumen[]; children: React.ReactNode }) {
  const catalogo = useMemo(() => Object.fromEntries(productos.map((p) => [p.slug, p])), [productos]);
  const [listo, setListo] = useState(false);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [panelAbierto, setPanelAbierto] = useState(false);

  // Carga lo guardado y descarta lo que ya no está a la venta o viene dañado.
  useEffect(() => {
    const c = leer<unknown>(CLAVE_CARRITO, []);
    const f = leer<unknown>(CLAVE_FAVORITOS, []);
    const vistos = new Set<string>();
    setCarrito(
      (Array.isArray(c) ? c : [])
        .filter((i): i is ItemCarrito => {
          const ok = typeof i?.slug === "string" && Boolean(catalogo[i.slug]) && !vistos.has(i.slug);
          if (ok) vistos.add(i.slug);
          return ok;
        })
        .slice(0, MAX_PRODUCTOS)
        .map((i) => ({ slug: i.slug, cantidad: limitar(Number(i.cantidad)) })),
    );
    setFavoritos([...new Set((Array.isArray(f) ? f : []).filter((s): s is string => typeof s === "string" && Boolean(catalogo[s])))]);
    setListo(true);
  }, [catalogo]);

  useEffect(() => {
    if (listo) guardar(CLAVE_CARRITO, carrito);
  }, [listo, carrito]);
  useEffect(() => {
    if (listo) guardar(CLAVE_FAVORITOS, favoritos);
  }, [listo, favoritos]);

  // Otra pestaña cambió el carrito o los favoritos: se sincroniza.
  useEffect(() => {
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVE_CARRITO) setCarrito(leer<ItemCarrito[]>(CLAVE_CARRITO, []).filter((i) => catalogo[i.slug]));
      if (e.key === CLAVE_FAVORITOS) setFavoritos(leer<string[]>(CLAVE_FAVORITOS, []).filter((s) => catalogo[s]));
    };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, [catalogo]);

  const agregar = useCallback(
    (slug: string, cantidad = 1) => {
      if (!catalogo[slug]) return false;
      const existe = carrito.some((i) => i.slug === slug);
      if (!existe && carrito.length >= MAX_PRODUCTOS) return false;
      setCarrito((actual) =>
        actual.some((i) => i.slug === slug)
          ? actual.map((i) => (i.slug === slug ? { ...i, cantidad: limitar(i.cantidad + cantidad) } : i))
          : [...actual, { slug, cantidad: limitar(cantidad) }],
      );
      return true;
    },
    [catalogo, carrito],
  );
  const cambiarCantidad = useCallback((slug: string, cantidad: number) => {
    setCarrito((actual) => actual.map((i) => (i.slug === slug ? { ...i, cantidad: limitar(cantidad) } : i)));
  }, []);
  const quitar = useCallback((slug: string) => setCarrito((actual) => actual.filter((i) => i.slug !== slug)), []);
  const vaciar = useCallback(() => setCarrito([]), []);
  const alternarFavorito = useCallback((slug: string) => {
    setFavoritos((actual) => (actual.includes(slug) ? actual.filter((s) => s !== slug) : [...actual, slug]));
  }, []);
  const abrirPanel = useCallback(() => setPanelAbierto(true), []);
  const cerrarPanel = useCallback(() => setPanelAbierto(false), []);

  const valor = useMemo<Tienda>(
    () => ({
      catalogo,
      listo,
      carrito,
      unidades: carrito.reduce((n, i) => n + i.cantidad, 0),
      subtotal: carrito.reduce((suma, i) => suma + (catalogo[i.slug]?.precio ?? 0) * i.cantidad, 0),
      favoritos,
      panelAbierto,
      abrirPanel,
      cerrarPanel,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      alternarFavorito,
    }),
    [catalogo, listo, carrito, favoritos, panelAbierto, abrirPanel, cerrarPanel, agregar, cambiarCantidad, quitar, vaciar, alternarFavorito],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
