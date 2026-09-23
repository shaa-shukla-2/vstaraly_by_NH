import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Returns policy" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="After the event"
      title="Returns"
      paragraphs={[
        "Unworn buys with tags may return within 7 days. Stitched blouses and custom lengths cannot.",
        "Rentals always return. That is the point. Use the garment bag. Do not wash. Do not gift it to a cousin.",
        "Start a return from your account. This preview does not contact a warehouse.",
      ]}
    />
  );
}
