import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/http.js";
import { verifyAccessToken } from "../lib/tokens.js";

export type AuthUser = { id: string; email: string; name: string; role: "USER" | "ADMIN"; phone: string | null };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    await attachUser(req);
  } catch {
    /* guest */
  }
  next();
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    await attachUser(req);
    if (!req.user) throw new HttpError(401, "Authentication required", "UNAUTHORIZED");
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, "Authentication required", "UNAUTHORIZED"));
  if (req.user.role !== "ADMIN") return next(new HttpError(403, "Admin access required", "FORBIDDEN"));
  next();
}

async function attachUser(req: Request) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return;
  const payload = verifyAccessToken(token);
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, phone: true },
  });
  if (!user) throw new HttpError(401, "Invalid session", "UNAUTHORIZED");
  req.user = user;
}
