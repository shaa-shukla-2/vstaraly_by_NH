import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productsForCollection } from "@/data/products";

export function EditorialLanding({
  eyebrow,
  title,
  lead,
  image,
  href,
  cta,
  collection,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  href: string;
  cta: string;
  collection: string;
}) {
  const list = productsForCollection(collection).slice(0, 8);
  return (
    <>
      <section className="relative h-[56vh] min-h-[360px]">
        <Image src={image} alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-espresso/45" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-12 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">{eyebrow}</p>
          <h1 className="mt-2 max-w-2xl font-serif text-5xl text-ivory md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-ivory/85">{lead}</p>
          <div className="mt-8">
            <Button href={href} variant="gold">
              {cta}
            </Button>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <ProductGrid products={list} />
      </div>
    </>
  );
}
