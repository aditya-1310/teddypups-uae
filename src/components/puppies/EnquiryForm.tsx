"use client";

import { useId, useState } from "react";
import { validateEnquiry, type EnquiryErrors } from "@/lib/enquiry";

type EnquiryFormProps = {
  puppySlug: string;
  puppyName: string;
  breed: string;
};

const INPUT_CLASS =
  "mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]";

export function EnquiryForm({ puppySlug, puppyName, breed }: EnquiryFormProps) {
  const baseId = useId();
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const who = puppyName && puppyName !== breed ? `${puppyName} (${breed})` : breed;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      area: String(fd.get("area") ?? ""),
      puppy: String(fd.get("puppy") ?? ""),
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
    setStatus("sending");

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
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("Network error. Please try again or message us on WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl border-[3px] border-cocoa bg-honey p-7 text-cocoa">
        <p className="font-plush text-2xl">Thank you — we&apos;ve received your enquiry!</p>
        <p className="mt-2 text-cocoa-soft">
          Our team will reach out shortly on your phone or WhatsApp with photos and details for {who}.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost mt-5">
          Send another message
        </button>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {(errorList.length > 0 || serverError) && (
        <div role="alert" className="rounded-2xl bg-blush px-4 py-3 text-cocoa">
          <p className="font-semibold">Please check the highlighted fields.</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {errorList.map(([k, msg]) => (
              <li key={k}>{msg}</li>
            ))}
            {serverError && <li>{serverError}</li>}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className="block text-[0.95rem] font-semibold">
            Your name <span className="text-toffee-ink">*</span>
          </label>
          <input
            id={`${baseId}-name`}
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-phone`} className="block text-[0.95rem] font-semibold">
            Phone or WhatsApp <span className="text-toffee-ink">*</span>
          </label>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={`${baseId}-phone-hint`}
            className={INPUT_CLASS}
          />
          <p id={`${baseId}-phone-hint`} className="mt-1 text-sm text-cocoa-soft">
            With country code, e.g. +971 50 123 4567
          </p>
        </div>

        <div>
          <label htmlFor={`${baseId}-email`} className="block text-[0.95rem] font-semibold">
            Email <span className="font-normal text-cocoa-soft">(optional)</span>
          </label>
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-area`} className="block text-[0.95rem] font-semibold">
            Your area <span className="font-normal text-cocoa-soft">(optional)</span>
          </label>
          <input
            id={`${baseId}-area`}
            name="area"
            autoComplete="address-level2"
            maxLength={80}
            aria-invalid="false"
            aria-describedby={`${baseId}-area-hint`}
            className={INPUT_CLASS}
          />
          <p id={`${baseId}-area-hint`} className="mt-1 text-sm text-cocoa-soft">
            e.g. Dubai Marina
          </p>
        </div>
      </div>

      <input type="hidden" name="puppy" value={puppySlug} />

      <div>
        <label htmlFor={`${baseId}-message`} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={`Hi! I'd love to know more about ${who}.`}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
        />
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
        </label>
      </div>

      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:opacity-70 sm:w-auto">
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
