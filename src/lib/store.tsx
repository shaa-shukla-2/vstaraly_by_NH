"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem, Fulfillment, MockUser, Product } from "@/types";
import { getProductById } from "@/data/products";
import { apiRequest } from "@/lib/api";

type Toast = { message: string } | null;

type Store = {
  cart: CartItem[];
  wishlist: string[];
  user: MockUser | null;
  accessToken: string | null;
  toast: Toast;
  searchOpen: boolean;
  cartOpen: boolean;
  menuOpen: boolean;
  quickView: Product | null;
  coupon: string | null;
  setSearchOpen: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setQuickView: (p: Product | null) => void;
  addToCart: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  applyCoupon: (code: string) => boolean;
  login: (user: MockUser, accessToken: string) => void;
  logout: () => void;
  notify: (message: string) => void;
  clearCart: () => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "laya-store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<MockUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const refreshStarted = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            cart?: CartItem[];
            wishlist?: string[];
            user?: MockUser | null;
            coupon?: string | null;
          };
          setCart(parsed.cart ?? []);
          setWishlist(parsed.wishlist ?? []);
          setUser(parsed.user ?? null);
          setCoupon(parsed.coupon ?? null);
        }
      } catch {
        /* ignore */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || !user || accessToken || refreshStarted.current) return;
    refreshStarted.current = true;
    let cancelled = false;
    apiRequest<{ user: MockUser; accessToken: string }>("/auth/refresh", { method: "POST", body: "{}" })
      .then((session) => {
        if (!cancelled) {
          setUser(session.user);
          setAccessToken(session.accessToken);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, user, accessToken]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, user, coupon }));
  }, [cart, wishlist, user, coupon, hydrated]);

  const notify = useCallback((message: string) => {
    setToast({ message });
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "key">) => {
      const key = [
        item.productId,
        item.size,
        item.color,
        item.fulfillment,
        item.rentalStart ?? "",
      ].join("|");
      setCart((prev) => {
        const found = prev.find((p) => p.key === key);
        if (found) {
          return prev.map((p) =>
            p.key === key ? { ...p, quantity: p.quantity + item.quantity } : p,
          );
        }
        return [...prev, { ...item, key }];
      });
      notify("Added to bag");
      setCartOpen(true);
    },
    [notify],
  );

  const updateQty = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((p) => (p.key === key ? { ...p, quantity } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        notify(has ? "Removed from wishlist" : "Saved to wishlist");
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [notify],
  );

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist],
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const ok = code.trim().toUpperCase() === "VASTRA10";
      if (ok) {
        setCoupon("VASTRA10");
        notify("VASTRA10 applied — 10% off buying price");
      } else {
        notify("That code is not active");
      }
      return ok;
    },
    [notify],
  );

  const value = useMemo<Store>(
    () => ({
      cart,
      wishlist,
      user,
      accessToken,
      toast,
      searchOpen,
      cartOpen,
      menuOpen,
      quickView,
      coupon,
      setSearchOpen,
      setCartOpen,
      setMenuOpen,
      setQuickView,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      applyCoupon,
      login: (u, token) => {
        setUser(u);
        setAccessToken(token);
        notify(`Welcome back, ${u.name.split(" ")[0]}`);
      },
      logout: () => {
        void apiRequest<{ loggedOut: boolean }>("/auth/logout", { method: "POST", body: "{}" }).catch(() => {});
        setUser(null);
        setAccessToken(null);
        notify("Signed out");
      },
      notify,
      clearCart: () => {
        setCart([]);
        setCoupon(null);
      },
    }),
    [
      cart,
      wishlist,
      user,
      accessToken,
      toast,
      searchOpen,
      cartOpen,
      menuOpen,
      quickView,
      coupon,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      applyCoupon,
      notify,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function cartTotals(cart: CartItem[], coupon: string | null) {
  let subtotal = 0;
  let deposit = 0;
  for (const item of cart) {
    const p = getProductById(item.productId);
    if (!p) continue;
    const unit =
      item.fulfillment === "rent"
        ? p.rentalPrice * (item.durationDays ? Math.max(1, Math.ceil(item.durationDays / 4)) : 1)
        : p.price;
    subtotal += unit * item.quantity;
    if (item.fulfillment === "rent") deposit += p.deposit * item.quantity;
  }
  const discount = coupon === "VASTRA10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 0 ? 0 : 0;
  return {
    subtotal,
    discount,
    deposit,
    shipping,
    total: subtotal - discount + deposit + shipping,
  };
}

export type { Fulfillment };
