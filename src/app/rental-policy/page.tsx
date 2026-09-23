import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Rental policy" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Rent · Buy · Repeat"
      title="Rental policy"
      paragraphs={[
        "Standard window is four days including delivery. Longer weeks are priced in four-day blocks on the product page.",
        "A refundable deposit is authorised with the rental. It is not a second purchase.",
        "Late returns eat the deposit. Lost pieces are billed at buy price. We would rather you just write to us.",
      ]}
    />
  );
}
