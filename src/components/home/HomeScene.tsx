"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { SITE } from "@/lib/site";

export function HomeScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }
    if (!document.documentElement.dataset.pup) {
      el.dataset.visited = "false";
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (!document.documentElement.dataset.pup) {
            el.dataset.visited = "true";
          }
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div data-section="cta">
      <section
        ref={sectionRef}
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-home"
        style={{ "--sky-top": "#2f1a10", "--sky-bottom": "#24130b" } as CSSProperties}
        aria-labelledby="cta-title"
      >
        <div className="tp-home__copy gutter">
          <h2 id="cta-title" className="font-plush text-huge">
            Ready to meet your new best friend?
          </h2>
          <p className="tp-home__lede">
            Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
          </p>
        </div>
        <div className="tp-house">
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
          <span aria-hidden="true" className="tp-house__lamp" />
          <div className="tp-house__doorway">
            <span className="tp-house__inside">
              <Image
                src="/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp"
                alt="Max, waiting inside"
                fill
                sizes="16rem"
                style={{ objectFit: "cover", objectPosition: "53.8% 44.3%", backgroundColor: "#785838" }}
              />
            </span>
            <span aria-hidden="true" className="tp-house__door">
              <span className="tp-house__peep" />
              <span className="tp-house__knob" />
            </span>
          </div>
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
          <span aria-hidden="true" className="tp-house__mat font-scrawl">
            welcome home
          </span>
          <div data-pup-stop="true" data-pose="bow" data-facing="right" className="pup-stop tp-house__teddy">
            <Teddy pose="door" />
          </div>
        </div>
        <div className="tp-home__actions gutter">
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            Enquire on WhatsApp
          </a>
          <Link className="btn btn-ghost tp-home__ghost" href="/contact">
            Visit &amp; contact
          </Link>
        </div>
      </section>
    </div>
  );
}
