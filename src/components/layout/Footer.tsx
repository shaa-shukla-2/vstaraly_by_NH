import Link from "next/link";
import Image from "next/image";
import { APP_NAME, APP_TAGLINE } from "@/constants";

const cols = [
  {
    title: "Collections",
    links: [
      ["Bridal", "/bridal"],
      ["Sarees", "/collections/sarees"],
      ["Lehengas", "/collections/lehengas"],
      ["Party Wear", "/collections/party-wear"],
      ["Festive", "/collections/festive"],
      ["Rent", "/rent"],
      ["Sale", "/collections/sale"],
    ],
  },
  {
    title: "Occasions",
    links: [
      ["Reception", "/collections/reception"],
      ["Engagement", "/collections/engagement"],
      ["Mehendi", "/collections/mehendi"],
      ["Haldi", "/collections/haldi"],
      ["Wedding Guest", "/collections/wedding-guest"],
    ],
  },
  {
    title: "The House",
    links: [
      ["About", "/about"],
      ["Lookbook", "/lookbook"],
      ["Journal", "/journal"],
      ["Contact", "/contact"],
      ["FAQ", "/faq"],
      ["Size Guide", "/size-guide"],
      ["How Renting Works", "/how-renting-works"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
      ["Refunds", "/refund-policy"],
      ["Rental Policy", "/rental-policy"],
      ["Cancellation", "/cancellation"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-ivory-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-5 md:px-8">
        <div>
          <Image src="/images/vastralay-logo.png" alt={APP_NAME} width={834} height={355} className="h-16 w-auto object-contain" />
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{APP_TAGLINE}</p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-gold">
            Defence Colony, New Delhi
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-espresso">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted hover:text-espresso">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line py-6 text-center text-[11px] uppercase tracking-[0.16em] text-muted">
        © {new Date().getFullYear()} Vastralay by NH. Atelier pieces, not costumes.
      </div>
    </footer>
  );
}
