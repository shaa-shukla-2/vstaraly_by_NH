import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { collections, getCollection, productsForCollection } from "@/data/products";
import { Catalog } from "@/components/product/Catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return {
    title: c?.title ?? "Collection",
    description: c?.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const list = productsForCollection(slug);

  return (
    <>
      <section className="relative h-[42vh] min-h-[280px]">
        <Image src={c.hero} alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-espresso/40" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-10 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">{c.eyebrow}</p>
          <h1 className="mt-2 font-serif text-5xl text-ivory">{c.title}</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory/85">{c.description}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Catalog products={list} />
      </div>
    </>
  );
}
