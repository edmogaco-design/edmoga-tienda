# CHANGELOG

## 2026-11-13 — Buscador de productos [agente: Claude]
- Nueva página `/buscar` y buscador en el encabezado (caja en computador, lupa en celular). Funciona sin JavaScript.
- Busca en nombre, sección, resumen y beneficios; ignora tildes, mayúsculas y plurales simples. Deben coincidir todas las palabras; primero salen las coincidencias en el nombre.
- Solo muestra productos a la venta (los ocultos no aparecen). La página no se indexa en Google.

## 2026-11-10 — Pago por transferencia con llave Bre-B [agente: Claude]
- Nueva forma de pago en el checkout: transferencia con llave Bre-B, con envío gratis igual que Bold. Al hacer el pedido el cliente ve la llave, el titular y su código, y manda el comprobante por WhatsApp.
- El pedido queda como `pendiente_comprobante_transferencia` en Supabase y en Sheets. No se crea en Dropi hasta que el dueño verifica que el dinero entró.
- Solo aparece si existe `TRANSFERENCIA_LLAVE_BREB` en Vercel (opcional `TRANSFERENCIA_TITULAR`).
- `supabase/esquema.sql` acepta el método `transferencia` (hay que volver a correrlo).

## 2026-11-10 — Productos sin INVIMA fuera de la tienda [agente: Claude]
- Nuevo campo `oculto` en el catálogo: el producto no aparece en el inicio ni en el sitemap, su ficha da 404 y no se puede pedir ni pagar.
- Se ocultan 7 productos Trendy sin registro de su tipo en InvimÁgil: tónico de rosas, exfoliante corporal, bruma con niacinamida, polvos compactos, contorno en barra con rubor, espuma desmaquillante y bronzer. Aprobado por el dueño.
- Registro INVIMA en la ficha de aceite desmaquillante (NSOC53030-26CO), crema facial efecto gel (NSOC53042-26CO) y lápiz de cejas (NSOC53307-26CO).
- Test: un producto oculto no se puede pedir.

## 2026-11-10 — Más fotos de productos Trendy [agente: Claude]
- Galería de Dropi en 7 productos Trendy más: espuma desmaquillante, contorno con rubor, iluminador, bronzer, paleta Dreams Pro, delineador en gel y kit de pestañina. Se descartaron fotos que mostraban otro producto.
- La bruma con niacinamida queda con 1 foto (la otra de Dropi era de otra bruma). Tónico, exfoliante, primer, paleta Kitty y lápiz de cejas solo tienen 1 foto en Dropi.

