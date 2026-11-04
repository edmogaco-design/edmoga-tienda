export const store = {
  name: "Edmoga",
  tagline: "Productos útiles, envío a toda Colombia y pago contraentrega",
  currency: "COP",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "573000000000",
  // Envío fijo mostrado al cliente (ajustar cuando definamos transportadora/cotización real)
  shippingFlat: 0,
  // Estrategia de precio: precio de venta = max(sugerido, costo * (1 + markupMin))
  markupMin: 0.6,
};
