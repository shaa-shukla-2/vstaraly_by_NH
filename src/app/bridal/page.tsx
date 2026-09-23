import type { Metadata } from "next";
import { EditorialLanding } from "@/components/layout/EditorialLanding";
import { galleryImages } from "@/data/products";

export const metadata: Metadata = {
  title: "Bridal",
  description: "Vastralay by NH bridal lehengas and sarees for the pheras.",
};

export default function BridalPage() {
  return (
    <EditorialLanding
      eyebrow="The pheras"
      title="Bridal, without the costume."
      lead="Maroon velvets, crimson silks, ivory architecture. Clothes cut to sit, stand and walk around a mandap."
      image={galleryImages.maroon}
      href="/collections/bridal"
      cta="Shop the bridal rail"
      collection="bridal"
    />
  );
}
