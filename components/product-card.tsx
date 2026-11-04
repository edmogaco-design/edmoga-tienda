import Image from "next/image";
import Link from "next/link";
import { formatCOP, priceOf, type Product } from "@/lib/catalog";

export function ProductCard({ p }: { p: Product }) {
  const price = priceOf(p, p.variations[0]?.id);
  return (
    <Link href={`/producto/${p.dropiId}`} className="card">
      <div className="img">
        <Image src={p.image} alt={p.name} fill sizes="(max-width: 600px) 50vw, 240px" style={{ objectFit: "cover" }} />
      </div>
      <div className="body">
        <h3>{p.name}</h3>
        <div className="price">{formatCOP(price)}</div>
        <span className="muted" style={{ fontSize: ".8rem" }}>Pago contraentrega</span>
      </div>
    </Link>
  );
}
