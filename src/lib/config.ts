export const SITE = {
  nombre: "EDMOGA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://edmoga.com",
  descripcion:
    "Productos para tu bienestar, hogar y cocina con pago contra entrega en toda Colombia.",
  whatsappVentas: process.env.NEXT_PUBLIC_WHATSAPP_VENTAS || "573162168177",
  whatsappMarketing: process.env.NEXT_PUBLIC_WHATSAPP_MARKETING || "573155280178",
  correo: "edmoga.co@gmail.com",
};

export function formatoCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function enlaceWhatsApp(mensaje: string, numero = SITE.whatsappVentas): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
