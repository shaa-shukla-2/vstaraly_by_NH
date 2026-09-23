"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { galleryImages as I } from "@/data/products";

const slides = [
  {
    image: I.goldLehenga,
    eyebrow: "The bridal atelier",
    title: "Clothes for the pheras, not the feed.",
    cta: "Explore Bridal Collection",
    href: "/bridal",
  },
  {
    image: I.orangeSaree,
    eyebrow: "Six yards",
    title: "Banarasi, organza, tissue — draped with intent.",
    cta: "Shop Sarees",
    href: "/collections/sarees",
  },
  {
    image: I.cream,
    eyebrow: "Rent · Buy · Repeat",
    title: "Couture for a long weekend.",
    cta: "Explore Rentals",
    href: "/rent",
  },
  {
    image: I.embroidered,
    eyebrow: "The calendar",
    title: "Festive colour, without the costume.",
    cta: "Shop Festive",
    href: "/collections/festive",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 3800);
    return () => window.clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-espresso"
      role="region"
      aria-label="Featured collections"
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <Image
          key={s.title}
          src={s.image}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/65 via-espresso/30 to-espresso/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/65 via-transparent to-espresso/10" />
      <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-20 md:px-8 md:pb-24">
        <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">{slide.eyebrow}</p>
        <h1 className="mt-3 max-w-xl font-serif text-4xl text-ivory md:text-6xl">{slide.title}</h1>
        <div className="mt-8">
          <Button href={slide.href} variant="gold">
            {slide.cta}
          </Button>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous slide"
          className="border border-ivory/40 px-3 py-1 text-ivory"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        >
          ←
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 w-6 ${i === index ? "bg-ivory" : "bg-ivory/35"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          className="border border-ivory/40 px-3 py-1 text-ivory"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
        >
          →
        </button>
      </div>
    </section>
  );
}
