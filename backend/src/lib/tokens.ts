import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export type AccessPayload = { sub: string; role: string; typ: "access" };
export type RefreshPayload = { sub: string; typ: "refresh"; jti: string };

export function signAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role, typ: "access" } satisfies AccessPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(userId: string, jti: string) {
  return jwt.sign({ sub: userId, typ: "refresh", jti } satisfies RefreshPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
  if (payload.typ !== "access") throw new Error("Invalid token");
  return payload;
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
  if (payload.typ !== "refresh") throw new Error("Invalid token");
  return payload;
}

export function parseDurationToDate(spec: string) {
  const match = /^(\d+)([smhd])$/.exec(spec);
  const now = Date.now();
  if (!match) return new Date(now + 7 * 24 * 3600 * 1000);
  const n = Number(match[1]);
  const unit = match[2];
  const ms =
    unit === "s" ? n * 1000 : unit === "m" ? n * 60_000 : unit === "h" ? n * 3_600_000 : n * 86_400_000;
  return new Date(now + ms);
}
