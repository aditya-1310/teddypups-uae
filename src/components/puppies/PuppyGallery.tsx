"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/media/Lightbox";
import type { Media } from "@/lib/puppies";

const focal = (m: Media) => `${m.focalX * 100}% ${m.focalY * 100}%`;

/** Storybook-style photo and video gallery for a puppy profile. */
export function PuppyGallery({ name, media }: { name: string; media: Media[] }) {
  const [current, setCurrent] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const n = media.length;
  const label = (i: number) => `${name}, ${media[i].kind === "video" ? "video" : "photo"} ${i + 1} of ${n}`;
  const step = (delta: number) => setCurrent((c) => (c + delta + n) % n);
  const item = media[current];

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <button type="button" className="absolute inset-0 block size-full" aria-label={`Open ${label(current)} full screen`} onClick={() => setViewer(current)}>
          {item.kind === "video" ? (
            <video
              key={item.url}
              src={item.url}
              poster={item.poster?.url}
              className="size-full object-cover"
              loop
              muted
              playsInline
              autoPlay
              aria-label={item.alt}
            />
          ) : (
            <Image
              key={item.url}
              src={item.url}
              alt={item.alt}
              fill
              priority={current === 0}
              sizes="(min-width: 1024px) 55vw, 92vw"
              style={{ objectFit: "cover", objectPosition: focal(item), backgroundColor: item.color }}
            />
          )}
        </button>
        {n > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Previous photo">
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {current + 1} / {n}
            </span>
            <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Next photo">
              ›
            </button>
          </div>
        )}
      </div>

      {n > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
          {media.map((m, i) => {
            const thumb = m.kind === "video" ? m.poster ?? m : m;
            const active = i === current;
            return (
              <li key={m.id} className="shrink-0">
                <button
                  type="button"
                  aria-label={label(i)}
                  aria-current={active}
                  onClick={() => setCurrent(i)}
                  className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                    active ? "-rotate-3 -translate-y-1 border-toffee-deep" : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa"
                  }`}
                >
                  <Image src={thumb.url} alt="" fill sizes="96px" style={{ objectFit: "cover", objectPosition: focal(thumb), backgroundColor: thumb.color }} />
                  {m.kind === "video" && <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Lightbox
        label={`${name} photos`}
        items={media.map((m) => ({ kind: m.kind, url: m.url, alt: m.alt, poster: m.poster?.url }))}
        index={viewer}
        caption={label}
        onIndex={setViewer}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}
