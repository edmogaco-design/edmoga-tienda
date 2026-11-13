// Sesión del modo administrador (/admin). Solo servidor.
// La clave la define el dueño en la variable de entorno ADMIN_CLAVE (nunca en el código).
// La sesión es una cookie firmada: "vencimiento.firma". Cambiar ADMIN_CLAVE cierra todas las sesiones.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_ADMIN = "edmoga_admin";
export const HORAS_SESION = 8;
const LARGO_MINIMO = 10;

function clave(): string {
  return process.env.ADMIN_CLAVE ?? "";
}

/** El modo administrador solo existe si hay una clave de al menos 10 caracteres. */
export function adminConfigurado(): boolean {
  return clave().length >= LARGO_MINIMO;
}

const sha = (texto: string) => createHash("sha256").update(texto).digest();

export function claveCorrecta(intento: string): boolean {
  if (!adminConfigurado()) return false;
  // Se comparan los hashes: mismo largo siempre, sin filtrar nada por tiempo.
  return timingSafeEqual(sha(intento), sha(clave()));
}

function firmar(vence: string): string {
  const llave = sha(`edmoga-admin-sesion:${clave()}`);
  return createHmac("sha256", llave).update(vence).digest("hex");
}

export function crearSesion(ahora = Date.now()): string {
  const vence = String(ahora + HORAS_SESION * 3600 * 1000);
  return `${vence}.${firmar(vence)}`;
}

export function sesionValida(valor: string | undefined, ahora = Date.now()): boolean {
  if (!valor || !adminConfigurado()) return false;
  const [vence, firma] = valor.split(".");
  if (!vence || !firma || !/^\d+$/.test(vence)) return false;
  const a = Buffer.from(firma);
  const b = Buffer.from(firmar(vence));
  return a.length === b.length && timingSafeEqual(a, b) && Number(vence) > ahora;
}
