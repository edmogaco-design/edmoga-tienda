# EDMOGA — Tienda online

Tienda de bienestar, hogar y cocina con pago contra entrega en Colombia. Dominio: **edmoga.com**.

Stack: Next.js (App Router) + TypeScript + Tailwind, desplegado en Vercel (plan Hobby).
Lee [AGENTS.md](AGENTS.md) antes de trabajar en el repo.

## Levantar el proyecto en menos de 30 minutos

1. Instala [Node.js LTS](https://nodejs.org) y [Git](https://git-scm.com).
2. Clona el repo:
   ```bash
   git clone https://github.com/edmogaco-design/edmoga-tienda.git
   cd edmoga-tienda
   npm install
   ```
3. Copia `.env.example` a `.env.local` y llena los valores que necesites.
4. Ejecuta `npm run dev` y abre http://localhost:3000.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local |
| `npm run lint` | Revisa el estilo del código |
| `npm run typecheck` | Revisa los tipos de TypeScript |
| `npm run build` | Compila para producción |

## Despliegue

- `main` → producción (edmoga.com).
- `dev` → preview automático en Vercel.
- Variables de entorno: Vercel → Project → Settings → Environment Variables.

## Documentos del proyecto

[ROADMAP.md](ROADMAP.md) · [TAREAS.md](TAREAS.md) · [CHANGELOG.md](CHANGELOG.md) · [DECISIONES.md](DECISIONES.md)
