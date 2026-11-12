"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { pedidoSchema } from "@/lib/pedido";
import { formatoCOP } from "@/lib/config";
import { DEPARTAMENTOS, type Departamento } from "@/lib/departamentos";
import { costoEnvioPedido } from "@/lib/envios";
import { BotonBold, type ParametrosBold } from "@/components/BotonBold";
import { ImagenProducto } from "@/components/ImagenProducto";
import { SelectorCantidad } from "@/components/Carrito";
import { useTienda } from "@/components/TiendaProvider";

type Props = {
  /** Compra directa de un producto ("Comprar ahora"). Sin esto, se pide lo que hay en el carrito. */
  directo?: string;
  pagoEnLinea: boolean;
};
type Metodo = "contraentrega" | "bold";
type Errores = Partial<Record<string, string[]>>;

const campos = [
  { name: "nombre", label: "Nombre completo", type: "text", autoComplete: "name", ancho: "sm:col-span-2" },
  { name: "telefono", label: "Celular (WhatsApp)", type: "tel", autoComplete: "tel-national", inputMode: "numeric" as const, ancho: "" },
  { name: "ciudad", label: "Ciudad o municipio", type: "text", autoComplete: "address-level2", ancho: "" },
  { name: "direccion", label: "Dirección completa (barrio, casa/apto)", type: "text", autoComplete: "street-address", ancho: "sm:col-span-2" },
];

function Error({ texto }: { texto?: string }) {
  if (!texto) return null;
  return <p className="mt-1.5 text-sm text-error">{texto}</p>;
}

