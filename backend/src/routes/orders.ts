import { Router } from "express";
import { randomToken } from "../lib/tokens.js";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok, routeParam } from "../lib/http.js";
import { isoDate, lineRentalPrice, orderStatusToApi, parseIsoDate } from "../lib/mappers.js";
import { assertRentalAvailable } from "../lib/rental.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const ordersRouter = Router();

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z.string().trim().regex(/^\d{6}$/),
});

const checkoutSchema = z.object({
  address: addressSchema,
  coupon: z.string().trim().optional(),
  paymentMethod: z.enum(["card", "upi", "netbanking"]).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        size: z.string(),
        color: z.string(),
        fulfillment: z.enum(["buy", "rent"]),
        quantity: z.coerce.number().int().min(1),
        rentalStart: z.string().optional(),
        rentalEnd: z.string().optional(),
        durationDays: z.coerce.number().int().min(1).optional(),
      }),
    )
    .optional(),
});

function mapOrder(order: {
  id: string;
  placedOn: Date;
  status: Parameters<typeof orderStatusToApi>[0];
  fulfillment: "buy" | "rent";
  items: {
    productId: string;
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  } | null;
  subtotal: number;
  shipping: number;
  total: number;
  trackingId: string;
  timeline: { label: string; date: string; done: boolean }[];
}) {
  return {
    id: order.id,
    placedOn: isoDate(order.placedOn),
    status: orderStatusToApi(order.status),
    fulfillment: order.fulfillment,
    items: order.items,
    address: order.address,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    trackingId: order.trackingId,
    timeline: order.timeline,
  };
}

const orderInclude = {
  items: true,
  address: true,
  timeline: { orderBy: { sortOrder: "asc" as const } },
};

ordersRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: orderInclude,
      orderBy: { placedOn: "desc" },
    });
    return ok(res, { orders: orders.map(mapOrder) });
  }),
);

ordersRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: {
        id: routeParam(req, "id"),
        ...(req.user!.role === "ADMIN" ? {} : { userId: req.user!.id }),
      },
      include: orderInclude,
    });
    if (!order) throw new HttpError(404, "Order not found", "NOT_FOUND");
    return ok(res, { order: mapOrder(order) });
  }),
);

ordersRouter.get(
  "/:id/track",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: {
        id: routeParam(req, "id"),
        ...(req.user!.role === "ADMIN" ? {} : { userId: req.user!.id }),
      },
      include: { timeline: { orderBy: { sortOrder: "asc" } } },
    });
    if (!order) throw new HttpError(404, "Order not found", "NOT_FOUND");
    return ok(res, {
      id: order.id,
      status: orderStatusToApi(order.status),
      trackingId: order.trackingId,
      timeline: order.timeline,
    });
  }),
);

