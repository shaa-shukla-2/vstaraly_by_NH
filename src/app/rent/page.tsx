import type { Metadata } from "next";
import { EditorialLanding } from "@/components/layout/EditorialLanding";
import { galleryImages } from "@/data/products";

export const metadata: Metadata = {
  title: "Rent",
  description: "Rent Vastralay by NH couture. Four-day windows, refundable deposits, atelier cleaning.",
};

export default function RentPage() {
  return (
    <EditorialLanding
      eyebrow="Rent · Buy · Repeat"
      title="Couture for a long weekend."
      lead="Select dates on the product. We clean, pack and collect. The deposit returns when the garment does."
      image={galleryImages.cream}
      href="/collections/rent"
      cta="Browse rentals"
      collection="rent"
    />
  );
}
