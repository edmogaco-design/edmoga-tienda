import Link from "next/link";
import { CATEGORIAS, SECCIONES } from "@/lib/catalogo";
import { Logo } from "./Logo";
import { AccionesEncabezado } from "./Carrito";

const categorias = SECCIONES.map((s) => ({ href: `/categoria/${CATEGORIAS[s].slug}`, texto: s }));

export function Encabezado() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-10">
        <Link href="/" aria-label="EDMOGA, inicio" className="shrink-0">
          <span className="sm:hidden">
            <Logo alto={34} />
          </span>
          <span className="hidden sm:inline">
            <Logo alto={44} />
          </span>
        </Link>
        <nav className="hidden items-center lg:flex" aria-label="Categorías">
          {categorias.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="rounded-full px-3 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              {e.texto}
            </Link>
          ))}
        </nav>
        <AccionesEncabezado />
      </div>
      {/* En celular y tableta las categorías van en una fila que se desliza */}
      <nav className="bg-primary lg:hidden" aria-label="Categorías">
        <ul className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-2 sm:px-4">
          {categorias.map((e) => (
            <li key={e.href} className="shrink-0">
              <Link href={e.href} className="block px-3 py-3 text-sm font-medium text-white">
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
