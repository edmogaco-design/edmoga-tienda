import { MAX_BUSQUEDA } from "@/lib/buscar";

// Formulario normal (GET /buscar?q=…): funciona sin JavaScript.
export function Buscador({
  valor,
  grande,
  className = "",
}: {
  valor?: string;
  /** Versión de la página de búsqueda; sin esto es la compacta del encabezado. */
  grande?: boolean;
  className?: string;
}) {
  return (
    <form action="/buscar" role="search" className={`flex items-center gap-2 ${className}`}>
      <input
        type="search"
        name="q"
        defaultValue={valor}
        maxLength={MAX_BUSQUEDA}
        required
        placeholder="Buscar productos"
        aria-label="Buscar productos"
        className={
          grande
            ? "campo"
            : "h-10 w-full min-w-0 rounded-full border border-hairline bg-canvas px-4 text-[15px] text-ink outline-none placeholder:text-muted focus:border-primary"
        }
      />
      <button
        type="submit"
        aria-label="Buscar"
        className={
          grande
            ? "btn-primary shrink-0"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"
        }
      >
        {grande ? "Buscar" : <Lupa />}
      </button>
    </form>
  );
}

export function Lupa() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
