// Precios vigentes: el precio base vive en catalogo.ts y el dueño puede cambiarlo desde /admin.
// Los cambios se guardan en la tabla `precios` de Supabase (ver supabase/esquema.sql). Solo servidor.
// Toda la tienda (páginas, pedido y pago) lee los precios de aquí, nunca del navegador.
import { unstable_cache } from "next/cache";
import { PRODUCTOS, type Producto } from "./catalogo";
import { supabaseConfigurado } from "./registro";

export const ETIQUETA_PRECIOS = "precios";
export const PRECIO_MIN = 1000;
export const PRECIO_MAX = 5_000_000;
const TIEMPO_MAX_MS = 4000;

type Precios = Record<string, number>;

function supabase(): { url: string; cabeceras: Record<string, string> } {
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  return {
    url: `${base}/rest/v1/precios`,
    cabeceras: { apikey: llave, Authorization: `Bearer ${llave}`, "Content-Type": "application/json" },
  };
}

async function leerDeSupabase(): Promise<Precios> {
  const { url, cabeceras } = supabase();
  const res = await fetch(`${url}?select=slug,precio`, {
    headers: cabeceras,
    cache: "no-store",
    signal: AbortSignal.timeout(TIEMPO_MAX_MS),
  });
  if (!res.ok) throw new Error(`supabase precios HTTP ${res.status}`);
  const filas = (await res.json()) as { slug: string; precio: number }[];
  const precios: Precios = {};
  for (const f of filas) {
    if (Number.isInteger(f.precio) && f.precio >= PRECIO_MIN && f.precio <= PRECIO_MAX) precios[f.slug] = f.precio;
  }
  return precios;
}

// Se guarda en caché y se renueva al instante cuando el dueño guarda un precio (revalidateTag).
const leerEnCache = unstable_cache(leerDeSupabase, ["precios-v1"], { tags: [ETIQUETA_PRECIOS], revalidate: 300 });

/** Precios cambiados desde /admin. Si Supabase no está o falla, no hay cambios: rigen los precios base. */
export async function preciosCambiados(): Promise<Precios> {
  if (!supabaseConfigurado()) return {};
  try {
    return await leerEnCache();
  } catch (e) {
    console.error("precios_no_disponibles", { error: String(e) });
    return {};
  }
}

export function aplicarPrecios(productos: Producto[], precios: Precios): Producto[] {
  return productos.map((p) => (precios[p.slug] ? { ...p, precio: precios[p.slug] } : p));
}

/** Productos a la venta con su precio vigente. */
export async function catalogoVigente(): Promise<Producto[]> {
  return aplicarPrecios(PRODUCTOS, await preciosCambiados());
}

export async function productoVigente(slug: string): Promise<Producto | undefined> {
  return (await catalogoVigente()).find((p) => p.slug === slug);
}

/** Guarda el precio de un producto. Lanza error si Supabase no lo acepta. */
export async function guardarPrecio(slug: string, precio: number): Promise<void> {
  const { url, cabeceras } = supabase();
  const res = await fetch(`${url}?on_conflict=slug`, {
    method: "POST",
    headers: { ...cabeceras, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ slug, precio, actualizado: new Date().toISOString() }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIEMPO_MAX_MS),
  });
  if (!res.ok) throw new Error(`supabase precios HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
}
