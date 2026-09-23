import type { Metadata } from "next";
import Image from "next/image";
import { lookbookShots } from "@/data/content";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Vastralay by NH lookbook — atelier and wedding-week photographs.",
};

export default function LookbookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Lookbook</p>
      <h1 className="mt-2 font-serif text-4xl">How the clothes sit in a room</h1>
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {lookbookShots.map((shot) => (
          <figure key={shot.caption} className="mb-4 break-inside-avoid">
            <div className="relative aspect-[3/4]">
              <Image src={shot.src} alt={shot.caption} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
