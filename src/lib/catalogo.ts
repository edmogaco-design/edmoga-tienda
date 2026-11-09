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
  // Productos agregados el 2026-11-09. Costo en Dropi en el comentario de cada uno.
  // Fotos del proveedor en Dropi; reemplazar por fotos propias cuando estén listas.
  {
    // Dropi: $30.000
    slug: "filtro-purificador-de-agua-para-grifo",
    dropiId: 2293682,
    nombre: "Filtro purificador de agua para grifo",
    resumen: "Se instala en la llave de la cocina y filtra el agua que usas para tomar y cocinar.",
    descripcion:
      "Ajústalo a la salida de tu grifo y ten agua filtrada al instante, sin instalaciones complicadas. Ayuda a reducir impurezas, sedimentos y el sabor a cloro del agua de la llave.",
    precio: 49900,
    beneficios: [
      "Agua filtrada directo de la llave",
      "Se instala en minutos, sin herramientas especiales",
      "Menos sabor a cloro",
      "Ahorras en agua embotellada",
    ],
    incluye: ["1 filtro purificador para grifo"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2293682/7ddba57c-d8aa-4d86-9092-edf97ed88ee1.webp",
  },
  {
    // Dropi: $20.900
    slug: "papel-para-air-fryer-x200",
    dropiId: 309788,
    nombre: "Papel para air fryer x200",
    resumen: "200 hojas cuadradas para cocinar en tu freidora de aire sin que se ensucie la canasta.",
    descripcion:
      "Pon una hoja en la canasta antes de cocinar: los alimentos no se pegan y la grasa no queda en la freidora. Al terminar, botas el papel y la canasta queda casi limpia.",
    precio: 39900,
    beneficios: [
      "La comida no se pega",
      "Lavas la canasta mucho menos",
      "200 hojas para muchos usos",
      "Sirve también para horno",
    ],
    incluye: ["Paquete de 200 hojas cuadradas"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/309788/17018906501701890650Papel%20freidora%20200%20cuadrado%201.jpg",
  },
  {
    // Dropi: $33.000
    slug: "sarten-3-puestos-panqueques",
    dropiId: 1414251,
    nombre: "Sartén de 3 puestos para panqueques",
    resumen: "Haz tres panqueques, huevos o arepas al mismo tiempo, con revestimiento antiadherente.",
    descripcion:
      "Tres moldes redondos en una sola sartén para preparar el desayuno de toda la familia más rápido. Su revestimiento antiadherente evita que se pegue la comida y facilita lavarla.",
    precio: 59900,
    beneficios: [
      "Tres porciones a la vez",
      "Revestimiento antiadherente",
      "Porciones del mismo tamaño",
      "Ideal para desayunos",
    ],
    incluye: ["1 sartén de 3 puestos"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1414251/1730247974D_NQ_NP_2X_866075-MCO79872119430_102024-F.webp",
  },
  {
    // Dropi: $45.000
    slug: "contenedor-de-alimentos",
    dropiId: 1846655,
    nombre: "Contenedor de alimentos",
    resumen: "Guarda granos, cereales y alimentos secos ordenados y protegidos en tu cocina.",
    descripcion:
      "Mantén tu despensa organizada y los alimentos lejos de la humedad y los insectos. Ves de un vistazo cuánto te queda y sirves sin regar.",
    precio: 79900,
    beneficios: [
      "Despensa ordenada",
      "Protege los alimentos secos",
      "Sirves fácil y sin regar",
      "Ocupa poco espacio",
    ],
    incluye: ["1 contenedor de alimentos (referencia TM1020-2)"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1846655/1749679457f05ef9f9-fdb7-4e11-b064-cbaac54d0016.jpg",
  },
  {
    // Dropi: $30.000
    slug: "dispensador-aceite-y-vinagre-x2",
    dropiId: 743117,
    nombre: "Dispensador de aceite y vinagre x2",
    resumen: "Dos dispensadores para servir aceite de oliva y vinagre en la medida justa.",
    descripcion:
      "Sirve aceite y vinagre sin derrames y sin gastar de más. Se ven bien en la mesa o junto a la estufa y se rellenan fácil.",
    precio: 49900,
    beneficios: [
      "Sirves la cantidad justa",
      "Sin goteos en la mesa",
      "Fáciles de rellenar",
      "Vienen dos en el paquete",
    ],
    incluye: ["2 dispensadores"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/743117/1712034994imagen_2024-04-02_001505903.png",
  },
  {
    // Dropi: $34.900
    slug: "calentador-de-taza-electrico",
    dropiId: 1965208,
    nombre: "Calentador de taza eléctrico",
    resumen: "Mantiene caliente tu café, té o chocolate mientras trabajas o estudias.",
    descripcion:
      "Pon tu taza encima y tu bebida se mantiene tibia por más tiempo, sin volver al microondas. Ideal para el escritorio de la casa o la oficina.",
    precio: 64900,
    beneficios: [
      "Tu bebida caliente por más tiempo",
      "Sin volver al microondas",
      "Compacto para el escritorio",
      "Fácil de usar",
    ],
    incluye: ["1 calentador de taza eléctrico"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Hogar",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1965208/1760652372D_NQ_NP_2X_781302-CBT91895371316_092025-F.webp",
  },
  {
    // Dropi: $20.000
    slug: "afilador-de-cuchillos-electrico",
    dropiId: 2135318,
    nombre: "Afilador de cuchillos eléctrico",
    resumen: "Deja tus cuchillos de cocina con filo de nuevo en pocos segundos.",
    descripcion:
      "Pasa el cuchillo por la ranura y el afilador hace el trabajo por ti. Cortar carne, verduras y frutas vuelve a ser fácil y más seguro.",
    precio: 44900,
    beneficios: [
      "Filo en segundos",
      "Sin experiencia previa",
      "Cortes más fáciles y seguros",
      "Tus cuchillos duran más",
    ],
    incluye: ["1 afilador de cuchillos eléctrico"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2135318/1776877367WhatsApp%20Image%202026-04-22%20at%2011.45.59%20AM%20(1).jpeg",
  },
  {
    // Dropi: $24.000
    slug: "molino-de-cafe-manual",
    dropiId: 2188720,
    nombre: "Molino de café manual",
    resumen: "Muele tu café en grano justo antes de prepararlo, sin electricidad.",
    descripcion:
      "El café recién molido tiene más aroma y sabor. Gira la manivela y muele la cantidad que necesitas para cada preparación.",
    precio: 41900,
    beneficios: [
      "Café con más aroma",
      "No necesita electricidad",
      "Mueles solo lo que vas a usar",
      "Fácil de limpiar",
    ],
    incluye: ["1 molino de café manual"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2188720/17827701961978524c403-electrohogarcyc-p3k7grqehx-1rhmo3da979.jpg",
  },
  {
    // Dropi: $43.000
    slug: "caldero-arrocera-29-cm",
    dropiId: 2315632,
    nombre: "Caldero arrocera de 29 cm",
    resumen: "Caldero número 10 para el arroz y las preparaciones de toda la familia.",
    descripcion:
      "Un caldero amplio de 29 cm, del tamaño ideal para cocinar arroz, sudados y guisos para varias personas.",
    precio: 79900,
    beneficios: [
      "Tamaño familiar (olla número 10)",
      "Para arroz, sudados y guisos",
      "Reparte bien el calor",
      "Resistente para el uso diario",
    ],
    incluye: ["1 caldero de 29 cm"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2315632/ff9b7980-9d43-4554-897a-c865586e4798.png",
  },
  {
    // Dropi: $44.000
    slug: "cafetera-moka-12-tazas",
    dropiId: 2314884,
    nombre: "Cafetera moka de 12 tazas",
    resumen: "Cafetera italiana en acero inoxidable para preparar hasta 12 tazas en la estufa.",
    descripcion:
      "Prepara café fuerte y aromático como en Italia, directo en tu estufa. En acero inoxidable, sin filtros de papel y fácil de limpiar.",
    precio: 69900,
    beneficios: [
      "Hasta 12 tazas por preparación",
      "Acero inoxidable",
      "Sin filtros de papel",
      "Funciona en la estufa",
    ],
    incluye: ["1 cafetera moka de 12 tazas"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cocina",
    imagen:
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2314884/6d8c4de3-3b68-46c7-9c8d-e4171cadbffe.webp",
  },
];

export function obtenerProducto(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug);
}
