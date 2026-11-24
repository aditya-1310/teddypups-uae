import Image from "next/image";
import Link from "next/link";
import { Twinkle } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="tp-footer relative pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
      <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="tp-footer__hill">
        <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z" />
      </svg>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "6%", top: "18%", width: "12.6px", animationDelay: "0.00s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "14%", top: "42%", width: "8.4px", animationDelay: "0.40s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "23%", top: "12%", width: "9.799999999999999px", animationDelay: "0.80s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "31%", top: "30%", width: "7px", animationDelay: "1.20s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "44%", top: "9%", width: "11.200000000000001px", animationDelay: "1.60s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "52%", top: "36%", width: "7.700000000000001px", animationDelay: "2.00s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "63%", top: "15%", width: "10.5px", animationDelay: "2.40s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "71%", top: "40%", width: "7px", animationDelay: "2.80s" } as React.CSSProperties} />
          <Twinkle className="tp-twinkle absolute text-honey" style={{ left: "92%", top: "33%", width: "8.4px", animationDelay: "3.20s" } as React.CSSProperties} />
        </div>
        <span className="tp-moon" />
      </div>
      <div className="gutter relative mx-auto grid max-w-[110rem] gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        <div className="md:col-span-5">
          <p className="font-plush text-big text-honey-soft">
            Home, at last.
          </p>
          <p className="mt-5 max-w-md text-milk/80">
            TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
          </p>
        </div>
        <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          <div className="tp-basket">
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__back">
              <ellipse cx="212" cy="145" rx="96" ry="12" className="tp-basket__hollow" />
              <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim-line" />
              <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim" />
            </svg>
            <div data-pup-stop="true" data-pose="snug" data-facing="right" data-act="basket" data-behind="true" data-lane="true" className="pup-stop tp-basket__pup">
              <Teddy pose="basket" label="Teddy, sitting snug in his basket" />
            </div>
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__front">
              <path d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z" className="tp-basket__body" />
              <path d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206" className="tp-basket__weave" />
              <path d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230" className="tp-basket__weave tp-basket__weave--stakes" />
              <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim-line" />
              <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim" />
            </svg>
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
          <ul className="mt-4 space-y-2.5 text-milk/90">
            <li>
              <a className="font-semibold hover:text-honey" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-honey">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.address}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social media">
            {SITE.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="gutter relative mx-auto mt-16 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="size-9" style={{ color: "transparent" } as React.CSSProperties} />
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span className="font-scrawl text-base text-honey/80">
          every puppy is family
        </span>
      </div>
    </footer>
  );
}
