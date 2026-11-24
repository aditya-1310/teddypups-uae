import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnquiryForm } from "./EnquiryForm";

describe("EnquiryForm", () => {
  it("pre-fills the message for the puppy and validates required fields", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm puppySlug="maltipoo-max-male" puppyName="Max" breed="Maltipoo" />);

    expect(screen.getByLabelText(/Message/)).toHaveValue("Hi! I'd love to know more about Max (Maltipoo).");

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Please tell us your name.");
    expect(alert).toHaveTextContent("Add a phone or WhatsApp number we can reach, with country code.");
    expect(screen.getByLabelText(/Your name/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Phone or WhatsApp/)).toHaveAttribute("aria-invalid", "true");
  });

  it("posts a valid enquiry to /api/enquiries and shows confirmation", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<EnquiryForm puppySlug="maltipoo-max-male" puppyName="Max" breed="Maltipoo" />);
    await user.type(screen.getByLabelText(/Your name/), "Aditya");
    await user.type(screen.getByLabelText(/Phone or WhatsApp/), "+971 50 123 4567");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/enquiries",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
      }),
    );
    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
