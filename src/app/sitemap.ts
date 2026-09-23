import type { MetadataRoute } from "next";
import { collections, products } from "@/data/products";
import { posts } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/bridal",
    "/rent",
    "/lookbook",
    "/journal",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/refund-policy",
    "/privacy",
    "/terms",
    "/rental-policy",
    "/cancellation",
    "/size-guide",
    "/how-renting-works",
    "/search",
    "/wishlist",
    "/cart",
    "/login",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `https://vastralaybynh.example${path || "/"}`,
      lastModified: new Date(),
    })),
    ...collections.map((c) => ({
      url: `https://vastralaybynh.example/collections/${c.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((p) => ({
      url: `https://vastralaybynh.example/products/${p.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((p) => ({
      url: `https://vastralaybynh.example/journal/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
