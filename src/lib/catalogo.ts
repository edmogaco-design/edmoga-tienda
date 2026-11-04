export type Producto = {
  slug: string;
  dropiId: number;
  nombre: string;
  resumen: string;
  descripcion: string;
  precio: number;
  beneficios: string[];
  incluye: string[];
  garantia: string;
  invima?: string;
  categoria: string;
  imagen?: string;
};

export const PRODUCTOS: Producto[] = [
  {
    slug: "picadora-manual-de-presion",
    dropiId: 2181739,
    nombre: "Picadora manual de presión",
    resumen: "Pica cebolla, ajo, verduras y frutos secos en segundos, sin electricidad.",
    descripcion:
      "Presiona la tapa unas cuantas veces y listo: cuchillas en acero inoxidable que pican de forma pareja sin llorar con la cebolla. Compacta, fácil de desarmar y de lavar. Ideal para cocinar más rápido todos los días.",
    precio: 60000,
    beneficios: [
      "Ahorra tiempo en la cocina",
      "No necesita electricidad ni baterías",
      "Cuchillas de acero inoxidable",
      "Se desarma y lava fácil",
    ],
    incluye: ["1 picadora manual de presión"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    // Foto del proveedor en Dropi. Reemplazar por fotos propias cuando estén listas.
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2181739/1781906846PICADOR%20DE%20AJO%201.jpeg",
  },
];

export function obtenerProducto(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug);
}
