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
  categoria: (typeof SECCIONES)[number];
  /** Fotos del producto; la primera es la principal. */
  imagenes: string[];
  /** Fuera de la tienda (no se muestra ni se puede pedir), p. ej. mientras se confirma su registro INVIMA. */
  oculto?: boolean;
};

const CATALOGO: Producto[] = [
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2181739/1781906846PICADOR%20DE%20AJO%201.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2181739/1781906846PICADOR%20DE%20AJO%203.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2181739/1781906846PICADOR%20DE%20AJO%202.jpeg",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2293682/7ddba57c-d8aa-4d86-9092-edf97ed88ee1.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2293682/04990cb3-1b70-41d1-bd04-8a94bd8aface.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2293682/ccf62421-5c86-4419-a12c-1366115a1d40.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2293682/f1b741ad-f870-4b6c-ac44-014b5cabb849.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2293682/e158dbbe-52d5-4f51-9079-8062bf63586b.jpeg",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/309788/17018906501701890650Papel%20freidora%20200%20cuadrado%201.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/309788/17018906491701890649Papel%20freidora%20100%20cuadrado%205%20(1).jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/309788/17018906491701890649Papel%20freidora%20100%20cuadrado%204.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/309788/17018906501701890650Papel%20freidora%20100%20cuadrado%203%20(1).jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/309788/17018906501701890650Papel%20freidora%20100%20cuadrado%202%20(1).jpg",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1414251/1730247974D_NQ_NP_2X_866075-MCO79872119430_102024-F.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1414251/1730247975D_NQ_NP_2X_817160-MCO79872119428_102024-F.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1414251/1730247975D_NQ_NP_2X_873557-MCO79872119424_102024-F.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1414251/1730247974D_NQ_NP_2X_931928-MCO79872119426_102024-F.webp",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1846655/1749679457f05ef9f9-fdb7-4e11-b064-cbaac54d0016.jpg",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/743117/1712034994imagen_2024-04-02_001505903.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/743117/1712034994imagen_2024-04-02_001536209.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/743117/1712034994imagen_2024-04-02_001519256.png",
    ],
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
    categoria: "Cocina",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1965208/1760652372D_NQ_NP_2X_781302-CBT91895371316_092025-F.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1965208/1760652372D_NQ_NP_2X_952065-CBT92298136735_092025-F.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1965208/1760652372D_NQ_NP_2X_819639-CBT92298106841_092025-F.webp",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2135318/1776877367WhatsApp%20Image%202026-04-22%20at%2011.45.59%20AM%20(1).jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2135318/1776877367WhatsApp%20Image%202026-04-22%20at%2011.45.59%20AM%20(3).jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2135318/1776877367WhatsApp%20Image%202026-04-22%20at%2011.45.59%20AM%20(2).jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2135318/1776877367WhatsApp%20Image%202026-04-22%20at%2011.45.59%20AM.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2135318/1776877367WhatsApp%20Image%202026-04-22%20at%2011.46.00%20AM.jpeg",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2188720/17827701961978524c403-electrohogarcyc-p3k7grqehx-1rhmo3da979.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2188720/17827701991978524a4f0-electrohogarcyc-p3k7grqehx-3y0t4g76l6g.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2188720/17827701961978524a0ec-electrohogarcyc-p3k7grqehx-31yb8okfoa1.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2188720/1782770196D_NQ_NP_2X_931311-MCO112997818627_062026-F.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2188720/1782770196D_NQ_NP_2X_603819-MCO112997434917_062026-F.webp",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2315632/ff9b7980-9d43-4554-897a-c865586e4798.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2315632/59433665-25a4-477c-8122-9c9c9098ec0f.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2315632/97c1b81b-3790-4807-b0f7-50da7a77aab6.png",
    ],
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
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2314884/6d8c4de3-3b68-46c7-9c8d-e4171cadbffe.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2314884/91ed2ac8-6836-4e99-b4c1-f2696e496ace.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2314884/96d8372d-cd7d-4829-81f5-de7b3c983921.jpg",
    ],
  },
  // Belleza, agregados el 2026-11-09. Costo en Dropi en el comentario de cada uno.
  {
    // Dropi: $30.000
    slug: "cepillo-secador-5-en-1",
    dropiId: 2220207,
    nombre: "Cepillo secador 5 en 1",
    resumen: "Seca, alisa y da volumen a tu cabello en un solo paso.",
    descripcion:
      "Un cepillo que sopla aire caliente mientras peinas: secas y alisas al mismo tiempo, con menos frizz y en menos tiempo que con secador y plancha por separado.",
    precio: 59900,
    beneficios: [
      "Seca y alisa a la vez",
      "Menos frizz",
      "Ahorra tiempo en las mañanas",
      "Fácil de usar en casa",
    ],
    incluye: ["1 cepillo secador 5 en 1"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2220207/ac166bba-1500-4786-92e3-b539a0e10357.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2220207/d4865b7a-7d55-4e88-bca2-e14793a0ddbb.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2220207/30bd2491-3070-4e16-810a-29801ebbf668.webp",
    ],
  },
  {
    // Dropi: $18.400
    slug: "cepillo-secador-voluminizador",
    dropiId: 91887,
    nombre: "Cepillo secador voluminizador",
    resumen: "Seca tu cabello con volumen y movimiento, como recién salida de la peluquería.",
    descripcion:
      "Cepillo redondo con aire caliente para secar desde la raíz y dar volumen. Ideal para cabello liso o con ondas suaves.",
    precio: 39900,
    beneficios: [
      "Volumen desde la raíz",
      "Seca y peina al mismo tiempo",
      "Liviano y cómodo",
      "Precio accesible",
    ],
    incluye: ["1 cepillo secador voluminizador"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/91887/170239458417023945841.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/91887/170239458417023945843.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/91887/170239458417023945842.jpg",
    ],
  },
  {
    // Dropi: $35.000
    slug: "plancha-de-cabello-placa-delgada",
    dropiId: 780762,
    nombre: "Plancha de cabello de placa delgada",
    resumen: "Placas delgadas para alisar, hacer ondas y llegar a los mechones cortos.",
    descripcion:
      "Su placa delgada te permite alisar cerca de la raíz, arreglar el flequillo y también hacer ondas. Se calienta rápido y es fácil de guardar.",
    precio: 64900,
    beneficios: [
      "Alisa y hace ondas",
      "Llega a mechones cortos y flequillo",
      "Se calienta rápido",
      "Compacta para viajar",
    ],
    incluye: ["1 plancha de cabello"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/780762/1713287477nano%202.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/780762/1713287478nano%203.png",
    ],
  },
  {
    // Dropi: $12.000
    slug: "depiladora-femenina-mini-recargable",
    dropiId: 2312703,
    nombre: "Depiladora femenina mini recargable",
    resumen: "Retira el vello de cara, axilas y piernas sin dolor, donde estés.",
    descripcion:
      "Pequeña, recargable y discreta para llevar en el bolso. Retira el vello suavemente, sin cremas ni cera.",
    precio: 34900,
    beneficios: [
      "Sin dolor",
      "Recargable",
      "Cabe en el bolso",
      "Para cara y cuerpo",
    ],
    incluye: ["1 depiladora mini recargable"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2312703/img_6adc734e891f59.21859759_0.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2312703/img_6adc734f896e15.03993513_2.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2312703/img_6adc734f0f0aa9.07783244_1.jpg",
    ],
  },
  {
    // Dropi: $11.000
    slug: "depiladora-de-cejas-recargable",
    dropiId: 2114856,
    nombre: "Depiladora de cejas recargable",
    resumen: "Da forma a tus cejas y retira vellos finos con precisión.",
    descripcion:
      "Punta delgada para perfilar las cejas y retirar vellos de la cara sin pinzas. Recargable y fácil de llevar.",
    precio: 29900,
    beneficios: [
      "Precisión en las cejas",
      "Sin pinzas ni dolor",
      "Recargable",
      "Tamaño de bolsillo",
    ],
    incluye: ["1 depiladora de cejas recargable"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2114856/1774374259D_Q_NP_2X_819940-MLA100569161074_122025-R.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2114856/1774374259D_Q_NP_2X_931847-MLA100569131428_122025-R.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2114856/1774374259D_Q_NP_2X_684215-MLA101064077215_122025-R.webp",
    ],
  },
  {
    // Dropi: $9.500
    slug: "depiladora-de-cristal",
    dropiId: 535204,
    nombre: "Depiladora de cristal",
    resumen: "Retira el vello frotando suavemente, sin cuchillas ni electricidad.",
    descripcion:
      "Frota el cristal en círculos sobre la piel y el vello se desprende. Se lava con agua y se reutiliza muchas veces.",
    precio: 29900,
    beneficios: [
      "Sin cuchillas",
      "No necesita electricidad",
      "Reutilizable",
      "Deja la piel suave",
    ],
    incluye: ["1 depiladora de cristal"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/535204/1701361092Depilador%20Cristal%2013.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/535204/1701361092Depilador%20Cristal%2011.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/535204/1701361092Depilador%20Cristal%2010.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/535204/1701361092Depilador%20Cristal%203.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/535204/1701361092Depilador%20Cristal%208.jpg",
    ],
  },
  {
    // Dropi: $70.500
    slug: "pulidor-de-unas-recargable",
    dropiId: 1666411,
    nombre: "Pulidor de uñas recargable",
    resumen: "Lima, pule y da forma a tus uñas en casa, sin cables.",
    descripcion:
      "Pulidor eléctrico recargable con varias puntas para limar, pulir y dar forma a uñas naturales o acrílicas. Manicure y pedicure en casa, cuando quieras.",
    precio: 119900,
    beneficios: [
      "Varias puntas intercambiables",
      "Recargable, sin cables",
      "Para manos y pies",
      "Ahorras en manicure",
    ],
    incluye: ["1 pulidor de uñas con puntas"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1666411/1754519004Frente%20-%202025-08-06T172044.153.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1666411/9e6ddd93-d4bc-44d9-af1f-292ba282ecd0.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1666411/815ea68c-637d-48f1-bdd7-2bb732ea7765.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1666411/30593031-b67d-4bb0-b42d-d798396286dc.png",
    ],
  },
  {
    // Dropi: $38.900
    slug: "espejo-de-maquillaje-led-con-ventilador",
    dropiId: 242259,
    nombre: "Espejo de maquillaje LED con ventilador",
    resumen: "Espejo con luz LED y ventilador para maquillarte con buena luz y sin calor.",
    descripcion:
      "La luz LED te muestra cada detalle para un maquillaje parejo, y el ventilador ayuda a que se seque y a que no sudes mientras te arreglas.",
    precio: 74900,
    beneficios: [
      "Luz LED para ver cada detalle",
      "Ventilador incorporado",
      "Ideal para el tocador",
      "Portátil",
    ],
    incluye: ["1 espejo LED con ventilador"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/242259/1701975512170197551210000963_10340647_1101610.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/242259/1701975512170197551210000963_10340647_1101612.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/242259/1701975512170197551210000963_10340647_1101611.png",
    ],
  },
  {
    // Dropi: $42.000
    slug: "cosmetiquera-con-espejo-y-divisiones",
    dropiId: 2307136,
    nombre: "Cosmetiquera con espejo y divisiones",
    resumen: "Lleva tu maquillaje ordenado, con espejo y divisiones ajustables.",
    descripcion:
      "Organiza bases, brochas y paletas en divisiones que puedes mover a tu gusto. Trae espejo para retocarte donde estés.",
    precio: 74900,
    beneficios: [
      "Todo ordenado y a la mano",
      "Divisiones ajustables",
      "Espejo incorporado",
      "Ideal para viajes",
    ],
    incluye: ["1 cosmetiquera con espejo"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2307136/img_6ad7c468dff986.29682301_0.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2307136/img_6ad7c469592314.80436471_2.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2307136/img_6ad7c46938d538.38031111_1.jpg",
    ],
  },
  {
    // Dropi: $49.900
    slug: "kit-de-brochas-trendy-x9-con-cosmetiquera",
    dropiId: 2013820,
    nombre: "Kit de 9 brochas Trendy con cosmetiquera",
    resumen: "Nueve brochas para base, polvo, rubor y sombras, con su cosmetiquera.",
    descripcion:
      "Todo lo que necesitas para maquillarte: brochas suaves para rostro y ojos, y una cosmetiquera para guardarlas limpias y ordenadas.",
    precio: 89900,
    beneficios: [
      "9 brochas para rostro y ojos",
      "Cerdas suaves",
      "Incluye cosmetiquera",
      "Buena opción para regalar",
    ],
    incluye: ["9 brochas", "1 cosmetiquera"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013820/1764717055BR-768x768.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013820/1764717055BRO2.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013820/1764717055BROC4.webp",
    ],
  },
  {
    // Dropi: $23.000
    slug: "limpiador-de-brochas-electrico",
    dropiId: 1751212,
    nombre: "Limpiador de brochas eléctrico",
    resumen: "Lava y seca tus brochas de maquillaje en segundos.",
    descripcion:
      "Pon la brocha, enciende y el limpiador la gira dentro del agua con jabón y luego la seca. Brochas limpias, maquillaje más parejo y piel más sana.",
    precio: 44900,
    beneficios: [
      "Lava y seca en segundos",
      "Brochas más limpias",
      "Cuida tu piel",
      "Fácil de usar",
    ],
    incluye: ["1 limpiador de brochas eléctrico"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1751212/17443103521000438595.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1751212/17443103521000438599.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1751212/17443103521000438596.jpg",
    ],
  },
  {
    // Dropi: $37.000
    slug: "organizador-de-brochas",
    dropiId: 505073,
    nombre: "Organizador de brochas y maquillaje",
    resumen: "Ten brochas, labiales y cosméticos ordenados en tu tocador.",
    descripcion:
      "Organizador con compartimentos para brochas, labiales y productos de maquillaje. Ves todo de un vistazo y tu tocador se mantiene ordenado.",
    precio: 64900,
    beneficios: [
      "Tocador ordenado",
      "Ves todo de un vistazo",
      "Varios compartimentos",
      "Fácil de limpiar",
    ],
    incluye: ["1 organizador"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/505073/1700179169WhatsApp%20Image%202023-11-16%20at%206.53.56%20PM.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/505073/1700179169WhatsApp%20Image%202023-11-16%20at%206.53.57%20PM%20(1).jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/505073/1700179169WhatsApp%20Image%202023-11-16%20at%206.53.58%20PM.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/505073/1700179169WhatsApp%20Image%202023-11-16%20at%206.53.57%20PM%20(2).jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/505073/1700179169WhatsApp%20Image%202023-11-16%20at%206.53.57%20PM.jpeg",
    ],
  },
  {
    // Dropi: $32.000
    slug: "lampara-de-unas-48w",
    dropiId: 443054,
    nombre: "Lámpara de uñas UV/LED 48 W",
    resumen: "Seca el esmalte semipermanente en casa, como en el salón.",
    descripcion:
      "Lámpara de 48 W para secar esmalte en gel o semipermanente en pocos segundos. Tus uñas listas en casa, sin pagar cada visita al salón.",
    precio: 59900,
    beneficios: [
      "Secado rápido",
      "Para esmalte en gel y semipermanente",
      "Uñas de salón en casa",
      "Ahorras en manicure",
    ],
    incluye: ["1 lámpara de uñas 48 W"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/443054/1697501680Screenshot_2023-10-16-19-09-37-00_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/443054/1697501680Screenshot_2023-10-16-19-09-56-92_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
    ],
  },
  {
    // Dropi: $20.000
    slug: "lampara-de-unas-mini-usb",
    dropiId: 2331382,
    nombre: "Lámpara de uñas mini USB",
    resumen: "Lámpara pequeña para secar esmalte en gel, se conecta por USB.",
    descripcion:
      "Ideal para retoques y para llevar de viaje: se conecta a un cargador o al computador por USB y seca el esmalte en gel uña por uña.",
    precio: 39900,
    beneficios: [
      "Tamaño mini",
      "Se conecta por USB",
      "Perfecta para retoques",
      "Fácil de llevar",
    ],
    incluye: ["1 lámpara de uñas mini USB"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2331382/b452626f-3a26-45a7-b723-6eebe0b32a26.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2331382/3dcd5a74-da16-441b-9c1f-ddabb067cd35.jpeg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2331382/d43ce97d-550d-46ce-afc5-faef4f5d7666.jpeg",
    ],
  },
  {
    // Dropi: $21.500
    slug: "masajeador-facial",
    dropiId: 1739192,
    nombre: "Masajeador facial",
    resumen: "Masajea tu rostro en casa para una piel que se siente más firme y descansada.",
    descripcion:
      "Úsalo unos minutos al día con tu crema o sérum: el masaje relaja el rostro y ayuda a que la piel se vea más descansada.",
    precio: 44900,
    beneficios: [
      "Masaje facial en casa",
      "Relaja el rostro",
      "Úsalo con tu crema favorita",
      "Rutina de cuidado fácil",
    ],
    incluye: ["1 masajeador facial"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1739192/1743537582Captura%20de%20pantalla%202025-04-01%20144834.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1739192/1743537582Captura%20de%20pantalla%202025-04-01%20145027.png",
    ],
  },
  {
    // Dropi: $21.000
    slug: "masajeador-facial-en-v",
    dropiId: 1672654,
    nombre: "Masajeador facial en V",
    resumen: "Masaje para el contorno del rostro, mandíbula y cuello.",
    descripcion:
      "Su forma en V recorre la línea de la mandíbula y el cuello para relajar la zona. Un momento de cuidado en tu rutina diaria.",
    precio: 42900,
    beneficios: [
      "Masaje de mandíbula y cuello",
      "Relajante",
      "Fácil de usar",
      "Compacto",
    ],
    incluye: ["1 masajeador facial en V"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1672654/1768579187masajeador%20papada%20ay-1688%2012.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1672654/1763134168masajeador%20papada%20ay-1688%207.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1672654/1763134168masajeador%20papada%20ay-1688%2011.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1672654/1763134168masajeador%20papada%20ay-1688%2016.JPG",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1672654/1763134168masajeador%20papada%20ay-1688%2015.JPG",
    ],
  },
  {
    // Dropi: $18.000
    slug: "rodillo-de-jade-facial",
    dropiId: 1903612,
    nombre: "Rodillo de jade facial",
    resumen: "Rodillo de piedra para masajear el rostro y relajar la piel.",
    descripcion:
      "Pásalo por el rostro con tu sérum o crema: la piedra fresca se siente bien en la piel y hace de tu rutina un momento de relajación.",
    precio: 36900,
    beneficios: [
      "Piedra fresca al tacto",
      "Relaja el rostro",
      "Ayuda a esparcir tu crema",
      "Bonito para regalar",
    ],
    incluye: ["1 rodillo de jade"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1903612/17557073661.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1903612/17557073664.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1903612/17557073666.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1903612/17557073662.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1903612/17557073663.jpg",
    ],
  },
  {
    // Dropi: $15.000
    slug: "rodillo-de-hielo-facial",
    dropiId: 1235157,
    nombre: "Rodillo de hielo facial",
    resumen: "Rodillo frío para despertar la piel y desinflamar en las mañanas.",
    descripcion:
      "Guárdalo en el congelador y pásalo por el rostro al levantarte: el frío refresca y ayuda a que la cara se vea menos hinchada.",
    precio: 32900,
    beneficios: [
      "Frío que refresca",
      "Ideal en las mañanas",
      "Se guarda en el congelador",
      "Fácil de limpiar",
    ],
    incluye: ["1 rodillo de hielo"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1235157/c44a9ae6-bfdc-4ab0-af07-cd4870dc5ea9.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1235157/ece2ddde-1812-4cbe-a9eb-f656d29fa72d.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1235157/1766766716bola-cristal-hielo-frio-par-masajeador-tonifica-hd-354-facial.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1235157/1766766716images%20(13).jpg",
    ],
  },
  {
    // Dropi: $22.900
    slug: "globos-de-hielo-faciales",
    dropiId: 1034673,
    nombre: "Globos de hielo faciales",
    resumen: "Esferas frías para masajear y refrescar el rostro.",
    descripcion:
      "Dos globos que se enfrían en la nevera y se deslizan por el rostro para refrescar la piel y relajar después de un día largo.",
    precio: 44900,
    beneficios: [
      "Refrescan la piel",
      "Masaje relajante",
      "Se enfrían en la nevera",
      "Vienen en par",
    ],
    incluye: ["2 globos de hielo faciales"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1034673/1722528740D_NQ_NP_2X_740059-MCO50809067269_072022-F.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1034673/1722528740D_NQ_NP_2X_891023-MCO50809124107_072022-F.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1034673/1722528740D_NQ_NP_2X_689294-MCO50809127100_072022-F.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1034673/1722528740D_NQ_NP_2X_613008-MCO50809063307_072022-F.jpg",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1034673/1722528740D_NQ_NP_2X_625906-MCO50809138035_072022-F.jpg",
    ],
  },
  {
    // Dropi: $26.900
    slug: "rodillo-facial-metalico-doble-punta",
    dropiId: 2240928,
    nombre: "Rodillo facial metálico doble punta",
    resumen: "Rodillo frío de metal con dos puntas para rostro y contorno de ojos.",
    descripcion:
      "La punta grande recorre mejillas, frente y cuello; la pequeña, el contorno de ojos. El metal se mantiene fresco y hace del masaje un momento de relajación.",
    precio: 52900,
    beneficios: [
      "Dos tamaños en uno",
      "Metal fresco al tacto",
      "Para rostro y contorno de ojos",
      "Fácil de limpiar",
    ],
    incluye: ["1 rodillo facial metálico"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2240928/02a05fc6-4a73-4728-96ff-29db334687e7.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2240928/a63f9789-9988-444f-8803-ddc9f8db9ca0.png",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2240928/3b0b6cec-7295-4a44-88c8-5fbc6adee785.png",
    ],
  },
  // Cafeteros: agregado el 2026-11-10.
  {
    // Dropi: $40.000 (precio sugerido $54.900)
    slug: "cafetera-metodo-chemex-600ml",
    dropiId: 2286133,
    nombre: "Cafetera método tipo Chemex 600 ml",
    resumen: "Prepara café filtrado a mano, con cuerpo de vidrio y cuello de madera.",
    descripcion:
      "Pon el filtro, agrega el café molido y vierte el agua caliente despacio: en pocos minutos tienes café limpio y aromático. El vidrio deja ver la preparación y el cuello de madera con cordón permite servir sin quemarte. Alcanza para varias tazas de una sola vez.",
    precio: 69900,
    beneficios: [
      "Café filtrado de sabor limpio",
      "Capacidad de 600 ml, para varias tazas",
      "Cuello de madera para servir sin quemarte",
      "Ideal para el método pour over",
    ],
    incluye: ["1 cafetera tipo Chemex de 600 ml"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Cafeteros",
    // Foto del proveedor en Dropi. Reemplazar por fotos propias cuando estén listas.
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2286133/6a37f277-5e47-4c35-9ce5-1e707c288349.png",
    ],
  },
  // Skincare y maquillaje Trendy, agregados el 2026-11-10. Marca colombiana; el INVIMA de cada uno no aparece en Dropi.
  {
    // Dropi: $35.000
    slug: "crema-facial-efecto-gel-trendy",
    dropiId: 2158797,
    nombre: "Crema facial efecto gel Trendy",
    resumen: "Hidratante ligera de textura gel que se absorbe rápido y no deja la piel grasosa.",
    descripcion:
      "Crema facial de la línea Trendy Skincare con textura gel: hidrata, refresca y se absorbe en segundos. Úsala de día bajo el maquillaje o de noche como último paso de tu rutina.",
    precio: 64900,
    beneficios: [
      "Textura gel ligera",
      "Se absorbe rápido",
      "No deja sensación grasosa",
      "Sirve de base para el maquillaje",
    ],
    incluye: ["1 crema facial efecto gel"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    invima: "NSOC53042-26CO",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2158797/1779719603trendy-p%20(2).webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2158797/1779719603trendy-crema-facial-gel-2-600x600%20(1).webp",
    ],
  },
  {
    // Dropi: $35.000
    slug: "bruma-facial-niacinamida-trendy",
    dropiId: 2158766,
    nombre: "Bruma facial con niacinamida Trendy",
    resumen: "Bruma refrescante con niacinamida para hidratar y revivir la piel en cualquier momento.",
    descripcion:
      "Rocíala sobre el rostro limpio o encima del maquillaje para refrescar e hidratar al instante. Su fórmula con niacinamida ayuda a que la piel se vea más uniforme y luminosa.",
    precio: 64900,
    beneficios: [
      "Hidrata al instante",
      "Con niacinamida",
      "Se usa sobre el maquillaje",
      "Tamaño práctico para el bolso",
    ],
    incluye: ["1 bruma facial"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2158766/1779718231Bruma-Facial-Niacinamida-Trendy-1_jpg%20(1).webp",
    ],
  },
  {
    // Dropi: $25.000
    slug: "aceite-desmaquillante-trendy",
    dropiId: 1982810,
    nombre: "Aceite desmaquillante Trendy",
    resumen: "Retira el maquillaje, incluso el a prueba de agua, sin frotar ni resecar la piel.",
    descripcion:
      "Masajea el aceite sobre la piel seca, agrega un poco de agua y enjuaga: el maquillaje y el protector solar se disuelven sin frotar. Es el primer paso de una buena doble limpieza.",
    precio: 46900,
    beneficios: [
      "Retira maquillaje a prueba de agua",
      "No reseca la piel",
      "Primer paso de la doble limpieza",
      "Rinde muchas aplicaciones",
    ],
    incluye: ["1 aceite desmaquillante"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    invima: "NSOC53030-26CO",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982810/1762029055157726-1200-auto.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982810/1762029055158806-1200-auto.webp",
    ],
  },
  {
    // Dropi: $36.000
    slug: "espuma-desmaquillante-trendy",
    dropiId: 2013649,
    nombre: "Espuma desmaquillante Trendy",
    resumen: "Espuma suave para limpiar el rostro y retirar restos de maquillaje.",
    descripcion:
      "Aplica la espuma sobre el rostro húmedo, masajea y enjuaga. Limpia en profundidad sin dejar la piel tirante, ideal como segundo paso después del aceite desmaquillante.",
    precio: 66900,
    beneficios: [
      "Limpieza suave y profunda",
      "No deja la piel tirante",
      "Textura en espuma",
      "Para uso diario",
    ],
    incluye: ["1 espuma desmaquillante"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013649/1764710473Espuma-Desmaquillante-Trendy-1.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013649/1764710473Espuma-Desmaquillante-Trendy_jpg.webp",
    ],
  },
  {
    // Dropi: $14.000
    slug: "tonico-de-rosas-trendy",
    dropiId: 1981373,
    nombre: "Tónico de rosas Trendy 360 ml",
    resumen: "Tónico de agua de rosas que refresca y prepara la piel después de la limpieza.",
    descripcion:
      "Aplícalo con un algodón o con las manos después de lavar tu rostro: refresca, equilibra la piel y la deja lista para tu crema o sérum. Presentación grande en doypack.",
    precio: 29900,
    beneficios: [
      "Refresca y equilibra la piel",
      "Con agua de rosas",
      "Prepara para la crema",
      "Presentación grande de 360 ml",
    ],
    incluye: ["1 tónico de rosas de 360 ml"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1981373/1761931935Capturadepantalla_20221209_123336_440x_fba1b131-7ea3-4850-86f0-57817a829142.webp",
    ],
  },
  {
    // Dropi: $19.000
    slug: "exfoliante-corporal-summer-trendy",
    dropiId: 1982420,
    nombre: "Exfoliante corporal Summer Trendy",
    resumen: "Exfoliante para el cuerpo que retira células muertas y deja la piel suave.",
    descripcion:
      "Masajea sobre la piel húmeda en la ducha con movimientos circulares y enjuaga. La piel queda suave, lisa y lista para hidratar.",
    precio: 39900,
    beneficios: [
      "Piel más suave y lisa",
      "Retira células muertas",
      "Aroma de verano",
      "Se usa en la ducha",
    ],
    incluye: ["1 exfoliante corporal"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982420/1762019226COLECCION-SEPTIEMBRE-8-1-416x416.webp",
    ],
  },
  {
    // Dropi: $20.000
    slug: "primer-aqua-serum-trendy",
    dropiId: 2144850,
    nombre: "Primer Aqua Serum Trendy",
    resumen: "Prebase hidratante que prepara la piel para que el maquillaje dure más.",
    descripcion:
      "Aplica una pequeña cantidad antes de la base: hidrata, suaviza la textura de la piel y ayuda a que el maquillaje se vea uniforme por más tiempo.",
    precio: 39900,
    beneficios: [
      "Maquillaje que dura más",
      "Hidrata la piel",
      "Acabado uniforme",
      "Textura ligera",
    ],
    incluye: ["1 primer Aqua Serum"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2144850/1778004501AQUASERUMGRANDE01_1024x1024_2x_c512d2da-1e02-48d1-9adc-281ec9a2ccbf%20(3).webp",
    ],
  },
  {
    // Dropi: $21.000
    slug: "polvos-compactos-trendy",
    dropiId: 1982499,
    nombre: "Polvos compactos Trendy",
    resumen: "Polvo compacto para sellar el maquillaje y controlar el brillo durante el día.",
    descripcion:
      "Úsalo para fijar la base o solo para matificar la zona T. Trae espejo, así que puedes retocarte donde estés.",
    precio: 42900,
    beneficios: [
      "Controla el brillo",
      "Sella la base",
      "Con espejo para retoques",
      "Cabe en el bolso",
    ],
    incluye: ["1 polvo compacto"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982499/1762022640PolvosCompactosTrendyRefPCO5781_1024x1024_2x_0eeae817-d020-49d8-ba7f-4525b7090ce5.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982499/1762022640PolvosCompactosTrendyRefPCO5782_1024x1024_2x_ce1ec09b-da1f-49af-b298-aec0efdcf1a5.webp",
    ],
  },
  {
    // Dropi: $15.500
    slug: "contorno-en-barra-con-rubor-trendy",
    dropiId: 1982126,
    nombre: "Contorno en barra doble con rubor Trendy",
    resumen: "Barra doble: un lado para contornear y otro de rubor para dar color.",
    descripcion:
      "Define pómulos, nariz y mandíbula con el lado de contorno y da un toque de color con el rubor. Textura cremosa que se difumina fácil con los dedos o con brocha.",
    precio: 32900,
    beneficios: [
      "Dos productos en uno",
      "Se difumina fácil",
      "Textura cremosa",
      "Práctico para llevar",
    ],
    incluye: ["1 barra doble de contorno y rubor"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982126/1762011120ContornoEnBarraDobleConRuborTrendyCS041_1024x1024_2x_c5116f7a-9dd9-4a8d-a336-69e97f18a1b6.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982126/1762011120ContornoEnBarraDobleConRuborTrendyCS042_1024x1024_2x_496e59e6-bf98-408e-b7fd-9ba48c61c8ad.webp",
    ],
  },
  {
    // Dropi: $35.000
    slug: "iluminador-lovely-glowy-trendy",
    dropiId: 2158094,
    nombre: "Iluminador Lovely Glowy Trendy",
    resumen: "Iluminador en polvo para dar brillo a pómulos, nariz y arco de cupido.",
    descripcion:
      "Aplícalo en los puntos altos del rostro para un acabado luminoso. Se puede usar suave para el día o intenso para la noche.",
    precio: 64900,
    beneficios: [
      "Acabado luminoso",
      "Fácil de difuminar",
      "Para día o noche",
      "Empaque bonito para regalar",
    ],
    incluye: ["1 iluminador"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2158094/1779558297Iluminador-Lovely-Glowy-Trendy%20(2).webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2158094/1779558297Iluminador-trendy-lovely-glow-tn%20(2).webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2158094/1779558297Iluminador-trendy-lovely-glow-tn-1-1%20(2).webp",
    ],
  },
  {
    // Dropi: $30.000
    slug: "bronzer-en-polvo-dash-trendy",
    dropiId: 2157998,
    nombre: "Bronzer en polvo Dash Trendy",
    resumen: "Bronceador en polvo para dar calidez y un tono de sol al rostro.",
    descripcion:
      "Aplícalo con brocha grande en frente, pómulos y mandíbula para un efecto bronceado natural. También sirve para contornear suave.",
    precio: 56900,
    beneficios: [
      "Efecto bronceado natural",
      "Sirve para contornear",
      "Fácil de difuminar",
      "Acabado de larga duración",
    ],
    incluye: ["1 bronzer en polvo"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    // Sin registro INVIMA de este tipo en InvimÁgil (consulta del 2026-11-10).
    oculto: true,
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2157998/1779554116Bronzer-En-Polvo-Dash-Trendy%20(2).webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2157998/1779554116Bronzer-En-Polvo-Dash-Trendy-1_jpg%20(2).webp",
    ],
  },
  {
    // Dropi: $47.000
    slug: "paleta-de-sombras-dreams-pro-trendy",
    dropiId: 2013800,
    nombre: "Paleta de sombras Dreams Pro Trendy",
    resumen: "Paleta con muchos tonos mate y brillantes para looks de día y de noche.",
    descripcion:
      "Combina tonos neutros para el día y colores intensos para la noche en una sola paleta. Pigmentos que se difuminan fácil y duran.",
    precio: 89900,
    beneficios: [
      "Muchos tonos en una paleta",
      "Mate y brillantes",
      "Buena pigmentación",
      "Looks de día y noche",
    ],
    incluye: ["1 paleta de sombras"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013800/1764715973Paleta-de-Sombras-Dreams-Pro-Trendy.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2013800/1764715972Paleta-de-Sombras-Dreams-Pro-Trendy-1.webp",
    ],
  },
  {
    // Dropi: $16.500
    slug: "paleta-de-sombras-kitty-trendy",
    dropiId: 1982313,
    nombre: "Paleta de sombras Kitty Trendy",
    resumen: "Paleta compacta de sombras con tonos fáciles de combinar.",
    descripcion:
      "Tonos pensados para el día a día en una paleta pequeña que cabe en cualquier cosmetiquera. Ideal para empezar o para llevar de viaje.",
    precio: 34900,
    beneficios: [
      "Tonos fáciles de combinar",
      "Compacta",
      "Ideal para empezar",
      "Buen regalo",
    ],
    incluye: ["1 paleta de sombras Kitty"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1982313/1762016393w_1500_h_1500_fit_pad.webp",
    ],
  },
  {
    // Dropi: $9.900
    slug: "delineador-en-gel-trendy",
    dropiId: 1980364,
    nombre: "Delineador en gel Trendy",
    resumen: "Delineador en gel a prueba de agua para un trazo intenso que dura todo el día.",
    descripcion:
      "Traza líneas finas o gruesas con precisión. Su fórmula en gel a prueba de agua no se corre con el calor ni la humedad.",
    precio: 24900,
    beneficios: [
      "A prueba de agua",
      "Color intenso",
      "Trazo preciso",
      "Larga duración",
    ],
    incluye: ["1 delineador en gel"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1980364/1761859814Delineador-Trendy-en-gel-a-prueba-de-agua.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1980364/1761859814Delineador-Trendy-en-gel-a-prueba-de-agua-Cbr.webp",
    ],
  },
  {
    // Dropi: $15.000
    slug: "lapiz-para-cejas-microblading-trendy",
    dropiId: 1986934,
    nombre: "Lápiz para cejas tipo microblading Trendy",
    resumen: "Lápiz de punta fina que dibuja trazos como pelitos para unas cejas naturales.",
    descripcion:
      "Su punta en forma de horquilla dibuja varios trazos a la vez que imitan el vello de la ceja. Rellena espacios y define la forma con un acabado natural.",
    precio: 32900,
    beneficios: [
      "Efecto pelo a pelo",
      "Acabado natural",
      "Fácil de aplicar",
      "Larga duración",
    ],
    incluye: ["1 lápiz para cejas"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    invima: "NSOC53307-26CO",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1986934/1762461322173327660978.jpeg",
    ],
  },
  {
    // Dropi: $11.000
    slug: "kit-pestanina-y-fortalecedor-trendy",
    dropiId: 1980805,
    nombre: "Kit pestañina y fortalecedor Trendy",
    resumen: "Dúo de pestañina para dar volumen y gel fortalecedor para cuidar tus pestañas.",
    descripcion:
      "Usa el fortalecedor como base o de noche para cuidar tus pestañas, y la pestañina para darles volumen y longitud durante el día.",
    precio: 26900,
    beneficios: [
      "Dos productos en un kit",
      "Volumen y longitud",
      "Cuida tus pestañas",
      "Buen precio",
    ],
    incluye: ["1 pestañina y 1 fortalecedor de pestañas"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Skincare y belleza",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1980805/1761917010gold-eyes-1.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1980805/1761917010165971-1200-auto.webp",
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1980805/1761917010165972-1200-auto.webp",
    ],
  },
  // Gimnasio y Tecnología, agregados el 2026-11-12. Precios propuestos por Claude; pendiente confirmación del dueño.
  // Productos genéricos (sin marcas imitadas), sin variantes de color. Foto del proveedor en Dropi.
  {
    // Dropi: $18.000
    slug: "bandas-de-resistencia-para-entrenamiento",
    dropiId: 722193,
    nombre: "Bandas de resistencia para entrenamiento",
    resumen: "Entrena piernas, glúteos y brazos en casa o en el gimnasio, sin máquinas.",
    descripcion:
      "Ligeras y fáciles de llevar a donde vayas: suma resistencia a tus sentadillas, puentes y estiramientos para que cada repetición cuente. Un gimnasio completo que cabe en tu maleta.",
    precio: 39900,
    beneficios: [
      "Entrena en casa, en el parque o de viaje",
      "Más intensidad en cada ejercicio",
      "Sirven para calentar y estirar",
      "Ocupan casi nada de espacio",
    ],
    incluye: ["Bandas de resistencia para entrenamiento"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Gimnasio",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/722193/17108662881708111845-NqNzNvxP5tZoGQ6GXp2.jpg",
    ],
  },
  {
    // Dropi: $22.000
    slug: "guantes-de-gimnasio-y-ciclismo",
    dropiId: 2147100,
    nombre: "Guantes de gimnasio y ciclismo",
    resumen: "Agarre firme en pesas, barras y manubrio, sin callos ni ampollas.",
    descripcion:
      "Protege tus manos mientras levantas o pedaleas: mejoran el agarre cuando sudas y reducen la fricción contra la barra. Entrena más tiempo y con más confianza.",
    precio: 44900,
    beneficios: [
      "Mejor agarre con las manos sudadas",
      "Menos callos y ampollas",
      "Sirven para pesas y bicicleta",
      "Livianos y fáciles de llevar",
    ],
    incluye: ["1 par de guantes"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Gimnasio",
    imagenes: ["https://d39ru7awumhhs2.cloudfront.net/colombia/products/2147100/17782487831000332393.jpg"],
  },
  {
    // Dropi: $19.900
    slug: "botella-shaker-con-compartimentos",
    dropiId: 1331457,
    nombre: "Botella shaker con compartimentos",
    resumen: "Lleva tu proteína en polvo aparte y mézclala justo cuando la vas a tomar.",
    descripcion:
      "Guarda el polvo en los compartimentos y el agua en la botella: al terminar de entrenar, sirves, agitas y listo. Nada de bolsas ni recipientes extra en el morral.",
    precio: 39900,
    beneficios: [
      "Compartimentos para el polvo",
      "Mezcla rápida al agitar",
      "Todo en un solo envase",
      "Ideal para el gimnasio y la oficina",
    ],
    incluye: ["1 botella shaker con compartimentos"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Gimnasio",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1331457/1728492380WhatsApp%20Image%202024-10-09%20at%205.53.19%20AM.jpeg",
    ],
  },
  {
    // Dropi: $40.000
    slug: "bolso-magnetico-para-gimnasio",
    dropiId: 2106331,
    nombre: "Bolso magnético para gimnasio",
    resumen: "Se pega a las máquinas del gimnasio y mantiene a mano tu celular, llaves y audífonos.",
    descripcion:
      "Pégalo en la máquina que estás usando y entrena con tus cosas a la vista, sin dejarlas en el piso ni en la banca. Práctico, discreto y siempre a tu alcance.",
    precio: 69900,
    beneficios: [
      "Se adhiere con imán a superficies metálicas",
      "Tus cosas siempre a la vista",
      "Nada en el piso del gimnasio",
      "Compacto y fácil de llevar",
    ],
    incluye: ["1 bolso magnético"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Gimnasio",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2106331/1773357195D_NQ_NP_2X_649449-CBT83583808540_042025-F.webp",
    ],
  },
  {
    // Dropi: $35.000
    slug: "barra-de-ejercicios-para-puerta",
    dropiId: 885497,
    nombre: "Barra de ejercicios para puerta",
    resumen: "Haz dominadas en casa: se instala en el marco de la puerta.",
    descripcion:
      "Convierte cualquier puerta en tu estación de dominadas. Fortalece espalda, brazos y abdomen todos los días sin pagar mensualidad ni salir de casa.",
    precio: 69900,
    beneficios: [
      "Dominadas y colgadas en casa",
      "Trabaja espalda, brazos y abdomen",
      "Se instala en el marco de la puerta",
      "Ocupa muy poco espacio",
    ],
    incluye: ["1 barra de ejercicios para puerta"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Gimnasio",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/885497/1716567368D_NQ_NP_879907-MCO75631165627_042024-O%20(1).webp",
    ],
  },
  {
    // Dropi: $25.000
    slug: "cargador-magnetico-inalambrico",
    dropiId: 2280195,
    nombre: "Cargador magnético inalámbrico",
    resumen: "Acerca el celular y queda pegado cargando, sin buscar el cable.",
    descripcion:
      "Olvídate de conectar y desconectar: el imán alinea tu celular en el punto exacto y empieza a cargar. Revisa que tu celular sea compatible con carga inalámbrica magnética.",
    precio: 49900,
    beneficios: [
      "Se pega con imán en la posición correcta",
      "Sin enredos de cables",
      "Puedes seguir usando el celular mientras carga",
      "Compacto para llevar en el bolso",
    ],
    incluye: ["1 cargador magnético inalámbrico"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Tecnología",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/2280195/593449c5-b1fa-45de-9346-b668ec3179d1.webp",
    ],
  },
  {
    // Dropi: $42.000
    slug: "cargador-magnetico-3-en-1",
    dropiId: 1719580,
    nombre: "Cargador magnético 3 en 1",
    resumen: "Carga hasta tres dispositivos en un solo lugar y despeja tu mesa de noche.",
    descripcion:
      "Un solo cargador para tus dispositivos de todos los días: menos cables, menos enchufes y todo listo cuando te levantas. Revisa que tus equipos sean compatibles con carga inalámbrica.",
    precio: 79900,
    beneficios: [
      "Tres dispositivos, un solo cargador",
      "Mesa de noche ordenada",
      "Libera enchufes",
      "Buen regalo",
    ],
    incluye: ["1 cargador magnético 3 en 1"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Tecnología",
    imagenes: [
      "https://d39ru7awumhhs2.cloudfront.net/colombia/products/1719580/1741986792Post%20de%20Instagram%20Vertical%20Frase%20Acuarela%20Azul%203.png.png",
    ],
  },
  {
    // Dropi: $39.900
    slug: "smartwatch-c60-ultra-3",
    dropiId: 2001624,
    nombre: "Smartwatch C60 Ultra 3",
    resumen: "Reloj inteligente con pantalla grande para ver la hora y tus notificaciones en la muñeca.",
    descripcion:
      "Mira la hora y tus mensajes con solo girar la muñeca. Un reloj deportivo de diseño moderno que se conecta a tu celular por Bluetooth.",
    precio: 79900,
    beneficios: [
      "Notificaciones del celular en la muñeca",
      "Se conecta por Bluetooth",
      "Pantalla grande y fácil de leer",
      "Diseño deportivo",
    ],
    incluye: ["1 smartwatch C60 Ultra 3"],
    garantia: "Garantía por defectos de fábrica según la Ley 1480 de 2011.",
    categoria: "Tecnología",
    imagenes: ["https://d39ru7awumhhs2.cloudfront.net/colombia/products/2001624/1763748452Reloj%20c60.jpg"],
  },
];

/** Productos a la venta: todo el catálogo menos los ocultos. */
export const PRODUCTOS: Producto[] = CATALOGO.filter((p) => !p.oculto);

/** Secciones de la tienda, en el orden en que aparecen en el inicio. */
export const SECCIONES = ["Cocina", "Skincare y belleza", "Cafeteros", "Gimnasio", "Tecnología"] as const;
export type Seccion = (typeof SECCIONES)[number];

/** Página propia de cada sección (/categoria/[slug]): textos del banner y de los buscadores. */
export const CATEGORIAS: Record<Seccion, { slug: string; titulo: string; lema: string; descripcion: string }> = {
  Cocina: {
    slug: "cocina",
    titulo: "Cocina práctica",
    lema: "Cocina más rápido, limpia menos y disfruta más cada comida.",
    descripcion: "Utensilios y accesorios de cocina con pago contra entrega en toda Colombia.",
  },
  "Skincare y belleza": {
    slug: "belleza",
    titulo: "Skincare y belleza",
    lema: "Tu rutina de cuidado, simple y directo a tu puerta.",
    descripcion: "Skincare, maquillaje y cuidado personal con pago contra entrega en toda Colombia.",
  },
  Cafeteros: {
    slug: "cafeteros",
    titulo: "Para cafeteros",
    lema: "Prepara en casa un café para disfrutar sin afán.",
    descripcion: "Cafeteras y accesorios para preparar café en casa, con envío a toda Colombia.",
  },
  Gimnasio: {
    slug: "gimnasio",
    titulo: "Gimnasio y fitness",
    lema: "Equipa tu rutina. Supera tus límites.",
    descripcion: "Accesorios para entrenar en casa o en el gimnasio, con pago contra entrega en toda Colombia.",
  },
  Tecnología: {
    slug: "tecnologia",
    titulo: "Tecnología y lifestyle",
    lema: "Pequeños aparatos que te hacen el día más fácil.",
    descripcion: "Cargadores, smartwatches y accesorios de tecnología con pago contra entrega en toda Colombia.",
  },
};

export function seccionPorSlug(slug: string): Seccion | undefined {
  return SECCIONES.find((s) => CATEGORIAS[s].slug === slug);
}

export function obtenerProducto(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug);
}
