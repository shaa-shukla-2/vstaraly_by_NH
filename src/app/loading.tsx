export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-8" aria-busy="true">
      <div className="h-8 w-48 bg-ivory-deep" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-ivory-deep" />
        ))}
      </div>
    </div>
  );
}
