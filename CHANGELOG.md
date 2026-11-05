# CHANGELOG

## 2026-11-05 — Logo y colores de marca [agente: Claude]
- Logo oficial de EDMOGA (emblema + nombre) en el encabezado y logo completo en el pie.
- Ícono del sitio, ícono para iPhone e imagen para redes sociales con el emblema/logo.
- Colores del logo: azul marino #162944 para acciones principales y dorado #c0a261 como acento.
- Rediseño general (lienzo blanco, esquinas suaves, foto primero, tarjeta de compra fija, checkout en dos columnas).

## 2026-11-05 — Pago en línea con Bold [agente: Claude]
- Opción "Pagar en línea con Bold · envío gratis" en el checkout (solo aparece si están las llaves de Bold).
- Botón oficial de Bold con firma de integridad generada en el servidor; el monto lo calcula el servidor.
- Página /pago/resultado: verifica el pago consultando a Bold (no confía en la URL de retorno), compara monto y referencia.
- Pago aprobado → pedido en Dropi `SIN RECAUDO` con nota "PAGADO EN LÍNEA - NO COBRAR" y resumen por WhatsApp.
- Monto distinto → revisión manual; rechazado/fallido → no se despacha. Reintentos no duplican pedidos.
- Webhook /api/bold/webhook con verificación de firma `x-bold-signature` (HMAC-SHA256).
- CSP permite *.bold.co. Probado con servidores Bold y Dropi falsos (16 pruebas).

## 2026-11-05 — Corrección urgente: WhatsApp de EDMOGA [agente: Claude]
- El número de WhatsApp de ventas estaba mal: era el de otro negocio, copiado por error del documento modelo.
- Ahora es 573185168451 (EDMOGA). Marketing usa el mismo número hasta definir uno propio.
- Aprobado por el dueño en chat; publicado directo a `main` por urgencia (excepción al flujo de PR).

## 2026-11-04 — Pedido automático a Dropi [agente: Claude]
- El checkout registra el pedido en Dropi (contra entrega, `CON RECAUDO`) cuando existe `DROPI_TOKEN`.
- Código de pedido `EDM-XXXXXXXX` en Dropi y en el mensaje de WhatsApp.
- Idempotencia: doble clic o reintento no crea pedidos duplicados.
- Si Dropi falla o no hay token, el cliente igual llega a WhatsApp (la venta nunca se pierde).
- Departamento como lista (nombres que entiende Dropi). Foto real del producto desde Dropi.
- Pendiente: Dropi responde 401 con el token de la integración EDMOGA; caso abierto con soporte de Dropi.

## 2026-11-04 — Fase 0 / Fase 1 base [agente: Claude]
- Proyecto Next.js 15 + TypeScript + Tailwind.
- Archivos de coordinación: AGENTS.md, ROADMAP.md, TAREAS.md, DECISIONES.md, .env.example.
- CI en GitHub Actions (lint, typecheck, build), plantillas de PR e issues, Dependabot.
- Tienda: inicio, ficha de la picadora manual (Dropi 2181739, 60.000 COP), checkout de un paso que deriva el cierre a WhatsApp.
- Botón flotante de WhatsApp, páginas legales (Ley 1581/2012, Ley 1480/2011), cabeceras de seguridad, SEO y Open Graph.
