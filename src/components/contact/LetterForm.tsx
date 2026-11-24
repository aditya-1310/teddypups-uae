"use client";

import { useId, useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { validateEnquiry, type EnquiryErrors } from "@/lib/enquiry";
import type { Puppy } from "@/lib/puppies";

type Phase = "idle" | "sealing" | "posting" | "sent";

function EnvelopeAndMailbox({ phase }: { phase: "sealing" | "posting" }) {
  return (
    <div aria-hidden="true" className="tp-post__scene">
      <svg viewBox="0 0 180 120" className="tp-post__envelope">
        <rect x="6" y="16" width="168" height="98" rx="12" fill="#fff8ea" stroke="#2a170e" strokeWidth="4" />
        <path d="M6 20l84 56 84-56" fill="none" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
        <path d="M6 20l84 56 84-56Z" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" className="tp-post__flap" />
      </svg>
      <svg viewBox="0 0 180 170" className="tp-post__box">
        <path d="M32 60c0-32 26-50 58-50s58 18 58 50v86H32Z" fill="#c2622b" stroke="#2a170e" strokeWidth="4" />
        <rect x="48" y="64" width="84" height="14" rx="7" fill="#2a170e" />
        <rect x="78" y="146" width="24" height="24" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
        <g className="tp-post__flag" data-phase={phase}>
          <rect x="148" y="42" width="6" height="44" rx="3" fill="#2a170e" />
          <path d="M154 42h20v16h-20Z" fill="#f2be6b" stroke="#2a170e" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export function LetterForm({ puppies }: { puppies: Puppy[] }) {
  const selectId = useId();
  const messageId = useId();
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      area: String(fd.get("area") ?? ""),
      puppy: String(fd.get("puppyId") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const checked = validateEnquiry(payload);
    if (!checked.ok) {
      setErrors(checked.errors);
      return;
    }

    setErrors({});
    setServerError("");
    setSending(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { errors?: EnquiryErrors; error?: string };
        if (body.errors) setErrors(body.errors);
        else setServerError(body.error ?? "Something went wrong. Please message us on WhatsApp.");
        setSending(false);
        return;
      }

      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setPhase("sent");
        setSending(false);
        return;
      }

      setPhase("sealing");
      setTimeout(() => setPhase("posting"), 650);
      setTimeout(() => {
        setPhase("sent");
        setSending(false);
      }, 1550);
    } catch {
      setServerError("Network error. Please try again or message us on WhatsApp.");
      setSending(false);
    }
  }

  if (phase === "sent") {
    return (
      <div className="tp-post__sent" role="status" tabIndex={-1}>
        <svg viewBox="0 0 180 170" className="tp-post__box tp-post__box--sent" aria-hidden="true">
          <path d="M32 60c0-32 26-50 58-50s58 18 58 50v86H32Z" fill="#c2622b" stroke="#2a170e" strokeWidth="4" />
          <rect x="48" y="64" width="84" height="14" rx="7" fill="#2a170e" />
          <rect x="78" y="146" width="24" height="24" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
          <rect x="148" y="42" width="6" height="44" rx="3" fill="#2a170e" />
          <path d="M154 42h20v16h-20Z" fill="#fffdf8" stroke="#2a170e" strokeWidth="3" />
        </svg>
        <h2 className="font-plush mt-4 text-3xl">Your letter is in the post!</h2>
        <p className="mx-auto mt-3 max-w-[38ch] text-cocoa-soft">
          Thank you for writing to TeddyPups. Our team will reply on your phone or WhatsApp shortly.
        </p>
        <button type="button" onClick={() => setPhase("idle")} className="btn btn-ghost mt-6">
          Write another letter
        </button>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <div className="tp-post" data-phase={phase !== "idle" ? phase : undefined}>
      <form noValidate onSubmit={onSubmit} className="tp-letterform">
        <span aria-hidden="true" className="tp-letter__stamp">
          <PawIcon className="size-9" />
        </span>
        <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>

        {(errorList.length > 0 || serverError) && (
          <div role="alert" className="tp-letterform__alert">
            <p className="font-semibold">Please check the highlighted fields.</p>
            <ul>
              {errorList.map(([k, msg]) => (
                <li key={k}>{msg}</li>
              ))}
              {serverError && <li>{serverError}</li>}
            </ul>
          </div>
        )}

        <p className="tp-letterform__line">
          my name is{" "}
          <span className="tp-blank" style={{ "--size": "16ch" } as CSSProperties}>
            <input
              aria-label="Your name (required)"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              name="name"
              aria-invalid={Boolean(errors.name)}
            />
          </span>
          , and you can reach me on{" "}
          <span className="tp-blank" style={{ "--size": "15ch" } as CSSProperties}>
            <input
              aria-label="Phone or WhatsApp number with country code (required)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+971 50 123 4567"
              name="phone"
              aria-invalid={Boolean(errors.phone)}
            />
          </span>{" "}
          or by email at{" "}
          <span className="tp-blank" style={{ "--size": "20ch" } as CSSProperties}>
            <input
              aria-label="Email (optional)"
              type="email"
              autoComplete="email"
              placeholder="optional"
              name="email"
              aria-invalid={Boolean(errors.email)}
            />
          </span>
          .
        </p>

        <p className="tp-letterform__line">
          I live in{" "}
          <span className="tp-blank" style={{ "--size": "13ch" } as CSSProperties}>
            <input aria-label="Your area (optional)" autoComplete="address-level2" maxLength={80} placeholder="e.g. Dubai Marina" name="area" />
          </span>
          , and I&apos;m curious about{" "}
          <span className="tp-blank tp-blank--select">
            <label htmlFor={selectId} className="sr-only">
              Puppy you&apos;re interested in (optional)
            </label>
            <select id={selectId} name="puppyId" defaultValue="">
              <option value="">any puppy (not sure yet)</option>
              {puppies.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.displayName} ({p.name ? `${p.breed}, ` : ""}
                  {p.genderLabel.toLowerCase()})
                </option>
              ))}
            </select>
          </span>
          .
        </p>

        <label htmlFor={messageId} className="sr-only">
          Your message (optional)
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Anything else you'd like to tell us…"
          className="tp-letterform__note"
        />

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
          </label>
        </div>

        <div className="tp-letterform__sign">
          <p className="font-scrawl">with love, a future puppy parent</p>
          <button type="submit" disabled={sending} className="btn btn-primary disabled:opacity-70">
            {sending ? "Posting…" : "Post my letter"}
          </button>
        </div>
      </form>
      {(phase === "sealing" || phase === "posting") && <EnvelopeAndMailbox phase={phase} />}
    </div>
  );
}
