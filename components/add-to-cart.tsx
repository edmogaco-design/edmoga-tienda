"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart";

type Option = { id: number; label: string; price: number; stock: number };

export function AddToCart(props: { productId: number; name: string; image: string; price: number; options: Option[] }) {
  const { add } = useCart();
  const router = useRouter();
  const [variation, setVariation] = useState<number | undefined>(props.options[0]?.id);
  const [qty, setQty] = useState(1);
  const opt = props.options.find((o) => o.id === variation);
  const price = opt?.price ?? props.price;

  const go = (checkout: boolean) => {
    add(
      { productId: props.productId, variationId: opt?.id, name: opt ? `${props.name} - ${opt.label}` : props.name, image: props.image, price },
      qty,
    );
    if (checkout) router.push("/carrito");
  };

  return (
    <div>
      {props.options.length > 0 && (
        <>
          <label htmlFor="var">Opción</label>
          <select id="var" value={variation} onChange={(e) => setVariation(Number(e.target.value))}>
            {props.options.map((o) => (
              <option key={o.id} value={o.id} disabled={o.stock <= 0}>
                {o.label}
                {o.stock <= 0 ? " (agotado)" : ""}
              </option>
            ))}
          </select>
        </>
      )}
      <label htmlFor="qty">Cantidad</label>
      <input id="qty" type="number" min={1} max={20} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => go(true)}>Comprar ahora</button>
        <button className="btn secondary" onClick={() => go(false)}>Agregar al carrito</button>
      </div>
    </div>
  );
}
