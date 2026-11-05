import { NextResponse } from "next/server";

// Diagnóstico TEMPORAL del 401 de Dropi. Solo en versiones de prueba (nunca en producción).
// Solo hace lecturas: no crea pedidos. Nunca devuelve el token: solo su forma.
export const dynamic = "force-dynamic";

const BASE = process.env.DROPI_API_URL || "https://api.dropi.co/integrations";

async function probar(nombre: string, url: string, metodo: "GET" | "POST", headers: Record<string, string>) {
  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json;charset=UTF-8", ...headers },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const texto = (await res.text()).replace(/\s+/g, " ").slice(0, 160);
    return { nombre, estado: res.status, respuesta: texto };
  } catch (e) {
    return { nombre, estado: 0, respuesta: e instanceof Error ? e.message : "error" };
  }
}

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "no disponible" }, { status: 404 });
  }
  const crudo = process.env.DROPI_TOKEN ?? "";
  const token = crudo.trim();

  // Forma del token (sin revelarlo): detecta errores típicos al pegar.
  const partes = token.split(".");
  let jwt: Record<string, unknown> | null = null;
  if (partes.length === 3) {
    try {
      const carga = JSON.parse(Buffer.from(partes[1], "base64url").toString("utf8")) as Record<string, unknown>;
      jwt = {
        campos: Object.keys(carga),
        expira: typeof carga.exp === "number" ? new Date(carga.exp * 1000).toISOString() : null,
        emitido: typeof carga.iat === "number" ? new Date(carga.iat * 1000).toISOString() : null,
        vencido: typeof carga.exp === "number" ? carga.exp * 1000 < Date.now() : null,
      };
    } catch {
      jwt = { error: "carga no legible" };
    }
  }

  const forma = {
    longitud: token.length,
    espaciosAlrededor: crudo.length !== token.length,
    comillas: /^["']|["']$/.test(token),
    saltosDeLinea: /[\r\n]/.test(crudo),
    partesJWT: partes.length,
    jwt,
  };

  const producto = `${BASE}/products/2181739`;
  const pruebas = await Promise.all([
    probar("producto · dropi-integration-key (como el plugin)", producto, "POST", { "dropi-integration-key": token }),
    probar("pedidos (lectura) · dropi-integration-key", `${BASE}/orders/myorders?result_number=1`, "GET", { "dropi-integration-key": token }),
    probar("producto · Authorization Bearer", producto, "POST", { Authorization: `Bearer ${token}` }),
    probar("producto · sin token (control)", producto, "POST", {}),
  ]);

  let salida: unknown = null;
  try {
    const ip = await fetch("https://ipinfo.io/json", { cache: "no-store", signal: AbortSignal.timeout(5000) });
    const j = (await ip.json()) as { country?: string; region?: string; org?: string };
    salida = { pais: j.country, region: j.region, red: j.org };
  } catch {
    salida = null;
  }

  return NextResponse.json({ forma, salidaVercel: salida, region: process.env.VERCEL_REGION ?? null, pruebas });
}
