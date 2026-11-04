import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Política de tratamiento de datos personales" };

export default function Datos() {
  return (
    <PaginaLegal titulo="Política de tratamiento de datos personales">
      <p>
        En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, EDMOGA (en adelante, el
        Responsable) informa cómo trata los datos personales de sus clientes.
      </p>
      <h2>Datos que recolectamos</h2>
      <ul>
        <li>Nombre, celular, departamento, ciudad y dirección de entrega.</li>
        <li>Información del pedido (producto, cantidad, valor).</li>
      </ul>
      <h2>Finalidades</h2>
      <ul>
        <li>Gestionar, confirmar y entregar tu pedido, incluida la entrega a la transportadora.</li>
        <li>Comunicarnos contigo por WhatsApp o llamada sobre tu compra.</li>
        <li>Cumplir obligaciones legales, contables y de garantía.</li>
        <li>Enviarte ofertas, solo si lo autorizas expresamente.</li>
      </ul>
      <h2>Tus derechos</h2>
      <p>
        Puedes conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización y
        presentar quejas ante la Superintendencia de Industria y Comercio.
      </p>
      <h2>Cómo ejercerlos</h2>
      <p>
        Escribe a {SITE.correo}. Responderemos consultas en máximo 10 días hábiles y reclamos en
        máximo 15 días hábiles.
      </p>
      <h2>Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y administrativas para proteger tu información. No vendemos tus
        datos a terceros.
      </p>
    </PaginaLegal>
  );
}
