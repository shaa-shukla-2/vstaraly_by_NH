export type CurrencyCode = "INR";

export type ProductId = string;

export type Fulfillment = "buy" | "rent";

export type ProductBadge =
  | "New"
  | "Bestseller"
  | "Sale"
  | "Limited"
  | "Rent";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: ProductId;
  slug: string;
  name: string;
  designer: string;
  description: string;
  story: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rentalPrice: number;
  deposit: number;
  availableToBuy: boolean;
  availableToRent: boolean;
  inStock: boolean;
  badges: ProductBadge[];
  category: string;
  occasions: string[];
  collections: string[];
  colors: ProductColor[];
  sizes: string[];
  fabric: string;
  embroidery: string;
  fit: string;
  care: string[];
  details: string[];
  rating: number;
  reviewCount: number;
  relatedIds: string[];
  lookIds: string[];
  rentalBlockedDates: string[];
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type CartItem = {
  key: string;
  productId: string;
  size: string;
  color: string;
  fulfillment: Fulfillment;
  quantity: number;
  rentalStart?: string;
  rentalEnd?: string;
  durationDays?: number;
};

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderStatus =
  | "Confirmed"
  | "Stitched"
  | "Dispatched"
  | "Out for delivery"
  | "Delivered"
  | "Returned"
  | "Exchanged"
  | "Refunded";

export type Order = {
  id: string;
  placedOn: string;
  status: OrderStatus;
  fulfillment: Fulfillment;
  items: {
    productId: string;
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  address: Address;
  subtotal: number;
  shipping: number;
  total: number;
  trackingId: string;
  timeline: { label: string; date: string; done: boolean }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  body: string[];
};

export type MockUser = {
  name: string;
  email: string;
};
