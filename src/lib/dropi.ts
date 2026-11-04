// Cliente de la API de integraciones de Dropi. Solo se usa en el servidor.
// La URL y el nombre del encabezado se pueden cambiar por variable de entorno
// sin tocar código, por si Dropi los actualiza.
import type { Pedido } from "./pedido";
import type { Producto } from "./catalogo";
import { departamentoDropi, normalizarDropi } from "./departamentos";

const BASE = process.env.DROPI_API_URL || "https://api.dropi.co/integrations";
const ENCABEZADO = process.env.DROPI_AUTH_HEADER || "dropi-integration-key";
const TIEMPO_MAX_MS = 12_000;

export function dropiConfigurado(): boolean {
  return Boolean(process.env.DROPI_TOKEN);
}

export type ResultadoDropi =
  | { ok: true; dropiId: string | null; estado: string | null }
  | { ok: false; motivo: string };

function separarNombre(completo: string): { nombre: string; apellido: string } {
  const partes = completo.trim().split(/\s+/);
  if (partes.length === 1) return { nombre: partes[0], apellido: "-" };
  const mitad = Math.ceil(partes.length / 2);
  return { nombre: partes.slice(0, mitad).join(" "), apellido: partes.slice(mitad).join(" ") };
}

export function cuerpoPedidoDropi(p: Pedido, producto: Producto, codigoPedido: string) {
  const { nombre, apellido } = separarNombre(p.nombre);
  const total = producto.precio * p.cantidad;
  return {
    type: "FINAL_ORDER",
    rate_type: "CON RECAUDO", // pago contra entrega
    calculate_costs_and_shiping: true,
    total_order: total,
    name: nombre,
    surname: apellido,
    phone: p.telefono,
    dir: p.direccion,
    state: departamentoDropi(p.departamento),
    city: normalizarDropi(p.ciudad),
    notes: [`Pedido web ${codigoPedido}`, p.notas].filter(Boolean).join(" · "),
    shop_order_id: codigoPedido,
    shop_order_number: codigoPedido,
    products: [{ id: producto.dropiId, price: producto.precio, quantity: p.cantidad }],
  };
}

export async function crearPedidoDropi(
  p: Pedido,
  producto: Producto,
  codigoPedido: string,
): Promise<ResultadoDropi> {
  const token = process.env.DROPI_TOKEN;
  if (!token) return { ok: false, motivo: "sin_token" };

  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_MAX_MS);
  try {
    const res = await fetch(`${BASE}/orders/myorders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", [ENCABEZADO]: token },
      body: JSON.stringify(cuerpoPedidoDropi(p, producto, codigoPedido)),
      signal: control.signal,
      cache: "no-store",
    });
    const texto = await res.text();
    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(texto);
    } catch {
      /* respuesta no JSON */
    }
    const isSuccess = json.isSuccess !== false && res.ok;
    if (!isSuccess) {
      const mensaje = typeof json.message === "string" ? json.message : `HTTP ${res.status}`;
      return { ok: false, motivo: mensaje.slice(0, 200) };
    }
    const objeto = (json.objects ?? json.object ?? json.data ?? json) as Record<string, unknown>;
    const id = objeto?.id ?? null;
    const estado = typeof objeto?.status === "string" ? objeto.status : null;
    return { ok: true, dropiId: id === null ? null : String(id), estado };
  } catch (e) {
    const motivo = e instanceof Error && e.name === "AbortError" ? "tiempo_agotado" : "error_red";
    return { ok: false, motivo };
  } finally {
    clearTimeout(temporizador);
  }
}
