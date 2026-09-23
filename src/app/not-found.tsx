import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="mt-3 font-serif text-4xl">This piece is not on the rail</h1>
      <p className="mt-3 text-sm text-muted">
        The URL may be old, or the look has been returned to the archive.
      </p>
      <Button href="/" className="mt-8">
        Return home
      </Button>
    </div>
  );
}
