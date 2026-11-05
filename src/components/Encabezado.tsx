import Link from "next/link";

const enlaces = [
  { href: "/#productos", texto: "Productos" },
  { href: "/legal/envios", texto: "Envíos" },
  { href: "/legal/devoluciones", texto: "Garantía" },
];

export function Encabezado() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2" aria-label="EDMOGA, inicio">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
          >
            E
          </span>
          <span className="text-xl font-bold tracking-[0.18em] text-primary">EDMOGA</span>
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
