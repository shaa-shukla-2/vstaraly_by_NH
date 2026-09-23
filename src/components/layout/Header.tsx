"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_LINKS } from "@/constants";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  IconBag,
  IconClose,
  IconHeart,
  IconMenu,
  IconSearch,
  IconUser,
} from "@/components/ui/Icons";

export function Header() {
  const pathname = usePathname();
  const {
    setSearchOpen,
    setCartOpen,
    setMenuOpen,
    menuOpen,
    cart,
    wishlist,
    user,
  } = useStore();
  const count = cart.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-[2px]">
      <div className="bg-espresso text-ivory">
        <p className="overflow-hidden whitespace-nowrap py-1.5 text-center text-[9px] uppercase tracking-[0.2em]">
          Complimentary bridal alterations · Pan-India delivery · Rent · Buy · Repeat · Code VASTRA10 on buys
        </p>
      </div>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 md:gap-4 md:px-8 md:py-2.5">
          <button
            type="button"
            className="lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <IconMenu />
          </button>
          <Link
            href="/"
            className="shrink-0"
            aria-label={`${APP_NAME} home`}
          >
            <Image src="/images/vastralay-logo.png" alt={APP_NAME} width={834} height={355} priority className="h-9 w-auto object-contain md:h-11" />
          </Link>
          <nav className="hidden items-center gap-4 lg:flex xl:gap-5" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[10px] uppercase tracking-[0.14em] text-charcoal hover:text-wine",
                  pathname === link.href && "text-wine",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5 md:gap-3">
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
            <Link href={user ? "/account" : "/login"} aria-label="Account">
              <IconUser />
            </Link>
            <Link href="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved`} className="relative">
              <IconHeart />
              {wishlist.length > 0 ? (
                <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-wine" />
              ) : null}
            </Link>
            <button
              type="button"
              aria-label={`Shopping bag, ${count} items`}
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <IconBag />
              {count > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-wine text-[9px] text-ivory">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 bg-espresso/40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={() => setMenuOpen(false)}
        >
          <div className="h-full w-[86%] max-w-sm bg-ivory p-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <Image src="/images/vastralay-logo.png" alt={APP_NAME} width={834} height={355} className="h-11 w-auto object-contain" />
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <IconClose />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-2xl text-espresso"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/lookbook" onClick={() => setMenuOpen(false)} className="pt-4 text-sm uppercase tracking-[0.16em]">
                Lookbook
              </Link>
              <Link href="/journal" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-[0.16em]">
                Journal
              </Link>
              <Link href="/how-renting-works" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-[0.16em]">
                How renting works
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
