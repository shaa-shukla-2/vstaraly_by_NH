import type { Metadata } from "next";
import Link from "next/link";
import { orders } from "@/data/content";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Your atelier file</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
        Fittings, rentals and buys live here. This dashboard is populated with mock orders so the screens can be designed before a backend exists.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Open orders" value="1" />
        <Stat label="Completed" value="2" />
        <Stat label="Saved pieces" value="—" />
      </div>
      <h2 className="mt-10 font-serif text-2xl">Recent</h2>
      <ul className="mt-4 divide-y divide-line border border-line">
        {orders.slice(0, 2).map((o) => (
          <li key={o.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              {o.id} · {o.status}
            </span>
            <Link href={`/account/orders/${o.id}`} className="text-gold">
              View
            </Link>
          </li>
        ))}
      </ul>
      <Button href="/account/orders" variant="outline" className="mt-6">
        All orders
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
