import { z } from "zod";

export const MESSAGES = {
  name: "Please tell us your name.",
  phone: "Add a phone or WhatsApp number we can reach, with country code.",
  email: "That email doesn't look right.",
} as const;

const text = (max: number) => z.string().trim().max(max).catch("");

const schema = z.object({
  name: z.string().trim().min(2, MESSAGES.name).max(80, MESSAGES.name),
  phone: z
    .string()
    .trim()
    .refine((v) => /^\+?[\d\s()-]+$/.test(v) && v.replace(/\D/g, "").length >= 7, MESSAGES.phone),
  email: z.union([z.literal(""), z.string().trim().email(MESSAGES.email)]),
  area: text(80),
  puppy: text(120),
  message: text(2000),
});

export type Enquiry = z.infer<typeof schema>;
export type EnquiryErrors = Partial<Record<"name" | "phone" | "email", string>>;
export type EnquiryResult = { ok: true; data: Enquiry } | { ok: false; errors: EnquiryErrors };

export function validateEnquiry(input: Record<string, unknown>): EnquiryResult {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const r = schema.safeParse({
    name: str(input.name),
    phone: str(input.phone),
    email: str(input.email).trim(),
    area: str(input.area),
    puppy: str(input.puppy),
    message: str(input.message),
  });
  if (r.success) return { ok: true, data: r.data };

  const errors: EnquiryErrors = {};
  for (const key of ["name", "phone", "email"] as const) {
    if (r.error.issues.some((i) => i.path[0] === key)) errors[key] = MESSAGES[key];
  }
  return { ok: false, errors };
}
