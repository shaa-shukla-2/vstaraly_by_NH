import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PolicyPage
      eyebrow="The house"
      title="Vastralay by NH is a Delhi atelier, not a catalogue."
      paragraphs={[
        "We make and keep bridal, festive and party clothes for women who would rather look considered than themed. The studio sits in Defence Colony. Karigars sit with us, not in a factory slideshow.",
        "Rent · Buy · Repeat exists because a reception lehenga is a four-hour garment. Buying remains the right choice for pheras pieces you will pack for a daughter. Renting is the right choice for everything else.",
        "Appointments are by note to the atelier. Walk-ins are tolerated if the rail is quiet.",
      ]}
    />
  );
}
