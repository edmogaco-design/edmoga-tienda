import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { store } from "@/lib/config";
import { CartProvider } from "@/components/cart";
import { CartLink } from "@/components/cart-link";

export const metadata: Metadata = {
  title: `${store.name} | Tienda online`,
  description: store.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <header className="top">
            <div className="wrap">
              <Link href="/" className="logo">
                {store.name}<span>.</span>
              </Link>
              <CartLink />
            </div>
          </header>
          <main className="wrap">{children}</main>
          <footer>
            <div className="wrap">
              © {new Date().getFullYear()} {store.name} · Envíos a toda Colombia · Pago contraentrega
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
