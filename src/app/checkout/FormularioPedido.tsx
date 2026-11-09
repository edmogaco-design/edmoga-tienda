"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { pedidoSchema } from "@/lib/pedido";
import { formatoCOP } from "@/lib/config";
import { DEPARTAMENTOS, type Departamento } from "@/lib/departamentos";
import { costoEnvio } from "@/lib/envios";
import { BotonBold, type ParametrosBold } from "@/components/BotonBold";
import { ImagenProducto } from "@/components/ImagenProducto";

type Props = {
  producto: { slug: string; nombre: string; precio: number; imagen?: string };
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

export function FormularioPedido({ producto, pagoEnLinea }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [metodo, setMetodo] = useState<Metodo>("contraentrega");
  const [departamento, setDepartamento] = useState<Departamento | "">("");
  const [bold, setBold] = useState<ParametrosBold | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  // Mismo id mientras los datos no cambien: un doble clic o reintento no duplica el pedido.
  const idSolicitud = useRef<string | null>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    setMensaje("");
    idSolicitud.current ??= crypto.randomUUID();
    const fd = new FormData(e.currentTarget);
    const datos = {
      idSolicitud: idSolicitud.current,
      producto: producto.slug,
      cantidad,
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
      setErrores(local.error.flatten().fieldErrors);
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
      window.location.href = json.whatsapp;
    } catch {
      setMensaje("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const subtotal = producto.precio * cantidad;
  // Contra entrega: envío según el departamento. En línea (Bold): envío gratis.
  const envio = metodo === "bold" ? 0 : departamento ? costoEnvio(departamento) : null;
  const textoEnvio =
    metodo === "bold" ? "Gratis" : envio === null ? "Elige tu departamento" : formatoCOP(envio);

  return (
    <form
      onSubmit={enviar}
      onChange={() => {
        idSolicitud.current = null;
        setBold(null);
      }}
      noValidate
      className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_360px] lg:gap-16"
    >
      {/* Columna del formulario */}
      <div className="space-y-10">
        {pagoEnLinea && (
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.18px] text-ink">Forma de pago</h2>
            <div className="mt-4 overflow-hidden rounded-sm border border-border-strong">
              {(
                [
                  ["contraentrega", "Pago contra entrega", "Pagas en efectivo al recibir. El envío depende de tu departamento."],
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
          <div className="flex gap-4">
            <ImagenProducto src={producto.imagen} alt={producto.nombre} className="h-24 w-24 shrink-0" />
            <div>
              <p className="text-base font-semibold leading-tight text-ink">{producto.nombre}</p>
              <p className="mt-1 text-sm text-muted">{formatoCOP(producto.precio)} por unidad</p>
            </div>
          </div>

          <div className="mt-5 border-t border-hairline pt-5">
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">Cantidad</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCantidad((n) => Math.max(1, n - 1));
                    setBold(null);
                  }}
                  disabled={cantidad <= 1}
                  aria-label="Quitar uno"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-lg text-ink disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-5 text-center text-base text-ink" aria-live="polite">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCantidad((n) => Math.min(5, n + 1));
                    setBold(null);
                  }}
                  disabled={cantidad >= 5}
                  aria-label="Agregar uno"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-lg text-ink disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-hairline pt-5 text-base">
            <div className="flex justify-between text-body">
              <dt>Productos</dt>
              <dd>{formatoCOP(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-body">
              <dt>Envío</dt>
              <dd>{textoEnvio}</dd>
            </div>
            <div className="flex justify-between border-t border-hairline pt-3 font-semibold text-ink">
              <dt>Total</dt>
              <dd>
                {formatoCOP(subtotal + (envio ?? 0))}
                {envio === null ? " + envío" : ""}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </form>
  );
}
