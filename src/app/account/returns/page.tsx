import type { Metadata } from "next";
import { orders } from "@/data/content";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  const returned = orders.filter((o) => o.status === "Returned");
  return (
    <div>
      <h1 className="font-serif text-4xl">Returns</h1>
      <p className="mt-3 text-sm text-muted">
        Rentals return in the garment bag. Buys may return within 7 days if unworn and tagged.
      </p>
      {returned.length ? (
        <ul className="mt-6 space-y-3">
          {returned.map((o) => (
            <li key={o.id} className="border border-line px-4 py-3">
              {o.id} · deposit released
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm">No open returns.</p>
      )}
      <form className="mt-8 grid max-w-md gap-3" action="#">
        <input className="border border-line px-3 py-3" placeholder="Order ID" />
        <textarea className="border border-line px-3 py-3" placeholder="Reason" rows={3} />
        <Button type="submit">Request return</Button>
      </form>
    </div>
  );
}
