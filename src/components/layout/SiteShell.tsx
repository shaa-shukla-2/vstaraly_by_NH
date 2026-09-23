"use client";

import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { QuickView } from "@/components/product/QuickView";
import { Toast } from "@/components/layout/Toast";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchOverlay />
      <CartDrawer />
      <QuickView />
      <Toast />
    </StoreProvider>
  );
}
