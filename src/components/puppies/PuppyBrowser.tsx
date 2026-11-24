"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SketchCard } from "@/components/puppies/SketchCard";
import { SITE } from "@/lib/site";
import {
  filterPuppies,
  hasVideo,
  matchSummary,
  parseFilters,
  puppyLabel,
  puppyMeta,
  type Puppy,
  type PuppyFilters,
} from "@/lib/puppies";

type Key = keyof PuppyFilters;
type Chip = { label: string; key: Key; value: string };

const WHERE: Chip[] = [
  { label: "Imported", key: "origin", value: "imported" },
  { label: "Korean Teacup", key: "collection", value: "korean-teacup" },
];
const BREEDS: Chip[] = [
  { label: "Maltipoo", key: "breed", value: "maltipoo" },
  { label: "Pomeranian", key: "breed", value: "pomeranian" },
  { label: "Poodle", key: "breed", value: "poodle" },
  { label: "Cavapoo", key: "breed", value: "cavapoo" },
  { label: "Shih Tzu", key: "breed", value: "shih-tzu" },
];
const GENDERS: Chip[] = [
  { label: "Boys", key: "gender", value: "male" },
  { label: "Girls", key: "gender", value: "female" },
];
const ORDER: Key[] = ["origin", "collection", "breed", "gender"];

export function PuppyBrowser({ puppies }: { puppies: Puppy[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PuppyFilters>(() => parseFilters(new URLSearchParams(searchParams.toString())));

  const apply = (next: PuppyFilters) => {
    setFilters(next);
    const qs = new URLSearchParams();
    for (const key of ORDER) if (next[key]) qs.set(key, next[key]!);
    const query = qs.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggle = (chip: Chip) => {
    const next = { ...filters };
    if (next[chip.key] === chip.value) delete next[chip.key];
    else next[chip.key] = chip.value;
    // Origin and collection share the "where" row, so only one can be active.
    if (chip.key === "origin") delete next.collection;
    if (chip.key === "collection") delete next.origin;
    apply(next);
  };

  const everywhere = () => {
    const next = { ...filters };
    delete next.origin;
    delete next.collection;
    apply(next);
  };

  const shown = filterPuppies(puppies, filters);
  const filtered = Object.keys(filters).length > 0;
  const pressed = (c: Chip) => filters[c.key] === c.value;

  const row = (title: string, chips: Chip[], extra?: React.ReactNode) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{title}</span>
      {extra}
      {chips.map((c) => (
        <button key={c.label} type="button" aria-pressed={pressed(c)} className="tp-sticker-chip" onClick={() => toggle(c)}>
          {c.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        {row(
          "where",
          WHERE,
          <button type="button" aria-pressed={!filters.origin && !filters.collection} className="tp-sticker-chip" onClick={everywhere}>
            Everywhere
          </button>,
        )}
        {row("breed", BREEDS)}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">boy or girl</span>
          {GENDERS.map((c) => (
            <button key={c.label} type="button" aria-pressed={pressed(c)} className="tp-sticker-chip" onClick={() => toggle(c)}>
              {c.label}
            </button>
          ))}
          {filtered && (
            <button type="button" className="link-ink ml-auto text-[0.95rem] font-semibold" onClick={() => apply({})}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {matchSummary(shown.length, filtered)}
      </p>

      <div>
        <ul className="tp-sketches mt-8" aria-label="Available puppies">
          {shown.map((p, i) => (
            <li key={p.slug}>
              <SketchCard
                slug={p.slug}
                index={i}
                label={puppyLabel(p)}
                name={p.displayName}
                meta={puppyMeta(p)}
                cover={p.cover}
                hasVideo={hasVideo(p)}
              />
            </li>
          ))}
        </ul>
        {shown.length === 0 && (
          <div className="mt-10">
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                Ask on WhatsApp
              </a>
              <button type="button" className="btn btn-ghost" onClick={() => apply({})}>
                Show all puppies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
