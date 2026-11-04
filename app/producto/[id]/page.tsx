import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatCOP, getProduct, getProducts, priceOf, salePrice } from "@/lib/catalog";
import { AddToCart } from "@/components/add-to-cart";

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: String(p.dropiId) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = getProduct(Number((await params).id));
  return { title: p ? p.name : "Producto" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const p = getProduct(Number((await params).id));
  if (!p || p.stock <= 0) notFound();
  const options = p.variations.map((v) => ({ id: v.id, label: v.label, stock: v.stock, price: salePrice(v.cost, v.suggestedPrice) }));
  const price = priceOf(p, options[0]?.id);
  return (
    <div className="product">
      <div className="img">
        <Image src={p.image} alt={p.name} fill priority sizes="(max-width: 800px) 100vw, 560px" style={{ objectFit: "cover" }} />
      </div>
      <div>
        <p className="muted">{p.categories.join(" · ")}</p>
        <h1>{p.name}</h1>
        <div className="price" style={{ fontSize: "1.6rem" }}>{formatCOP(price)}</div>
        <p className="muted">Pagas al recibir · Envío a toda Colombia · {p.stock > 50 ? "Disponible" : `Últimas ${p.stock} unidades`}</p>
        <AddToCart productId={p.dropiId} name={p.name} image={p.image} price={price} options={options} />
      </div>
    </div>
  );
}
