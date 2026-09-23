"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { IconHeart } from "@/components/ui/Icons";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, setQuickView } = useStore();
  const wish = isWishlisted(product.id);
  const hover = product.images[1] ?? product.images[0];

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
        <Link href={`/products/${product.slug}`} className="relative block h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={hover}
            alt=""
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className="bg-paper/90 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-espresso"
            >
              {b}
            </span>
          ))}
          {!product.inStock ? (
            <span className="bg-espresso/90 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ivory">
              Made to order
            </span>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-paper/90 text-espresso"
        >
          <IconHeart filled={wish} />
        </button>
        <button
          type="button"
          onClick={() => setQuickView(product)}
          className="absolute inset-x-3 bottom-3 translate-y-2 bg-paper/95 py-2 text-[10px] uppercase tracking-[0.2em] text-espresso opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick view
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{product.designer}</p>
        <Link href={`/products/${product.slug}`} className="font-serif text-lg text-espresso">
          {product.name}
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-3 text-sm text-charcoal">
          {product.availableToBuy ? (
            <span>
              {product.compareAtPrice ? (
                <span className="mr-2 text-muted line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              ) : null}
              {formatINR(product.price)}
            </span>
          ) : (
            <span className="text-muted">Buy unavailable</span>
          )}
          {product.availableToRent ? (
            <span className="text-muted">Rent {formatINR(product.rentalPrice)}</span>
          ) : null}
        </div>
        <p className={cn("text-[11px] uppercase tracking-[0.14em]", product.inStock ? "text-muted" : "text-wine")}>
          {product.inStock ? "Available now" : "Atelier waitlist"}
        </p>
      </div>
    </article>
  );
}
