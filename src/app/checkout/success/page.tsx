import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Order received" };

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Thank you</p>
      <h1 className="mt-3 font-serif text-4xl">Your order is with the atelier</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        This is a frontend preview. No payment was taken. In the finished house, you would receive a packing note and tracking for LY-20XXX.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/account/orders">View orders</Button>
        <Button href="/" variant="outline">
          Home
        </Button>
      </div>
    </div>
  );
}
