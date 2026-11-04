import { notFound } from "next/navigation";
import { formatCOP, getProducts, margin, salePrice, syncedAt } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function Margenes({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k } = await searchParams;
  if (!process.env.ADMIN_KEY || k !== process.env.ADMIN_KEY) notFound();
  const rows = getProducts()
    .map((p) => {
      const price = salePrice(p.cost, p.suggestedPrice);
      return { p, price, ...margin(p.cost, price) };
    })
    .sort((a, b) => b.profit - a.profit);
  return (
    <section style={{ padding: "24px 0 48px" }}>
      <h1>Márgenes</h1>
      <p className="muted">Catálogo Dropi sincronizado: {syncedAt}. Ganancia bruta antes de envío y devoluciones.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th><th className="num">Costo</th><th className="num">Precio</th>
              <th className="num">Ganancia</th><th className="num">Margen</th><th className="num">Stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, price, profit, pct }) => (
              <tr key={p.dropiId}>
                <td>{p.name}</td>
                <td className="num">{formatCOP(p.cost)}</td>
                <td className="num">{formatCOP(price)}</td>
                <td className="num">{formatCOP(profit)}</td>
                <td className="num">{Math.round(pct * 100)}%</td>
                <td className="num">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
