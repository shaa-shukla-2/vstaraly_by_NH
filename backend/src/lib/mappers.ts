import type { Fulfillment, OrderStatus, Prisma, Product } from "@prisma/client";
import { HttpError } from "./http.js";

export type ProductDto = {
  id: string;
  slug: string;
  name: string;
  designer: string;
  description: string;
  story: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rentalPrice: number;
  deposit: number;
  availableToBuy: boolean;
  availableToRent: boolean;
  inStock: boolean;
  badges: string[];
  category: string;
  occasions: string[];
  collections: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  fabric: string;
  embroidery: string;
  fit: string;
  care: string[];
  details: string[];
  rating: number;
  reviewCount: number;
  relatedIds: string[];
  lookIds: string[];
  rentalBlockedDates: string[];
};

const productInclude = {
  designerRel: true,
  categoryRel: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  colors: true,
  sizes: true,
  collections: { include: { collection: true } },
  rentalBlocks: true,
} satisfies Prisma.ProductInclude;

export type ProductLoaded = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export const PRODUCT_INCLUDE = productInclude;

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function toProductDto(p: ProductLoaded): ProductDto {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    designer: p.designerRel.name,
    description: p.description,
    story: p.story,
    images: p.images.map((i) => i.url),
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    rentalPrice: p.rentalPrice,
    deposit: p.deposit,
    availableToBuy: p.availableToBuy,
    availableToRent: p.availableToRent,
    inStock: p.inStock,
    badges: p.badges,
    category: p.categoryRel.slug,
    occasions: p.occasions,
    collections: p.collections.map((c) => c.collection.slug),
    colors: p.colors.map((c) => ({ name: c.name, hex: c.hex })),
    sizes: p.sizes.map((s) => s.size),
    fabric: p.fabric,
    embroidery: p.embroidery,
    fit: p.fit,
    care: p.care,
    details: p.details,
    rating: p.rating,
    reviewCount: p.reviewCount,
    relatedIds: p.relatedIds,
    lookIds: p.lookIds,
    rentalBlockedDates: p.rentalBlocks.map((b) => isoDate(b.date)),
  };
}

export function publicUser(user: { id: string; name: string; email: string; role: string; phone?: string | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? null,
  };
}

export function cartKey(item: {
  productId: string;
  size: string;
  color: string;
  fulfillment: Fulfillment;
  rentalStart?: string | null;
  rentalEnd?: string | null;
}) {
  return [item.productId, item.size, item.color, item.fulfillment, item.rentalStart ?? "", item.rentalEnd ?? ""].join("|");
}

export function rentalBlocks(start: Date, end: Date, durationDays?: number) {
  const days = durationDays ?? daysBetween(start, end);
  return Math.max(1, Math.ceil(days / 4));
}

export function daysBetween(start: Date, end: Date) {
  const a = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const b = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  return Math.max(1, Math.round((b - a) / 86_400_000) + 1);
}

export function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new HttpError(400, "Dates must be YYYY-MM-DD", "VALIDATION_ERROR");
  }
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime()) || isoDate(d) !== value) throw new HttpError(400, "Invalid date", "VALIDATION_ERROR");
  return d;
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd;
}

export function eachDate(start: Date, end: Date) {
  const dates: Date[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86_400_000) {
    dates.push(new Date(t));
  }
  return dates;
}

export function orderStatusToApi(status: OrderStatus) {
  return status === "Out_for_delivery" ? "Out for delivery" : status;
}

export function orderStatusFromApi(status: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    Confirmed: "Confirmed",
    Stitched: "Stitched",
    Dispatched: "Dispatched",
    "Out for delivery": "Out_for_delivery",
    Delivered: "Delivered",
    Returned: "Returned",
    Exchanged: "Exchanged",
    Refunded: "Refunded",
  };
  const value = map[status];
  if (!value) throw new HttpError(400, "Invalid order status", "VALIDATION_ERROR");
  return value;
}

export function unitPrice(
  product: Pick<Product, "price" | "rentalPrice">,
  fulfillment: Fulfillment,
  durationDays?: number | null,
) {
  if (fulfillment === "rent") {
    return product.rentalPrice * rentalBlocks(new Date(), new Date(), durationDays ?? 4);
  }
  return product.price;
}

export function lineRentalPrice(rentalPrice: number, durationDays?: number | null) {
  return rentalPrice * Math.max(1, Math.ceil((durationDays ?? 4) / 4));
}