ordersRouter.post(
  "/",
  requireAuth,
  validate(checkoutSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof checkoutSchema>;
    const cartRows =
      body.items && body.items.length
        ? body.items
        : (await prisma.cartItem.findMany({ where: { userId: req.user!.id } })).map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            fulfillment: i.fulfillment,
            quantity: i.quantity,
            rentalStart: i.rentalStart ? isoDate(i.rentalStart) : undefined,
            rentalEnd: i.rentalEnd ? isoDate(i.rentalEnd) : undefined,
            durationDays: i.durationDays ?? undefined,
          }));
    if (!cartRows.length) throw new HttpError(400, "Cart is empty", "EMPTY_CART");

    let subtotal = 0;
    let deposit = 0;
    let buySubtotal = 0;
    const prepared: {
      productId: string;
      name: string;
      image: string;
      size: string;
      color: string;
      quantity: number;
      price: number;
      fulfillment: "buy" | "rent";
      rentalStart: Date | null;
      rentalEnd: Date | null;
      durationDays: number | null;
      deposit: number;
    }[] = [];

    for (const row of cartRows) {
      const product = await prisma.product.findUnique({
        where: { id: row.productId },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, sizes: true },
      });
        if (!product) throw new HttpError(400, `Unknown product ${row.productId}`, "NOT_FOUND");
      if (!product.sizes.some((option) => option.size === row.size)) {
        throw new HttpError(400, `Invalid size for ${product.name}`, "INVALID_VARIANT");
      }
      const selectedColor = await prisma.productColor.findUnique({
        where: { productId_name: { productId: product.id, name: row.color } },
      });
      if (!selectedColor) throw new HttpError(400, `Invalid color for ${product.name}`, "INVALID_VARIANT");
      if (row.fulfillment === "rent") {
        if (!row.rentalStart || !row.rentalEnd) {
          throw new HttpError(400, "Rental dates are required", "VALIDATION_ERROR");
        }
        const { start, end, durationDays } = await assertRentalAvailable(
          product.id,
          row.rentalStart,
          row.rentalEnd,
        );
        const unit = lineRentalPrice(product.rentalPrice, durationDays);
        subtotal += unit * row.quantity;
        deposit += product.deposit * row.quantity;
        prepared.push({
          productId: product.id,
          name: product.name,
          image: product.images[0]?.url ?? "",
          size: row.size,
          color: row.color,
          quantity: row.quantity,
          price: unit,
          fulfillment: "rent",
          rentalStart: start,
          rentalEnd: end,
          durationDays,
          deposit: product.deposit,
        });
      } else {
        if (!product.availableToBuy) throw new HttpError(400, `${product.name} is not for sale`, "UNAVAILABLE");
        if (!product.inStock) throw new HttpError(400, `${product.name} is currently made to order only`, "UNAVAILABLE");
        if (row.rentalStart || row.rentalEnd) throw new HttpError(400, "Rental dates are only valid for rental items", "VALIDATION_ERROR");
        subtotal += product.price * row.quantity;
        buySubtotal += product.price * row.quantity;
        prepared.push({
          productId: product.id,
          name: product.name,
          image: product.images[0]?.url ?? "",
          size: row.size,
          color: row.color,
          quantity: row.quantity,
          price: product.price,
          fulfillment: "buy",
          rentalStart: null,
          rentalEnd: null,
          durationDays: null,
          deposit: 0,
        });
      }
    }

    let discount = 0;
    let couponCode: string | undefined;
    if (body.coupon) {
      const coupon = await prisma.coupon.findUnique({ where: { code: body.coupon.trim().toUpperCase() } });
      if (!coupon || !coupon.active) throw new HttpError(400, "That code is not active", "INVALID_COUPON");
      const base = coupon.scope === "BUY" ? buySubtotal : subtotal;
      discount = Math.round((base * coupon.percentOff) / 100);
      couponCode = coupon.code;
    }

    const shipping = 0;
    const total = subtotal - discount + deposit + shipping;
    const hasRent = prepared.some((p) => p.fulfillment === "rent");
    const fulfillment = hasRent && !prepared.some((p) => p.fulfillment === "buy") ? "rent" : hasRent ? "rent" : "buy";

    const id = `LY-${randomToken(5).toUpperCase()}`;
    const trackingId = `DELX-${randomToken(6).toUpperCase()}`;
    const today = new Date();
    const dateLabel = today.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          id,
          userId: req.user!.id,
          status: "Confirmed",
          fulfillment,
          subtotal,
          discount,
          shipping,
          deposit,
          total,
          trackingId,
          couponCode,
          paymentMethod: body.paymentMethod ?? "placeholder",
          paymentStatus: "placeholder_unpaid",
          items: { create: prepared },
          address: { create: body.address },
          timeline: {
            create: [
              { label: "Confirmed", date: dateLabel, done: true, sortOrder: 0 },
              { label: "Packed at atelier", date: "", done: false, sortOrder: 1 },
              { label: "Dispatched", date: "", done: false, sortOrder: 2 },
              { label: "Delivered", date: "", done: false, sortOrder: 3 },
            ],
          },
        },
        include: orderInclude,
      });
      for (const item of prepared) {
        if (item.fulfillment === "rent" && item.rentalStart && item.rentalEnd) {
          // Serialize bookings for the same piece so simultaneous checkouts cannot overlap.
          await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${item.productId}))`;
          const [overlap, blocked] = await Promise.all([
            tx.rentalReservation.findFirst({
              where: {
                productId: item.productId,
                status: "ACTIVE",
                startDate: { lte: item.rentalEnd },
                endDate: { gte: item.rentalStart },
              },
              select: { id: true },
            }),
            tx.rentalBlock.findFirst({
              where: { productId: item.productId, date: { gte: item.rentalStart, lte: item.rentalEnd } },
              select: { id: true },
            }),
          ]);
          if (overlap || blocked) throw new HttpError(409, "Those rental dates are no longer available", "RENTAL_CONFLICT");
          await tx.rentalReservation.create({
            data: {
              productId: item.productId,
              orderId: created.id,
              startDate: item.rentalStart,
              endDate: item.rentalEnd,
              status: "ACTIVE",
            },
          });
        }
      }
      await tx.cartItem.deleteMany({ where: { userId: req.user!.id } });
      return created;
    });

    return ok(res, { order: mapOrder(order), payment: { provider: "placeholder", status: "not_charged" } }, 201);
  }),
);
