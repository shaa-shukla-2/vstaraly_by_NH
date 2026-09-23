"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [ok, setOk] = useState(false);
  return (
    <section className="border-t border-line bg-paper py-16">
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The atelier letter</p>
        <h2 className="mt-3 font-serif text-3xl">New rails, quietly.</h2>
        <p className="mt-3 text-sm text-muted">
          No daily noise. A note when the next ivory or Banarasi is ready.
        </p>
        {ok ? (
          <p className="mt-6 text-sm">You are on the list. We will write when it matters.</p>
        ) : (
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setOk(true);
            }}
          >
            <input
              type="email"
              required
              placeholder="Email"
              className="flex-1 border border-line bg-transparent px-3 py-3 text-sm"
              aria-label="Email"
            />
            <Button type="submit">Join</Button>
          </form>
        )}
      </div>
    </section>
  );
}
