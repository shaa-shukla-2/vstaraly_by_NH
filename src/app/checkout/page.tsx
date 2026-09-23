"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartTotals, useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const steps = ["Details", "Address", "Payment", "Review"] as const;

export default function CheckoutPage() {
  const { cart, coupon, user, clearCart, notify } = useStore();
  const totals = cartTotals(cart, coupon);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    line1: "",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    method: "card",
  });

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Nothing to check out</h1>
        <Button href="/cart" className="mt-8">
          Return to bag
        </Button>
      </div>
    );
  }

  function next() {
    if (step < 3) setStep(step + 1);
    else {
      clearCart();
      notify("Order placed — this is a frontend preview");
      router.push("/checkout/success");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <ol className="mt-6 flex gap-4 text-[11px] uppercase tracking-[0.16em]">
        {steps.map((s, i) => (
          <li key={s} className={i === step ? "text-wine" : "text-muted"}>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 border border-line p-6">
        {step === 0 ? (
          <div className="grid gap-3">
            <input className="border border-line px-3 py-3" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="border border-line px-3 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="border border-line px-3 py-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-3">
            <input className="border border-line px-3 py-3" placeholder="Address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <input className="border border-line px-3 py-3" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="border border-line px-3 py-3" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <input className="border border-line px-3 py-3" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">Payment is a mock UI only. No charges are made.</p>
            {["card", "upi", "netbanking"].map((m) => (
              <label key={m} className="flex items-center gap-3 border border-line px-3 py-3 capitalize">
                <input type="radio" name="pay" checked={form.method === m} onChange={() => setForm({ ...form, method: m })} />
                {m === "card" ? "Card" : m === "upi" ? "UPI" : "Net banking"}
              </label>
            ))}
            {form.method === "card" ? (
              <input className="w-full border border-line px-3 py-3" placeholder="ACCT-000015" />
            ) : null}
          </div>
        ) : null}
        {step === 3 ? (
          <div className="text-sm leading-7">
            <p>
              {form.name} · {form.email}
            </p>
            <p>
              {form.line1}, {form.city} {form.pincode}
            </p>
            <p className="mt-3">Paying by {form.method}. Total {formatINR(totals.total)} including any rental deposit.</p>
          </div>
        ) : null}
        <div className="mt-6 flex justify-between">
          <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Back
          </Button>
          <Button type="button" onClick={next}>
            {step === 3 ? "Place order" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
