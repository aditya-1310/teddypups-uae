"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { getPuppies, hasVideo } from "@/lib/puppies";

const DOOR_COLORS = ["#a24a1a", "#5a3a28", "#2f6e9e", "#c2622b", "#6f4e37"];

/**
 * Pure corridor math: given vertical scroll progress [0..1] through the pinned
 * Meet section, computes the horizontal track offset and which doors have reached
 * Teddy's trigger point so they swing open.
 */
export function computeCorridorState(
  progress: number,
  maxTranslate: number,
  doorCenters: number[],
  triggerX: number,
): { translateX: number; openDoors: boolean[] } {
  const clamped = Math.max(0, Math.min(1, progress));
  const translateX = clamped * Math.max(0, maxTranslate);
  const openDoors = doorCenters.map((center) => center - translateX <= triggerX);
  return { translateX, openDoors };
}

export function MeetScene() {
  const puppies = getPuppies();
  const rangeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);

  const [pinned, setPinned] = useState(false);
  const [pinHeight, setPinHeight] = useState<number | undefined>(undefined);
  const [openDoors, setOpenDoors] = useState<boolean[]>(() => puppies.map(() => false));

  useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    const syncMode = () => {
      const isDesktop = mq.matches;
      setPinned(isDesktop);
      if (!isDesktop) {
        setPinHeight(undefined);
        if (trackRef.current) trackRef.current.style.transform = "";
      }
    };
    const id = requestAnimationFrame(syncMode);
    mq.addEventListener("change", syncMode);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", syncMode);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;

    let maxTranslate = 0;
    let doorCenters: number[] = [];
    let raf = 0;

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);
      const items = Array.from(track.querySelectorAll<HTMLLIElement>("li.tp-door:not(.tp-door--all)"));
      doorCenters = items.map((li) => li.offsetLeft + li.offsetWidth * 0.5);
      // Scroll distance equals horizontal travel + 1 viewport height for the sticky stage
      setPinHeight(Math.round(maxTranslate * 0.9 + window.innerHeight));
    };

    const update = () => {
      raf = 0;
      const range = rangeRef.current;
      const track = trackRef.current;
      if (!range || !track) return;

      const rect = range.getBoundingClientRect();
      const scrollable = Math.max(1, range.offsetHeight - window.innerHeight);
      const progress = -rect.top / scrollable;
      const triggerX = window.innerWidth * 0.44;
      const { translateX, openDoors: nextOpen } = computeCorridorState(progress, maxTranslate, doorCenters, triggerX);

      track.style.transform = `translate3d(${-translateX.toFixed(1)}px, 0, 0)`;
      if (floorRef.current) {
        floorRef.current.style.backgroundPositionX = `${-translateX.toFixed(1)}px`;
      }
      setOpenDoors((prev) => (prev.length === nextOpen.length && prev.every((v, i) => v === nextOpen[i]) ? prev : nextOpen));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [pinned]);

  return (
    <div data-section="meet">
      <section
        data-pup-scene="true"
        data-tone="light"
        data-pinned={pinned ? "" : undefined}
        className="tp-scene tp-meet"
        style={{ "--sky-top": "#fff1d8", "--sky-bottom": "#fbe3b4" } as CSSProperties}
        aria-labelledby="meet-title"
      >
        <div
          ref={rangeRef}
          data-pin-range="true"
          style={{ "--pinned": pinned ? "1" : "0", height: pinHeight ? `${pinHeight}px` : undefined } as CSSProperties}
        >
          <div className="tp-meet__stage">
            <header className="tp-meet__head gutter">
              <div>
                <h2 id="meet-title" className="font-plush text-huge">
                  Meet the pups
                </h2>
                <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                  Real puppies, real photos, looking for their families right now.
                </p>
              </div>
              <Link className="btn btn-primary shrink-0" href="/puppies">
                See all available puppies
              </Link>
            </header>

            <div className="tp-meet__hall">
              <ol ref={trackRef} className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
                {puppies.map((p, i) => {
                  const isOpen = !pinned || (openDoors[i] ?? false);
                  const meta = [p.name ? p.breed : null, p.genderLabel.toLowerCase(), p.age, hasVideo(p) ? "with video" : null]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <li key={p.slug} className="tp-door" data-open={isOpen ? "true" : "false"}>
                      <Link
                        className="tp-door__link"
                        style={{ "--door": DOOR_COLORS[i % DOOR_COLORS.length] } as CSSProperties}
                        href={`/puppies/${p.slug}`}
                      >
                        <span className="tp-door__plate">
                          <span className="font-plush tp-door__name">{p.displayName}</span>
                          <span className="tp-door__meta">{meta}</span>
                        </span>
                        <span className="tp-door__frame">
                          <span className="tp-door__room">
                            <Image
                              src={p.cover.url}
                              alt={p.cover.alt}
                              fill
                              sizes="(min-width: 1024px) 15rem, 44vw"
                              style={{
                                objectFit: "cover",
                                objectPosition: `${p.cover.focalX * 100}% ${p.cover.focalY * 100}%`,
                                backgroundColor: p.cover.color,
                              }}
                            />
                          </span>
                          <span aria-hidden="true" className="tp-door__way">
                            <span className="tp-door__leaf">
                              <PawIcon className="tp-door__peephole" />
                              <span className="tp-door__knob" />
                            </span>
                          </span>
                          <span className="tp-door__tag font-scrawl">Available</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li className="tp-door tp-door--all">
                  <Link className="tp-door__link" href="/puppies">
                    <span className="tp-door__frame tp-door__frame--all">
                      <span className="font-plush tp-door__all">Meet them all</span>
                    </span>
                  </Link>
                </li>
              </ol>

              <div ref={floorRef} aria-hidden="true" className="tp-meet__floor" />
              <div data-pup-stop="true" data-pose="walk" data-facing="right" data-act="doorway" data-lane="true" className="pup-stop tp-meet__teddy">
                <Teddy pose="sit" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
