import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { orderStatusFromApi, orderStatusToApi, PRODUCT_INCLUDE, publicUser, toProductDto } from "../lib/mappers.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const [users, products, orders, revenue, openOrders] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ where: { paymentStatus: "paid" }, _sum: { total: true } }),
      prisma.order.count({ where: { status: { notIn: ["Delivered", "Returned", "Refunded", "Exchanged"] } } }),
    ]);
    return ok(res, { users, products, orders, openOrders, paidRevenue: revenue._sum.total ?? 0 });
  }),
);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
    return ok(res, { users: users.map(publicUser) });
  }),
);

adminRouter.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const orders = await prisma.order.findMany({
      include: { items: true, address: true, user: { select: { email: true, name: true } } },
      orderBy: { placedOn: "desc" },
    });
    return ok(
      res,
      orders.map((o) => ({
        id: o.id,
        email: o.user.email,
        name: o.user.name,
        status: orderStatusToApi(o.status),
        total: o.total,
        fulfillment: o.fulfillment,
        trackingId: o.trackingId,
      })),
    );
  }),
);

adminRouter.patch(
  "/orders/:id",
  validate(
    z.object({
      status: z.string(),
      timelineLabel: z.string().optional(),
    }),
  ),
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({ where: { id: routeParam(req, "id") } });
    if (!order) throw new HttpError(404, "Order not found", "NOT_FOUND");
    const status = orderStatusFromApi((req.body as { status: string }).status);
    const labels = ["Confirmed", "Packed at atelier", "Dispatched", "Out for delivery", "Delivered"];
    const statusLabel = orderStatusToApi(status);
    const statusIndex = Math.max(0, labels.indexOf(statusLabel));
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.order.update({ where: { id: order.id }, data: { status } });
      const events = await tx.orderEvent.findMany({ where: { orderId: order.id }, orderBy: { sortOrder: "asc" } });
      const eventForStatus = events.find((event) => event.label === statusLabel);
      if (eventForStatus) {
        await Promise.all(events.map((event) => {
          const eventIndex = labels.indexOf(event.label);
          return tx.orderEvent.update({
            where: { id: event.id },
            data: { done: eventIndex >= 0 && eventIndex <= statusIndex },
          });
        }));
        await tx.orderEvent.update({ where: { id: eventForStatus.id }, data: { date: today, done: true } });
      } else {
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            label: (req.body as { timelineLabel?: string }).timelineLabel ?? statusLabel,
            date: today,
            done: true,
            sortOrder: events.length,
          },
        });
      }
      if (status === "Returned" || status === "Refunded" || status === "Exchanged") {
        await tx.rentalReservation.updateMany({ where: { orderId: order.id, status: "ACTIVE" }, data: { status: "COMPLETED" } });
      }
      return result;
    });
    return ok(res, { id: updated.id, status: orderStatusToApi(updated.status) });
  }),
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = routeParam(req, "id");
    const product = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true, reservations: true, cartItems: true } } },
    });
    if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
    if (product._count.orderItems || product._count.reservations || product._count.cartItems) {
      throw new HttpError(409, "Product has cart, order, or rental history and cannot be deleted", "PRODUCT_IN_USE");
    }
    await prisma.product.delete({ where: { id } });
    return ok(res, { deleted: true });
  }),
);

