// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const post = (body: unknown) =>
  POST(new Request("http://localhost/api/enquiries", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } }));

describe("POST /api/enquiries", () => {
  it("accepts a valid enquiry", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const res = await post({ name: "Aditya", phone: "+971 50 123 4567", puppy: "Max" });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns field errors for an invalid enquiry", async () => {
    const res = await post({ name: "", phone: "" });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({
      ok: false,
      errors: { name: "Please tell us your name.", phone: "Add a phone or WhatsApp number we can reach, with country code." },
    });
  });

  it("quietly drops submissions that fill the honeypot field", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    info.mockClear();
    const res = await post({ name: "Bot", phone: "+971501234567", website: "spam.example" });
    expect(res.status).toBe(201);
    expect(info).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const res = await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: "nope" }));
    expect(res.status).toBe(400);
  });
});
