import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Refund policy" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Money"
      title="Refunds"
      paragraphs={[
        "Approved buy returns refund to the original method in 7–10 working days.",
        "Rental deposits return after inspection, usually within 5–7 working days of the garment reaching Delhi.",
        "Damage beyond honest wear is deducted from the deposit. We will show you photographs first.",
      ]}
    />
  );
}
