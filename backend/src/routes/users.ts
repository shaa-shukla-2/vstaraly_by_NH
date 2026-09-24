import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { publicUser } from "../lib/mappers.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const usersRouter = Router();

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(8).max(20).nullable().optional(),
});

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  isDefault: z.boolean().optional(),
});

usersRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return ok(res, { user: publicUser(req.user!), addresses });
  }),
);

usersRouter.patch(
  "/me",
  requireAuth,
  validate(profileSchema),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
    });
    req.user = { ...req.user!, name: user.name, phone: user.phone };
    return ok(res, { user: publicUser(user) });
  }),
);

usersRouter.get(
  "/me/addresses",
  requireAuth,
  asyncHandler(async (req, res) => {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return ok(res, { addresses });
  }),
);

usersRouter.post(
  "/me/addresses",
  requireAuth,
  validate(addressSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof addressSchema>;
    if (body.isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({ data: { ...body, userId: req.user!.id } });
    return ok(res, { address }, 201);
  }),
);

usersRouter.patch(
  "/me/addresses/:id",
  requireAuth,
  validate(addressSchema.partial()),
  asyncHandler(async (req, res) => {
    const existing = await prisma.address.findFirst({
      where: { id: routeParam(req, "id"), userId: req.user!.id },
    });
    if (!existing) throw new HttpError(404, "Address not found", "NOT_FOUND");
    const body = req.body as z.infer<typeof addressSchema>;
    if (body.isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.update({ where: { id: existing.id }, data: body });
    return ok(res, { address });
  }),
);

usersRouter.delete(
  "/me/addresses/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.address.findFirst({
      where: { id: routeParam(req, "id"), userId: req.user!.id },
    });
    if (!existing) throw new HttpError(404, "Address not found", "NOT_FOUND");
    await prisma.address.delete({ where: { id: existing.id } });
    return ok(res, { deleted: true });
  }),
);
