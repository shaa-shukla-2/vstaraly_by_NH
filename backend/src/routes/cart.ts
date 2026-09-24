import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { cartKey, isoDate, lineRentalPrice, parseIsoDate } from "../lib/mappers.js";
import { assertRentalAvailable } from "../lib/rental.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const cartRouter = Router();
cartRouter.use(requireAuth);

const itemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
  fulfillment: z.enum(["buy", "rent"]),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  rentalStart: z.string().optional(),
  rentalEnd: z.string().optional(),
  durationDays: z.coerce.number().int().min(1).optional(),
});

function toCartItem(row: {
  key: string;
  productId: string;
  size: string;
  color: string;
  fulfillment: "buy" | "rent";
  quantity: number;
  rentalStart: Date | null;
  rentalEnd: Date | null;
  durationDays: number | null;
}) {
  return {
    key: row.key,
    productId: row.productId,
    size: row.size,
    color: row.color,
    fulfillment: row.fulfillment,
    quantity: row.quantity,
    rentalStart: row.rentalStart ? isoDate(row.rentalStart) : undefined,
    rentalEnd: row.rentalEnd ? isoDate(row.rentalEnd) : undefined,
    durationDays: row.durationDays ?? undefined,
  };
}

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = await prisma.cartItem.findMany({ where: { userId: req.user!.id } });
    return ok(res, { items: items.map(toCartItem) });
  }),
);

cartRouter.post(
  "/",
  validate(itemSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof itemSchema>;
    const product = await prisma.product.findUnique({
      where: { id: body.productId },
      include: { sizes: true, colors: true },
    });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    if (!product.sizes.some((option) => option.size === body.size)) {
      throw new HttpError(400, "Choose a valid size", "INVALID_VARIANT");
    }
    if (!product.colors.some((option) => option.name === body.color)) {
      throw new HttpError(400, "Choose a valid color", "INVALID_VARIANT");
    }
    if (body.fulfillment === "buy" && !product.availableToBuy) {
      throw new HttpError(400, "This piece is not for sale", "UNAVAILABLE");
    }
    if (body.fulfillment === "buy" && !product.inStock) {
      throw new HttpError(400, "This piece is currently unavailable", "UNAVAILABLE");
    }
    if (body.fulfillment === "rent") {
      if (!product.availableToRent) throw new HttpError(400, "This piece is not available to rent", "UNAVAILABLE");
      if (!body.rentalStart || !body.rentalEnd) {
        throw new HttpError(400, "Select rental dates first", "VALIDATION_ERROR");
      }
      await assertRentalAvailable(product.id, body.rentalStart, body.rentalEnd);
    } else if (body.rentalStart || body.rentalEnd) {
      throw new HttpError(400, "Rental dates are only valid for rental items", "VALIDATION_ERROR");
    }
    const key = cartKey(body);
    const existing = await prisma.cartItem.findUnique({
      where: { userId_key: { userId: req.user!.id, key } },
    });
    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: Math.min(10, existing.quantity + body.quantity) },
        })
      : await prisma.cartItem.create({
          data: {
            userId: req.user!.id,
            key,
            productId: product.id,
            size: body.size,
            color: body.color,
            fulfillment: body.fulfillment,
            quantity: body.quantity,
            rentalStart: body.rentalStart ? parseIsoDate(body.rentalStart) : null,
            rentalEnd: body.rentalEnd ? parseIsoDate(body.rentalEnd) : null,
            durationDays: body.durationDays,
          },
        });
    return ok(res, { item: toCartItem(item) }, existing ? 200 : 201);
  }),
);

cartRouter.patch(
  "/:key",
  validate(z.object({ quantity: z.coerce.number().int().min(0).max(10) })),
  asyncHandler(async (req, res) => {
    const existing = await prisma.cartItem.findUnique({
      where: { userId_key: { userId: req.user!.id, key: routeParam(req, "key") } },
    });
    if (!existing) throw new HttpError(404, "Cart item not found", "NOT_FOUND");
    const quantity = (req.body as { quantity: number }).quantity;
    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: existing.id } });
      return ok(res, { deleted: true });
    }
    const item = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } });
    return ok(res, { item: toCartItem(item) });
  }),
);

cartRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    const existing = await prisma.cartItem.findUnique({
      where: { userId_key: { userId: req.user!.id, key: routeParam(req, "key") } },
    });
    if (!existing) throw new HttpError(404, "Cart item not found", "NOT_FOUND");
    await prisma.cartItem.delete({ where: { id: existing.id } });
    return ok(res, { deleted: true });
  }),
);

cartRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });
    return ok(res, { cleared: true });
  }),
);

export { lineRentalPrice };
