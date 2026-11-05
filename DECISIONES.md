# DECISIONES

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-11-04 | Next.js (App Router) + TypeScript + Tailwind en Vercel Hobby | Gratis, rápido, un solo proyecto para frontend y backend |
| 2026-11-04 | Marca EDMOGA en edmoga.com, repo `edmogaco-design/edmoga-tienda` | Dominio y cuentas del dueño; la tienda no depende de terceros |
| 2026-11-04 | El checkout no confirma ventas: arma el pedido y abre WhatsApp de ventas | Regla de oro contra estafas; la venta la cierra una persona |
| 2026-11-04 | Catálogo en código (`src/lib/catalogo.ts`) mientras hay un solo producto | Simple; se migrará a Supabase + sincronización Dropi en la Fase 3 |
| 2026-11-04 | Validación con zod en cliente y servidor | Nunca confiar en datos de entrada |
| 2026-11-04 | Pedido a Dropi al enviar el formulario, cierre por WhatsApp | El pedido queda registrado (código EDM) y un asesor lo confirma; si es falso se cancela en Dropi |
| 2026-11-04 | URL y encabezado de Dropi configurables por variable de entorno | No hay documentación pública oficial; se ajusta sin tocar código |
| 2026-11-04 | Si Dropi falla, el cliente sigue a WhatsApp | La venta nunca se pierde por una caída de Dropi |
| 2026-11-05 | Colores de marca del logo: azul #162944 (acciones) y dorado #c0a261 (acentos) | Coherencia con el logo oficial; el dorado no se usa en textos largos por contraste |
| 2026-11-05 | Bold con Botón de pagos y envío gratis al pagar en línea | Decisión del dueño: incentivar el prepago y bajar devoluciones |
| 2026-11-05 | El pago se confirma consultando a Bold desde el servidor | La URL de retorno puede no ser definitiva (docs de Bold); regla de oro: no despachar sin pago verificado |
| 2026-11-05 | Datos de entrega del prepago se guardan en el navegador hasta volver de Bold | Aún no hay base de datos; en la Fase 2 se guardan en Supabase junto con el webhook |
