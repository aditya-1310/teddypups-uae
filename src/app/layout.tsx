import type { Metadata } from "next";
import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";
import { MobileBar } from "@/components/layout/MobileBar";
import { PageCurtain } from "@/components/layout/PageCurtain";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { PawCursorTrail } from "@/components/motion/PawCursorTrail";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const shantell = Shantell_Sans({ variable: "--font-shantell", subsets: ["latin"], axes: ["BNCE", "INFM"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Premium teacup puppies in Dubai`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.",
  applicationName: SITE.name,
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}>
      <body>
        <PageCurtain />
        <RevealObserver />
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileBar />
        <PawCursorTrail />
      </body>
    </html>
  );
}
