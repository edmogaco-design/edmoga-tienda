"use client";

import { useMemo, useState } from "react";
import { TarjetaProducto, type ProductoTarjeta } from "./TarjetaProducto";

const ORDENES = [
  { valor: "recomendados", texto: "Recomendados" },
  { valor: "novedades", texto: "Novedades" },
  { valor: "menor", texto: "Precio: menor a mayor" },
  { valor: "mayor", texto: "Precio: mayor a menor" },
] as const;

const PRECIOS = [
  { valor: "todos", texto: "Todos los precios", min: 0, max: Infinity },
  { valor: "bajo", texto: "Hasta $50.000", min: 0, max: 50000 },
  { valor: "medio", texto: "$50.000 a $80.000", min: 50000, max: 80000 },
  { valor: "alto", texto: "Más de $80.000", min: 80000, max: Infinity },
] as const;

/** Lista de una categoría con filtro por precio y orden. Los productos llegan en el orden del catálogo. */
export function ListaProductos({ productos }: { productos: ProductoTarjeta[] }) {
  const [orden, setOrden] = useState<(typeof ORDENES)[number]["valor"]>("recomendados");
  const [precio, setPrecio] = useState<(typeof PRECIOS)[number]["valor"]>("todos");

  const visibles = useMemo(() => {
    const rango = PRECIOS.find((r) => r.valor === precio) ?? PRECIOS[0];
    const lista = productos.filter((p) => p.precio >= rango.min && p.precio <= rango.max);
    if (orden === "novedades") lista.reverse(); // los últimos agregados al catálogo van primero
    if (orden === "menor") lista.sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") lista.sort((a, b) => b.precio - a.precio);
    return lista;
  }, [productos, orden, precio]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="etiqueta">Precio</span>
          <select className="campo min-h-12 py-2.5" value={precio} onChange={(e) => setPrecio(e.target.value as typeof precio)}>
            {PRECIOS.map((r) => (
              <option key={r.valor} value={r.valor}>
                {r.texto}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="etiqueta">Ordenar por</span>
          <select className="campo min-h-12 py-2.5" value={orden} onChange={(e) => setOrden(e.target.value as typeof orden)}>
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.texto}
              </option>
            ))}
          </select>
        </label>
        <p className="pb-3 text-sm text-muted" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {visibles.length ? (
        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibles.map((p, i) => (
            <TarjetaProducto key={p.slug} p={p} prioridad={i < 2} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-base text-body">
          No hay productos en ese rango de precio.{" "}
          <button type="button" className="font-bold text-primary underline" onClick={() => setPrecio("todos")}>
            Ver todos
          </button>
        </p>
      )}
    </div>
  );
}
