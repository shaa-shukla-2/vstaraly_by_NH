import type { BlogPost, Order, Review } from "@/types";
import { galleryImages as I, getProductById } from "@/data/products";

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p01",
    name: "Ananya Mehra",
    city: "Delhi",
    rating: 5,
    title: "Quiet, not costume",
    body: "The velvet photographed like old jewellery. Alterations at the Defence Colony atelier were precise.",
    date: "2026-02-14",
  },
  {
    id: "r2",
    productId: "p01",
    name: "Rhea Kapoor",
    city: "Mumbai",
    rating: 5,
    title: "Rented for a cousin's pheras",
    body: "Four-day rental, garment bag, no drama. I would buy it if I were the bride.",
    date: "2026-03-02",
  },
  {
    id: "r3",
    productId: "p02",
    name: "Sana Qureshi",
    city: "Hyderabad",
    rating: 5,
    title: "The ivory everyone asked about",
    body: "Light enough to drape myself. The champagne tissue border did all the work.",
    date: "2026-01-20",
  },
  {
    id: "r4",
    productId: "p20",
    name: "Ishita Rao",
    city: "Bengaluru",
    rating: 5,
    title: "Rent · Buy · Repeat as promised",
    body: "Deposit back in five days. The champagne jaal still looked new.",
    date: "2026-04-11",
  },
  {
    id: "r5",
    productId: "p08",
    name: "Meher Singh",
    city: "Jaipur",
    rating: 5,
    title: "For the pheras",
    body: "Heavy in the right places. I sat, stood, walked the mandap. Nothing pulled.",
    date: "2025-12-08",
  },
];

export const testimonials = [
  {
    quote:
      "Vastralay by NH understood that a Delhi reception does not need more gold. It needs proportion.",
    name: "Aditi and Kabir",
    place: "The Oberoi, New Delhi",
  },
  {
    quote:
      "We rented three looks across the week. Each arrived steamed, labelled, and exactly as photographed.",
    name: "The Menon family",
    place: "Kochi",
  },
  {
    quote:
      "The Banarasi was for my mother. She said it felt like something her mother would have chosen.",
    name: "Priyanka Nair",
    place: "Bengaluru",
  },
];

export const posts: BlogPost[] = [
  {
    slug: "how-to-wear-ivory-to-a-north-indian-wedding",
    title: "How to wear ivory to a North Indian wedding",
    excerpt:
      "Ivory is not white. In candlelight it reads as pearl. A note on jewellery, makeup and when to leave red behind.",
    date: "2026-08-12",
    readTime: "6 min",
    image: I.white,
    category: "Editorial",
    body: [
      "Ivory belongs to the engagement, the reception, and any pheras that take place after noon. It does not belong to a morning haldi.",
      "Keep the metal old. Antique gold, not yellow. Pearls if the embroidery is already speaking.",
      "If you are a guest, ivory is a compliment. If you are the bride, it is a decision — and it should be the only loud one you make that evening.",
    ],
  },
  {
    slug: "a-case-for-renting-the-reception-lehenga",
    title: "A case for renting the reception lehenga",
    excerpt:
      "Wear it once. Return it in the bag. Keep the photographs, not the cupboard.",
    date: "2026-07-02",
    readTime: "5 min",
    image: I.goldLehenga,
    category: "Rent · Buy · Repeat",
    body: [
      "A reception lehenga is a four-hour garment. Buying it is a ten-year storage problem.",
      "Our rental pieces are cleaned, stitched at stress points, and sized across a real range — not a sample size and a prayer.",
      "The deposit is a courtesy, not a punishment. It returns when the garment does.",
    ],
  },
  {
    slug: "banarasi-without-the-costume",
    title: "Banarasi without the costume",
    excerpt:
      "Kadhwa florals, temple borders, and why wine is more useful than parrot green.",
    date: "2026-05-18",
    readTime: "7 min",
    image: I.orangeSaree,
    category: "Craft",
    body: [
      "A Banarasi is not a festival prop. It is a weaving tradition that looks better when you stop pairing it with neon.",
      "Wine, forest and espresso sit well with old gold. They also sit well with a plain blouse.",
      "If the zari is shouting, the rest of you should whisper.",
    ],
  },
];

export const lookbookShots = [
  { src: I.maroon, caption: "Ruhani, Defence Colony atelier" },
  { src: I.goldLehenga, caption: "Mehr tissue, reception edit" },
  { src: I.white, caption: "Ivory season" },
  { src: I.embroidered, caption: "Forest and gold" },
  { src: I.portrait, caption: "Mehendi lawn" },
  { src: I.wedding, caption: "The pheras" },
  { src: I.night, caption: "After hours" },
  { src: I.cream, caption: "Champagne sharara" },
];

export const instagramShots = [
  I.maroon,
  I.goldLehenga,
  I.white,
  I.orangeSaree,
  I.portrait,
  I.night,
];

const address = {
  fullName: "Ananya Mehra",
  phone: "+91 98100 11223",
  line1: "14, Aurangzeb Road",
  city: "New Delhi",
  state: "Delhi",
  pincode: "110011",
};

function orderItem(id: string, size: string, qty: number, price: number) {
  const p = getProductById(id)!;
  return {
    productId: id,
    name: p.name,
    image: p.images[0],
    size,
    quantity: qty,
    price,
  };
}

export const orders: Order[] = [
  {
    id: "LY-20481",
    placedOn: "2026-08-02",
    status: "Delivered",
    fulfillment: "buy",
    items: [orderItem("p03", "Free size", 1, 98000)],
    address,
    subtotal: 98000,
    shipping: 0,
    total: 98000,
    trackingId: "DELX-88921",
    timeline: [
      { label: "Confirmed", date: "2 Aug", done: true },
      { label: "Packed at atelier", date: "3 Aug", done: true },
      { label: "Dispatched", date: "4 Aug", done: true },
      { label: "Delivered", date: "6 Aug", done: true },
    ],
  },
  {
    id: "LY-20502",
    placedOn: "2026-09-10",
    status: "Out for delivery",
    fulfillment: "rent",
    items: [orderItem("p20", "M", 1, 9990)],
    address,
    subtotal: 9990,
    shipping: 0,
    total: 24990,
    trackingId: "DELX-90211",
    timeline: [
      { label: "Confirmed", date: "10 Sep", done: true },
      { label: "Cleaned & packed", date: "12 Sep", done: true },
      { label: "Dispatched", date: "14 Sep", done: true },
      { label: "Out for delivery", date: "15 Sep", done: true },
      { label: "Delivered", date: "16 Sep", done: false },
    ],
  },
  {
    id: "LY-20310",
    placedOn: "2026-04-18",
    status: "Returned",
    fulfillment: "rent",
    items: [orderItem("p07", "S", 1, 5500)],
    address,
    subtotal: 5500,
    shipping: 0,
    total: 14500,
    trackingId: "DELX-77102",
    timeline: [
      { label: "Delivered", date: "20 Apr", done: true },
      { label: "Returned", date: "24 Apr", done: true },
      { label: "Deposit released", date: "29 Apr", done: true },
    ],
  },
];

export function getOrder(id: string) {
  return orders.find((o) => o.id === id);
}

export function reviewsFor(productId: string) {
  const own = reviews.filter((r) => r.productId === productId);
  return own.length ? own : reviews.slice(0, 2);
}
