type Props = { src?: string; alt?: string; className?: string };

// Muestra la foto del producto; si no hay, una ilustración provisional.
export function ImagenProducto({ src, alt = "Producto EDMOGA", className = "" }: Props) {
  if (src) {
    return (
      <div className={`overflow-hidden rounded-2xl bg-stone-100 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- imagen externa del proveedor */}
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-stone-100 ${className}`}
    >
      <svg viewBox="0 0 120 120" className="h-2/3 w-2/3" role="img" aria-label={alt}>
        <rect x="42" y="14" width="36" height="14" rx="6" fill="#065f46" />
        <rect x="56" y="28" width="8" height="16" fill="#047857" />
        <path
          d="M30 46h60l-6 56a8 8 0 0 1-8 7H44a8 8 0 0 1-8-7z"
          fill="#d1fae5"
          stroke="#065f46"
          strokeWidth="3"
        />
        <path d="M44 70l32-6M44 82l32-6" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
        <rect x="26" y="40" width="68" height="8" rx="4" fill="#065f46" />
      </svg>
    </div>
  );
}
