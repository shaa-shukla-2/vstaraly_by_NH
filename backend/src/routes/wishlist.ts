import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { PRODUCT_INCLUDE, toProductDto } from "../lib/mappers.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const wishlistRouter = Router();
wishlistRouter.use(requireAuth);

wishlistRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const rows = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: { include: PRODUCT_INCLUDE } },
      orderBy: { createdAt: "desc" },
    });
    return ok(res, {
      ids: rows.map((r) => r.productId),
      items: rows.map((r) => toProductDto(r.product)),
    });
  }),
);

wishlistRouter.post(
  "/",
  validate(z.object({ productId: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const { productId } = req.body as { productId: string };
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: req.user!.id, productId } },
      update: {},
      create: { userId: req.user!.id, productId },
    });
    const ids = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      select: { productId: true },
    });
    return ok(res, { ids: ids.map((i) => i.productId) });
  }),
);

wishlistRouter.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user!.id, productId: routeParam(req, "productId") },
    });
    const ids = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      select: { productId: true },
    });
    return ok(res, { ids: ids.map((i) => i.productId) });
  }),
);
