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
import type { Pedido } from "./pedido";

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
  autorizaDatos: true,
};

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
