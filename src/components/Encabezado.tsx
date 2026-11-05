import Link from "next/link";
import { Logo } from "./Logo";

const enlaces = [
  { href: "/#productos", texto: "Productos" },
  { href: "/legal/envios", texto: "Envíos" },
  { href: "/legal/devoluciones", texto: "Garantía" },
];

export function Encabezado() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
        <Link href="/" aria-label="EDMOGA, inicio" className="shrink-0">
          <span className="sm:hidden">
            <Logo alto={34} />
          </span>
          <span className="hidden sm:inline">
            <Logo alto={44} />
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Principal">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="rounded-full px-4 py-2.5 text-[15px] font-medium text-ink hover:bg-surface-soft"
            >
              {e.texto}
            </Link>
          ))}
        </nav>
        <Link
          href="/#productos"
          className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink shadow-card sm:hidden"
        >
          Productos
        </Link>
      </div>
    </header>
  );
}
