# edmoga-tienda

Tienda online de dropshipping (Colombia, COP, pago contraentrega) construida con Next.js 15 y desplegada en Vercel.

## Qué hace hoy
- Catálogo con productos de **Dropi** (`data/products.json`), filtro por categoría y página de producto con variaciones.
- Carrito (localStorage) y checkout contraentrega → `/api/pedido` valida, **recalcula precios en servidor**, genera código de pedido y abre WhatsApp con el resumen.
- Reenvío opcional de cada pedido a `ORDER_WEBHOOK_URL` (Make, Zapier, n8n, Google Sheets).
- Panel interno `/margenes?k=ADMIN_KEY` con costo, precio, ganancia y % de margen por producto.

## Precios
`lib/config.ts` → `markupMin`. Precio = máx(precio sugerido Dropi, costo × (1 + markupMin)), redondeado a $100.

## Variables de entorno (Vercel → Settings → Environment Variables)
| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_WHATSAPP` | Número de la tienda, ej. `573001234567` |
| `ADMIN_KEY` | Clave para ver `/margenes` |
| `ORDER_WEBHOOK_URL` | (Opcional) dónde reenviar pedidos |

## Desarrollo
```bash
npm install
npm run dev
```
