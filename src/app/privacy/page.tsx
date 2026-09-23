import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Privacy" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Your file"
      title="Privacy"
      paragraphs={[
        "This website currently stores bag, wishlist and a mock login in your browser only. Nothing is sent to a server.",
        "When a backend exists, we will keep measurements, addresses and payment tokens with the same discretion we keep fittings.",
        "We do not sell lists. The atelier letter is optional.",
      ]}
    />
  );
}
