"use client";

import { useStore } from "@/lib/store";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-espresso px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory"
    >
      {toast.message}
    </div>
  );
}
