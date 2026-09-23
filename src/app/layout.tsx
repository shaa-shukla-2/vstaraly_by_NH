import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { APP_NAME, APP_TAGLINE } from "@/constants";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vastralaybynh.example"),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Vastralay by NH is a New Delhi atelier for bridal, festive and party couture. Rent, buy, or return. Designer sarees, lehengas and occasion wear.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ivory font-sans text-espresso">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
