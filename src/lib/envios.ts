// Costo de envío contra entrega por zonas. Tabla fija mientras Dropi no habilite su API
// para cotizar en vivo. Valores de referencia tomados de Dropi el 2026-11-09 (picadora, 1 unidad):
// Medellín ~$13.400, Bogotá ~$16.600, municipios ~$21.700, Leticia ~$39.700.
// Para cambiar precios, edita ZONAS. Pago en línea (Bold) sigue con envío gratis.
import type { Departamento } from "./departamentos";

export type Zona = "principal" | "nacional" | "lejana";

export const ZONAS: Record<Zona, { nombre: string; valor: number }> = {
  principal: { nombre: "Ciudades principales", valor: 18000 },
  nacional: { nombre: "Resto del país", valor: 24000 },
  lejana: { nombre: "Zonas apartadas", valor: 42000 },
};

const PRINCIPALES: Departamento[] = [
  "Antioquia",
  "Bogotá D.C.",
  "Cundinamarca",
  "Valle del Cauca",
  "Atlántico",
  "Santander",
  "Risaralda",
  "Caldas",
  "Quindío",
];

const LEJANAS: Departamento[] = [
  "Amazonas",
  "San Andrés y Providencia",
  "Guainía",
  "Guaviare",
  "Vaupés",
  "Vichada",
];

export function zonaDe(departamento: Departamento): Zona {
  if (PRINCIPALES.includes(departamento)) return "principal";
  if (LEJANAS.includes(departamento)) return "lejana";
  return "nacional";
}

/** Valor del envío contra entrega para un departamento (un solo cobro por pedido). */
export function costoEnvio(departamento: Departamento): number {
  return ZONAS[zonaDe(departamento)].valor;
}