adminRouter.post(
  "/products",
  validate(
    z.object({
      id: z.string().min(2),
      slug: z.string().min(2),
      name: z.string().min(2),
      designer: z.string().min(2),
      description: z.string().min(8),
      story: z.string().min(8),
      images: z.array(z.string().url()).min(1),
      price: z.coerce.number().int().min(0),
      compareAtPrice: z.coerce.number().int().optional(),
      rentalPrice: z.coerce.number().int().min(0),
      deposit: z.coerce.number().int().min(0),
      availableToBuy: z.boolean().default(true),
      availableToRent: z.boolean().default(true),
      inStock: z.boolean().default(true),
      badges: z.array(z.enum(["New", "Bestseller", "Sale", "Limited", "Rent"])).default([]),
      category: z.string(),
      occasions: z.array(z.string()).default([]),
      collections: z.array(z.string()).default([]),
      colors: z.array(z.object({ name: z.string(), hex: z.string() })).min(1),
      sizes: z.array(z.string()).min(1),
      fabric: z.string(),
      embroidery: z.string(),
      fit: z.string(),
      care: z.array(z.string()).default([]),
      details: z.array(z.string()).default([]),
    }),
  ),
  asyncHandler(async (req, res) => {
    const b = req.body as {
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
      badges: ("New" | "Bestseller" | "Sale" | "Limited" | "Rent")[];
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
    };
    const designer = await prisma.designer.upsert({
      where: { name: b.designer },
      update: {},
      create: { name: b.designer, slug: b.designer.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
    const category = await prisma.category.findUnique({ where: { slug: b.category } });
    if (!category) throw new HttpError(400, "Unknown category", "VALIDATION_ERROR");
    const created = await prisma.product.create({
      data: {
        id: b.id,
        slug: b.slug,
        name: b.name,
        designerId: designer.id,
        description: b.description,
        story: b.story,
        price: b.price,
        compareAtPrice: b.compareAtPrice,
        rentalPrice: b.rentalPrice,
        deposit: b.deposit,
        availableToBuy: b.availableToBuy,
        availableToRent: b.availableToRent,
        inStock: b.inStock,
        badges: b.badges,
        categoryId: category.id,
        occasions: b.occasions,
        fabric: b.fabric,
        embroidery: b.embroidery,
        fit: b.fit,
        care: b.care,
        details: b.details,
        images: { create: b.images.map((url, i) => ({ url, sortOrder: i })) },
        colors: { create: b.colors },
        sizes: { create: b.sizes.map((size) => ({ size })) },
        collections: {
          create: (
            await prisma.collection.findMany({ where: { slug: { in: b.collections } } })
          ).map((c) => ({ collectionId: c.id })),
        },
      },
      include: PRODUCT_INCLUDE,
    });
    return ok(res, { product: toProductDto(created) }, 201);
  }),
);

adminRouter.patch(
  "/products/:id",
  validate(z.object({
    name: z.string().trim().min(2).max(160).optional(),
    price: z.coerce.number().int().min(0).optional(),
    compareAtPrice: z.coerce.number().int().min(0).nullable().optional(),
    rentalPrice: z.coerce.number().int().min(0).optional(),
    deposit: z.coerce.number().int().min(0).optional(),
    availableToBuy: z.boolean().optional(),
    availableToRent: z.boolean().optional(),
    inStock: z.boolean().optional(),
  }).refine((value) => Object.keys(value).length > 0, "At least one field is required")),
  asyncHandler(async (req, res) => {
    const id = routeParam(req, "id");
    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) throw new HttpError(404, "Product not found", "NOT_FOUND");
    const product = await prisma.product.update({ where: { id }, data: req.body });
    return ok(res, { product: { id: product.id, slug: product.slug, name: product.name, price: product.price, rentalPrice: product.rentalPrice, availableToBuy: product.availableToBuy, availableToRent: product.availableToRent, inStock: product.inStock } });
  }),
);

adminRouter.get(
  "/coupons",
  asyncHandler(async (_req, res) => ok(res, { coupons: await prisma.coupon.findMany({ orderBy: { code: "asc" } }) })),
);

const couponSchema = z.object({
  code: z.string().trim().min(3).max(40).transform((code) => code.toUpperCase()),
  percentOff: z.coerce.number().int().min(1).max(100),
  scope: z.enum(["ALL", "BUY"]).default("BUY"),
  active: z.boolean().default(true),
  description: z.string().trim().max(200).nullable().optional(),
});

adminRouter.post(
  "/coupons",
  validate(couponSchema),
  asyncHandler(async (req, res) => {
    const coupon = await prisma.coupon.create({ data: req.body });
    return ok(res, { coupon }, 201);
  }),
);

adminRouter.patch(
  "/coupons/:code",
  validate(couponSchema.partial().omit({ code: true })),
  asyncHandler(async (req, res) => {
    const code = routeParam(req, "code").toUpperCase();
    const result = await prisma.coupon.updateMany({ where: { code }, data: req.body });
    if (!result.count) throw new HttpError(404, "Coupon not found", "NOT_FOUND");
    return ok(res, { coupon: await prisma.coupon.findUnique({ where: { code } }) });
  }),
);

adminRouter.delete(
  "/coupons/:code",
  asyncHandler(async (req, res) => {
    const result = await prisma.coupon.deleteMany({ where: { code: routeParam(req, "code").toUpperCase() } });
    if (!result.count) throw new HttpError(404, "Coupon not found", "NOT_FOUND");
    return ok(res, { deleted: true });
  }),
);
