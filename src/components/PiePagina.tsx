import Link from "next/link";
import { SITE } from "@/lib/config";

export function PiePagina() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 text-sm text-stone-600 sm:grid-cols-3">
        <div>
          <p className="font-bold tracking-[0.3em] text-emerald-800">EDMOGA</p>
          <p className="mt-2">Pago contra entrega en toda Colombia.</p>
          <p className="mt-1">{SITE.correo}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-stone-800">Legal</p>
          <Link href="/legal/datos">Tratamiento de datos</Link>
          <Link href="/legal/terminos">Términos y condiciones</Link>
          <Link href="/legal/envios">Política de envíos</Link>
          <Link href="/legal/devoluciones">Devoluciones y retracto</Link>
        </div>
        <div>
          <p className="font-semibold text-stone-800">Compra segura</p>
          <p className="mt-2">
            Confirmamos cada pedido por WhatsApp antes de despacharlo. Nunca te pediremos claves
            ni códigos.
          </p>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-stone-500">© {new Date().getFullYear()} EDMOGA</p>
    </footer>
  );
}
