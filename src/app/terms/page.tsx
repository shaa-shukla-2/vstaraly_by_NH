import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Terms" };

export default function Page() {
  return (
    <PolicyPage
      eyebrow="The fine print"
      title="Terms"
      paragraphs={[
        "By using this storefront you are looking at a frontend demonstration of Vastralay by NH. Products, prices and availability are illustrative.",
        "Images are sourced for design purposes. Garments described belong to the Vastralay by NH collection.",
        "Real orders, payments and deliveries will only exist once a backend is connected.",
      ]}
    />
  );
}
