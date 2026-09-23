import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/data/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Vastralay by NH editorial — ivory, Banarasi, and a case for renting the reception lehenga.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Journal</p>
      <h1 className="mt-2 font-serif text-4xl">Notes from the atelier</h1>
      <div className="mt-10 grid gap-10">
        {posts.map((post) => (
          <Link key={post.slug} href={`/journal/${post.slug}`} className="grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[4/3]">
              <Image src={post.image} alt="" fill sizes="(min-width:768px) 280px, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{post.category}</p>
              <h2 className="mt-2 font-serif text-3xl">{post.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted">
                {post.date} · {post.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
