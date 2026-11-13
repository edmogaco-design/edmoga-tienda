export const SITE = {
  nombre: "EDMOGA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://edmoga.com",
  descripcion:
    "Productos para tu bienestar, hogar y cocina con pago contra entrega en toda Colombia.",
  // WhatsApp de ventas de EDMOGA (formato 57 + 10 dígitos).
  whatsappVentas: process.env.NEXT_PUBLIC_WHATSAPP_VENTAS || "573185168451",
  // Sin número de marketing propio todavía: usa el de ventas.
  whatsappMarketing:
    process.env.NEXT_PUBLIC_WHATSAPP_MARKETING || process.env.NEXT_PUBLIC_WHATSAPP_VENTAS || "573185168451",
  correo: "edmoga.co@gmail.com",
};

/**
 * Datos para pago por transferencia (llave Bre-B). Solo servidor: se leen de Vercel.
 * Sin TRANSFERENCIA_LLAVE_BREB la tienda no ofrece transferencia.
 */
export function datosTransferencia(): { llave: string; titular: string | null } | null {
  const llave = process.env.TRANSFERENCIA_LLAVE_BREB?.trim();
  if (!llave) return null;
  return { llave, titular: process.env.TRANSFERENCIA_TITULAR?.trim() || null };
}

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
