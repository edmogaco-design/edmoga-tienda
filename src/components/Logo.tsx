/* eslint-disable @next/next/no-img-element -- logos estáticos pequeños en /public */

/** Emblema + nombre, como en el logo oficial de EDMOGA, en versión horizontal. */
export function Logo({ alto = 40 }: { alto?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/emblema-edmoga.png" alt="" width={Math.round(alto * 0.965)} height={alto} style={{ height: alto, width: "auto" }} />
      <img
        src="/nombre-edmoga.png"
        alt="EDMOGA"
        width={Math.round(alto * 0.45 * 7.02)}
        height={Math.round(alto * 0.45)}
        style={{ height: Math.round(alto * 0.45), width: "auto" }}
      />
    </span>
  );
}

/** Logo completo (emblema arriba, nombre abajo), como en la imagen original. */
export function LogoCompleto({ ancho = 160 }: { ancho?: number }) {
  return (
    <img
      src="/logo-edmoga.png"
      alt="EDMOGA"
      width={ancho}
      height={Math.round(ancho * 0.776)}
      style={{ width: ancho, height: "auto" }}
    />
  );
}
