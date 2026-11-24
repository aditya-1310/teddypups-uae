"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { Lightbox } from "@/components/media/Lightbox";
import type { Media } from "@/lib/puppies";

export type FamilyPhoto = Media & { caption: string };

const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 1.1];
const TAPES = ["#f6d79a", "#f9cdbf", "#cfe5f6"];
const TAPE_POS = ["center", "left", "right", "both"] as const;

export function FamilyWall({ photos }: { photos: FamilyPhoto[] }) {
  const [viewer, setViewer] = useState<number | null>(null);
  const n = photos.length;

  return (
    <div>
      <ul className="tp-wall" aria-label="Photos from TeddyPups families">
        {photos.map((photo, i) => {
          const tilt = TILTS[i % TILTS.length];
          const tape = TAPES[i % TAPES.length];
          const pos = TAPE_POS[i % TAPE_POS.length];
          const label = photo.caption ? `Open photo ${i + 1} of ${n}: ${photo.caption}` : `Open photo ${i + 1} of ${n}`;

          return (
            <li key={photo.id} className="tp-wall__item" data-reveal="true" style={{ "--d": `${(i % 6) * 60}ms` } as CSSProperties}>
              <button type="button" className="tp-wall__print" aria-label={label} onClick={() => setViewer(i)}>
                <span className="tp-polaroid" style={{ "--tilt": `${tilt}deg`, "--tape": tape, "--i": String(i % 8) } as CSSProperties}>
                  {pos === "both" ? (
                    <>
                      <span aria-hidden="true" className="tp-tape tp-tape--tl" />
                      <span aria-hidden="true" className="tp-tape tp-tape--tr" />
                    </>
                  ) : (
                    <span aria-hidden="true" className={`tp-tape tp-tape--${pos}`} />
                  )}
                  <span className="tp-polaroid__photo">
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
                      priority={i < 2}
                      style={{ width: "100%", height: "auto", backgroundColor: photo.color }}
                    />
                  </span>
                  <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
                </span>
                <PawIcon className="tp-wall__paw" />
              </button>
            </li>
          );
        })}
      </ul>

      <Lightbox
        label="Photo viewer"
        items={photos.map((p) => ({ kind: "image", url: p.url, alt: p.alt }))}
        index={viewer}
        caption={(i) => photos[i]?.caption || `${i + 1} of ${n}`}
        onIndex={setViewer}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}
