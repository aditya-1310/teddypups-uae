"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { Teddy } from "@/components/teddy/Teddy";

/**
 * Evaluates a point and tangent angle (degrees) along the Korea -> Dubai cubic Bézier:
 * M 40 250 C 170 40, 470 20, 620 168
 */
export function flightPose(rawT: number): { x: number; y: number; angle: number } {
  const t = Math.max(0, Math.min(1, rawT));
  const u = 1 - t;
  const x = u * u * u * 40 + 3 * u * u * t * 170 + 3 * u * t * t * 470 + t * t * t * 620;
  const y = u * u * u * 250 + 3 * u * u * t * 40 + 3 * u * t * t * 20 + t * t * t * 168;
  const dx = 3 * u * u * (170 - 40) + 6 * u * t * (470 - 170) + 3 * t * t * (620 - 470);
  const dy = 3 * u * u * (40 - 250) + 6 * u * t * (20 - 40) + 3 * t * t * (168 - 20);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { x, y, angle };
}

export function PathsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      const plane = planeRef.current;
      if (!el || !plane) return;
      const rect = el.getBoundingClientRect();
      // Map scroll from section entering viewport to leaving viewport into [0.08..0.92]
      const raw = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const t = 0.08 + Math.max(0, Math.min(1, raw)) * 0.84;
      const { x, y, angle } = flightPose(t);
      plane.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(angle * 0.55).toFixed(1)})`);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div data-section="paths">
      <section
        ref={sectionRef}
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-paths"
        style={{ "--sky-top": "#fbe3b4", "--sky-bottom": "#f7d18d" } as CSSProperties}
        aria-labelledby="paths-title"
      >
        <div className="gutter mx-auto max-w-[110rem]">
          <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
            Two ways to meet your puppy
          </h2>
          <div className="tp-fork">
            <div aria-hidden="true" className="tp-fork__post" />
            <article className="tp-way tp-way--left" aria-labelledby="way-local">
              <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
                Puppies in Dubai
              </h3>
              <div className="tp-way__scene" data-pup-look="true">
                <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden="true">
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <figure className="tp-window">
                  <span className="tp-window__glass">
                    <Image
                      src="/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg"
                      alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom"
                      fill
                      sizes="(min-width: 1024px) 16rem, 60vw"
                      style={{ objectFit: "cover", objectPosition: "54.3% 48.3%", backgroundColor: "#685848" }}
                    />
                  </span>
                  <figcaption className="font-scrawl">In our showroom</figcaption>
                </figure>
              </div>
              <p className="tp-way__text">
                See them, love them, take them home. Come meet our locally available puppies before you decide.
              </p>
              <Link className="btn btn-primary" href="/puppies?origin=local">
                Meet local puppies
              </Link>
            </article>

            <article className="tp-way tp-way--right" aria-labelledby="way-imported">
              <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
                Imported for you
              </h3>
              <div className="tp-way__scene" data-pup-look="true">
                <div className="tp-flight">
                  <svg viewBox="0 0 660 300" role="img" aria-label="A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai">
                    <defs>
                      <clipPath id="tp-flight-porthole">
                        <circle r="25" />
                      </clipPath>
                    </defs>
                    <path d="M40 250 C 170 40, 470 20, 620 168" className="tp-flight__route" />
                    <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
                    <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
                    <text x="40" y="284" textAnchor="middle" className="tp-flight__label">
                      Korea
                    </text>
                    <text x="620" y="202" textAnchor="middle" className="tp-flight__label">
                      Dubai
                    </text>
                    <g ref={planeRef} transform="translate(410 70)">
                      <g transform="translate(-126 -78)">
                        <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
                        <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far" />
                        <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" className="tp-flight__body" />
                        <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
                        <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
                      </g>
                      <g transform="translate(10 2)">
                        <image
                          href="/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg"
                          x="-25"
                          y="-25"
                          width="50"
                          height="50"
                          clipPath="url(#tp-flight-porthole)"
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <circle r="25" className="tp-flight__porthole" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <p className="tp-way__text">
                Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable breeders and let us handle the import.
              </p>
              <Link className="btn btn-primary" href="/puppies?origin=imported">
                See imported puppies
              </Link>
            </article>

            <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-fork__teddy">
              <Teddy pose="sit" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
