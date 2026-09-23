import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="border border-line px-6 py-16 text-center">
        <p className="font-serif text-2xl">Nothing on this rail yet</p>
        <p className="mt-2 text-sm text-muted">
          Try another collection, or start a search for Banarasi, ivory, or velvet.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
