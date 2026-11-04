import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <p>Al comprar en edmoga.com aceptas estos términos.</p>
      <h2>Pedidos</h2>
      <p>
        El formulario de compra no confirma la venta. Tu pedido queda confirmado solo cuando un
        asesor de EDMOGA lo valida contigo por WhatsApp e informa el valor del envío.
      </p>
      <h2>Precios y pago</h2>
      <p>
        Los precios están en pesos colombianos (COP) e incluyen IVA cuando aplica. El envío se
        informa antes de confirmar. El pago principal es contra entrega.
      </p>
      <h2>Disponibilidad</h2>
      <p>
        Los productos están sujetos a disponibilidad. Si un producto se agota después de tu
        pedido, te avisaremos y no se hará ningún cobro.
      </p>
      <h2>Garantía</h2>
      <p>
        Todos los productos tienen la garantía legal establecida en la Ley 1480 de 2011 (Estatuto
        del Consumidor).
      </p>
      <h2>Seguridad</h2>
      <p>EDMOGA nunca te pedirá contraseñas, códigos de verificación ni pagos a cuentas distintas a las informadas en este sitio.</p>
    </PaginaLegal>
  );
}
