export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-3xl font-medium text-espresso md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
