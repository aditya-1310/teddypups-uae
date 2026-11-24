import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LetterForm } from "./LetterForm";
import { getPuppies } from "@/lib/puppies";

describe("LetterForm", () => {
  it("lists all 15 puppies in the dropdown and validates required fields", async () => {
    const user = userEvent.setup();
    render(<LetterForm puppies={getPuppies()} />);

    const select = screen.getByLabelText("Puppy you're interested in (optional)");
    expect(select.querySelectorAll("option")).toHaveLength(16); // "any puppy" + 15 puppies

    await user.click(screen.getByRole("button", { name: "Post my letter" }));
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Please tell us your name.");
    expect(alert).toHaveTextContent("Add a phone or WhatsApp number we can reach, with country code.");
  });

  it("posts a valid letter to /api/enquiries and enters the sent state", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));

    render(<LetterForm puppies={getPuppies()} />);
    await user.type(screen.getByLabelText("Your name (required)"), "Aditya");
    await user.type(screen.getByLabelText("Phone or WhatsApp number with country code (required)"), "+971 50 123 4567");
    await user.click(screen.getByRole("button", { name: "Post my letter" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/enquiries",
      expect.objectContaining({ method: "POST" }),
    );
    expect(await screen.findByText(/Your letter is in the post/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
