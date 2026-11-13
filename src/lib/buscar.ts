// Buscador de productos: busca en el catálogo cargado en el código (sin base de datos).
import { PRODUCTOS, type Producto } from "./catalogo";

export const MAX_BUSQUEDA = 60;

/** Minúsculas y sin tildes: "Café" → "cafe". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Quita el plural simple para que "cafeteras" encuentre "cafetera". */
function raiz(palabra: string): string {
  if (palabra.length > 4 && palabra.endsWith("es")) return palabra.slice(0, -2);
  if (palabra.length > 4 && palabra.endsWith("s")) return palabra.slice(0, -1);
  return palabra;
}

/**
 * Productos a la venta que contienen TODAS las palabras buscadas (en nombre, sección,
 * resumen o beneficios). Primero los que coinciden en el nombre.
 */
export function buscarProductos(texto: string, productos: Producto[] = PRODUCTOS): Producto[] {
  const palabras = normalizar(texto.slice(0, MAX_BUSQUEDA))
    .split(/[^a-z0-9ñ]+/)
    .filter(Boolean)
    .map(raiz);
  if (palabras.length === 0) return [];

  return productos
    .map((p) => {
      const nombre = normalizar(p.nombre);
      const resto = normalizar([p.categoria, p.resumen, ...p.beneficios].join(" "));
      let puntos = 0;
      for (const palabra of palabras) {
        if (nombre.includes(palabra)) puntos += 2;
        else if (resto.includes(palabra)) puntos += 1;
        else return null;
      }
      return { p, puntos };
    })
    .filter((x): x is { p: Producto; puntos: number } => x !== null)
    .sort((a, b) => b.puntos - a.puntos)
    .map((x) => x.p);
}
