"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";

export type Journey = {
  key: string;
  label: string;
  hint: string;
  heading: string;
  body: string;
  note: string | null;
  steps: { title: string; text: string }[];
};

const TINTS = ["#fbe3b4", "#fde6de", "#bfddf5", "#f2be6b"];

export function JourneyToggle({ journeys }: { journeys: Journey[] }) {
  const [active, setActive] = useState(0);
  const current = journeys[active] ?? journeys[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => (i + 1) % journeys.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => (i - 1 + journeys.length) % journeys.length);
    }
  };

  return (
    <section className="tp-journeys" data-ready="" aria-labelledby="two-ways-title">
      <div className="tp-journeys__top">
        <div>
          <p className="font-scrawl tp-journeys__kicker">choose your way</p>
          <h2 id="two-ways-title" className="font-plush text-big">
            Two ways home
          </h2>
        </div>

        <div className="tp-journeys__pick">
          <div
            role="tablist"
            aria-label="Ways to bring your puppy home"
            className="tp-switch"
            style={{ "--at": String(active), "--n": String(journeys.length) } as CSSProperties}
            onKeyDown={onKeyDown}
          >
            <span aria-hidden="true" className="tp-switch__thumb" />
            {journeys.map((j, i) => {
              const selected = i === active;
              return (
                <button
                  key={j.key}
                  type="button"
                  role="tab"
                  id={`tab-${j.key}`}
                  aria-selected={selected}
                  aria-controls={`panel-${j.key}`}
                  tabIndex={selected ? 0 : -1}
                  className="tp-switch__tab"
                  onClick={() => setActive(i)}
                >
                  <span className="font-plush tp-switch__label">{j.label}</span>
                  <span className="tp-switch__hint">{j.hint}</span>
                </button>
              );
            })}
          </div>
          <Teddy pose="sit" label="Teddy, waiting to see which way you pick" className="tp-journeys__teddy" />
        </div>
      </div>

      <div role="tabpanel" id={`panel-${current.key}`} aria-labelledby={`tab-${current.key}`} className="tp-journey">
        <div className="tp-journey__head">
          <div>
            <h3 className="font-plush tp-journey__title">{current.heading}</h3>
            <p className="text-lede mt-4 text-[var(--ink-soft)]">{current.body}</p>
            {current.note && <p className="mt-4 text-cocoa-soft">{current.note}</p>}
          </div>

          {current.key === "local" ? (
            <div aria-hidden="true" className="tp-postcard">
              <span className="tp-postcard__sun" />
              <svg viewBox="0 0 300 120" className="tp-postcard__city" aria-hidden="true">
                <path
                  d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-scrawl tp-postcard__to tp-postcard__to--left">Downtown Dubai</span>
            </div>
          ) : (
            <div aria-hidden="true" className="tp-postcard tp-postcard--sky">
              <svg viewBox="0 0 300 140" className="tp-postcard__route" aria-hidden="true">
                <path d="M24 108C92 22 204 22 276 96" />
              </svg>
              <svg viewBox="0 0 64 40" className="tp-postcard__plane" aria-hidden="true">
                <path d="M4 22l18-3L38 6l5 2-9 13 18 2 6-6h4l-3 9 3 9h-4l-6-6-18 2 9 13-5 2-16-13-18-3z" fill="currentColor" />
              </svg>
              <span className="font-scrawl tp-postcard__from">Korea &amp; Europe</span>
              <span className="font-scrawl tp-postcard__to">Dubai</span>
            </div>
          )}
        </div>

        <ol className="tp-steps">
          {current.steps.map((s, i) => (
            <li key={s.title} className="tp-step" style={{ "--i": String(i), "--tint": TINTS[i % TINTS.length] } as CSSProperties}>
              <span aria-hidden="true" className="tp-step__icon">
                <PawIcon className="size-6" />
              </span>
              <span className="tp-step__num font-plush">Step {i + 1}</span>
              <h4 className="font-plush-text tp-step__title">{s.title}</h4>
              <p className="tp-step__text">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Link href={current.key === "local" ? "/puppies?origin=local" : "/puppies?origin=imported"} className="btn btn-primary">
            {current.key === "local" ? "Meet local puppies" : "See imported puppies"}
          </Link>
        </div>
      </div>
    </section>
  );
}
