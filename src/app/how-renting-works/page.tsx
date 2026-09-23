import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "How renting works" };

const steps = [
  ["Choose the piece", "Filter the rent rail. Check the calendar on the product — struck dates are already promised."],
  ["Pay rental and deposit", "The rental is the wear. The deposit is a courtesy that returns after inspection."],
  ["Wear it", "It arrives steamed, labelled, with a return bag. Do not wash. Do not alter."],
  ["Send it back", "Drop-off or pickup. We inspect, clean, and release the deposit."],
];

export default function HowRentingWorksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Rent · Buy · Repeat</p>
      <h1 className="mt-2 font-serif text-4xl">How renting works</h1>
      <ol className="mt-10 space-y-8">
        {steps.map(([t, d], i) => (
          <li key={t}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold">0{i + 1}</p>
            <h2 className="font-serif text-2xl">{t}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{d}</p>
          </li>
        ))}
      </ol>
      <Button href="/rent" className="mt-10">
        Explore rentals
      </Button>
    </div>
  );
}
