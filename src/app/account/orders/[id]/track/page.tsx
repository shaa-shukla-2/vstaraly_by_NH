import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrder } from "@/data/content";

export const metadata: Metadata = { title: "Tracking" };

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl">Tracking {order.id}</h1>
      <p className="mt-2 text-sm text-muted">Carrier ref {order.trackingId}</p>
      <ol className="mt-8 space-y-4 border-l border-line pl-6">
        {order.timeline.map((t) => (
          <li key={t.label} className={t.done ? "text-espresso" : "text-muted"}>
            <p className="font-serif text-xl">{t.label}</p>
            <p className="text-sm">{t.date}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
