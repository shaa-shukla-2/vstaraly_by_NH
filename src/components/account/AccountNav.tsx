"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  ["Dashboard", "/account"],
  ["Orders", "/account/orders"],
  ["Returns", "/account/returns"],
  ["Exchanges", "/account/exchanges"],
  ["Refunds", "/account/refunds"],
  ["Wishlist", "/wishlist"],
];

export function AccountNav() {
  const pathname = usePathname();
  const { user, logout } = useStore();
  return (
    <aside className="lg:w-56">
      <p className="font-serif text-2xl">{user?.name ?? "Guest"}</p>
      <p className="text-sm text-muted">{user?.email ?? "Sign in to save fittings"}</p>
      <nav className="mt-6 flex flex-col gap-2 text-sm">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={cn(pathname === href ? "text-wine" : "text-charcoal hover:text-wine")}
          >
            {label}
          </Link>
        ))}
        {user ? (
          <button type="button" className="mt-4 text-left text-muted" onClick={logout}>
            Sign out
          </button>
        ) : (
          <Link href="/login" className="mt-4 text-wine">
            Sign in
          </Link>
        )}
      </nav>
    </aside>
  );
}
