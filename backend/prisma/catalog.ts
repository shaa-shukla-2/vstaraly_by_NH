export type Badge = "New" | "Bestseller" | "Sale" | "Limited" | "Rent";

export type SeedProduct = {
  id: string;
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
  badges: Badge[];
  category: string;
  occasions: string[];
  collections: string[];
  colors: { name: string; hex: string }[];
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

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const I = {
  maroon: u("photo-1610030469983-98e550d6193c"),
  goldLehenga: u("photo-1595777457583-95e059d581b8"),
  orangeSaree: u("photo-1558171813-4c088753af8f"),
  embroidered: u("photo-1617627143750-d86bc21e42bb"),
  runway: u("photo-1469334031218-e382a71b716b"),
  coat: u("photo-1483985988355-763728e1935b"),
  redDress: u("photo-1572804013309-59a88b7e92f1"),
  pinkGown: u("photo-1566174053879-31528523f8ae"),
  wedding: u("photo-1519741497674-611481863552"),
  elegant: u("photo-1469334031218-e382a71b716b"),
  portrait: u("photo-1524504388940-b1c1722653e1"),
  black: u("photo-1487222477894-8943e31ef7b2"),
  silk: u("photo-1558171813-4c088753af8f"),
  sitting: u("photo-1594633312681-425c7b97ccd1"),
  boutique: u("photo-1441984904996-e0b6ba687e04"),
  cream: u("photo-1512436991641-6745cdb1723f"),
  lace: u("photo-1515372039744-b8f02a3ae446"),
  hair: u("photo-1487412720507-e7ab37603c6f"),
  profile: u("photo-1524502397800-2eeead7b1ac9"),
  night: u("photo-1529139574466-a303027c1d8b"),
  walk: u("photo-1487222477894-8943e31ef7b2"),
  white: u("photo-1524504388940-b1c1722653e1"),
};

const blocked = ["2026-10-02", "2026-10-03", "2026-10-18", "2026-11-04", "2026-11-14"];

export const designers = [
  { slug: "vastralay-by-nh", name: "Vastralay by NH", bio: "The house atelier in Defence Colony, New Delhi." },
  { slug: "noor-by-vastralay", name: "Noor by Vastralay", bio: "Ivory, pearl and daylight dressing." },
  { slug: "studio-zariya", name: "Studio Zariya", bio: "Banarasi and zari, never costume." },
  { slug: "atelier-meher", name: "Atelier Meher", bio: "Forest, velvet and winter courts." },
  { slug: "vastralay-rentals", name: "Vastralay Rentals", bio: "Couture kept exclusively for four-day hires." },
];

export const categories = [
  { slug: "sarees", title: "Designer Sarees", description: "Banarasi, organza, tissue and velvet." },
  { slug: "lehengas", title: "Lehengas", description: "Bridal, reception and guest volume." },
  { slug: "anarkalis", title: "Anarkalis", description: "Floor-length sets for after hours." },
  { slug: "shararas", title: "Sharara Sets", description: "Paneled trousers for lawns and tents." },
];

export const collections = [
  { slug: "new-arrivals", title: "New Arrivals", eyebrow: "This season", description: "Just in from the atelier: ivory pearls, marigold haldi sets, and the first tissue lehengas of winter.", hero: I.white },
  { slug: "bridal", title: "Bridal", eyebrow: "The pheras", description: "Maroon velvets, crimson silks and ivory architecture.", hero: I.maroon },
  { slug: "sarees", title: "Designer Sarees", eyebrow: "Six yards", description: "Banarasi, organza, tissue and velvet — draped, not decorated.", hero: I.orangeSaree },
  { slug: "lehengas", title: "Lehengas", eyebrow: "Volume, considered", description: "Bridal, reception and guest lehengas cut to walk, sit and dance.", hero: I.goldLehenga },
  { slug: "party-wear", title: "Party Wear", eyebrow: "After hours", description: "Black sequin, rose-gold columns and velvet anarkalis.", hero: I.night },
  { slug: "festive", title: "Festive", eyebrow: "The calendar", description: "Diwali, Navratri and winter pujas — colour without costume.", hero: I.embroidered },
  { slug: "sale", title: "The Archive Sale", eyebrow: "Last of the season", description: "A quiet markdown on previous atelier runs.", hero: I.boutique },
  { slug: "reception", title: "Reception", eyebrow: "After the pheras", description: "Champagne tissue, emerald raw silk and wine capes.", hero: I.goldLehenga },
  { slug: "engagement", title: "Engagement", eyebrow: "The promise", description: "Ivory pearls and champagne shararas.", hero: I.lace },
  { slug: "mehendi", title: "Mehendi", eyebrow: "Garden colour", description: "Mint, coral and champagne for lawns and afternoon light.", hero: I.portrait },
  { slug: "haldi", title: "Haldi", eyebrow: "Sunlight", description: "Marigold, mustard and cream.", hero: I.orangeSaree },
  { slug: "wedding-guest", title: "Wedding Guest", eyebrow: "Be present, not the plot", description: "Wine Banarasi, mauve anarkalis, quiet sequins.", hero: I.elegant },
  { slug: "designer", title: "Designer Collection", eyebrow: "The house", description: "Signature atelier pieces from Vastralay by NH, Noor and Studio Zariya.", hero: I.runway },
  { slug: "best-sellers", title: "Best Sellers", eyebrow: "Most requested", description: "The lehengas and sarees our ateliers cannot keep on the rail.", hero: I.wedding },
  { slug: "rent", title: "Rent · Buy · Repeat", eyebrow: "Wear it once, beautifully", description: "Couture for a long weekend. Dry-cleaned, insured, returned.", hero: I.cream },
];

export const products: SeedProduct[] = [
  {
    id: "p01", slug: "ruhani-maroon-velvet-lehenga", name: "Ruhani Maroon Velvet Lehenga", designer: "Vastralay by NH",
    description: "A midnight-maroon velvet lehenga with antique gold zardozi, cut for a bride who prefers quiet splendour over spectacle.",
    story: "Hand-embroidered in our Lucknow atelier over eight weeks. The velvet is mill-dyed, then finished with old-gold mukaish that catches candlelight rather than flash.",
    images: [I.maroon, I.goldLehenga, I.wedding, I.embroidered], price: 185000, rentalPrice: 18000, deposit: 25000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["Bestseller", "Rent"], category: "lehengas",
    occasions: ["bridal", "reception"], collections: ["bridal", "best-sellers", "designer", "rent"],
    colors: [{ name: "Maroon", hex: "#6f2c3a" }, { name: "Espresso", hex: "#2b241d" }], sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Silk velvet with silk organza dupatta", embroidery: "Antique gold zardozi and mukaish", fit: "Structured blouse, flared twelve-kali skirt",
    care: ["Dry clean only", "Store in muslin", "Keep away from moisture"],
    details: ["Unstitched blouse option available at checkout notes", "Can-can and canvas lining included", "Dupatta finished with hand-rolled edges"],
    rating: 4.9, reviewCount: 42, relatedIds: ["p02", "p08", "p16"], lookIds: ["p03", "p20"], rentalBlockedDates: blocked,
  },
  {
    id: "p02", slug: "chandni-ivory-organza-saree", name: "Chandni Ivory Organza Saree", designer: "Noor by Vastralay",
    description: "Ivory organza with a whisper of champagne tissue, scattered with pearl moti work for evening pheras and intimate receptions.",
    story: "Named for moonlight on the Gomti. Each pallu is denser than the field so the drape photographs like liquid ivory.",
    images: [I.white, I.elegant, I.lace, I.portrait], price: 72000, compareAtPrice: 82000, rentalPrice: 6500, deposit: 10000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["New", "Sale"], category: "sarees",
    occasions: ["engagement", "wedding-guest", "reception"], collections: ["sarees", "new-arrivals", "sale", "engagement"],
    colors: [{ name: "Ivory", hex: "#f6f1e8" }, { name: "Champagne", hex: "#c6b089" }], sizes: ["Free size"],
    fabric: "Pure organza with tissue border", embroidery: "Pearl, sequin and resham", fit: "Unstitched blouse fabric included",
    care: ["Dry clean only", "Steam lightly before drape"], details: ["5.5 metres with 0.8 metre blouse", "Fall and pico on request"],
    rating: 4.8, reviewCount: 31, relatedIds: ["p04", "p11", "p17"], lookIds: ["p05"], rentalBlockedDates: ["2026-10-10", "2026-10-11"],
  },
  {
    id: "p03", slug: "zoya-wine-banarasi-saree", name: "Zoya Wine Banarasi Saree", designer: "Studio Zariya",
    description: "A deep wine Banarasi with kadhwa florals in muted gold — for the mother of the bride, or a guest who understands restraint.",
    story: "Woven in a family pit-loom in Varanasi. The zari is tested antique, never flash gold.",
    images: [I.orangeSaree, I.silk, I.maroon, I.boutique], price: 98000, rentalPrice: 8500, deposit: 12000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["Bestseller"], category: "sarees",
    occasions: ["festive", "wedding-guest", "reception"], collections: ["sarees", "festive", "best-sellers", "wedding-guest"],
    colors: [{ name: "Wine", hex: "#6f2c3a" }], sizes: ["Free size"], fabric: "Pure katan silk", embroidery: "Kadhwa brocade",
    fit: "Classic six-yard drape", care: ["Dry clean", "Wrap in undyed cotton"], details: ["Temple border", "Contrast blouse fabric in espresso"],
    rating: 4.7, reviewCount: 28, relatedIds: ["p02", "p12", "p18"], lookIds: ["p01"], rentalBlockedDates: blocked,
  },
  {
    id: "p04", slug: "mehr-gold-tissue-lehenga", name: "Mehr Gold Tissue Lehenga", designer: "Vastralay by NH",
    description: "Champagne tissue kalidar lehenga with sparse floral jaal — made to move through a reception without competing with the jewellery.",
    story: "Tissue is layered over satin so the skirt holds volume while remaining light on a long night.",
    images: [I.goldLehenga, I.pinkGown, I.runway, I.cream], price: 142000, rentalPrice: 15000, deposit: 20000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["New", "Rent"], category: "lehengas",
    occasions: ["reception", "engagement", "bridal"], collections: ["lehengas", "new-arrivals", "reception", "rent", "designer"],
    colors: [{ name: "Champagne", hex: "#c6b089" }, { name: "Ivory", hex: "#f6f1e8" }], sizes: ["XS", "S", "M", "L"],
    fabric: "Silk tissue over satin", embroidery: "Tone-on-tone dori and sequin", fit: "Corset blouse with flare skirt",
    care: ["Dry clean only"], details: ["Detachable trail optional", "Soft can-can"],
    rating: 4.8, reviewCount: 19, relatedIds: ["p01", "p08", "p14"], lookIds: ["p02"], rentalBlockedDates: ["2026-11-20", "2026-11-21", "2026-11-22"],
  },
  {
    id: "p05", slug: "anika-emerald-reception-lehenga", name: "Anika Emerald Reception Lehenga", designer: "Atelier Meher",
    description: "Forest-toned raw silk with antique gold borders for brides who leave red behind after the pheras.",
    story: "Inspired by old Deccan court portraits. The colour is dyed to photograph jewel-like under tungsten.",
    images: [I.embroidered, I.elegant, I.sitting, I.goldLehenga], price: 168000, rentalPrice: 16500, deposit: 22000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["Limited"], category: "lehengas",
    occasions: ["reception", "bridal"], collections: ["lehengas", "reception", "designer", "bridal"],
    colors: [{ name: "Emerald", hex: "#1f4a3a" }], sizes: ["S", "M", "L", "XL"], fabric: "Raw silk", embroidery: "Antique gold border",
    fit: "Structured blouse, circular skirt", care: ["Dry clean only"], details: ["Matching potli optional"],
    rating: 4.8, reviewCount: 16, relatedIds: ["p01", "p04", "p08"], lookIds: ["p14"], rentalBlockedDates: blocked,
  },
  {
    id: "p06", slug: "tara-blush-organza-saree", name: "Tara Blush Organza Saree", designer: "Noor by Vastralay",
    description: "A blush organza with scattered floral butis — the saree for cocktail dinners and rooftop sangeets.",
    story: "Light enough for late-night dancing, finished enough for family photographs.",
    images: [I.pinkGown, I.lace, I.portrait, I.white], price: 54000, rentalPrice: 4800, deposit: 8000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["New"], category: "sarees",
    occasions: ["party", "festive", "wedding-guest"], collections: ["sarees", "party-wear", "festive", "new-arrivals"],
    colors: [{ name: "Blush", hex: "#e7cfc4" }], sizes: ["Free size"], fabric: "Silk organza", embroidery: "Resham florals",
    fit: "Pre-pleated option on request", care: ["Dry clean"], details: ["Includes silk blouse piece"],
    rating: 4.6, reviewCount: 22, relatedIds: ["p02", "p11", "p19"], lookIds: ["p07"], rentalBlockedDates: [],
  },
  {
    id: "p07", slug: "noor-champagne-sharara", name: "Noor Champagne Sharara Set", designer: "Vastralay by NH",
    description: "A champagne sharara with short kurta and pearl-dotted dupatta — conceived for mehendi lawns and winter afternoons.",
    story: "The sharara is paneled to walk easily on grass. Pearls are stitched, not glued.",
    images: [I.cream, I.white, I.hair, I.elegant], price: 64000, rentalPrice: 5500, deposit: 9000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["Bestseller", "Rent"], category: "shararas",
    occasions: ["mehendi", "engagement", "festive"], collections: ["festive", "mehendi", "engagement", "rent", "best-sellers"],
    colors: [{ name: "Champagne", hex: "#c6b089" }], sizes: ["XS", "S", "M", "L"], fabric: "Georgette with silk lining",
    embroidery: "Pearl and dori", fit: "Short kurta, wide sharara", care: ["Dry clean"], details: ["Potli bag not included"],
    rating: 4.8, reviewCount: 37, relatedIds: ["p09", "p10", "p15"], lookIds: ["p06"], rentalBlockedDates: ["2026-10-24", "2026-10-25"],
  },
  {
    id: "p08", slug: "isha-crimson-bridal-lehenga", name: "Isha Crimson Bridal Lehenga", designer: "Vastralay by NH",
    description: "A classic crimson bridal with dense but balanced zardozi — for families who still believe the pheras should feel ceremonial.",
    story: "The skirt is weighted at the hem so it falls in a clean circle. Blouse is boned for all-day wear.",
    images: [I.redDress, I.maroon, I.wedding, I.goldLehenga], price: 225000, rentalPrice: 22000, deposit: 35000,
    availableToBuy: true, availableToRent: false, inStock: true, badges: ["Limited", "Bestseller"], category: "lehengas",
    occasions: ["bridal"], collections: ["bridal", "lehengas", "best-sellers", "designer"],
    colors: [{ name: "Crimson", hex: "#7a1f2b" }], sizes: ["S", "M", "L", "XL"], fabric: "Raw silk and velvet borders",
    embroidery: "Zardozi, dabka, sequin", fit: "Traditional bridal volume", care: ["Museum-style packing on purchase"],
    details: ["Includes matching potli", "Custom blouse fitting in store"],
    rating: 5, reviewCount: 18, relatedIds: ["p01", "p16", "p05"], lookIds: ["p03"], rentalBlockedDates: [],
  },
  {
    id: "p09", slug: "saanjh-marigold-haldi-set", name: "Saanjh Marigold Haldi Set", designer: "Atelier Meher",
    description: "Marigold and cream cotton-silk for a haldi that should look like sunlight, not costume.",
    story: "Washable enough for turmeric, tailored enough for photographs. Gota is used as punctuation, not noise.",
    images: [I.orangeSaree, I.cream, I.sitting, I.boutique], price: 28000, rentalPrice: 3200, deposit: 5000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["New", "Rent"], category: "shararas",
    occasions: ["haldi", "mehendi"], collections: ["haldi", "mehendi", "festive", "new-arrivals", "rent"],
    colors: [{ name: "Marigold", hex: "#d4a017" }, { name: "Ivory", hex: "#f6f1e8" }], sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Cotton silk", embroidery: "Gota patti", fit: "Relaxed kurta with gharara",
    care: ["Gentle dry clean recommended after turmeric"], details: ["Stain-guard finish on inner lining"],
    rating: 4.7, reviewCount: 25, relatedIds: ["p07", "p10", "p15"], lookIds: ["p10"], rentalBlockedDates: [],
  },
  {
    id: "p10", slug: "meher-mint-mehendi-lehenga", name: "Meher Mint Mehendi Lehenga", designer: "Noor by Vastralay",
    description: "Mint raw silk with coral threadwork — a garden colour that still reads as couture in photographs.",
    story: "Designed after a commission for a Jaipur mehendi under neem trees.",
    images: [I.portrait, I.embroidered, I.elegant, I.white], price: 78000, rentalPrice: 7200, deposit: 11000,
    availableToBuy: true, availableToRent: true, inStock: true, badges: ["Rent"], category: "lehengas",
    occasions: ["mehendi", "festive"], collections: ["mehendi", "lehengas", "festive", "rent"],
    colors: [{ name: "Mint", hex: "#9cbaa8" }], sizes: ["XS", "S", "M", "L"], fabric: "Raw silk", embroidery: "Coral resham",
    fit: "Light circular skirt", care: ["Dry clean"], details: ["Open-back blouse with inner lining"],
    rating: 4.6, reviewCount: 14, relatedIds: ["p07", "p09", "p06"], lookIds: ["p09"], rentalBlockedDates: ["2026-10-02", "2026-10-03"],
  },
];
