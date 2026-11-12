# ROADMAP — EDMOGA

| Fase | Descripción | Estado |
|---|---|---|
| 0 — Cimientos | Repo, ramas, archivos de coordinación, CI, Vercel + GitHub, dominio edmoga.com, `main` protegida, marca y diseño | hecho |
| 1 — Un producto | Tienda mínima con la picadora (Dropi 2181739), checkout contra entrega → Dropi + WhatsApp, páginas legales | en curso (Dropi rechaza el token con 401: esperando acceso API de Dropi; envío cotizado por zonas; registro en Supabase y Sheets activo) |
| 2 — Pagos | Bold con webhook firmado, transferencias con comprobante, conciliación | en curso (Bold en producción con webhook; anti-duplicados con Upstash y pagos guardados en Supabase; faltan transferencias) |
| 3 — Catálogo | Sincronización con Dropi, categorías, buscador, +100 productos | en curso (53 productos a la venta (7 ocultos sin INVIMA) en 6 secciones con página propia, filtros y orden: Cocina, Skincare y belleza, Cafeteros, Gimnasio, Tecnología y Audífonos; carrito de varios productos y lista de deseos; falta sincronización, buscador y variantes) |
| 4 — Admin | Panel con roles, revisión antes de publicar, tablero de ventas | en curso (modo administrador en /admin para cambiar precios; faltan roles y tablero de ventas) |
| 5 — Isis y Biblioteca | Chatbot y PDFs | pendiente |
| 6 — Escalar | Otros países de Dropi, marca propia, temporadas | pendiente |
