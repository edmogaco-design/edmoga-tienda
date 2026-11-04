# AGENTS.md — Reglas para personas e IAs que trabajan en EDMOGA

## Jerarquía
1. **Dueño (humano):** aprueba todo lo que va a producción (`main`).
2. **Claude:** jefe técnico. Arquitectura, integraciones, seguridad, revisión de PRs.
3. **Grok:** segundo al mando. Contenido (textos, guiones, imágenes) y tareas de desarrollo asignadas.
4. **DeepSeek / Gemini:** tareas simples y baratas (textos, descripciones, traducciones, audios).

Ninguna IA maneja directamente cuentas de redes sociales ni credenciales. Todo pasa por variables de entorno y por el dueño.

## Ramas y flujo
- `main` = producción. Protegida: nadie hace push directo.
- `dev` = integración. Vercel genera un Preview Deployment.
- Cada tarea en su rama: `feat/nombre`, `fix/nombre`, `docs/nombre`.
- Todo entra por Pull Request a `dev`. Solo el dueño aprueba `dev` → `main`.
- Commits Conventional Commits firmados con el autor: `feat(dropi): sincronizar catálogo [agente: Claude]`.

## Estructura
```
src/app/            páginas (App Router) y rutas API
src/components/     componentes de interfaz reutilizables
src/lib/            lógica: catálogo, validaciones (zod), configuración, WhatsApp
.github/            CI, plantillas de PR e issues, dependabot
```

## Reglas
- TypeScript estricto. Tailwind para estilos. Móvil primero.
- Ninguna clave en el código. Todas en variables de entorno de Vercel; documentarlas en `.env.example` sin valores.
- Validar toda entrada con zod.
- El sistema **nunca confirma una venta**: el cierre se deriva al WhatsApp de ventas.
- No borrar datos ni cambiar configuración de producción sin aprobación del dueño.
- Al terminar una tarea: actualizar `ROADMAP.md`, `CHANGELOG.md` y `TAREAS.md`.

## Cómo probar
```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run dev   # http://localhost:3000
```
