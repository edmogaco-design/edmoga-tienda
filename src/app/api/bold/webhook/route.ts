import { NextResponse, after } from "next/server";
import { firmaWebhookValida } from "@/lib/bold";
import { registrarEventoBold } from "@/lib/registro";

// Webhook de Bold. Verifica la firma x-bold-signature y responde 200 de inmediato
// (Bold exige respuesta en menos de 2 s y reintenta si no la recibe).
// Guarda el evento en Supabase (tabla pagos_bold) para conciliar pagos aunque el cliente
// cierre el navegador antes de volver a la tienda. Los logs van sin datos personales.
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
    if (evento.id) {
      const registro = {
        evento: evento.id,
        tipo: evento.type ?? null,
        transaccion: evento.data?.payment_id ?? null,
        orden: evento.data?.metadata?.reference ?? null,
        total: evento.data?.amount?.total ?? null,
        crudo: evento,
      };
      after(registrarEventoBold(registro)); // se guarda después de responder (Bold exige < 2 s)
    }
  } catch {
    console.warn("bold_webhook_json_invalido");
  }
  return NextResponse.json({ recibido: true });
}
