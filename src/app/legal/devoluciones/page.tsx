import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Devoluciones y derecho de retracto" };

export default function Devoluciones() {
  return (
    <PaginaLegal titulo="Devoluciones y derecho de retracto">
      <h2>Derecho de retracto (artículo 47, Ley 1480 de 2011)</h2>
      <p>
        Por ser una compra a distancia, puedes retractarte dentro de los 5 días hábiles siguientes
        a la entrega. El producto debe devolverse en las mismas condiciones en que lo recibiste.
        Los costos de transporte de la devolución corren por tu cuenta. Te reintegramos el dinero
        en máximo 30 días calendario.
      </p>
      <h2>Garantía</h2>
      <p>
        Si el producto presenta defectos de fábrica, aplicamos la garantía legal: reparación,
        cambio o devolución del dinero según corresponda.
      </p>
      <h2>Reversión del pago (artículo 51, Ley 1480 de 2011)</h2>
      <p>
        Si pagaste con tarjeta o medio electrónico y fuiste víctima de fraude, la operación no fue
        solicitada, el producto no llegó o no corresponde a lo pedido, puedes solicitar la
        reversión del pago dentro de los 5 días hábiles siguientes.
      </p>
      <h2>Cómo solicitarlo</h2>
      <p>Escríbenos por WhatsApp o a {SITE.correo} con tu nombre, número de pedido y motivo.</p>
    </PaginaLegal>
  );
}
