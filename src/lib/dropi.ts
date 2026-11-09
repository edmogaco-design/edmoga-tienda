// Cliente de la API de integraciones de Dropi. Solo se usa en el servidor.
// La URL y el nombre del encabezado se pueden cambiar por variable de entorno
// sin tocar código, por si Dropi los actualiza.
import type { Pedido } from "./pedido";
import type { Producto } from "./catalogo";
import { departamentoDropi, normalizarDropi } from "./departamentos";

const BASE = process.env.DROPI_API_URL || "https://api.dropi.co/integrations";
const TIEMPO_MAX_MS = 12_000;

// Las fuentes no coinciden en cómo enviar la llave. Se prueban en orden y se recuerda
// la que Dropi acepta. DROPI_AUTH_HEADER fija una sola (usar "Authorization" para Bearer).
type FormaLlave = { nombre: string; valor: (t: string) => string };
const FORMAS: FormaLlave[] = process.env.DROPI_AUTH_HEADER
  ? [
      {
        nombre: process.env.DROPI_AUTH_HEADER,
        valor: (t) => (process.env.DROPI_AUTH_HEADER === "Authorization" ? `Bearer ${t}` : t),
      },
    ]
  : [
      { nombre: "dropi-integration-key", valor: (t) => t },
      { nombre: "dropi-integracion-key", valor: (t) => t },
      { nombre: "Authorization", valor: (t) => `Bearer ${t}` },
    ];
let formaQueFunciona: FormaLlave | null = null;

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

/**
 * Si viene `pagoBold`, el cliente ya pagó en línea: Dropi NO debe cobrar al entregar.
 * `envio`: valor del envío que paga el cliente contra entrega; se suma a lo que Dropi recauda.
 */
export type OpcionesDropi = { pagoBold?: { transaccion: string | null }; envio?: number };

export function cuerpoPedidoDropi(
  p: Pedido,
  producto: Producto,
  codigoPedido: string,
  opciones: OpcionesDropi = {},
) {
  const { nombre, apellido } = separarNombre(p.nombre);
  const prepagado = Boolean(opciones.pagoBold);
  // total_order = lo que la transportadora cobra al entregar (productos + envío del cliente).
  const total = producto.precio * p.cantidad + (prepagado ? 0 : (opciones.envio ?? 0));
  return {
    type: "FINAL_ORDER",
    rate_type: prepagado ? "SIN RECAUDO" : "CON RECAUDO",
    calculate_costs_and_shiping: true,
    total_order: total,
    name: nombre,
    surname: apellido,
    phone: p.telefono,
    dir: p.direccion,
    state: departamentoDropi(p.departamento),
    city: normalizarDropi(p.ciudad),
    notes: [
      `Pedido web ${codigoPedido}`,
      prepagado ? `PAGADO EN LÍNEA (Bold ${opciones.pagoBold?.transaccion ?? ""}) - NO COBRAR` : null,
      p.notas,
    ]
      .filter(Boolean)
      .join(" · "),
    shop_order_id: codigoPedido,
    shop_order_number: codigoPedido,
    products: [{ id: producto.dropiId, price: producto.precio, quantity: p.cantidad }],
  };
}

export async function crearPedidoDropi(
  p: Pedido,
  producto: Producto,
  codigoPedido: string,
  opciones: OpcionesDropi = {},
): Promise<ResultadoDropi> {
  const token = process.env.DROPI_TOKEN;
  if (!token) return { ok: false, motivo: "sin_token" };

  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_MAX_MS);
  const cuerpo = JSON.stringify(cuerpoPedidoDropi(p, producto, codigoPedido, opciones));
  try {
    const formas = formaQueFunciona ? [formaQueFunciona] : FORMAS;
    let res: Response | null = null;
    for (const forma of formas) {
      res = await fetch(`${BASE}/orders/myorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          [forma.nombre]: forma.valor(token),
        },
        body: cuerpo,
        signal: control.signal,
        cache: "no-store",
      });
      // 401/403 = llave rechazada antes de procesar el pedido: se puede probar otra forma sin duplicar.
      if (res.status !== 401 && res.status !== 403) {
        formaQueFunciona = forma;
        break;
      }
    }
    if (!res) return { ok: false, motivo: "sin_respuesta" };
    const texto = await res.text();
    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(texto);
    } catch {
      /* respuesta no JSON */
    }
    const isSuccess = json.isSuccess !== false && res.ok;
    if (!isSuccess) {
      const mensaje =
        typeof json.message === "string" ? json.message : texto.replace(/\s+/g, " ").slice(0, 150);
      return { ok: false, motivo: `HTTP ${res.status}: ${mensaje}`.slice(0, 250) };
    }
    const objeto = (json.objects ?? json.object ?? json.data ?? json) as Record<string, unknown>;
    const id = objeto?.id ?? null;
    const estado = typeof objeto?.status === "string" ? objeto.status : null;
    return { ok: true, dropiId: id === null ? null : String(id), estado };
  } catch (e) {
    // Tiempo agotado no significa que no se creó: Dropi pudo registrarlo igual.
    const motivo =
      e instanceof Error && e.name === "AbortError"
        ? `tiempo_agotado: buscar ${codigoPedido} en Dropi antes de cargarlo a mano`
        : "error_red";
    return { ok: false, motivo };
  } finally {
    clearTimeout(temporizador);
  }
}
