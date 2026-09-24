import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { fail, HttpError } from "../lib/http.js";
import { isProd } from "../config/env.js";
import { Prisma } from "@prisma/client";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return fail(res, err.status, err.message, err.code);
  }
  if (err instanceof ZodError) {
    const message = err.issues[0]?.message ?? "Validation failed";
    return fail(res, 400, message, "VALIDATION_ERROR");
  }
  if (err instanceof SyntaxError && "body" in err) {
    return fail(res, 400, "Request body contains invalid JSON", "INVALID_JSON");
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return fail(res, 409, "A record with those details already exists", "CONFLICT");
    if (err.code === "P2025") return fail(res, 404, "Record not found", "NOT_FOUND");
    if (err.code === "P2003") return fail(res, 400, "Related record does not exist", "INVALID_REFERENCE");
  }
  console.error(err);
  return fail(res, 500, isProd ? "Internal server error" : String(err), "INTERNAL");
}

export function validate(schema: ZodType, source: "body" | "query" | "params" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[source]);
    req[source] = parsed as never;
    next();
  };
}
