"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { getPuppies } from "@/lib/puppies";
import { SITE } from "@/lib/site";

const SEATS = [
  { x: "9%", w: "8.6rem", peek: "0.62", tilt: "-5deg" },
  { x: "22.5%", w: "10.4rem", peek: "0.8", tilt: "3deg" },
  { x: "35%", w: "9.2rem", peek: "0.7", tilt: "-2deg" },
  { x: "65%", w: "9.4rem", peek: "0.74", tilt: "3deg" },
  { x: "77.5%", w: "10.6rem", peek: "0.82", tilt: "-3deg" },
  { x: "91%", w: "8.4rem", peek: "0.6", tilt: "4deg" },
] as const;

const SEAT_ORDER = [5, 1, 3, 0, 4, 2];

export function HeroScene() {
  const pool = getPuppies();
  const [slots, setSlots] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [states, setStates] = useState<("idle" | "duck" | "pop")[]>(["idle", "idle", "idle", "idle", "idle", "idle"]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [poppedTag, setPoppedTag] = useState<number | null>(null);
  const [preloadIdx, setPreloadIdx] = useState(6);
  const nextPupRef = useRef(6);
  const turnRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || pool.length <= SEATS.length) return;

    let swapTimer: ReturnType<typeof setTimeout> | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      const seat = SEAT_ORDER[turnRef.current % SEAT_ORDER.length];
      turnRef.current += 1;

      setStates((prev) => prev.map((s, i) => (i === seat ? "duck" : s)));
      setPoppedTag((cur) => (cur === seat ? null : cur));

      swapTimer = setTimeout(() => {
        const nextIdx = nextPupRef.current % pool.length;
        nextPupRef.current += 1;
        setPreloadIdx(nextPupRef.current % pool.length);

        setSlots((prev) => prev.map((p, i) => (i === seat ? nextIdx : p)));
        setStates((prev) => prev.map((s, i) => (i === seat ? "pop" : s)));
        setPoppedTag(seat);

        settleTimer = setTimeout(() => {
          setStates((prev) => prev.map((s, i) => (i === seat ? "idle" : s)));
          setPoppedTag((cur) => (cur === seat ? null : cur));
        }, 1600);
      }, 360);
    }, 2200);

    return () => {
      clearInterval(interval);
      if (swapTimer) clearTimeout(swapTimer);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [pool.length]);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || document.documentElement.dataset.pup) return;
      const rect = el.getBoundingClientRect();
      el.dataset.here = rect.bottom > window.innerHeight * 0.35 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const preloadPup = pool[preloadIdx % pool.length];

  return (
    <div data-section="hero">
      <section
        ref={sectionRef}
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-hero"
        style={{ "--sky-top": "#fffdf8", "--sky-bottom": "#fff1d8", "--quilt": "#fff1d8" } as CSSProperties}
        aria-labelledby="hero-title"
      >
        <span aria-hidden="true" className="tp-hero__sun" />
        <div className="tp-hero__copy gutter">
          <p className="tp-hero__note font-scrawl">
            every puppy is family
            <svg viewBox="0 0 220 24" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-toffee" aria-hidden="true">
              <path d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
          <h1 id="hero-title" className="tp-hero__title font-plush">
            <span className="tp-hero__line">Premium teacup</span>
            <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
          </h1>
          <p className="tp-hero__lede">
            Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
          </p>
          <div className="tp-hero__actions">
            <Link className="btn btn-primary" href="/puppies">
              View available puppies
            </Link>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        <div className="tp-hero__stage">
          <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
            {SEATS.map((seat, i) => {
              const pup = pool[slots[i]] ?? pool[0];
              const state = states[i];
              return (
                <li
                  key={i}
                  className="tp-lineup__seat"
                  style={{ "--x": seat.x, "--w": seat.w, "--peek": seat.peek, "--tilt": seat.tilt, "--i": String(i) } as CSSProperties}
                >
                  <Link
                    className="tp-lineup__pup"
                    data-pup-friend="true"
                    data-state={state !== "idle" ? state : undefined}
                    aria-label={`Meet ${pup.displayName}, ${pup.breed}`}
                    href={`/puppies/${pup.slug}`}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered((cur) => (cur === i ? null : cur))}
                  >
                    <span className="tp-lineup__photo">
                      <Image
                        src={pup.cover.url}
                        alt={pup.cover.alt}
                        fill
                        sizes="11rem"
                        priority={i < 2}
                        style={{
                          objectFit: "cover",
                          objectPosition: `${pup.cover.focalX * 100}% ${pup.cover.focalY * 100}%`,
                          backgroundColor: pup.cover.color,
                        }}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
            {SEATS.map((seat, i) => {
              const pup = pool[slots[i]] ?? pool[0];
              const showTag = hovered === i || poppedTag === i;
              return (
                <li
                  key={i}
                  className="tp-lineup__seat"
                  style={{ "--x": seat.x, "--w": seat.w, "--peek": seat.peek, "--tilt": seat.tilt, "--i": String(i) } as CSSProperties}
                >
                  <span className="tp-lineup__ghost" data-tag={showTag ? "show" : undefined}>
                    <span className="tp-lineup__name font-scrawl">{pup.displayName}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          {preloadPup && (
            <span aria-hidden="true" className="tp-lineup__wings">
              <Image src={preloadPup.cover.url} alt="" fill sizes="11rem" />
            </span>
          )}

          <div data-pup-stop="true" data-pose="peek" data-facing="right" data-act="peekaboo" data-behind="true" data-lane="true" className="pup-stop tp-hero__teddy">
            <Teddy pose="peek" label="Teddy, the TeddyPups puppy, peeking over the quilt" />
          </div>

          <div aria-hidden="true" className="tp-quilt">
            <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
              <defs>
                <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: "var(--quilt)" } as CSSProperties} />
                  <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
                  <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
                </pattern>
              </defs>
              <rect width="100%" height="40" fill="url(#tp-scallop)" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
