import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { categories, collections, designers, products } from "./catalog.js";

const prisma = new PrismaClient();

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: category, create: category });
  }
  for (const collection of collections) {
    await prisma.collection.upsert({ where: { slug: collection.slug }, update: collection, create: collection });
  }
  for (const designer of designers) {
    await prisma.designer.upsert({ where: { slug: designer.slug }, update: designer, create: designer });
  }

  for (const product of products) {
    const designer = await prisma.designer.findUniqueOrThrow({ where: { name: product.designer } });
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: product.category } });
    const scalarData = {
      slug: product.slug,
      name: product.name,
      designerId: designer.id,
      description: product.description,
      story: product.story,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      rentalPrice: product.rentalPrice,
      deposit: product.deposit,
      availableToBuy: product.availableToBuy,
      availableToRent: product.availableToRent,
      inStock: product.inStock,
      badges: product.badges,
      categoryId: category.id,
      occasions: product.occasions,
      fabric: product.fabric,
      embroidery: product.embroidery,
      fit: product.fit,
      care: product.care,
      details: product.details,
      rating: product.rating,
      reviewCount: product.reviewCount,
      relatedIds: product.relatedIds,
      lookIds: product.lookIds,
    };
    await prisma.product.upsert({
      where: { id: product.id },
      update: scalarData,
      create: {
        id: product.id,
        ...scalarData,
        images: { create: product.images.map((url, sortOrder) => ({ url, sortOrder })) },
        colors: { create: product.colors },
        sizes: { create: product.sizes.map((size) => ({ size })) },
        collections: {
          create: (await prisma.collection.findMany({ where: { slug: { in: product.collections } } })).map((c) => ({ collectionId: c.id })),
        },
        rentalBlocks: { create: product.rentalBlockedDates.map((date) => ({ date: new Date(`${date}T00:00:00.000Z`) })) },
      },
    });
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: product.id } }),
      prisma.productColor.deleteMany({ where: { productId: product.id } }),
      prisma.productSize.deleteMany({ where: { productId: product.id } }),
      prisma.productCollection.deleteMany({ where: { productId: product.id } }),
      prisma.rentalBlock.deleteMany({ where: { productId: product.id } }),
    ]);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: { create: product.images.map((url, sortOrder) => ({ url, sortOrder })) },
        colors: { create: product.colors },
        sizes: { create: product.sizes.map((size) => ({ size })) },
        collections: {
          create: (await prisma.collection.findMany({ where: { slug: { in: product.collections } } })).map((c) => ({ collectionId: c.id })),
        },
        rentalBlocks: { create: product.rentalBlockedDates.map((date) => ({ date: new Date(`${date}T00:00:00.000Z`) })) },
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "VASTRA10" },
    update: { percentOff: 10, active: true, scope: "BUY", description: "10% off purchase items" },
    create: { code: "VASTRA10", percentOff: 10, active: true, scope: "BUY", description: "10% off purchase items" },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN", passwordHash: await bcrypt.hash(adminPassword, 12) },
      create: { email: adminEmail, name: "Vastralay Atelier", role: "ADMIN", passwordHash: await bcrypt.hash(adminPassword, 12) },
    });
  }
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL?.toLowerCase();
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;
  if (customerEmail && customerPassword) {
    await prisma.user.upsert({
      where: { email: customerEmail },
      update: {},
      create: { email: customerEmail, name: "Ananya Mehra", passwordHash: await bcrypt.hash(customerPassword, 12) },
    });
  }

  console.log(`Seeded ${categories.length} categories, ${collections.length} collections, ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
