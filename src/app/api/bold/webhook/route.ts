import { NextResponse } from "next/server";
import { firmaWebhookValida } from "@/lib/bold";

// Webhook de Bold. Verifica la firma x-bold-signature y responde 200 de inmediato
// (Bold exige respuesta en menos de 2 s y reintenta si no la recibe).
// Por ahora registra el evento (sin datos personales); en la Fase 2 se guardará en Supabase
// para conciliar pagos aunque el cliente cierre el navegador antes de volver a la tienda.
export async function POST(req: Request) {
  const cuerpoCrudo = await req.text();
  if (!firmaWebhookValida(cuerpoCrudo, req.headers.get("x-bold-signature"))) {
    console.warn("bold_webhook_firma_invalida");
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  try {
    const evento = JSON.parse(cuerpoCrudo) as {
      id?: string;
      type?: string;
      data?: { payment_id?: string; metadata?: { reference?: string | null }; amount?: { total?: number } };
    };
    console.info("bold_webhook", {
      evento: evento.id,
      tipo: evento.type,
      transaccion: evento.data?.payment_id,
      orden: evento.data?.metadata?.reference ?? null,
      total: evento.data?.amount?.total,
    });
  } catch {
    console.warn("bold_webhook_json_invalido");
  }
  return NextResponse.json({ recibido: true });
}
