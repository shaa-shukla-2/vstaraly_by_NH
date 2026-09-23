export const APP_NAME = "Vastralay by NH";
export const APP_TAGLINE = "Couture for the Indian celebration";
export const DEFAULT_CURRENCY = "INR" as const;

export const NAV_LINKS = [
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/bridal", label: "Bridal" },
  { href: "/collections/sarees", label: "Sarees" },
  { href: "/collections/lehengas", label: "Lehengas" },
  { href: "/collections/party-wear", label: "Party Wear" },
  { href: "/collections/festive", label: "Festive" },
  { href: "/rent", label: "Rent" },
  { href: "/collections/sale", label: "Sale" },
] as const;

export const OCCASIONS = [
  { slug: "bridal", title: "Bridal", href: "/bridal" },
  { slug: "reception", title: "Reception", href: "/collections/reception" },
  { slug: "engagement", title: "Engagement", href: "/collections/engagement" },
  { slug: "mehendi", title: "Mehendi", href: "/collections/mehendi" },
  { slug: "haldi", title: "Haldi", href: "/collections/haldi" },
  { slug: "festive", title: "Festive", href: "/collections/festive" },
  { slug: "party", title: "Party", href: "/collections/party-wear" },
  { slug: "wedding-guest", title: "Wedding Guest", href: "/collections/wedding-guest" },
] as const;

export const CATEGORIES = [
  { slug: "sarees", title: "Designer Sarees", href: "/collections/sarees" },
  { slug: "lehengas", title: "Lehengas", href: "/collections/lehengas" },
  { slug: "anarkalis", title: "Anarkalis", href: "/collections/party-wear" },
  { slug: "shararas", title: "Sharara Sets", href: "/collections/festive" },
] as const;

export const PINCODE_SERVICEABLE = ["110001", "400001", "560001", "600001", "700001", "500001"];
