import type { Metadata } from "next";
import { orders } from "@/data/content";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = { title: "Refunds" };

export default function RefundsPage() {
  const refunded = orders.filter((o) => o.status === "Refunded" || o.status === "Returned");
  return (
    <div>
      <h1 className="font-serif text-4xl">Refunds</h1>
      <p className="mt-3 text-sm text-muted">
        Deposits return in 5–7 working days after the garment is inspected. This screen uses mock history only.
      </p>
      <ul className="mt-8 divide-y divide-line border border-line">
        {refunded.map((o) => (
          <li key={o.id} className="flex justify-between px-4 py-3 text-sm">
            <span>{o.id}</span>
            <span>{formatINR(o.total)} · processed</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
