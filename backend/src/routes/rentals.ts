import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { isoDate } from "../lib/mappers.js";
import { assertRentalAvailable, blockedDatesForProduct } from "../lib/rental.js";
import { optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const rentalsRouter = Router();

rentalsRouter.get(
  "/availability/:productId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: routeParam(req, "productId") }, { slug: routeParam(req, "productId") }] },
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

rentalsRouter.post(
  "/check",
  optionalAuth,
  validate(
    z.object({
      productId: z.string(),
      rentalStart: z.string(),
      rentalEnd: z.string(),
    }),
  ),
  asyncHandler(async (req, res) => {
    const { productId, rentalStart, rentalEnd } = req.body as {
      productId: string;
      rentalStart: string;
      rentalEnd: string;
    };
    const { durationDays } = await assertRentalAvailable(productId, rentalStart, rentalEnd);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    return ok(res, {
      available: true,
      durationDays,
      rentalPrice: product ? product.rentalPrice * Math.max(1, Math.ceil(durationDays / 4)) : 0,
      deposit: product?.deposit ?? 0,
      start: rentalStart,
      end: rentalEnd,
    });
  }),
);

rentalsRouter.get(
  "/calendar/:productId",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: routeParam(req, "productId") }, { slug: routeParam(req, "productId") }] },
    });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    const blockedDates = await blockedDatesForProduct(product.id);
    return ok(res, { productId: product.id, monthHint: isoDate(new Date()).slice(0, 7), blockedDates });
  }),
);
