import { NextResponse } from "next/server";
import { formatCOP, getProduct, priceOf } from "@/lib/catalog";
import { store } from "@/lib/config";

type Body = {
  customer: Record<string, string>;
  items: { productId: number; variationId?: number; qty: number }[];
};

const required = ["name", "surname", "phone", "department", "city", "address"];

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const c = body.customer ?? {};
  const missing = required.filter((k) => !String(c[k] ?? "").trim());
  if (missing.length) return NextResponse.json({ error: `Faltan datos: ${missing.join(", ")}` }, { status: 400 });
  if (!/^3\d{9}$/.test(String(c.phone))) return NextResponse.json({ error: "Celular inválido" }, { status: 400 });
  if (!Array.isArray(body.items) || body.items.length === 0) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });

  // Recalcular precios en el servidor: nunca confiar en el precio que manda el navegador.
  const lines = [];
  for (const it of body.items) {
    const p = getProduct(Number(it.productId));
    const qty = Math.min(20, Math.max(1, Math.floor(Number(it.qty))));
    if (!p) return NextResponse.json({ error: `Producto ${it.productId} no existe` }, { status: 400 });
    const v = p.variations.find((x) => x.id === it.variationId);
    if (p.variations.length && !v) return NextResponse.json({ error: `Elige una opción para ${p.name}` }, { status: 400 });
    const unit = priceOf(p, v?.id);
    const cost = v?.cost ?? p.cost;
    lines.push({ dropiId: p.dropiId, variationId: v?.id ?? null, name: v ? `${p.name} - ${v.label}` : p.name, qty, unit, cost });
  }
  const total = lines.reduce((s, l) => s + l.unit * l.qty, 0) + store.shippingFlat;
  const profit = lines.reduce((s, l) => s + (l.unit - l.cost) * l.qty, 0);
  const orderId = `ED-${Date.now().toString(36).toUpperCase()}`;

  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    paymentMethod: "contraentrega",
    customer: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, String(v).slice(0, 300)])),
    lines,
    total,
    estimatedProfitBeforeShipping: profit,
  };

  // Reenvío opcional a un webhook (Make / Zapier / n8n / Google Sheets) para no perder ningún pedido.
  if (process.env.ORDER_WEBHOOK_URL) {
    try {
      await fetch(process.env.ORDER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch (e) {
      console.error("webhook pedido falló", e);
    }
  }
  console.log("PEDIDO", JSON.stringify(order));

  const text = [
    `Hola, quiero confirmar mi pedido ${orderId}:`,
    ...lines.map((l) => `• ${l.qty} x ${l.name} — ${formatCOP(l.unit * l.qty)}`),
    `Total: ${formatCOP(total)} (contraentrega)`,
    `${c.name} ${c.surname} · ${c.phone}`,
    `${c.address}, ${c.city}, ${c.department}${c.notes ? ` (${c.notes})` : ""}`,
  ].join("\n");

  return NextResponse.json({ orderId, total, whatsappUrl: `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}` });
}
