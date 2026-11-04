"use client";

import Link from "next/link";
import { useState } from "react";
import { pedidoSchema } from "@/lib/pedido";
import { formatoCOP } from "@/lib/config";

type Props = { producto: { slug: string; nombre: string; precio: number } };
type Errores = Partial<Record<string, string[]>>;

const campos = [
  { name: "nombre", label: "Nombre completo", type: "text", autoComplete: "name" },
  { name: "telefono", label: "Celular (WhatsApp)", type: "tel", autoComplete: "tel-national", inputMode: "numeric" as const },
  { name: "departamento", label: "Departamento", type: "text", autoComplete: "address-level1" },
  { name: "ciudad", label: "Ciudad o municipio", type: "text", autoComplete: "address-level2" },
  { name: "direccion", label: "Dirección completa (barrio, casa/apto)", type: "text", autoComplete: "street-address" },
];

export function FormularioPedido({ producto }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    const fd = new FormData(e.currentTarget);
    const datos = {
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
      setMensaje("¡Listo! Te abrimos WhatsApp para confirmar tu pedido.");
      window.location.href = json.whatsapp;
    } catch {
      setMensaje("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-6 space-y-4">
      <div className="rounded-xl border border-stone-200 p-4">
        <p className="font-semibold text-stone-900">{producto.nombre}</p>
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            Cantidad
            <select
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="rounded-lg border border-stone-300 px-2 py-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <p className="text-lg font-bold">{formatoCOP(producto.precio * cantidad)}</p>
        </div>
        <p className="mt-1 text-xs text-stone-500">+ envío (te lo confirmamos por WhatsApp)</p>
      </div>

      {campos.map((c) => (
        <div key={c.name}>
          <label htmlFor={c.name} className="block text-sm font-medium text-stone-800">
            {c.label}
          </label>
          <input
            id={c.name}
            name={c.name}
            type={c.type}
            autoComplete={c.autoComplete}
            inputMode={c.inputMode}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 focus:border-emerald-700 focus:outline-none"
          />
          {errores[c.name] && <p className="mt-1 text-sm text-red-700">{errores[c.name]?.[0]}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="notas" className="block text-sm font-medium text-stone-800">
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={2}
          maxLength={200}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 focus:border-emerald-700 focus:outline-none"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-stone-700">
        <input type="checkbox" name="autorizaDatos" className="mt-1" />
        <span>
          Autorizo el tratamiento de mis datos personales según la{" "}
          <Link href="/legal/datos" className="underline" target="_blank">
            política de tratamiento de datos
          </Link>{" "}
          (Ley 1581 de 2012).
        </span>
      </label>
      {errores.autorizaDatos && <p className="text-sm text-red-700">{errores.autorizaDatos[0]}</p>}

      {mensaje && <p className="rounded-lg bg-stone-100 p-3 text-sm text-stone-800">{mensaje}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-emerald-800 px-6 py-4 text-lg font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Confirmar por WhatsApp"}
      </button>
      <p className="text-center text-xs text-stone-500">
        Tu pedido queda confirmado solo cuando un asesor de EDMOGA te responde por WhatsApp.
      </p>
    </form>
  );
}
