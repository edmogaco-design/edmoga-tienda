// Registro de ventas: guarda cada pedido en Supabase (base de datos) y en Google Sheets
// (hoja para el dueño). Solo servidor. Nunca lanza error: si un destino falla, el cliente
// igual sigue a WhatsApp y el fallo queda en los logs.
// - Supabase por REST con la llave service_role (las tablas tienen RLS sin políticas: nadie
//   más las lee). Esquema en supabase/esquema.sql.
// - Sheets por un Apps Script publicado como app web (ver docs/google-sheets.gs).
import type { Pedido } from "./pedido";

const TIEMPO_MAX_MS = 4000;

export type FilaPedido = {
  codigo: string;
  metodo: "contra_entrega" | "bold";
  estado: string;
  producto: string;
  cantidad: number;
  subtotal: number;
  envio: number;
  total: number;
  nombre: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  notas: string | null;
  orden_bold: string | null;
  transaccion_bold: string | null;
  dropi: string;
  dropi_pedido: string | null;
};

export function filaPedido(
  p: Pedido,
  datos: Omit<FilaPedido, "cantidad" | "nombre" | "telefono" | "departamento" | "ciudad" | "direccion" | "notas">,
): FilaPedido {
  return {
    ...datos,
    cantidad: p.cantidad,
    nombre: p.nombre,
    telefono: p.telefono,
    departamento: p.departamento,
    ciudad: p.ciudad,
    direccion: p.direccion,
    notas: p.notas ?? null,
  };
}

function urlSupabase(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function supabaseConfigurado(): boolean {
  return Boolean(urlSupabase() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Inserta o actualiza (por la columna única `conflicto`) una fila en una tabla de Supabase. */
async function upsertSupabase(tabla: string, conflicto: string, fila: object): Promise<void> {
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${urlSupabase()}/rest/v1/${tabla}?on_conflict=${conflicto}`, {
    method: "POST",
    headers: {
      apikey: llave,
      Authorization: `Bearer ${llave}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(fila),
    cache: "no-store",
    signal: AbortSignal.timeout(TIEMPO_MAX_MS),
  });
  if (!res.ok) throw new Error(`supabase ${tabla} HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function enviarASheets(fila: FilaPedido): Promise<void> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return;
  // Apps Script no lee encabezados: la clave compartida va en el cuerpo.
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clave: process.env.SHEETS_WEBHOOK_SECRET ?? "", fecha: new Date().toISOString(), ...fila }),
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(TIEMPO_MAX_MS),
  });
  if (!res.ok) throw new Error(`sheets HTTP ${res.status}`);
  const txt = await res.text();
  if (!txt.includes('"ok":true')) throw new Error(`sheets respuesta: ${txt.slice(0, 100)}`);
}

/** Guarda el pedido en Supabase y en Sheets, en paralelo. No lanza. */
export async function registrarPedido(fila: FilaPedido): Promise<void> {
  const tareas: Promise<void>[] = [enviarASheets(fila)];
  if (supabaseConfigurado()) tareas.push(upsertSupabase("pedidos", "codigo,metodo", fila));
  const r = await Promise.allSettled(tareas);
  for (const x of r) {
    if (x.status === "rejected") console.error("registro_venta_fallo", { codigo: fila.codigo, error: String(x.reason) });
  }
}

/** Guarda un evento del webhook de Bold (con el JSON completo, protegido por RLS). No lanza. */
export async function registrarEventoBold(evento: {
  evento: string;
  tipo: string | null;
  transaccion: string | null;
  orden: string | null;
  total: number | null;
  crudo: unknown;
}): Promise<void> {
  if (!supabaseConfigurado()) return;
  try {
    await upsertSupabase("pagos_bold", "evento", evento);
  } catch (e) {
    console.error("registro_bold_fallo", { evento: evento.evento, error: String(e) });
  }
}
