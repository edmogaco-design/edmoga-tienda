import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import { store } from "@/lib/config";
import { ProductCard } from "@/components/product-card";

export default async function Home({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const categories = getCategories();
  const products = getProducts(c);
  return (
    <>
      <section className="hero">
        <h1>{store.tagline}</h1>
        <p>Pide en 1 minuto. Pagas cuando lo recibes en tu casa.</p>
        <div className="badges">
          <span className="badge">🚚 Envío a toda Colombia</span>
          <span className="badge">💵 Pago contraentrega</span>
          <span className="badge">💬 Atención por WhatsApp</span>
        </div>
      </section>
      <nav className="chips" aria-label="Categorías">
        <Link href="/" className={`chip ${!c ? "active" : ""}`}>Todo</Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/?c=${encodeURIComponent(cat)}`} className={`chip ${c === cat ? "active" : ""}`}>
            {cat}
          </Link>
        ))}
      </nav>
      <section className="grid">
        {products.map((p) => (
          <ProductCard key={p.dropiId} p={p} />
        ))}
      </section>
    </>
  );
}
