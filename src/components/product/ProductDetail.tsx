"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { reviewsFor } from "@/data/content";
import { getProductById } from "@/data/products";
import { PINCODE_SERVICEABLE } from "@/constants";
import { formatINR } from "@/lib/format";
import { daysBetween } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { RentalCalendar } from "@/components/product/RentalCalendar";
import { ProductCard } from "@/components/product/ProductCard";
import { IconHeart } from "@/components/ui/Icons";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted, notify } = useStore();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [mode, setMode] = useState<"buy" | "rent">(
    product.availableToBuy ? "buy" : "rent",
  );
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const related = product.relatedIds.map(getProductById).filter(Boolean);
  const looks = product.lookIds.map(getProductById).filter(Boolean);
  const duration = start && end ? daysBetween(start, end) : 4;
  const reviews = reviewsFor(product.id);

  const unit = useMemo(() => {
    if (mode === "rent") {
      const blocks = Math.max(1, Math.ceil(duration / 4));
      return product.rentalPrice * blocks;
    }
    return product.price;
  }, [mode, duration, product]);

  function add(buyNow = false) {
    if (mode === "rent" && (!start || !end)) {
      notify("Select rental dates first");
      return;
    }
    addToCart({
      productId: product.id,
      size,
      color,
      fulfillment: mode,
      quantity: 1,
      rentalStart: start,
      rentalEnd: end,
      durationDays: duration,
    });
    if (buyNow) router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <button
            type="button"
            className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-deep"
            onClick={() => setZoom(true)}
            aria-label="Zoom image"
          >
            <Image
              src={product.images[active]}
              alt={`${product.name} view ${active + 1}`}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          </button>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
              key={`${img}-${i}`}
                type="button"
                className={`relative aspect-[3/4] overflow-hidden ${i === active ? "ring-1 ring-espresso" : ""}`}
                onClick={() => setActive(i)}
              >
                <Image src={img} alt="" fill sizes="12vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{product.designer}</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{product.description}</p>
          <p className="mt-4 text-sm">
            {product.rating} · {product.reviewCount} atelier notes
          </p>

          <div className="mt-6 grid grid-cols-2 border border-line">
            <button
              type="button"
              disabled={!product.availableToBuy}
              onClick={() => setMode("buy")}
              className={`px-4 py-3 text-[11px] uppercase tracking-[0.16em] ${mode === "buy" ? "bg-espresso text-ivory" : "text-muted"}`}
            >
              Buy {product.availableToBuy ? formatINR(product.price) : "—"}
            </button>
            <button
              type="button"
              disabled={!product.availableToRent}
              onClick={() => setMode("rent")}
              className={`px-4 py-3 text-[11px] uppercase tracking-[0.16em] ${mode === "rent" ? "bg-espresso text-ivory" : "text-muted"}`}
            >
              Rent {product.availableToRent ? formatINR(product.rentalPrice) : "—"}
            </button>
          </div>
          {product.compareAtPrice && mode === "buy" ? (
            <p className="mt-2 text-sm text-muted">
              Was {formatINR(product.compareAtPrice)}
            </p>
          ) : null}

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.18em]">Colour</p>
            <div className="mt-2 flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  onClick={() => setColor(c.name)}
                  className={`h-7 w-7 rounded-full border ${color === c.name ? "border-espresso" : "border-line"}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em]">Size</p>
              <Link href="/size-guide" className="text-xs text-gold">
                Size guide
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`border px-3 py-2 text-xs ${size === s ? "border-espresso" : "border-line"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {mode === "rent" ? (
            <div className="mt-6 border border-line p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em]">Rental dates</p>
              <RentalCalendar
                blocked={product.rentalBlockedDates}
                start={start}
                end={end}
                onChange={(a, b) => {
                  setStart(a);
                  setEnd(b);
                }}
              />
              <p className="mt-3 text-sm">
                Duration {duration} days · Rental {formatINR(unit)} · Deposit {formatINR(product.deposit)}
              </p>
            </div>
          ) : null}

          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setPinMsg(
                PINCODE_SERVICEABLE.includes(pin)
                  ? "Atelier dispatch in 3–6 days. Try-on available in Delhi NCR."
                  : "We ship here, but samples live in Delhi. Allow 7–10 days.",
              );
            }}
          >
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Pincode"
              inputMode="numeric"
              className="flex-1 border border-line bg-transparent px-3 py-3 text-sm"
              aria-label="Delivery pincode"
            />
            <Button type="submit" variant="outline">
              Check
            </Button>
          </form>
          {pinMsg ? <p className="mt-2 text-sm text-muted">{pinMsg}</p> : null}

          <div className="mt-6 flex gap-2">
            <Button className="flex-1" onClick={() => add(false)} disabled={!product.inStock && mode === "buy"}>
              Add to bag
            </Button>
            <Button className="flex-1" variant="gold" onClick={() => add(true)}>
              Buy now
            </Button>
            <button
              type="button"
              className="border border-line px-4"
              aria-label="Wishlist"
              onClick={() => toggleWishlist(product.id)}
            >
              <IconHeart filled={isWishlisted(product.id)} />
            </button>
          </div>
          {!product.inStock ? (
            <p className="mt-3 text-sm text-wine">This piece is made to order. Allow three weeks.</p>
          ) : null}

          <div className="mt-10 space-y-4 border-t border-line pt-8 text-sm leading-7 text-charcoal">
            <p>{product.story}</p>
            <p>
              <strong>Fabric.</strong> {product.fabric}. {product.embroidery}.
            </p>
            <p>
              <strong>Fit.</strong> {product.fit}
            </p>
            <ul className="list-disc pl-5">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p>
              <strong>Care.</strong> {product.care.join(" · ")}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Atelier notes</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <blockquote key={r.id} className="border border-line p-5">
              <p className="font-serif text-xl">{r.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{r.body}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em]">
                {r.name}, {r.city} · {r.rating}★
              </p>
            </blockquote>
          ))}
        </div>
      </section>

      {looks.length ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Complete the look</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {looks.map((p) => (p ? <ProductCard key={p.id} product={p} /> : null))}
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className="font-serif text-3xl">You may also consider</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (p ? <ProductCard key={p.id} product={p} /> : null))}
        </div>
      </section>

      {zoom ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-espresso/80 p-6"
          role="dialog"
          aria-label="Zoomed image"
          onClick={() => setZoom(false)}
        >
          <div className="relative h-[80vh] w-full max-w-3xl">
            <Image src={product.images[active]} alt={product.name} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
