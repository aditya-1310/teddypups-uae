"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type LightboxItem = { kind: "image" | "video"; url: string; alt: string; poster?: string };

type LightboxProps = {
  label: string;
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  caption: (index: number) => string;
  onIndex: (index: number) => void;
  onClose: () => void;
};

/** Full-screen photo/video viewer built on the native <dialog> element. */
export function Lightbox({ label, items, index, caption, onIndex, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const step = (delta: number) => index !== null && onIndex((index + delta + items.length) % items.length);
  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      data-lenis-prevent="true"
    >
      {item && index !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg">{caption(index)}</p>
            <button type="button" onClick={onClose} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
              Close
            </button>
          </div>
          <div className="relative flex-1 touch-pan-y">
            <div className="absolute inset-0">
              {item.kind === "video" ? (
                <video key={item.url} src={item.url} poster={item.poster} controls autoPlay playsInline className="size-full object-contain" />
              ) : (
                <Image key={item.url} src={item.url} alt={item.alt} fill sizes="100vw" className="object-contain" />
              )}
            </div>
          </div>
          {items.length > 1 && (
            <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
              <button type="button" onClick={() => step(-1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => step(1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
