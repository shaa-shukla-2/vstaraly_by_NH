"use client";

import { getProductById } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProductById).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-4xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-10 border border-line px-6 py-16 text-center">
          <p className="font-serif text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted">Keep a lehenga while you decide between buy and rent.</p>
          <Button href="/collections/new-arrivals" className="mt-6">
            Browse new arrivals
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (p ? <ProductCard key={p.id} product={p} /> : null))}
        </div>
      )}
    </div>
  );
}
