"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: number;
  variationId?: number;
  name: string;
  image: string;
  price: number;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: number, variationId: number | undefined, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "edmoga-cart";
const same = (a: CartItem, id: number, v?: number) => a.productId === id && a.variationId === v;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: Ctx["add"] = (item, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((x) => same(x, item.productId, item.variationId));
      if (found) return prev.map((x) => (x === found ? { ...x, qty: x.qty + qty } : x));
      return [...prev, { ...item, qty }];
    });

  const setQty: Ctx["setQty"] = (id, v, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((x) => !same(x, id, v)) : prev.map((x) => (same(x, id, v) ? { ...x, qty } : x)),
    );

  const clear = () => setItems([]);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.qty * x.price, 0);

  return <CartContext.Provider value={{ items, add, setQty, clear, count, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuera de CartProvider");
  return ctx;
}
