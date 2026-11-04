import data from "@/data/products.json";
import { store } from "./config";

export type Variation = {
  id: number;
  sku: string;
  label: string;
  stock: number;
  cost: number;
  suggestedPrice: number;
};

export type Product = {
  dropiId: number;
  sku: string;
  name: string;
  cost: number;
  suggestedPrice: number;
  stock: number;
  supplierId: number;
  categories: string[];
  image: string;
  variations: Variation[];
  source: string;
};

const products = data.products as Product[];

export const syncedAt = data.syncedAt;

/** Precio al público: el sugerido por el proveedor o un mínimo sobre el costo, el mayor. Redondeado a $100. */
export function salePrice(cost: number, suggested: number): number {
  const min = cost * (1 + store.markupMin);
  return Math.ceil(Math.max(suggested, min) / 100) * 100;
}

export function margin(cost: number, price: number) {
  const profit = price - cost;
  return { profit, pct: price > 0 ? profit / price : 0 };
}

export function priceOf(p: Product, variationId?: number): number {
  const v = p.variations.find((x) => x.id === variationId);
  return v ? salePrice(v.cost, v.suggestedPrice) : salePrice(p.cost, p.suggestedPrice);
}

export function getProducts(category?: string): Product[] {
  const inStock = products.filter((p) => p.stock > 0);
  return category ? inStock.filter((p) => p.categories.includes(category)) : inStock;
}

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.dropiId === id);
}

export function getCategories(): string[] {
  return [...new Set(getProducts().flatMap((p) => p.categories))].sort();
}

export function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}
