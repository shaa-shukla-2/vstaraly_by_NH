import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Shipping" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Delivery"
      title="Shipping"
      paragraphs={[
        "Atelier packs leave Delhi within 2–4 working days for in-stock pieces. Made-to-order bridal waits three weeks.",
        "Metros usually see the box in 3–6 days. Hill stations and interiors take longer. Shipping is complimentary on every order in this preview.",
        "Rentals are timed to your calendar, not to a courier’s convenience. We build two buffer days into every window.",
      ]}
    />
  );
}
