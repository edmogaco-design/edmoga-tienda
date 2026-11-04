import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = { title: "Política de envíos" };

export default function Envios() {
  return (
    <PaginaLegal titulo="Política de envíos">
      <h2>Cobertura</h2>
      <p>Enviamos a toda Colombia a través de transportadoras aliadas.</p>
      <h2>Tiempos</h2>
      <p>
        Ciudades principales: 2 a 5 días hábiles. Municipios y zonas rurales: 4 a 8 días hábiles,
        contados desde la confirmación del pedido.
      </p>
      <h2>Costo</h2>
      <p>El valor del envío depende de la ciudad y se informa por WhatsApp antes de confirmar.</p>
      <h2>Pago contra entrega</h2>
      <p>Pagas en efectivo al recibir el producto. Revisa el paquete antes de pagar.</p>
      <h2>Seguimiento</h2>
      <p>Al despachar te enviamos el número de guía para que sigas tu pedido.</p>
    </PaginaLegal>
  );
}
