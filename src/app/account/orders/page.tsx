import type { Metadata } from "next";
import Link from "next/link";
import { orders } from "@/data/content";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <ul className="mt-8 divide-y divide-line border border-line">
        {orders.map((o) => (
          <li key={o.id} className="px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-serif text-xl">{o.id}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{o.status}</p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {o.placedOn} · {o.fulfillment} · {formatINR(o.total)}
            </p>
            <Link href={`/account/orders/${o.id}`} className="mt-2 inline-block text-sm text-wine">
              Order details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
