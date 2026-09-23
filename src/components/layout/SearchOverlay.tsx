"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products, searchProducts } from "@/data/products";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconClose, IconSearch } from "@/components/ui/Icons";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(() => (q ? searchProducts(q).slice(0, 6) : products.slice(0, 4)), [q]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-espresso/40" role="dialog" aria-label="Search">
      <div className="mx-auto mt-0 max-w-2xl bg-ivory p-6 shadow-[var(--shadow)] md:mt-16">
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <IconSearch />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchOpen(false);
                router.push(`/search?q=${encodeURIComponent(q)}`);
              }
            }}
            placeholder="Search Banarasi, ivory lehenga, mehendi…"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
            aria-label="Search products"
          />
          <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <IconClose />
          </button>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {results.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.slug}`}
                onClick={() => setSearchOpen(false)}
                className="flex gap-4 py-3 hover:bg-ivory-deep/60"
              >
                <Image src={p.images[0]} alt="" width={56} height={72} className="h-16 w-12 object-cover" />
                <span>
                  <span className="block font-serif text-lg">{p.name}</span>
                  <span className="text-sm text-muted">
                    {p.designer} · {formatINR(p.availableToBuy ? p.price : p.rentalPrice)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 text-[11px] uppercase tracking-[0.18em] text-wine"
          onClick={() => {
            setSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          View all results
        </button>
      </div>
    </div>
  );
}
