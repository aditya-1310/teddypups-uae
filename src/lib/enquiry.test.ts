import { describe, expect, it } from "vitest";
import { validateEnquiry } from "./enquiry";

// Messages copied from the reference site's contact form.
const NAME = "Please tell us your name.";
const PHONE = "Add a phone or WhatsApp number we can reach, with country code.";
const EMAIL = "That email doesn't look right.";

describe("validateEnquiry", () => {
  it("accepts a name and phone with country code", () => {
    const r = validateEnquiry({ name: "  Aditya ", phone: "+971 50 123 4567" });
    expect(r).toEqual({ ok: true, data: { name: "Aditya", phone: "+971 50 123 4567", email: "", area: "", puppy: "", message: "" } });
  });

  it("requires a name of at least two characters", () => {
    expect(validateEnquiry({ name: "A", phone: "+971501234567" })).toEqual({ ok: false, errors: { name: NAME } });
  });

  it("rejects phone numbers without enough digits", () => {
    for (const phone of ["", "12", "abc"]) {
      expect(validateEnquiry({ name: "Aditya", phone })).toEqual({ ok: false, errors: { phone: PHONE } });
    }
  });

  it("allows an empty email but rejects a malformed one", () => {
    expect(validateEnquiry({ name: "Aditya", phone: "+971501234567", email: "" }).ok).toBe(true);
    expect(validateEnquiry({ name: "Aditya", phone: "+971501234567", email: "bad" })).toEqual({ ok: false, errors: { email: EMAIL } });
  });

  it("reports every problem at once, in form order", () => {
    const r = validateEnquiry({ name: "", phone: "12", email: "bad" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors)).toEqual(["name", "phone", "email"]);
  });
});
