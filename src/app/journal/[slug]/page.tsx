import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/data/content";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? "Journal", description: post?.excerpt };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{post.category}</p>
      <h1 className="mt-2 font-serif text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {post.date} · {post.readTime}
      </p>
      <div className="relative mt-8 aspect-[16/9]">
        <Image src={post.image} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="mt-8 space-y-5 text-sm leading-8 text-charcoal">
        {post.body.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
    </article>
  );
}
