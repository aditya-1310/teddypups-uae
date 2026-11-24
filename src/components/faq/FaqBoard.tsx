"use client";

import { useId, useState, type CSSProperties } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { SITE } from "@/lib/site";

export type FaqItem = { id: string; question: string; answer: string };

const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.3, 0.9];
const PINS = ["var(--color-toffee)", "var(--color-sky-deep)", "#d9a13c", "#c45a6a"];

export function FaqBoard({ faqs }: { faqs: FaqItem[] }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const shown = q ? faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) : faqs;
  const countText = q
    ? `${shown.length} ${shown.length === 1 ? "note" : "notes"} match`
    : `${shown.length} ${shown.length === 1 ? "note" : "notes"} on the board`;

  return (
    <div className="tp-notes">
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={searchId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="tp-notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={searchId}
            type="search"
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {countText}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden="true" className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <Teddy pose="sit" label="Teddy, reading the notes" />
        </div>
        <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">
          Ask your own question
        </a>
      </aside>

      <div className="tp-notes__board">
        {shown.length > 0 ? (
          <ul className="tp-notes__list">
            {shown.map((item, i) => {
              const open = openId === item.id;
              return (
                <li
                  key={item.id}
                  className="tp-note"
                  data-reveal="true"
                  data-unfolded={open ? "" : undefined}
                  style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, "--pin": PINS[i % PINS.length], "--i": String(i) } as CSSProperties}
                >
                  <span aria-hidden="true" className="tp-note__pin" />
                  <h2 className="tp-note__q">
                    <button
                      type="button"
                      id={`q-${item.id}`}
                      aria-expanded={open}
                      aria-controls={`a-${item.id}`}
                      onClick={() => setOpenId(open ? null : item.id)}
                    >
                      <span className="font-plush-text">{item.question}</span>
                      <span aria-hidden="true" className="tp-note__chevron" />
                    </button>
                  </h2>
                  <div
                    id={`a-${item.id}`}
                    role="region"
                    aria-labelledby={`q-${item.id}`}
                    className="tp-note__answer"
                    inert={!open ? true : undefined}
                  >
                    <div className="tp-note__flap">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-3xl border-[3px] border-dashed border-milk/40 p-8 text-center text-milk">
            <p className="font-plush text-2xl">No notes match &ldquo;{query.trim()}&rdquo;.</p>
            <button type="button" onClick={() => setQuery("")} className="btn btn-ghost mt-5 !border-milk !text-milk hover:!bg-milk hover:!text-cocoa">
              Show all questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
