import { prisma } from "./prisma.js";
import { HttpError } from "./http.js";
import { eachDate, isoDate, parseIsoDate, rangesOverlap } from "./mappers.js";

export async function assertRentalAvailable(productId: string, startIso: string, endIso: string) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (end < start) throw new HttpError(400, "Rental end must be on or after start", "VALIDATION_ERROR");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { rentalBlocks: true },
  });
  if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");
  if (!product.availableToRent) throw new HttpError(400, "This piece is not available to rent", "RENTAL_UNAVAILABLE");

  const blocked = new Set(product.rentalBlocks.map((b) => isoDate(b.date)));
  for (const d of eachDate(start, end)) {
    if (blocked.has(isoDate(d))) {
      throw new HttpError(409, `Unavailable on ${isoDate(d)}`, "RENTAL_CONFLICT");
    }
  }

  const reservations = await prisma.rentalReservation.findMany({
    where: { productId, status: "ACTIVE" },
  });
  for (const r of reservations) {
    if (rangesOverlap(start, end, r.startDate, r.endDate)) {
      throw new HttpError(409, "Those dates overlap an existing rental", "RENTAL_CONFLICT");
    }
  }

  return { start, end, durationDays: eachDate(start, end).length };
}

export async function blockedDatesForProduct(productId: string) {
  const [blocks, reservations] = await Promise.all([
    prisma.rentalBlock.findMany({ where: { productId } }),
    prisma.rentalReservation.findMany({ where: { productId, status: "ACTIVE" } }),
  ]);
  const dates = new Set<string>();
  for (const b of blocks) dates.add(isoDate(b.date));
  for (const r of reservations) {
    for (const d of eachDate(r.startDate, r.endDate)) dates.add(isoDate(d));
  }
  return [...dates].sort();
}
