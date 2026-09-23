"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Contact</p>
      <h1 className="mt-2 font-serif text-4xl">Write to the atelier</h1>
      <p className="mt-3 text-sm text-muted">
        14, Defence Colony, New Delhi. Tuesday to Sunday, 11–7. Bridal fittings by appointment.
      </p>
      {sent ? (
        <p className="mt-8 border border-line p-5">Received. In production this would reach the studio desk — here it stays on the page.</p>
      ) : (
        <form
          className="mt-8 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input required className="border border-line px-3 py-3" placeholder="Name" />
          <input required type="email" className="border border-line px-3 py-3" placeholder="Email" />
          <textarea required rows={5} className="border border-line px-3 py-3" placeholder="Occasion, date, city" />
          <Button type="submit">Send</Button>
        </form>
      )}
    </div>
  );
}
