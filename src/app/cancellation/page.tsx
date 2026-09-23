import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Cancellation" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Change of plan"
      title="Cancellation"
      paragraphs={[
        "Buys may cancel before dispatch. After dispatch, use returns.",
        "Rentals may cancel up to 7 days before the start date with a full refund of rental and deposit. Inside 7 days, the rental is kept; the deposit still returns.",
        "Bridal made-to-order cannot cancel once embroidery has begun.",
      ]}
    />
  );
}
