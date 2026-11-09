import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";

// Texto: Atkinson Hyperlegible, pensada para leerse fácil en celular y por cualquier persona.
// Títulos y precios: Bricolage Grotesque, con carácter para la voz de la marca.
const texto = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
const titulos = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "EDMOGA — Bienestar, hogar y cocina", template: "%s | EDMOGA" },
  description: SITE.descripcion,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "EDMOGA",
    title: "EDMOGA — Bienestar, hogar y cocina",
    description: SITE.descripcion,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#162944" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO">
      <body className={`${texto.variable} ${titulos.variable} flex min-h-screen flex-col bg-canvas text-ink`}>
        <Encabezado />
        <main className="flex-1">{children}</main>
        <PiePagina />
        <BotonWhatsApp />
      </body>
    </html>
  );
}
