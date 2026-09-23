export function PolicyPage({
  title,
  eyebrow,
  paragraphs,
}: {
  title: string;
  eyebrow: string;
  paragraphs: string[];
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl">{title}</h1>
      <div className="mt-8 space-y-5 text-sm leading-8 text-charcoal">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </article>
  );
}
