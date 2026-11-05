type Props = { src?: string; alt?: string; className?: string; insignia?: string; prioridad?: boolean };

// Foto del producto con esquinas de 14 px. Si no hay foto, una ilustración provisional.
export function ImagenProducto({ src, alt = "Producto EDMOGA", className = "", insignia, prioridad }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-surface-strong ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagen externa del proveedor
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading={prioridad ? "eager" : "lazy"}
          fetchPriority={prioridad ? "high" : "auto"}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-2/3 w-2/3" role="img" aria-label={alt}>
            <rect x="42" y="14" width="36" height="14" rx="6" fill="#222222" />
            <rect x="56" y="28" width="8" height="16" fill="#3f3f3f" />
            <path d="M30 46h60l-6 56a8 8 0 0 1-8 7H44a8 8 0 0 1-8-7z" fill="#ffffff" stroke="#222222" strokeWidth="3" />
            <path d="M44 70l32-6M44 82l32-6" stroke="#929292" strokeWidth="3" strokeLinecap="round" />
            <rect x="26" y="40" width="68" height="8" rx="4" fill="#c0a261" />
          </svg>
        </div>
      )}
      {insignia && (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold leading-none text-primary shadow-card">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-oro" />
          {insignia}
        </span>
      )}
    </div>
  );
}
