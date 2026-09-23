"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconClose, IconHeart } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export function QuickView() {
  const { quickView: p, setQuickView, addToCart, toggleWishlist, isWishlisted } = useStore();
  const [size, setSize] = useState("");
  if (!p) return null;
  const selected = size || p.sizes[0];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-espresso/40 p-4" role="dialog" aria-label="Quick view">
      <div className="grid max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-ivory md:grid-cols-2">
        <div className="relative min-h-[320px]">
          <Image src={p.images[0]} alt={p.name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="p-6">
          <div className="flex justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{p.designer}</p>
            <button type="button" aria-label="Close" onClick={() => setQuickView(null)}>
              <IconClose />
            </button>
          </div>
          <h2 className="mt-2 font-serif text-3xl">{p.name}</h2>
          <p className="mt-2 text-sm text-muted">{p.description}</p>
          <p className="mt-4">{formatINR(p.availableToBuy ? p.price : p.rentalPrice)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`border px-3 py-1 text-xs ${selected === s ? "border-espresso" : "border-line"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <Button
              className="flex-1"
              disabled={!p.availableToBuy}
              onClick={() =>
                addToCart({
                  productId: p.id,
                  size: selected,
                  color: p.colors[0].name,
                  fulfillment: "buy",
                  quantity: 1,
                })
              }
            >
              Add to bag
            </Button>
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => toggleWishlist(p.id)}
              className="border border-line px-3"
            >
              <IconHeart filled={isWishlisted(p.id)} />
            </button>
          </div>
          <Button href={`/products/${p.slug}`} variant="ghost" className="mt-3 px-0" onClick={() => setQuickView(null)}>
            View full details
          </Button>
        </div>
      </div>
    </div>
  );
}
