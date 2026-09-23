"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { ProductGrid } from "@/components/product/ProductGrid";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "new", label: "Newest" },
];

export function Catalog({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("featured");
  const [fulfillment, setFulfillment] = useState<"all" | "buy" | "rent">("all");
  const [size, setSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState(250000);

  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))),
    [products],
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (fulfillment === "buy" && !p.availableToBuy) return false;
      if (fulfillment === "rent" && !p.availableToRent) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      const price = p.availableToBuy ? p.price : p.rentalPrice;
      if (price > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].filter((p) => p.badges.includes("New")).concat(list.filter((p) => !p.badges.includes("New")));
    return list;
  }, [products, sort, fulfillment, size, maxPrice]);

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-6 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em]">Availability</p>
          <div className="mt-2 flex flex-col gap-2">
            {(["all", "buy", "rent"] as const).map((f) => (
              <label key={f} className="flex items-center gap-2 capitalize">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillment === f}
                  onChange={() => setFulfillment(f)}
                />
                {f === "all" ? "Buy & rent" : f}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em]">Size</p>
          <select
            className="mt-2 w-full border border-line bg-transparent px-2 py-2"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="all">All sizes</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em]">Price up to {maxPrice.toLocaleString("en-IN")}</p>
          <input
            type="range"
            min={5000}
            max={250000}
            step={5000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
      </aside>
      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{filtered.length} pieces</p>
          <label className="text-sm">
            Sort{" "}
            <select
              className="border border-line bg-transparent px-2 py-1"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
