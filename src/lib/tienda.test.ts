// Tests de la lógica que mueve plata: qué cobra Dropi, cuánto vale el envío, firma del webhook.
// Correr: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { cuerpoPedidoDropi } from "./dropi";
import { costoEnvio, ZONAS } from "./envios";
import { firmaWebhookValida } from "./bold";
import { PRODUCTOS } from "./catalogo";
import { guardarResultado, reservar } from "./unaVez";
import { pedidoSchema, mensajePedidoTransferencia, type Pedido } from "./pedido";
import { formatoCOP } from "./config";

const producto = PRODUCTOS[0];
const pedido: Pedido = {
  idSolicitud: "123e4567-e89b-12d3-a456-426614174000",
  producto: producto.slug,
  cantidad: 2,
  nombre: "Ana María Pérez",
  telefono: "3001234567",
  ciudad: "Medellín",
  departamento: "Antioquia",
  direccion: "Calle 10 # 20-30",
  metodo: "contraentrega",
  autorizaDatos: true,
};

test("pedido sin método queda como contra entrega; transferencia se acepta", () => {
  const { metodo: _m, ...sinMetodo } = pedido;
  void _m;
  assert.equal(pedidoSchema.parse(sinMetodo).metodo, "contraentrega");
  assert.equal(pedidoSchema.parse({ ...pedido, metodo: "transferencia" }).metodo, "transferencia");
  assert.equal(pedidoSchema.safeParse({ ...pedido, metodo: "bold" }).success, false);
});

test("transferencia: mensaje con total sin envío y código", () => {
  const m = mensajePedidoTransferencia(pedido, producto.precio * 2, producto.nombre, "EDM-1");
  assert.match(m, /EDM-1/);
  assert.match(m, /envío gratis/);
  assert.ok(m.includes(formatoCOP(producto.precio * 2)));
});

test("contra entrega: Dropi cobra productos + envío", () => {
  const c = cuerpoPedidoDropi(pedido, producto, "EDM-1", { envio: 18000 });
  assert.equal(c.rate_type, "CON RECAUDO");
  assert.equal(c.total_order, producto.precio * 2 + 18000);
});

test("pagado con Bold: Dropi no cobra nada y no suma envío", () => {
  const c = cuerpoPedidoDropi(pedido, producto, "EDM-1", { pagoBold: { transaccion: "T1" }, envio: 18000 });
  assert.equal(c.rate_type, "SIN RECAUDO");
  assert.equal(c.total_order, producto.precio * 2);
  assert.match(c.notes, /NO COBRAR/);
});

test("envío: capital paga tarifa principal, municipio paga nacional", () => {
  assert.equal(costoEnvio("Antioquia", "medellín "), ZONAS.principal.valor);
  assert.equal(costoEnvio("Antioquia", "Yarumal"), ZONAS.nacional.valor);
  assert.equal(costoEnvio("Bogotá D.C.", "Bogotá"), ZONAS.principal.valor);
  assert.equal(costoEnvio("Antioquia", "Armenia"), ZONAS.nacional.valor); // Armenia de Antioquia, no Quindío
  assert.equal(costoEnvio("Amazonas", "Leticia"), ZONAS.lejana.valor);
});

test("registro: la segunda llamada no repite el trabajo y recibe la misma respuesta", async () => {
  assert.deepEqual(await reservar("t:1"), { nueva: true });
  assert.deepEqual(await reservar("t:1"), { nueva: false, cuerpo: null }); // aún procesando
  await guardarResultado("t:1", { codigo: "EDM-1" });
  assert.deepEqual(await reservar("t:1"), { nueva: false, cuerpo: { codigo: "EDM-1" } });
});

test("límite de intentos: deja pasar hasta el máximo y luego bloquea", async () => {
  const { limitado } = await import("./unaVez");
  for (let i = 0; i < 3; i++) assert.equal(await limitado("t:ip", 3, 60), false);
  assert.equal(await limitado("t:ip", 3, 60), true);
  assert.equal(await limitado("t:otra-ip", 3, 60), false);
});

test("webhook: firma correcta pasa, incorrecta no, llave vacía no en producción", () => {
  const cuerpo = '{"id":"e1"}';
  const firmar = (llave: string) =>
    createHmac("sha256", llave).update(Buffer.from(cuerpo).toString("base64")).digest("hex");

  process.env.BOLD_WEBHOOK_SECRET = "secreta";
  assert.equal(firmaWebhookValida(cuerpo, firmar("secreta")), true);
  assert.equal(firmaWebhookValida(cuerpo, firmar("otra")), false);
  assert.equal(firmaWebhookValida(cuerpo, null), false);

  process.env.BOLD_WEBHOOK_SECRET = "";
  process.env.VERCEL_ENV = "preview";
  assert.equal(firmaWebhookValida(cuerpo, firmar("")), true);
  process.env.VERCEL_ENV = "production";
  assert.equal(firmaWebhookValida(cuerpo, firmar("")), false);
});

test("registro: la fila lleva los datos del pedido y sin destinos configurados no falla", async () => {
  const { filaPedido, registrarPedido } = await import("./registro");
  const fila = filaPedido(pedido, {
    codigo: "EDM-1",
    metodo: "contra_entrega",
    estado: "pendiente_confirmacion_whatsapp",
    producto: producto.nombre,
    subtotal: 100,
    envio: 18000,
    total: 18100,
    orden_bold: null,
    transaccion_bold: null,
    dropi: "no_configurado",
    dropi_pedido: null,
  });
  assert.equal(fila.telefono, pedido.telefono);
  assert.equal(fila.notas, null);
  await registrarPedido(fila); // sin SUPABASE_* ni SHEETS_*: no hace nada y no lanza
});

test("un producto oculto no está a la venta ni se puede pedir", async () => {
  const { pedidoSchema } = await import("./pedido");
  const { obtenerProducto } = await import("./catalogo");
  assert.equal(obtenerProducto("tonico-de-rosas-trendy"), undefined);
  assert.equal(pedidoSchema.safeParse({ ...pedido, producto: "tonico-de-rosas-trendy" }).success, false);
  assert.equal(pedidoSchema.safeParse(pedido).success, true);
});
