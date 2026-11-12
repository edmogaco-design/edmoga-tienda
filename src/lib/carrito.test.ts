// Tests del carrito de varios productos, los precios del administrador y su sesión.
// Correr: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { PRODUCTOS } from "./catalogo";
import { lineasDe, mensajePedido, pedidoSchema, subtotalDe, type Pedido } from "./pedido";
import { costoEnvio, costoEnvioPedido } from "./envios";
import { cotizar, lineasCotizadas } from "./cotizacion";
import { cuerpoPedidoDropi, resumenDropi } from "./dropi";

const [a, b] = PRODUCTOS;
const pedido: Pedido = {
  idSolicitud: "123e4567-e89b-12d3-a456-426614174000",
  items: [
    { producto: a.slug, cantidad: 2 },
    { producto: b.slug, cantidad: 1 },
  ],
  nombre: "Ana María Pérez",
  telefono: "3001234567",
  ciudad: "Medellín",
  departamento: "Antioquia",
  direccion: "Calle 10 # 20-30",
  autorizaDatos: true,
};

test("carrito: el pedido acepta varios productos, no vacío ni repetidos", () => {
  assert.equal(pedidoSchema.safeParse(pedido).success, true);
  assert.equal(pedidoSchema.safeParse({ ...pedido, items: [] }).success, false);
  assert.equal(pedidoSchema.safeParse({ ...pedido, items: [pedido.items[0], pedido.items[0]] }).success, false);
  assert.equal(pedidoSchema.safeParse({ ...pedido, items: [{ producto: a.slug, cantidad: 11 }] }).success, false);
});

test("carrito: el subtotal usa el precio del servidor y el envío se cobra por producto distinto", () => {
  const lineas = lineasDe(pedido.items, PRODUCTOS)!;
  assert.equal(subtotalDe(lineas), a.precio * 2 + b.precio);
  const unPaquete = costoEnvio("Antioquia", "Medellín");
  assert.equal(costoEnvioPedido("Antioquia", "Medellín", lineas.length), unPaquete * 2);
  assert.equal(lineasDe([{ producto: "no-existe", cantidad: 1 }], PRODUCTOS), null);
  assert.match(mensajePedido(pedido, lineas, unPaquete * 2, "EDM-1"), /2 paquetes/);
});

test("carrito: cada renglón es un pedido de Dropi que cobra su producto y su envío", () => {
  const lineas = lineasDe(pedido.items, PRODUCTOS)!;
  const c = cuerpoPedidoDropi(pedido, lineas[1], "EDM-1-2", { envio: 18000 });
  assert.equal(c.total_order, b.precio + 18000);
  assert.deepEqual(c.products, [{ id: b.dropiId, price: b.precio, quantity: 1 }]);
  assert.equal(c.shop_order_id, "EDM-1-2");
  const r = resumenDropi([{ ok: true, dropiId: "7", estado: null }, { ok: false, motivo: "HTTP 401" }]);
  assert.equal(r.todos, false);
  assert.equal(r.pedido, "7");
  assert.deepEqual(resumenDropi(null), { estado: "no_configurado", pedido: null, todos: false });
});

test("precios del administrador: se aplican sobre el catálogo sin tocar los demás", async () => {
  const { aplicarPrecios } = await import("./precios");
  const vigente = aplicarPrecios(PRODUCTOS, { [a.slug]: 12345 });
  assert.equal(vigente[0].precio, 12345);
  assert.equal(vigente[1].precio, b.precio);
  assert.equal(PRODUCTOS[0].precio, a.precio); // no cambia el catálogo base
});

test("cotización del pago: respeta el precio cotizado y rechaza otros productos o cantidades", () => {
  const cotizacion = cotizar(lineasDe(pedido.items, PRODUCTOS)!);
  // El dueño sube el precio mientras el cliente paga: vale lo cotizado.
  const masCaro = PRODUCTOS.map((p) => (p.slug === a.slug ? { ...p, precio: a.precio + 5000 } : p));
  assert.equal(subtotalDe(lineasCotizadas(pedido.items, cotizacion, masCaro)!), cotizacion.monto);
  // Cambiar lo que se pide después de pagar no pasa.
  assert.equal(lineasCotizadas([{ producto: a.slug, cantidad: 2 }], cotizacion, PRODUCTOS), null);
  assert.equal(lineasCotizadas([{ ...pedido.items[0], cantidad: 3 }, pedido.items[1]], cotizacion, PRODUCTOS), null);
});

test("administrador: sin clave está apagado; la sesión firmada vence y no se puede falsificar", async () => {
  const { adminConfigurado, claveCorrecta, crearSesion, sesionValida } = await import("./admin");
  delete process.env.ADMIN_CLAVE;
  assert.equal(adminConfigurado(), false);
  assert.equal(claveCorrecta(""), false);
  assert.equal(sesionValida(crearSesion()), false);

  process.env.ADMIN_CLAVE = "clave-de-prueba-123";
  assert.equal(claveCorrecta("clave-de-prueba-123"), true);
  assert.equal(claveCorrecta("otra"), false);
  const sesion = crearSesion(1000);
  assert.equal(sesionValida(sesion, 2000), true);
  assert.equal(sesionValida(sesion, 1000 + 9 * 3600 * 1000), false); // vencida
  assert.equal(sesionValida(`${Date.now() + 99999999}.${sesion.split(".")[1]}`), false); // fecha alterada
  assert.equal(sesionValida(undefined), false);
  process.env.ADMIN_CLAVE = "otra-clave-distinta";
  assert.equal(sesionValida(sesion, 2000), false); // cambiar la clave cierra las sesiones
  delete process.env.ADMIN_CLAVE;
});

test("pedido con la forma anterior (producto + cantidad) se sigue aceptando", () => {
  const { items, ...resto } = pedido;
  const r = pedidoSchema.safeParse({ ...resto, producto: items[0].producto, cantidad: 2 });
  assert.equal(r.success, true);
  assert.deepEqual(r.success && r.data.items, [{ producto: a.slug, cantidad: 2 }]);
});
