import { Router } from "express";
import { z } from "zod";
import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, ok } from "../lib/http.js";
import { env, isProd } from "../config/env.js";
import { publicUser } from "../lib/mappers.js";
import {
  hashPassword,
  hashToken,
  parseDurationToDate,
  randomToken,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../lib/tokens.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(72),
  phone: z.string().trim().min(8).max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});

const forgotSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(72),
});

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", { path: "/api/auth" });
}

async function issueTokens(user: { id: string; role: string; name: string; email: string; phone?: string | null }) {
  const jti = randomToken(16);
  const refreshToken = signRefreshToken(user.id, jti);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: parseDurationToDate(env.JWT_REFRESH_EXPIRES_IN),
    },
  });
  return {
    user: publicUser(user),
    accessToken: signAccessToken(user.id, user.role),
    refreshToken,
  };
}

authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body as z.infer<typeof registerSchema>;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new HttpError(409, "An account with this email already exists", "EMAIL_TAKEN");
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash: await hashPassword(password) },
    });
    const tokens = await issueTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    return ok(res, tokens, 201);
  }),
);

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }
    const tokens = await issueTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    return ok(res, tokens);
  }),
);

authRouter.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof refreshSchema>;
    const token = body.refreshToken || req.cookies?.refreshToken;
    if (!token) throw new HttpError(401, "Refresh token required", "UNAUTHORIZED");
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new HttpError(401, "Invalid refresh token", "UNAUTHORIZED");
    }
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date() || stored.userId !== payload.sub) {
      throw new HttpError(401, "Refresh token expired", "UNAUTHORIZED");
    }
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new HttpError(401, "Invalid session", "UNAUTHORIZED");
    const tokens = await issueTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    return ok(res, tokens);
  }),
);

authRouter.post(
  "/logout",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const token = (req.body?.refreshToken as string | undefined) || req.cookies?.refreshToken;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(token) },
        data: { revokedAt: new Date() },
      });
    }
    if (req.user) {
      await prisma.refreshToken.updateMany({
        where: { userId: req.user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    clearRefreshCookie(res);
    return ok(res, { loggedOut: true });
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    return ok(res, { user: publicUser(req.user!) });
  }),
);

authRouter.post(
  "/forgot-password",
  validate(forgotSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body as z.infer<typeof forgotSchema>;
    const user = await prisma.user.findUnique({ where: { email } });
    const payload: { sent: boolean; resetToken?: string } = { sent: true };
    if (user) {
      const token = randomToken();
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      if (!isProd) payload.resetToken = token;
    }
    return ok(res, payload);
  }),
);

authRouter.post(
  "/reset-password",
  validate(resetSchema),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body as z.infer<typeof resetSchema>;
    const row = await prisma.passwordReset.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      throw new HttpError(400, "Reset link is invalid or expired", "INVALID_RESET");
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash: await hashPassword(password) },
      }),
      prisma.passwordReset.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
      prisma.refreshToken.updateMany({
        where: { userId: row.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return ok(res, { reset: true });
  }),
);
