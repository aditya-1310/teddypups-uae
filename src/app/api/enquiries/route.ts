import { validateEnquiry } from "@/lib/enquiry";

/**
 * Receives contact / puppy enquiries. Valid enquiries are written to the server log
 * (visible in the Vercel dashboard); a mail or CRM integration would hook in here.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real visitors never see the "website" field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true }, { status: 201 });
  }

  const result = validateEnquiry(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  console.info("[enquiry]", JSON.stringify({ ...result.data, receivedAt: new Date().toISOString() }));
  return Response.json({ ok: true }, { status: 201 });
}
