// Integración con Bold (Botón de pagos). Solo servidor.
// Docs: developers.bold.co → Botón de pagos (integración manual), Consulta de transacciones, Webhook.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const URL_CONSULTA = process.env.BOLD_API_URL || "https://payments.api.bold.co/v2/payment-voucher";
const TIEMPO_MAX_MS = 10_000;

/** Bold está activo solo si existen la llave de identidad y la secreta. */
export function boldConfigurado(): boolean {
  return Boolean(process.env.BOLD_API_KEY && process.env.BOLD_SECRET_KEY);
}

/** Llave de identidad: es pública (va en el botón del navegador). */
export function llaveIdentidad(): string {
  return process.env.BOLD_API_KEY ?? "";
}

/** Firma de integridad: SHA256 hex de {orden}{monto}{moneda}{llaveSecreta}. */
export function firmaIntegridad(orden: string, monto: number, moneda = "COP"): string {
  const secreta = process.env.BOLD_SECRET_KEY ?? "";
  return createHash("sha256").update(`${orden}${monto}${moneda}${secreta}`).digest("hex");
}

/**
 * Verifica el encabezado x-bold-signature: HMAC-SHA256 (hex) del cuerpo crudo en Base64,
 * con la llave secreta. En modo pruebas Bold firma con llave vacía (BOLD_WEBHOOK_SECRET="").
 */
export function firmaWebhookValida(cuerpoCrudo: string, firma: string | null): boolean {
  if (!firma) return false;
  const llave = process.env.BOLD_WEBHOOK_SECRET ?? process.env.BOLD_SECRET_KEY ?? "";
  // Llave vacía = cualquiera puede firmar. Solo se acepta fuera de producción (modo pruebas de Bold).
  if (!llave && process.env.VERCEL_ENV === "production") return false;
  const esperado = createHmac("sha256", llave)
    .update(Buffer.from(cuerpoCrudo, "utf8").toString("base64"))
    .digest("hex");
  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(firma.trim().toLowerCase(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export type EstadoPago =
  | "APPROVED"
  | "PENDING"
  | "PROCESSING"
  | "REJECTED"
  | "FAILED"
  | "VOIDED"
  | "NO_TRANSACTION_FOUND";

export type ConsultaPago =
  | { ok: true; estado: EstadoPago; total: number | null; transaccion: string | null; referencia: string | null }
  | { ok: false; motivo: string };

/** Consulta el estado real del pago en Bold (no se confía en lo que diga la URL de retorno). */
export async function consultarPago(orden: string): Promise<ConsultaPago> {
  const control = new AbortController();
  const t = setTimeout(() => control.abort(), TIEMPO_MAX_MS);
  try {
    const res = await fetch(`${URL_CONSULTA}/${encodeURIComponent(orden)}`, {
      headers: { Authorization: `x-api-key ${llaveIdentidad()}`, Accept: "application/json" },
      signal: control.signal,
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, motivo: `HTTP ${res.status}` };
    const j = (await res.json()) as Record<string, unknown>;
    return {
      ok: true,
      estado: String(j.payment_status ?? "NO_TRANSACTION_FOUND") as EstadoPago,
      total: typeof j.total === "number" ? j.total : j.total != null ? Number(j.total) : null,
      transaccion: j.transaction_id != null ? String(j.transaction_id) : null,
      referencia: j.reference_id != null ? String(j.reference_id) : null,
    };
  } catch (e) {
    return { ok: false, motivo: e instanceof Error && e.name === "AbortError" ? "tiempo_agotado" : "error_red" };
  } finally {
    clearTimeout(t);
  }
}
