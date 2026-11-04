// Departamentos de Colombia: nombre que ve el cliente → nombre exacto que usa Dropi
// (tomado de la lista de departamentos de Dropi el 2026-11-04).
const MAPA_DROPI = {
  Amazonas: "AMAZONAS",
  Antioquia: "ANTIOQUIA",
  Arauca: "ARAUCA",
  Atlántico: "ATLANTICO",
  "Bogotá D.C.": "CUNDINAMARCA", // Dropi registra Bogotá dentro de Cundinamarca
  Bolívar: "BOLIVAR",
  Boyacá: "BOYACA",
  Caldas: "CALDAS",
  Caquetá: "CAQUETA",
  Casanare: "CASANARE",
  Cauca: "CAUCA",
  Cesar: "CESAR",
  Chocó: "CHOCO",
  Córdoba: "CORDOBA",
  Cundinamarca: "CUNDINAMARCA",
  Guainía: "GUAINIA",
  Guaviare: "GUAVIARE",
  Huila: "HUILA",
  "La Guajira": "LA GUAJIRA",
  Magdalena: "MAGDALENA",
  Meta: "META",
  Nariño: "NARIÑO",
  "Norte de Santander": "NORTE DE SANTANDER",
  Putumayo: "PUTUMAYO",
  Quindío: "QUINDIO",
  Risaralda: "RISARALDA",
  "San Andrés y Providencia": "ARCHIPIELAGO DE SAN ANDRES",
  Santander: "SANTANDER",
  Sucre: "SUCRE",
  Tolima: "TOLIMA",
  "Valle del Cauca": "VALLE",
  Vaupés: "VAUPES",
  Vichada: "VICHADA",
} as const;

export type Departamento = keyof typeof MAPA_DROPI;
export const DEPARTAMENTOS = Object.keys(MAPA_DROPI) as [Departamento, ...Departamento[]];

/** Ciudad como la escribe Dropi: mayúsculas, sin tildes, conservando la Ñ. "Medellín" -> "MEDELLIN" */
export function normalizarDropi(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/(?<![nN])[̀-ͯ]/g, "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function departamentoDropi(departamento: Departamento): string {
  return MAPA_DROPI[departamento];
}
