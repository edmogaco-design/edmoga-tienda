import Link from "next/link";
import { SITE, enlaceWhatsApp } from "@/lib/config";
import { LogoCompleto } from "./Logo";

const columnas = [
  {
    titulo: "Ayuda",
    enlaces: [
      { href: enlaceWhatsApp("Hola EDMOGA, necesito ayuda."), texto: "Escríbenos por WhatsApp", externo: true },
      { href: "/legal/envios", texto: "Envíos y tiempos" },
      { href: "/legal/devoluciones", texto: "Devoluciones y garantía" },
    ],
  },
  {
    titulo: "Compra segura",
    enlaces: [
      { href: "/legal/envios", texto: "Pago contra entrega" },
      { href: "/legal/terminos", texto: "Confirmamos cada pedido por WhatsApp" },
      { href: "/legal/terminos", texto: "Nunca te pedimos claves ni códigos" },
    ],
  },
  {
    titulo: "EDMOGA",
    enlaces: [
      { href: "/#productos", texto: "Productos" },
      { href: "/legal/terminos", texto: "Términos y condiciones" },
      { href: "/legal/datos", texto: "Tratamiento de datos" },
    ],
  },
];

export function PiePagina() {
  return (
    <footer className="mt-16 border-t border-hairline bg-surface-soft">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div>
          <LogoCompleto ancho={120} />
          <p className="mt-3 max-w-[220px] text-sm text-muted">
            Bienestar, hogar y cocina con pago contra entrega en toda Colombia.
          </p>
        </div>
        {columnas.map((c) => (
          <div key={c.titulo}>
            <p className="text-base font-medium text-ink">{c.titulo}</p>
            <ul className="mt-3 space-y-3">
              {c.enlaces.map((e) => (
                <li key={e.texto}>
                  <Link
                    href={e.href}
                    className="text-sm text-ink hover:underline"
                    {...("externo" in e && e.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-6 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-10">
          <p>© {new Date().getFullYear()} EDMOGA, Colombia</p>
          <p>{SITE.correo}</p>
        </div>
      </div>
    </footer>
  );
}
