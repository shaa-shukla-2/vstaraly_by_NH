import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { productsRouter } from "./routes/products.js";
import { catalogRouter } from "./routes/catalog.js";
import { cartRouter } from "./routes/cart.js";
import { wishlistRouter } from "./routes/wishlist.js";
import { ordersRouter } from "./routes/orders.js";
import { couponsRouter } from "./routes/coupons.js";
import { rentalsRouter } from "./routes/rentals.js";
import { adminRouter } from "./routes/admin.js";
import { fail, ok } from "./lib/http.js";
import { prisma } from "./lib/prisma.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: "Too many auth attempts", code: "RATE_LIMIT" } },
  });

  app.get("/api/health", async (_req, res, next) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return ok(res, { ok: true, database: "connected", service: "vastralay-api" });
    } catch (error) {
      return next(error);
    }
  });

  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/account", usersRouter);
  app.use("/api", catalogRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/coupons", couponsRouter);
  app.use("/api/rentals", rentalsRouter);
  app.use("/api/admin", adminRouter);

  app.use((_req, res) => fail(res, 404, "Route not found", "NOT_FOUND"));
  app.use(errorHandler);
  return app;
}
