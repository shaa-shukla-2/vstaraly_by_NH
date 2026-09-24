import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const couponsRouter = Router();

couponsRouter.post(
  "/validate",
  requireAuth,
  validate(z.object({ code: z.string().trim().min(3), subtotal: z.coerce.number().optional() })),
  asyncHandler(async (req, res) => {
    const { code, subtotal } = req.body as { code: string; subtotal?: number };
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.active) throw new HttpError(400, "That code is not active", "INVALID_COUPON");
    const discount = subtotal ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
    return ok(res, { code: coupon.code, percentOff: coupon.percentOff, scope: coupon.scope, discount });
  }),
);
