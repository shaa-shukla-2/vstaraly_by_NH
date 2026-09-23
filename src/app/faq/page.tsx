import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  ["Do you stitch blouses?", "Yes, in Delhi. Outstation buys include a blouse piece; we can stitch from measurements."],
  ["How does renting work?", "Choose dates on the product, pay rental plus deposit, wear it, return it in the bag. Deposit back after inspection."],
  ["Can I buy a rental piece?", "If it is on the buy rail, yes. Exclusive rental pieces stay in the programme."],
  ["Do you ship outside India?", "Not yet. Pan-India only, for now."],
  ["What if it does not fit?", "Buys: one complimentary size exchange in 7 days. Rentals: we send a backup size when the calendar allows."],
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <h1 className="font-serif text-4xl">Questions</h1>
      <dl className="mt-8 space-y-6">
        {faqs.map(([q, a]) => (
          <div key={q}>
            <dt className="font-serif text-2xl">{q}</dt>
            <dd className="mt-2 text-sm leading-7 text-muted">{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
