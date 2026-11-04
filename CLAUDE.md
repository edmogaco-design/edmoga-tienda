# Guía para Claude

- Proyecto: tienda dropshipping Colombia (Next.js 15 App Router, TypeScript, CSS plano, sin base de datos aún).
- Despliegue: Vercel conectado al repo de GitHub; cada push genera un deploy (preview por rama, producción desde `main`).
- Catálogo: `data/products.json` es un snapshot de Dropi tomado con el conector DROPI (`list_products`). Para actualizarlo, vuelve a consultar Dropi y reescribe el archivo conservando el esquema de `lib/catalog.ts`.
- Pedidos: `app/api/pedido/route.ts`. Los precios SIEMPRE se recalculan en servidor. Los pedidos se pueden crear en Dropi con el conector (`create_order`) cuando el usuario lo pida.
- No inventar precios de referencia tachados ni descuentos falsos (normas SIC Colombia).
- Antes de hacer push: `npm run lint && npm run build`.
- El usuario da órdenes en español y de forma verbal; responder en español.
