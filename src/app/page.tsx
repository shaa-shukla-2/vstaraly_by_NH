import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, OCCASIONS } from "@/constants";
import { products, productsForCollection, galleryImages as I } from "@/data/products";
import { instagramShots, testimonials } from "@/data/content";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  const arrivals = products.filter((p) => p.badges.includes("New")).slice(0, 4);
  const bridal = productsForCollection("bridal").slice(0, 4);
  const rent = products.filter((p) => p.availableToRent).slice(0, 4);
  const trending = products.filter((p) => p.badges.includes("Bestseller")).slice(0, 4);
  const designer = productsForCollection("designer").slice(0, 3);
  const festive = productsForCollection("festive").slice(0, 4);
  const looks = products.slice(5, 9);

  return (
    <>
      <HeroCarousel />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeader
          eyebrow="The week"
          title="Shop by occasion"
          description="Bridal, reception, mehendi, haldi, festive and the careful art of being a guest."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {OCCASIONS.map((o) => (
            <Link key={o.slug} href={o.href} className="group border border-line bg-paper p-6">
              <p className="font-serif text-2xl group-hover:text-wine">{o.title}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">View edit</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ivory-deep py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader eyebrow="The rail" title="Shop by category" />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Link key={c.slug} href={c.href} className="group relative aspect-[3/4] overflow-hidden">
                <Image
                  src={[I.orangeSaree, I.goldLehenga, I.maroon, I.cream][i]}
                  alt={c.title}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-espresso/55 px-4 py-3 font-serif text-xl text-ivory">
                  {c.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Rail title="New arrivals" eyebrow="Just in" href="/collections/new-arrivals" products={arrivals} />
      <Rail title="The bridal edit" eyebrow="For the pheras" href="/bridal" products={bridal} />
      <Rail title="On the rent rail" eyebrow="Wear it once" href="/rent" products={rent} />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={I.cream} alt="Champagne sharara on a quiet rail" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Rent · Buy · Repeat</p>
          <h2 className="mt-3 font-serif text-4xl">Wear it for the weekend. Return it in the bag.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            A reception lehenga is a four-hour garment. Renting keeps the photographs and leaves the cupboard alone.
            Deposit back when the piece is.
          </p>
          <div className="mt-8 flex gap-3">
            <Button href="/rent">Explore rentals</Button>
            <Button href="/how-renting-works" variant="outline">
              How it works
            </Button>
          </div>
        </div>
      </section>

      <Rail title="Trending now" eyebrow="Most requested" href="/collections/best-sellers" products={trending} />

      <section className="border-y border-line bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader eyebrow="The house" title="Designer collection" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {designer.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/collections/designer" variant="gold">
              The designer rail
            </Button>
          </div>
        </div>
      </section>

      <Rail title="Festive collection" eyebrow="The calendar" href="/collections/festive" products={festive} />
      <Rail title="Best sellers" eyebrow="Tried, worn, requested again" href="/collections/best-sellers" products={trending} />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeader title="Complete the look" eyebrow="Atelier pairings" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {looks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-ivory-deep py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">From the dressing rooms</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name}>
                <p className="font-serif text-xl leading-8">“{t.quote}”</p>
                <footer className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted">
                  {t.name} · {t.place}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <SectionHeader title="Vastralay by NH" eyebrow="The studio roll" />
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-2 px-4 md:grid-cols-6 md:px-8">
          {instagramShots.map((src, index) => (
            <div key={`${src}-${index}`} className="relative aspect-square overflow-hidden">
              <Image src={src} alt="Vastralay by NH studio photograph" fill sizes="(min-width:768px) 16vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function Rail({
  title,
  eyebrow,
  href,
  products: list,
}: {
  title: string;
  eyebrow: string;
  href: string;
  products: typeof products;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeader align="left" eyebrow={eyebrow} title={title} />
        <Link href={href} className="hidden text-[11px] uppercase tracking-[0.18em] text-gold md:block">
          View all
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
