"use client";

import Image from "next/image";
import { useState } from "react";
import { getProductById } from "@/data/products";
import { cartTotals, useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, coupon, applyCoupon } = useStore();
  const [code, setCode] = useState("");
  const totals = cartTotals(cart, coupon);

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-muted">The bridal rail is not.</p>
        <Button href="/bridal" className="mt-8">
          Explore bridal
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 lg:grid-cols-[1fr_320px] md:px-8">
      <div>
        <h1 className="font-serif text-4xl">Shopping bag</h1>
        <ul className="mt-8 divide-y divide-line">
          {cart.map((item) => {
            const p = getProductById(item.productId);
            if (!p) return null;
            return (
              <li key={item.key} className="flex gap-4 py-6">
                <Image src={p.images[0]} alt={p.name} width={96} height={128} className="h-32 w-24 object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-xl">{p.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    {item.fulfillment} · {item.size} · {item.color}
                    {item.rentalStart ? ` · ${item.rentalStart}–${item.rentalEnd}` : ""}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" onClick={() => updateQty(item.key, item.quantity - 1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.key, item.quantity + 1)}>
                      +
                    </button>
                    <button type="button" className="ml-4 text-xs text-muted" onClick={() => removeFromCart(item.key)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="h-fit border border-line p-5">
        <p className="text-[11px] uppercase tracking-[0.18em]">Summary</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatINR(totals.subtotal)}</dd>
          </div>
          {totals.discount ? (
            <div className="flex justify-between text-wine">
              <dt>VASTRA10</dt>
              <dd>−{formatINR(totals.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>Complimentary</dd>
          </div>
          {totals.deposit ? (
            <div className="flex justify-between text-muted">
              <dt>Refundable deposit</dt>
              <dd>{formatINR(totals.deposit)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-line pt-3 font-medium">
            <dt>Total</dt>
            <dd>{formatINR(totals.total)}</dd>
          </div>
        </dl>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyCoupon(code);
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon"
            className="flex-1 border border-line px-2 py-2 text-sm"
            aria-label="Coupon code"
          />
          <Button type="submit" size="sm" variant="outline">
            Apply
          </Button>
        </form>
        {coupon ? <p className="mt-2 text-xs text-muted">{coupon} is on this bag.</p> : null}
        <Button href="/checkout" className="mt-6 w-full">
          Checkout
        </Button>
      </aside>
    </div>
  );
}
