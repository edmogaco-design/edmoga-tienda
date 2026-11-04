"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart";

const cop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const { items, setQty, total, clear } = useCart();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items: items.map(({ productId, variationId, qty }) => ({ productId, variationId, qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar el pedido");
      setState("done");
      setMsg(data.orderId);
      clear();
      if (data.whatsappUrl) window.location.href = data.whatsappUrl;
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  if (state === "done")
    return (
      <div className="panel" style={{ margin: "32px 0" }}>
        <p className="ok">¡Pedido recibido! Código {msg}</p>
        <p>Te confirmaremos por WhatsApp. Pagas cuando lo recibas.</p>
        <Link href="/" className="btn">Seguir comprando</Link>
      </div>
    );

  if (items.length === 0)
    return (
      <div style={{ padding: "48px 0" }}>
        <p>Tu carrito está vacío.</p>
        <Link href="/" className="btn">Ver productos</Link>
      </div>
    );

  return (
    <div className="cols">
      <section>
        <h1>Tu carrito</h1>
        {items.map((it) => (
          <div className="cart-item" key={`${it.productId}-${it.variationId ?? ""}`}>
            <div className="thumb">
              <Image src={it.image} alt={it.name} fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              <div className="qty">
                <button aria-label="Quitar uno" onClick={() => setQty(it.productId, it.variationId, it.qty - 1)}>−</button>
                <span>{it.qty}</span>
                <button aria-label="Agregar uno" onClick={() => setQty(it.productId, it.variationId, it.qty + 1)}>+</button>
              </div>
            </div>
            <div className="price">{cop(it.price * it.qty)}</div>
          </div>
        ))}
        <p className="price" style={{ textAlign: "right" }}>Total: {cop(total)}</p>
      </section>
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Datos de envío</h2>
        <p className="muted">Pago contraentrega: pagas al recibir.</p>
        <form onSubmit={submit}>
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" required autoComplete="given-name" />
          <label htmlFor="surname">Apellido</label>
          <input id="surname" name="surname" required autoComplete="family-name" />
          <label htmlFor="phone">Celular</label>
          <input id="phone" name="phone" required inputMode="tel" pattern="3[0-9]{9}" placeholder="3001234567" />
          <label htmlFor="department">Departamento</label>
          <input id="department" name="department" required />
          <label htmlFor="city">Ciudad / municipio</label>
          <input id="city" name="city" required />
          <label htmlFor="address">Dirección</label>
          <input id="address" name="address" required autoComplete="street-address" />
          <label htmlFor="notes">Indicaciones (barrio, apto, referencias)</label>
          <textarea id="notes" name="notes" rows={2} />
          <button className="btn" style={{ width: "100%", marginTop: 16 }} disabled={state === "sending"}>
            {state === "sending" ? "Enviando..." : `Confirmar pedido · ${cop(total)}`}
          </button>
          {state === "error" && <p className="err">{msg}</p>}
        </form>
      </section>
    </div>
  );
}
