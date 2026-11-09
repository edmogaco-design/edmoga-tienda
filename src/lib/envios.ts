// Costo de envío contra entrega por zonas. Tabla fija mientras Dropi no habilite su API
// para cotizar en vivo. Valores de referencia tomados de Dropi el 2026-11-09 (picadora, 1 unidad):
// Medellín ~$13.400, Bogotá ~$16.600, municipios ~$21.700, Leticia ~$39.700.
// Para cambiar precios, edita ZONAS. Pago en línea (Bold) sigue con envío gratis.
import { normalizarDropi, type Departamento } from "./departamentos";

export type Zona = "principal" | "nacional" | "lejana";

export const ZONAS: Record<Zona, { nombre: string; valor: number }> = {
  principal: { nombre: "Ciudades principales", valor: 18000 },
  nacional: { nombre: "Resto del país", valor: 24000 },
  lejana: { nombre: "Zonas apartadas", valor: 42000 },
};

// Tarifa principal solo en la capital: los demás municipios del departamento cuestan como
// "resto del país" en Dropi (~$21.700). Bogotá D.C. es toda ciudad principal.
// shortcut: municipios del área metropolitana (Bello, Soacha…) pagan tarifa nacional; agregarlos
// aquí si Dropi les cobra como a la capital.
const CAPITALES: Partial<Record<Departamento, string[]>> = {
  Antioquia: ["MEDELLIN"],
  "Valle del Cauca": ["CALI", "SANTIAGO DE CALI"],
  Atlántico: ["BARRANQUILLA"],
  Santander: ["BUCARAMANGA"],
  Risaralda: ["PEREIRA"],
  Caldas: ["MANIZALES"],
  Quindío: ["ARMENIA"],
};

const LEJANAS: Departamento[] = [
  "Amazonas",
  "San Andrés y Providencia",
  "Guainía",
  "Guaviare",
  "Vaupés",
  "Vichada",
];

export function zonaDe(departamento: Departamento, ciudad: string): Zona {
  if (departamento === "Bogotá D.C.") return "principal";
  if (CAPITALES[departamento]?.includes(normalizarDropi(ciudad))) return "principal";
  if (LEJANAS.includes(departamento)) return "lejana";
  return "nacional";
}

/** Valor del envío contra entrega según departamento y ciudad (un solo cobro por pedido). */
export function costoEnvio(departamento: Departamento, ciudad: string): number {
  return ZONAS[zonaDe(departamento, ciudad)].valor;
}
