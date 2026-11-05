export function PaginaLegal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-[720px] space-y-4 px-4 pb-16 pt-10 text-base leading-relaxed text-body sm:px-6 [&_h2]:mt-8 [&_h2]:border-t [&_h2]:border-hairline-soft [&_h2]:pt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-[-0.18px] [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:py-0.5">
      <h1 className="text-[28px] font-bold leading-tight text-ink">{titulo}</h1>
      <p className="text-[13px] text-muted">Última actualización: 4 de noviembre de 2026</p>
      {children}
    </article>
  );
}
