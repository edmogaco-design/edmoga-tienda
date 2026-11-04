import Link from "next/link";

export function Encabezado() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-[0.3em] text-emerald-800">
          EDMOGA
        </Link>
        <nav className="flex gap-4 text-sm text-stone-700">
          <Link href="/#productos" className="hover:text-emerald-800">
            Productos
          </Link>
          <Link href="/legal/envios" className="hover:text-emerald-800">
            Envíos
          </Link>
        </nav>
      </div>
    </header>
  );
}