export function FormularioPedido({ directo, pagoEnLinea }: Props) {
  const tienda = useTienda();
  const [cantidadDirecta, setCantidadDirecta] = useState(1);
  const [metodo, setMetodo] = useState<Metodo>("contraentrega");
  const [departamento, setDepartamento] = useState<Departamento | "">("");
  const [ciudad, setCiudad] = useState("");
  const [bold, setBold] = useState<ParametrosBold | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [hecho, setHecho] = useState(false);
  // Mismo id mientras los datos no cambien: un doble clic o reintento no duplica el pedido.
  const idSolicitud = useRef<string | null>(null);

  const items = directo ? [{ slug: directo, cantidad: cantidadDirecta }] : tienda.carrito;
  const lineas = items.flatMap((i) => (tienda.catalogo[i.slug] ? [{ ...tienda.catalogo[i.slug], cantidad: i.cantidad }] : []));

  // Cambió el pedido: nueva solicitud y el botón de Bold anterior ya no sirve.
  function reiniciar() {
    idSolicitud.current = null;
    setBold(null);
  }
  function cambiarCantidad(slug: string, n: number) {
    if (directo) setCantidadDirecta(Math.max(1, Math.min(10, n)));
    else tienda.cambiarCantidad(slug, n);
    reiniciar();
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    setMensaje("");
    idSolicitud.current ??= crypto.randomUUID();
    const fd = new FormData(e.currentTarget);
    const datos = {
      idSolicitud: idSolicitud.current,
      items: lineas.map((l) => ({ producto: l.slug, cantidad: l.cantidad })),
      nombre: fd.get("nombre"),
      telefono: String(fd.get("telefono") ?? "").replace(/\D/g, ""),
      departamento: fd.get("departamento"),
      ciudad: fd.get("ciudad"),
      direccion: fd.get("direccion"),
      notas: fd.get("notas") || undefined,
      autorizaDatos: fd.get("autorizaDatos") === "on",
    };

    const local = pedidoSchema.safeParse(datos);
    if (!local.success) {
      const e: Errores = local.error.flatten().fieldErrors;
      setErrores(e);
      if (e.items) setMensaje(e.items[0]);
      return;
    }
    setErrores({});
    setEnviando(true);

    if (metodo === "bold") {
      try {
        const res = await fetch("/api/pago/iniciar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(local.data),
        });
        const json = await res.json();
        if (!res.ok) {
          setErrores(json.campos ?? {});
          setMensaje(json.error ?? "No pudimos preparar el pago.");
          return;
        }
        // Los datos de entrega se guardan solo en este navegador para confirmar al volver de Bold.
        try {
          sessionStorage.setItem(`edmoga-pago-${json.orden}`, JSON.stringify(local.data));
          // Si el pago sale bien y venía del carrito, el carrito se vacía al volver.
          if (!directo) sessionStorage.setItem(`edmoga-pago-${json.orden}-carrito`, "1");
        } catch {
          /* sin almacenamiento: el asesor completa por WhatsApp */
        }
        setBold(json);
        setMensaje(`Pedido ${json.codigo} listo. Paga con el botón de Bold para terminar.`);
      } catch {
        setMensaje("Error de conexión. Intenta de nuevo.");
      } finally {
        setEnviando(false);
      }
      return;
    }

    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(local.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrores(json.campos ?? {});
        setMensaje(json.error ?? "No pudimos procesar tu pedido.");
        return;
      }
      setMensaje(`¡Listo! Tu pedido ${json.codigo} quedó registrado. Te abrimos WhatsApp para confirmarlo.`);
      setHecho(true);
      if (!directo) tienda.vaciar();
      window.location.href = json.whatsapp;
    } catch {
      setMensaje("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (!directo && !tienda.listo) return <p className="mt-8 text-base text-muted">Cargando tu carrito…</p>;

  if (hecho) {
    return (
      <p role="status" className="mt-8 rounded-sm bg-surface-soft p-4 text-base text-ink">
        {mensaje}
      </p>
    );
  }

  if (lineas.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-base text-body">Tu carrito está vacío.</p>
        <Link href="/#productos" className="btn-primary mt-6">
          Ver productos
        </Link>
      </div>
    );
  }

  const subtotal = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);
  const paquetes = lineas.length;
  // Contra entrega: un envío por producto distinto, según departamento y ciudad. En línea: gratis.
  const envio =
    metodo === "bold" ? 0 : departamento && ciudad.trim() ? costoEnvioPedido(departamento, ciudad, paquetes) : null;
  const textoEnvio =
    metodo === "bold" ? "Gratis" : envio === null ? "Elige departamento y ciudad" : formatoCOP(envio);

  return (
    <form
      onSubmit={enviar}
      onChange={(e) => {
        const campo = e.target;
        if (campo instanceof HTMLInputElement && campo.name === "ciudad") setCiudad(campo.value);
        reiniciar();
      }}
      noValidate
      className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_380px] lg:gap-16"
    >
      {/* Columna del formulario */}
      <div className="space-y-10">
        {pagoEnLinea && (
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.18px] text-ink">Forma de pago</h2>
            <div className="mt-4 overflow-hidden rounded-sm border border-border-strong">
              {(
                [
                  ["contraentrega", "Pago contra entrega", "Pagas en efectivo al recibir. El envío depende de tu ciudad."],
                  ["bold", "Pagar en línea con envío gratis", "Tarjeta, PSE, Nequi y más. Pago seguro procesado por Bold."],
                ] as const
              ).map(([valor, titulo, detalle], i) => (
                <label
                  key={valor}
                  className={`flex cursor-pointer items-start justify-between gap-4 px-4 py-4 ${
                    i > 0 ? "border-t border-border-strong" : ""
                  } ${metodo === valor ? "bg-surface-soft" : "bg-canvas"}`}
                >
                  <span>
                    <span className="block text-base font-medium text-ink">{titulo}</span>
                    <span className="mt-0.5 block text-sm text-muted">{detalle}</span>
                  </span>
                  <input
                    type="radio"
                    name="metodo"
                    value={valor}
                    checked={metodo === valor}
                    onChange={() => setMetodo(valor)}
                    className="mt-1 h-5 w-5 accent-ink"
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold tracking-[-0.18px] text-ink">Datos de entrega</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="departamento" className="etiqueta">
                Departamento
              </label>
              <select
                id="departamento"
                name="departamento"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value as Departamento)}
                autoComplete="address-level1"
                aria-invalid={Boolean(errores.departamento)}
                className="campo"
              >
                <option value="" disabled>
                  Elige tu departamento
                </option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <Error texto={errores.departamento?.[0]} />
            </div>

            {campos.map((c) => (
              <div key={c.name} className={c.ancho}>
                <label htmlFor={c.name} className="etiqueta">
                  {c.label}
                </label>
                <input
                  id={c.name}
                  name={c.name}
                  type={c.type}
                  autoComplete={c.autoComplete}
                  inputMode={c.inputMode}
                  aria-invalid={Boolean(errores[c.name])}
                  className="campo"
                />
                <Error texto={errores[c.name]?.[0]} />
              </div>
            ))}

            <div className="sm:col-span-2">
              <label htmlFor="notas" className="etiqueta">
                Notas para la entrega <span className="font-normal text-muted">(opcional)</span>
              </label>
              <textarea id="notas" name="notas" rows={2} maxLength={200} className="campo" />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <label className="flex items-start gap-3 text-sm text-body">
            <input type="checkbox" name="autorizaDatos" className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
            <span>
              Autorizo el tratamiento de mis datos personales según la{" "}
              <Link href="/legal/datos" className="font-medium text-ink underline" target="_blank">
                política de tratamiento de datos
              </Link>{" "}
              (Ley 1581 de 2012).
            </span>
          </label>
          <Error texto={errores.autorizaDatos?.[0]} />

          {mensaje && (
            <p role="status" className="rounded-sm bg-surface-soft p-4 text-sm text-ink">
              {mensaje}
            </p>
          )}

          {metodo === "bold" && bold ? (
            <div className="rounded-md border border-hairline p-5 text-center shadow-card">
              <p className="text-base font-semibold text-ink">Total a pagar: {formatoCOP(bold.monto)}</p>
              <div className="mt-3">
                <BotonBold p={bold} />
              </div>
              <p className="mt-3 text-sm text-muted">
                Al pagar, Bold te devuelve a EDMOGA y verificamos tu pago antes de despachar.
              </p>
            </div>
          ) : (
            <button type="submit" disabled={enviando} className="btn-primary w-full sm:w-auto">
              {enviando ? "Enviando…" : metodo === "bold" ? "Continuar al pago" : "Confirmar pedido por WhatsApp"}
            </button>
          )}
          <p className="text-sm text-muted">
            {metodo === "bold"
              ? "Solo despachamos cuando Bold confirma que el pago entró."
              : "Tu pedido queda confirmado cuando un asesor de EDMOGA te responde por WhatsApp."}
          </p>
        </section>
      </div>

      {/* Resumen del pedido */}
      <aside className="order-first md:order-none">
        <div className="rounded-md border border-hairline bg-canvas p-6 shadow-card md:sticky md:top-28">
          <h2 className="text-lg font-bold text-ink">Tu pedido</h2>
          <ul className="mt-2 divide-y divide-hairline">
            {lineas.map((l) => (
              <li key={l.slug} className="flex gap-3 py-4">
                <ImagenProducto src={l.imagen} alt={l.nombre} className="h-16 w-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold leading-tight text-ink">{l.nombre}</p>
                  <p className="mt-0.5 text-sm text-muted">{formatoCOP(l.precio)} por unidad</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <SelectorCantidad cantidad={l.cantidad} alCambiar={(n) => cambiarCantidad(l.slug, n)} nombre={l.nombre} />
                    {!directo && (
                      <button
                        type="button"
                        onClick={() => {
                          tienda.quitar(l.slug);
                          reiniciar();
                        }}
                        className="text-sm font-medium text-muted underline hover:text-error"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="space-y-3 border-t border-hairline pt-5 text-base">
            <div className="flex justify-between text-body">
              <dt>Productos</dt>
              <dd>{formatoCOP(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-body">
              <dt>Envío{metodo !== "bold" && paquetes > 1 ? ` (${paquetes} paquetes)` : ""}</dt>
              <dd className="text-right">{textoEnvio}</dd>
            </div>
            <div className="flex justify-between border-t border-hairline pt-3 font-semibold text-ink">
              <dt>Total</dt>
              <dd>
                {formatoCOP(subtotal + (envio ?? 0))}
                {envio === null ? " + envío" : ""}
              </dd>
            </div>
          </dl>
          {paquetes > 1 && (
            <p className="mt-4 text-sm text-muted">
              Cada producto distinto llega en un paquete aparte
              {metodo === "bold" ? "." : ", con su propio envío, y lo pagas al recibirlo."}
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
