import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Exchanges" };

export default function ExchangesPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Exchanges</h1>
      <p className="mt-3 text-sm text-muted">
        Size exchanges on buys are complimentary once, within 7 days. Rentals are exchanged only if the garment is damaged on arrival.
      </p>
      <form className="mt-8 grid max-w-md gap-3">
        <input className="border border-line px-3 py-3" placeholder="Order ID" />
        <input className="border border-line px-3 py-3" placeholder="Preferred size" />
        <Button type="submit">Request exchange</Button>
      </form>
      <p className="mt-6 text-sm text-muted">No exchanges in progress.</p>
    </div>
  );
}
