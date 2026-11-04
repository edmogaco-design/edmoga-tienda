export function PaginaLegal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-10 text-stone-700 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-stone-900 [&_li]:ml-5 [&_li]:list-disc">
      <h1 className="text-2xl font-bold text-stone-900">{titulo}</h1>
      <p className="text-sm text-stone-500">Última actualización: 4 de noviembre de 2026</p>
      {children}
    </article>
  );
}
