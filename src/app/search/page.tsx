import type { Metadata } from "next";
import { searchProducts } from "@/data/products";
import { Catalog } from "@/components/product/Catalog";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Vastralay by NH sarees, lehengas and rental pieces.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const list = q ? searchProducts(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Search</p>
      <h1 className="mt-2 font-serif text-4xl">
        {q ? `Results for “${q}”` : "What are you looking for?"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Try Banarasi, ivory, mehendi, velvet, or a designer name.
      </p>
      <div className="mt-10">
        {q && !list.length ? (
          <p className="border border-line px-6 py-16 text-center">
            No pieces matched. The rail is still full — try a broader word.
          </p>
        ) : (
          <Catalog products={list} />
        )}
      </div>
    </div>
  );
}
