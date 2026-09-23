"use client";

import Image from "next/image";
import { getProductById } from "@/data/products";
import { cartTotals, useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconClose } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, coupon } = useStore();
  const totals = cartTotals(cart, coupon);
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-espresso/40" role="dialog" aria-label="Shopping bag">
      <div className="flex h-full w-full max-w-md flex-col bg-ivory">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-2xl">Your bag</h2>
          <button type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}>
            <IconClose />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <p className="pt-10 text-center text-sm text-muted">
              Your bag is empty. The atelier rail is not.
            </p>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => {
                const p = getProductById(item.productId);
                if (!p) return null;
                return (
                  <li key={item.key} className="flex gap-4">
                    <Image src={p.images[0]} alt={p.name} width={72} height={96} className="h-24 w-[72px] object-cover" />
                    <div className="flex-1">
                      <p className="font-serif">{p.name}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted">
                        {item.fulfillment} · {item.size} · {item.color}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <button type="button" onClick={() => updateQty(item.key, item.quantity - 1)} aria-label="Decrease">
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQty(item.key, item.quantity + 1)} aria-label="Increase">
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-xs text-muted"
                          onClick={() => removeFromCart(item.key)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-line p-5">
          <p className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatINR(totals.subtotal)}</span>
          </p>
          {totals.deposit > 0 ? (
            <p className="mt-1 flex justify-between text-sm text-muted">
              <span>Refundable deposit</span>
              <span>{formatINR(totals.deposit)}</span>
            </p>
          ) : null}
          <div className="mt-4 grid gap-2">
            <Button href="/cart" onClick={() => setCartOpen(false)} variant="outline">
              View bag
            </Button>
            <Button href="/checkout" onClick={() => setCartOpen(false)}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
