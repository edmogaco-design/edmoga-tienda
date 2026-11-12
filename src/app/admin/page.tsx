import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_ADMIN, adminConfigurado, sesionValida } from "@/lib/admin";
import { PRODUCTOS, SECCIONES } from "@/lib/catalogo";
import { formatoCOP } from "@/lib/config";
import { preciosCambiados } from "@/lib/precios";
import { supabaseConfigurado } from "@/lib/registro";
import { cambiarPrecio, entrar, salir } from "./acciones";

export const metadata: Metadata = { title: "Administrador", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ERRORES: Record<string, string> = {
  clave: "Clave incorrecta.",
  intentos: "Demasiados intentos. Espera 15 minutos.",
  precio: "Precio inválido. Escribe un valor entre $1.000 y $5.000.000.",
  guardar: "No se pudo guardar el precio. Revisa que la tabla «precios» exista en Supabase.",
};

type Props = { searchParams: Promise<{ error?: string; ok?: string }> };

export default async function Admin({ searchParams }: Props) {
  const { error, ok } = await searchParams;
  const aviso = error ? ERRORES[error] : undefined;
  const caja = "mx-auto max-w-[1080px] px-4 py-10 sm:px-6";

  if (!adminConfigurado()) {
    return (
      <div className={caja}>
        <h1 className="text-[28px] font-extrabold text-ink">Administrador apagado</h1>
        <p className="mt-3 max-w-xl text-base text-body">
          Para encenderlo, crea la variable <code className="font-bold">ADMIN_CLAVE</code> en Vercel (Settings → Environment
          Variables) con una clave de 10 caracteres o más, y vuelve a desplegar.
        </p>
      </div>
    );
  }

  if (!sesionValida((await cookies()).get(COOKIE_ADMIN)?.value)) {
    return (
      <div className="mx-auto max-w-[420px] px-4 py-16 sm:px-6">
        <h1 className="text-[28px] font-extrabold text-ink">Administrador</h1>
        <form action={entrar} className="mt-6 space-y-4">
          <div>
            <label htmlFor="clave" className="etiqueta">
              Clave
            </label>
            <input id="clave" name="clave" type="password" autoComplete="current-password" required className="campo" />
          </div>
          {aviso && (
            <p role="alert" className="text-sm text-error">
              {aviso}
            </p>
          )}
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const cambiados = await preciosCambiados();
  const guardado = PRODUCTOS.find((p) => p.slug === ok);

  return (
    <div className={caja}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-ink">Precios de la tienda</h1>
          <p className="mt-1 text-base text-muted">
            {PRODUCTOS.length} productos a la venta. Al guardar, el precio cambia de inmediato en la tienda.
          </p>
        </div>
        <form action={salir}>
          <button type="submit" className="btn-secondary">
            Salir
          </button>
        </form>
      </div>

      {!supabaseConfigurado() && (
        <p role="alert" className="mt-6 rounded-sm bg-oro-suave p-4 text-sm text-ink">
          Supabase no está conectado en este entorno: puedes ver los precios, pero no se pueden guardar cambios.
        </p>
      )}
      {aviso && (
        <p role="alert" className="mt-6 rounded-sm border border-error p-4 text-sm text-error">
          {aviso}
        </p>
      )}
      {guardado && (
        <p role="status" className="mt-6 rounded-sm bg-surface-strong p-4 text-sm text-ink">
          Guardado: {guardado.nombre} ahora vale {formatoCOP(cambiados[guardado.slug] ?? guardado.precio)}.
        </p>
      )}

      {SECCIONES.map((seccion) => (
        <section key={seccion} className="mt-10">
          <h2 className="text-xl font-bold text-ink">{seccion}</h2>
          <ul className="mt-3 divide-y divide-hairline rounded-md border border-hairline bg-canvas">
            {PRODUCTOS.filter((p) => p.categoria === seccion).map((p) => {
              const actual = cambiados[p.slug] ?? p.precio;
              return (
                <li key={p.slug} id={p.slug} className="flex scroll-mt-28 flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
                  <div className="min-w-[200px] flex-1">
                    <p className="text-base font-bold text-ink">{p.nombre}</p>
                    <p className="text-sm text-muted">
                      Precio original: {formatoCOP(p.precio)}
                      {actual !== p.precio && <span className="ml-2 font-bold text-primary">· cambiado</span>}
                    </p>
                  </div>
                  <form action={cambiarPrecio} className="flex items-center gap-2">
                    <input type="hidden" name="slug" value={p.slug} />
                    <label htmlFor={`precio-${p.slug}`} className="sr-only">
                      Precio de {p.nombre}
                    </label>
                    <span aria-hidden="true" className="text-base text-muted">
                      $
                    </span>
                    <input
                      id={`precio-${p.slug}`}
                      name="precio"
                      type="text"
                      inputMode="numeric"
                      defaultValue={actual}
                      required
                      className="campo min-h-12 w-32 py-2.5"
                    />
                    <button type="submit" className="btn-primary min-h-12 px-4 py-2.5">
                      Guardar
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
