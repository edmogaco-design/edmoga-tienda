import type { MetadataRoute } from "next";
import { PRODUCTOS } from "@/lib/catalogo";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const legales = ["datos", "terminos", "envios", "devoluciones"].map((l) => ({
    url: `${SITE.url}/legal/${l}`,
  }));
  return [
    { url: SITE.url },
    ...PRODUCTOS.map((p) => ({ url: `${SITE.url}/producto/${p.slug}` })),
    ...legales,
  ];
}
