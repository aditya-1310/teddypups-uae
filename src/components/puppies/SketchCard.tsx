import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import type { Media } from "@/lib/puppies";
import { maskUrl, sketchDecor, type Doodle } from "@/lib/sketch";

type SketchCardProps = {
  slug: string;
  label: string;
  name: string;
  meta: string;
  cover: Media;
  index: number;
  gone?: boolean;
  hasVideo?: boolean;
  small?: boolean;
  sizes?: string;
};

function DoodleShape({ kind }: { kind: Doodle["kind"] }) {
  const line = { fill: "none", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (kind) {
    case "swirl":
      return <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" stroke="#c2622b" {...line} />;
    case "whoosh":
      return <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" stroke="#a24a1a" {...line} />;
    case "star":
      return <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill="#c2622b" />;
    case "heart":
      return (
        <path
          d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z"
          stroke="#2a170e"
          {...line}
        />
      );
    case "dots":
      return (
        <g fill="#d4893f">
          <circle cx="-4" cy="1" r="1.2" />
          <circle cx="0" cy="-2" r="1.2" />
          <circle cx="4" cy="1" r="1.2" />
        </g>
      );
    case "paw":
      return (
        <g transform="scale(.17) translate(-32 -34)" opacity="0.85">
          <PawIcon x="0" y="0" width="64" height="64" color="#d4893f" />
        </g>
      );
  }
}

/** A puppy drawn into Teddy's sketchbook: masked photo, ink outline and doodles. */
export function SketchCard({ slug, label, name, meta, cover, index, gone, hasVideo, small, sizes }: SketchCardProps) {
  const d = sketchDecor(slug, index);
  const mask = maskUrl(d.mask);
  return (
    <Link
      className={small ? "tp-sketch tp-sketch--small" : "tp-sketch"}
      data-reveal="true"
      style={{ "--tilt": `${d.tilt}deg`, "--d": d.delay, "--wash": d.wash } as CSSProperties}
      aria-label={label}
      href={`/puppies/${slug}`}
    >
      <span className="tp-sketch__frame">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__wash" style={{ translate: d.washShift }}>
          <path d={d.washPath} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <Image
            src={cover.url}
            alt=""
            fill
            sizes={sizes ?? "(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"}
            style={{ objectFit: "cover", objectPosition: `${cover.focalX * 100}% ${cover.focalY * 100}%`, backgroundColor: cover.color }}
          />
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={d.ink} pathLength={1} className="tp-sketch__line" />
          <path d={d.retrace} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {d.doodles.map((doodle, i) => (
            <g key={i} transform={doodle.transform}>
              <g className="tp-sketch__doodle">
                <DoodleShape kind={doodle.kind} />
              </g>
            </g>
          ))}
        </svg>
        {gone ? (
          <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>
        ) : (
          <span className="tp-sketch__sticker font-scrawl">Available</span>
        )}
        {hasVideo && <span className="tp-sketch__video">▶ video</span>}
      </span>
      <span className="tp-sketch__name font-plush">{name}</span>
      <span className="tp-sketch__meta">{meta}</span>
    </Link>
  );
}