## 2026-11-10 — Skincare y maquillaje Trendy [agente: Claude]
- La sección "Belleza femenina" pasa a llamarse "Skincare y belleza" (ancla #skincare-y-belleza).
- 16 productos nuevos de la marca colombiana Trendy: 7 de skincare (crema efecto gel, bruma con niacinamida, aceite y espuma desmaquillantes, tónico de rosas, exfoliante corporal, primer) y 9 de maquillaje (polvos, contorno con rubor, iluminador, bronzer, 2 paletas de sombras, delineador, lápiz de cejas, kit de pestañina).
- Precios propuestos por Claude y aprobados por el dueño el 2026-11-10. El número INVIMA no aparece en Dropi: confirmarlo con el proveedor antes de publicar.
- Fotos: galería completa en 3 productos; el resto con la foto principal porque las fichas de Dropi no cargaron.

## 2026-11-10 — Sección Cafeteros [agente: Claude]
- Nueva sección "Cafeteros" en el inicio con la cafetera método tipo Chemex 600 ml (Dropi 2286133), a $69.900 (costo Dropi $40.000), precio aprobado por el dueño.

## 2026-11-10 — Límite de intentos compartido en Redis [agente: Claude]
- `/api/pedido` (5 cada 10 min por IP), `/api/pago/iniciar` (10) y `/api/pago/confirmar` (20) limitan intentos con Upstash Redis, compartido entre instancias de Vercel. Antes el límite de pedidos era en memoria y se saltaba cambiando de instancia.
- Si Redis no responde, se deja pasar (no se bloquean ventas). Sin `KV_REST_API_*` usa memoria (solo local).
- El webhook de Bold no se limita: ya exige firma HMAC y Bold reintenta si recibe error.

## 2026-11-09 — Belleza femenina, secciones y galería de fotos [agente: Claude]
- 20 productos nuevos de Dropi en la sección Belleza femenina (cabello, depilación, maquillaje, uñas y cuidado facial). Sin perfumes imitación, suplementos ni cosméticos que requieran INVIMA. Precios de venta propuestos por Claude y aprobados por el dueño el 2026-11-10.
- El inicio se divide en secciones (Cocina y Belleza femenina) con botones para saltar a cada una. El calentador de taza pasa de Hogar a Cocina.
- Cada producto tiene varias fotos (hasta 5, tomadas de la galería de Dropi) y la ficha muestra una galería con miniaturas. El contenedor de alimentos solo tiene 1 foto en Dropi.

## 2026-11-09 — Registro de ventas en Supabase y Google Sheets [agente: Claude]
- Cada pedido (contra entrega o pagado con Bold) se guarda en Supabase (tabla `pedidos`) y en una hoja de Google Sheets, después de responder al cliente (no lo demora).
- El webhook de Bold guarda cada evento en Supabase (tabla `pagos_bold`) para conciliar pagos.
- Esquema en `supabase/esquema.sql` (RLS activo, solo el servidor accede). Script de la hoja en `docs/google-sheets.gs`.
- Si un destino no está configurado o falla, la venta sigue igual por WhatsApp y el fallo queda en los logs.

## 2026-11-09 — 10 productos nuevos de Dropi [agente: Claude]
- Cocina y hogar: filtro de agua, papel air fryer, sartén panqueques, contenedor, dispensador aceite/vinagre, calentador de taza, afilador, molino de café, caldero 29 cm y cafetera moka.
- Precios de venta aprobados por el dueño; fotos del proveedor en Dropi.

## 2026-11-09 — Correcciones de la auditoría [agente: Claude]
- Un pago confirmado o un pedido contra entrega ya no se duplica en Dropi aunque la confirmación se repita en otra instancia de Vercel: registro compartido en Upstash Redis (`src/lib/unaVez.ts`, requiere `KV_REST_API_URL`/`KV_REST_API_TOKEN`).
- Envío: la tarifa principal ($18.000) aplica solo en Bogotá y las capitales (Medellín, Cali, Barranquilla, Bucaramanga, Pereira, Manizales, Armenia); los demás municipios pagan la tarifa nacional. El checkout pide la ciudad para cotizar.
- Si Dropi tarda demasiado, el log avisa que hay que buscar el pedido en Dropi antes de cargarlo a mano.
- El webhook de Bold rechaza la llave vacía en producción.
- Primeros tests (`npm test`) de lo que mueve plata: recaudo de Dropi, envío, firma del webhook, anti-duplicados. CI los corre.

## 2026-11-09 — Ajuste de diseño con la guía frontend-design [agente: Claude]
- Inicio con franja azul de marca: la picadora, su precio y la promesa "Paga cuando te llegue".
- Letras nuevas: Atkinson Hyperlegible (texto, fácil de leer) y Bricolage Grotesque (títulos y precios).
- Grises con tono azul de la marca; foco visible con teclado y respeto a "reducir movimiento".
- Menos adornos genéricos: sin etiquetas en mayúsculas, sin separadores "·", garantías en frases claras.

## 2026-11-09 — Cotización de envío por zonas [agente: Claude]
- Envío contra entrega según el departamento: $18.000 ciudades principales, $24.000 resto del país, $42.000 zonas apartadas (tabla en `src/lib/envios.ts`, basada en tarifas reales de Dropi).
- El checkout muestra el envío y el total apenas el cliente elige su departamento; el mensaje de WhatsApp incluye envío y total a pagar.
- El pedido a Dropi suma el envío al valor a recaudar (contra entrega). Pago en línea con Bold sigue con envío gratis.
- Política de envíos actualizada con los valores.

## 2026-11-09 — Pendientes cerrados [agente: Claude]
- `main` protegida en GitHub (PR obligatorio, sin force push ni borrado).
- Webhook de Bold en producción y llaves de producción en Vercel: el pago en línea queda activo en edmoga.com.
- TAREAS y ROADMAP actualizados.

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
