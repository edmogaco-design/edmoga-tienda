// Registro compartido "esto ya se procesó", para no crear el mismo pedido dos veces en Dropi
// cuando la petición cae en otra instancia de Vercel (recargas, reintentos, repeticiones).
// Usa Upstash Redis por REST (Vercel → Storage → Upstash). Sin KV_REST_API_URL/TOKEN usa
// memoria por instancia: sirve en local, NO protege producción.
const URL_KV = process.env.KV_REST_API_URL;
const TOKEN_KV = process.env.KV_REST_API_TOKEN;
const PROCESANDO = "procesando";

const memoria = new Map<string, { valor: string; hasta: number }>();

async function redis(comando: (string | number)[]): Promise<unknown> {
  const res = await fetch(URL_KV!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_KV}`, "Content-Type": "application/json" },
    body: JSON.stringify(comando),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`kv HTTP ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

function enMemoria(clave: string): string | null {
  const r = memoria.get(clave);
  if (!r) return null;
  if (r.hasta < Date.now()) {
    memoria.delete(clave);
    return null;
  }
  return r.valor;
}

/** Guarda solo si la clave no existe. true = la guardó esta llamada. */
async function guardarSiNoExiste(clave: string, valor: string, segundos: number): Promise<boolean> {
  if (URL_KV && TOKEN_KV) return (await redis(["SET", clave, valor, "NX", "EX", segundos])) === "OK";
  if (enMemoria(clave) !== null) return false;
  memoria.set(clave, { valor, hasta: Date.now() + segundos * 1000 });
  return true;
}

async function leer(clave: string): Promise<string | null> {
  if (URL_KV && TOKEN_KV) return (await redis(["GET", clave])) as string | null;
  return enMemoria(clave);
}

export type Reserva<T> = { nueva: true } | { nueva: false; cuerpo: T | null };

/**
 * Reserva la clave por 2 minutos. `nueva: true`: esta llamada hace el trabajo y luego llama
 * a `guardarResultado`. `nueva: false`: otra ya lo hizo (cuerpo) o lo está haciendo (null).
 * Lanza error si el almacén no responde: cada ruta decide si sigue o se detiene.
 */
export async function reservar<T>(clave: string): Promise<Reserva<T>> {
  if (await guardarSiNoExiste(clave, PROCESANDO, 120)) return { nueva: true };
  const v = await leer(clave);
  return { nueva: false, cuerpo: v && v !== PROCESANDO ? (JSON.parse(v) as T) : null };
}

/** Guarda la respuesta final por 30 días: las repeticiones reciben lo mismo. */
export async function guardarResultado(clave: string, cuerpo: unknown): Promise<void> {
  const valor = JSON.stringify(cuerpo);
  const segundos = 30 * 24 * 3600;
  if (URL_KV && TOKEN_KV) {
    await redis(["SET", clave, valor, "EX", segundos]);
    return;
  }
  memoria.set(clave, { valor, hasta: Date.now() + segundos * 1000 });
}
