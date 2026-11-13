# ROADMAP — EDMOGA

| Fase | Descripción | Estado |
|---|---|---|
| 0 — Cimientos | Repo, ramas, archivos de coordinación, CI, Vercel + GitHub, dominio edmoga.com, `main` protegida, marca y diseño | hecho |
| 1 — Un producto | Tienda mínima con la picadora (Dropi 2181739), checkout contra entrega → Dropi + WhatsApp, páginas legales | en curso (Dropi rechaza el token con 401: esperando acceso API de Dropi; envío cotizado por zonas; registro en Supabase y Sheets activo) |
| 2 — Pagos | Bold con webhook firmado, transferencias con comprobante, conciliación | en curso (Bold en producción con webhook; anti-duplicados con Upstash y pagos guardados en Supabase; faltan transferencias) |
| 3 — Catálogo | Sincronización con Dropi, categorías, buscador, +100 productos | en curso (41 productos a la venta (7 ocultos sin INVIMA) en 3 secciones: Cocina, Skincare y belleza y Cafeteros, con galería de fotos; buscador en `/buscar`; falta sincronización) |
| 4 — Admin | Panel con roles, revisión antes de publicar, tablero de ventas | pendiente |
| 5 — Isis y Biblioteca | Chatbot y PDFs | pendiente |
| 6 — Escalar | Otros países de Dropi, marca propia, temporadas | pendiente |
