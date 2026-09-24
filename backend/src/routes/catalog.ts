import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { PRODUCT_INCLUDE, toProductDto } from "../lib/mappers.js";

export const catalogRouter = Router();

catalogRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return ok(
      res,
      categories.map((c) => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        productCount: c._count.products,
      })),
    );
  }),
);

catalogRouter.get(
  "/collections",
  asyncHandler(async (_req, res) => {
    const collections = await prisma.collection.findMany({ orderBy: { title: "asc" } });
    return ok(res, collections);
  }),
);

catalogRouter.get(
  "/collections/:slug",
  asyncHandler(async (req, res) => {
    const collection = await prisma.collection.findUnique({ where: { slug: routeParam(req, "slug") } });
    if (!collection) throw new HttpError(404, "Collection not found", "NOT_FOUND");
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { collections: { some: { collection: { slug: collection.slug } } } },
          { categoryRel: { slug: collection.slug } },
          { occasions: { has: collection.slug } },
        ],
      },
      include: PRODUCT_INCLUDE,
    });
    return ok(res, { collection, products: products.map(toProductDto) });
  }),
);

catalogRouter.get(
  "/designers",
  asyncHandler(async (_req, res) => {
    const designers = await prisma.designer.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return ok(
      res,
      designers.map((d) => ({
        slug: d.slug,
        name: d.name,
        bio: d.bio,
        productCount: d._count.products,
      })),
    );
  }),
);
