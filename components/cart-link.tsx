"use client";
import Link from "next/link";
import { useCart } from "./cart";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/carrito" className="cart-link">
      Carrito ({count})
    </Link>
  );
}
