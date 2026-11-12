"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { COOKIE_ADMIN, HORAS_SESION, claveCorrecta, crearSesion, sesionValida } from "@/lib/admin";
import { PRODUCTOS } from "@/lib/catalogo";
import { ETIQUETA_PRECIOS, PRECIO_MAX, PRECIO_MIN, guardarPrecio, preciosCambiados } from "@/lib/precios";
import { limitado } from "@/lib/unaVez";

export async function entrar(formData: FormData): Promise<void> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  // 5 intentos cada 15 minutos por IP.
  if (await limitado(`admin:${ip}`, 5, 900)) redirect("/admin?error=intentos");

  if (!claveCorrecta(String(formData.get("clave") ?? ""))) {
    console.warn("admin_clave_incorrecta");
    redirect("/admin?error=clave");
  }
  (await cookies()).set(COOKIE_ADMIN, crearSesion(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: HORAS_SESION * 3600,
  });
  redirect("/admin");
}

export async function salir(): Promise<void> {
  (await cookies()).delete({ name: COOKIE_ADMIN, path: "/admin" });
  redirect("/admin");
}

const slugs = PRODUCTOS.map((p) => p.slug) as [string, ...string[]];
const cambio = z.object({
  slug: z.enum(slugs),
  // Acepta "64.900" o "$ 64900": se quitan puntos, espacios y el signo antes de validar.
  precio: z.preprocess(
    (v) => Number(String(v ?? "").replace(/[^\d]/g, "")),
    z.number().int().min(PRECIO_MIN).max(PRECIO_MAX),
  ),
});

export async function cambiarPrecio(formData: FormData): Promise<void> {
  // Cada acción vuelve a comprobar la sesión: la página protegida no basta.
  if (!sesionValida((await cookies()).get(COOKIE_ADMIN)?.value)) redirect("/admin");

  const r = cambio.safeParse({ slug: formData.get("slug"), precio: formData.get("precio") });
  if (!r.success) redirect("/admin?error=precio");

  const { slug, precio } = r.data;
  const antes = (await preciosCambiados())[slug] ?? PRODUCTOS.find((p) => p.slug === slug)?.precio;
  try {
    await guardarPrecio(slug, precio);
  } catch (e) {
    console.error("admin_precio_no_guardado", { slug, error: String(e) });
    redirect("/admin?error=guardar");
  }
  console.info("admin_precio_cambiado", { slug, antes, despues: precio });

  // La tienda pública toma el precio nuevo de inmediato.
  revalidateTag(ETIQUETA_PRECIOS);
  revalidatePath("/", "layout");
  redirect(`/admin?ok=${slug}#${slug}`);
}
