import { PRODUCTOS } from "@/lib/catalogo";
import { TarjetaProducto } from "@/components/TarjetaProducto";

const ventajas = [
  { titulo: "Pago contra entrega", texto: "Pagas al recibir en tu casa" },
  { titulo: "Envío a toda Colombia", texto: "Te confirmamos el valor antes" },
  { titulo: "Atención por WhatsApp", texto: "Una persona real te responde" },
];

const pasos = [
  { n: "1", titulo: "Elige tu producto", texto: "Mira fotos, beneficios y precio final." },
  { n: "2", titulo: "Pide en un paso", texto: "Solo tus datos de entrega. Sin crear cuenta." },
  { n: "3", titulo: "Confirma y recibe", texto: "Te escribimos por WhatsApp y despachamos." },
];

export default function Inicio() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
      {/* Encabezado editorial: titular modesto, la foto hace el trabajo */}
      <section className="pb-8 pt-10 sm:pt-14">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-oro">Bienestar · Hogar · Cocina</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-bold leading-[1.25] text-primary">
          Productos para tu bienestar, hogar y cocina
        </h1>
        <p className="mt-2 max-w-xl text-base text-body">
          Pide en un minuto y paga cuando lo recibes. Confirmamos cada pedido contigo por WhatsApp.
        </p>

        {/* Franja en forma de píldora con las 3 garantías de compra */}
        <div className="mt-6 grid overflow-hidden rounded-xl border border-hairline bg-canvas shadow-card sm:grid-cols-3 sm:rounded-full">
          {ventajas.map((v, i) => (
            <div
              key={v.titulo}
              className={`px-6 py-3 sm:py-3.5 ${i > 0 ? "border-t border-hairline sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="text-sm font-medium text-ink">{v.titulo}</p>
              <p className="text-sm text-muted">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grilla densa de productos */}
      <section id="productos" className="scroll-mt-24 pb-16">
        <h2 className="text-[22px] font-medium leading-tight tracking-[-0.44px] text-ink">Productos</h2>
        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-8 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PRODUCTOS.map((p, i) => (
            <TarjetaProducto key={p.slug} p={p} prioridad={i === 0} />
          ))}
        </div>
      </section>

      {/* Cómo comprar */}
      <section className="border-t border-hairline py-16">
        <h2 className="text-[22px] font-medium leading-tight tracking-[-0.44px] text-ink">Así de fácil compras</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {pasos.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-oro bg-oro-suave text-base font-semibold text-primary">
                {s.n}
              </span>
              <div>
                <p className="text-base font-semibold text-ink">{s.titulo}</p>
                <p className="mt-0.5 text-sm text-muted">{s.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
