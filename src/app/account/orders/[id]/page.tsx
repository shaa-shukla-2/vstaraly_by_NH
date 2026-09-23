import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/data/content";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-gold">{order.status}</p>
      <h1 className="mt-2 font-serif text-4xl">{order.id}</h1>
      <p className="mt-2 text-sm text-muted">
        Placed {order.placedOn} · {order.fulfillment}
      </p>
      <ul className="mt-8 space-y-4">
        {order.items.map((item) => (
          <li key={item.productId} className="flex gap-4">
            <Image src={item.image} alt={item.name} width={72} height={96} className="h-24 w-[72px] object-cover" />
            <div>
              <p className="font-serif text-lg">{item.name}</p>
              <p className="text-sm text-muted">
                Size {item.size} · {formatINR(item.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">
        {order.address.fullName}, {order.address.line1}, {order.address.city} {order.address.pincode}
      </p>
      <p className="mt-2 text-sm">Total {formatINR(order.total)}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={`/account/orders/${order.id}/track`} variant="outline">
          Track
        </Button>
        <Link href="/account/returns" className="text-sm text-muted">
          Start a return
        </Link>
      </div>
    </div>
  );
}
