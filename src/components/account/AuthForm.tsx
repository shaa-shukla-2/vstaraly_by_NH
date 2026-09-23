"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

export function AuthForm({
  mode,
}: {
  mode: "login" | "signup" | "forgot";
}) {
  const { login } = useStore();
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const title =
    mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">The house</p>
      <h1 className="mt-2 font-serif text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">
        Mock account only — nothing is sent to a server.
      </p>
      {sent ? (
        <p className="mt-8 border border-line p-5 text-sm">
          If this were live, a reset note would be on its way to {email}.
        </p>
      ) : (
        <form
          className="mt-8 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (mode === "forgot") {
              setSent(true);
              return;
            }
            login({ name: name || "Ananya Mehra", email: email || "ananya@vastralaybynh.in" });
            router.push("/account");
          }}
        >
          {mode === "signup" ? (
            <input
              className="border border-line px-3 py-3"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : null}
          <input
            type="email"
            required
            className="border border-line px-3 py-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {mode !== "forgot" ? (
            <input type="password" required className="border border-line px-3 py-3" placeholder="Password" />
          ) : null}
          <Button type="submit">{title}</Button>
        </form>
      )}
      <div className="mt-6 space-y-2 text-sm">
        {mode !== "login" ? (
          <p>
            Already with us? <Link href="/login" className="text-wine">Sign in</Link>
          </p>
        ) : null}
        {mode !== "signup" ? (
          <p>
            New to Vastralay by NH? <Link href="/signup" className="text-wine">Create account</Link>
          </p>
        ) : null}
        {mode !== "forgot" ? (
          <p>
            <Link href="/forgot-password" className="text-muted">
              Forgot password
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
