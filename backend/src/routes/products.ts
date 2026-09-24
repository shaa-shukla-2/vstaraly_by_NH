import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { PRODUCT_INCLUDE, toProductDto } from "../lib/mappers.js";
import { blockedDatesForProduct } from "../lib/rental.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const productsRouter = Router();

const listSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  designer: z.string().optional(),
  occasion: z.string().optional(),
  fulfillment: z.enum(["buy", "rent", "all"]).optional(),
  size: z.string().optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "new"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(24),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
});

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().min(8).max(2000),
  city: z.string().trim().min(2).max(80).optional(),
});

productsRouter.get(
  "/",
  validate(listSchema, "query"),
  asyncHandler(async (req, res) => {
    const q = req.query as unknown as z.infer<typeof listSchema>;
    const where: Prisma.ProductWhereInput = {};
    const and: Prisma.ProductWhereInput[] = [];

    if (q.q) {
      const term = q.q.trim();
      and.push({
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { fabric: { contains: term, mode: "insensitive" } },
          { designerRel: { name: { contains: term, mode: "insensitive" } } },
          { occasions: { has: term.toLowerCase() } },
        ],
      });
    }
    if (q.category) and.push({ categoryRel: { slug: q.category } });
    if (q.designer) {
      and.push({
        OR: [{ designerRel: { slug: q.designer } }, { designerRel: { name: { equals: q.designer, mode: "insensitive" } } }],
      });
    }
    if (q.occasion) and.push({ occasions: { has: q.occasion } });
    if (q.collection) {
      const slug = q.collection;
      if (slug === "new-arrivals") {
        and.push({ OR: [{ badges: { has: "New" } }, { collections: { some: { collection: { slug } } } }] });
      } else if (slug === "sale") {
        and.push({ OR: [{ compareAtPrice: { not: null } }, { collections: { some: { collection: { slug } } } }] });
      } else if (slug === "best-sellers") {
        and.push({ OR: [{ badges: { has: "Bestseller" } }, { collections: { some: { collection: { slug } } } }] });
      } else if (slug === "rent") {
        and.push({ availableToRent: true });
      } else {
        and.push({
          OR: [
            { collections: { some: { collection: { slug } } } },
            { categoryRel: { slug } },
            { occasions: { has: slug } },
          ],
        });
      }
    }
    if (q.fulfillment === "buy") and.push({ availableToBuy: true });
    if (q.fulfillment === "rent") and.push({ availableToRent: true });
    if (q.size) and.push({ sizes: { some: { size: q.size } } });
    if (q.minPrice !== undefined) and.push({ price: { gte: q.minPrice } });
    if (q.maxPrice !== undefined) and.push({ price: { lte: q.maxPrice } });
    if (and.length) where.AND = and;

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      q.sort === "price-asc"
        ? [{ price: "asc" }]
        : q.sort === "price-desc"
          ? [{ price: "desc" }]
          : q.sort === "new"
            ? [{ createdAt: "desc" }]
            : [{ rating: "desc" }, { reviewCount: "desc" }];

    const skip = (q.page - 1) * q.limit;
    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy,
        skip,
        take: q.limit,
      }),
    ]);

    return ok(res, {
      items: rows.map(toProductDto),
      page: q.page,
      limit: q.limit,
      total,
      pages: Math.ceil(total / q.limit),
    });
  }),
);

productsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const row = await prisma.product.findFirst({
      where: { OR: [{ slug: routeParam(req, "slug") }, { id: routeParam(req, "slug") }] },
      include: PRODUCT_INCLUDE,
    });
    if (!row) throw new HttpError(404, "Product not found", "NOT_FOUND");
    const dto = toProductDto(row);
    dto.rentalBlockedDates = await blockedDatesForProduct(row.id);
    return ok(res, { product: dto });
  }),
);

productsRouter.get(
  "/:id/reviews",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: routeParam(req, "id") }, { slug: routeParam(req, "id") }] },
    });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { date: "desc" },
    });
    return ok(
      res,
      reviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        name: r.name,
        city: r.city,
        rating: r.rating,
        title: r.title,
        body: r.body,
        date: r.date.toISOString().slice(0, 10),
      })),
    );
  }),
);

productsRouter.post(
  "/:id/reviews",
  requireAuth,
  validate(reviewSchema),
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: routeParam(req, "id") }, { slug: routeParam(req, "id") }] },
    });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    const body = req.body as z.infer<typeof reviewSchema>;
    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: req.user!.id,
        name: req.user!.name,
        city: body.city ?? "India",
        rating: body.rating,
        title: body.title,
        body: body.body,
      },
    });
    const agg = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: product.id },
      data: { rating: Number(agg._avg.rating?.toFixed(1) ?? 0), reviewCount: agg._count },
    });
    return ok(
      res,
      {
        id: review.id,
        productId: review.productId,
        name: review.name,
        city: review.city,
        rating: review.rating,
        title: review.title,
        body: review.body,
        date: review.date.toISOString().slice(0, 10),
      },
      201,
    );
  }),
);

productsRouter.get(
  "/:id/rental-availability",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: routeParam(req, "id") }, { slug: routeParam(req, "id") }] },
    });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    const blockedDates = await blockedDatesForProduct(product.id);
    return ok(res, {
      productId: product.id,
      availableToRent: product.availableToRent,
      rentalPrice: product.rentalPrice,
      deposit: product.deposit,
      blockedDates,
    });
  }),
);
