import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqBoard } from "./FaqBoard";
import faqs from "@/data/faqs.json";

describe("FaqBoard", () => {
  it("lists all 9 notes collapsed and toggles an answer open and closed", async () => {
    const user = userEvent.setup();
    render(<FaqBoard faqs={faqs} />);

    expect(screen.getByText("9 notes on the board")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Are your puppies vaccinated and health-checked?" });
    expect(btn).toHaveAttribute("aria-expanded", "false");

    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Are your puppies vaccinated and health-checked?" })).not.toHaveAttribute("inert");

    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("filters questions and answers as the visitor types", async () => {
    const user = userEvent.setup();
    render(<FaqBoard faqs={faqs} />);

    await user.type(screen.getByLabelText("sniff out a question"), "Korea");
    expect(screen.getByText(/2 notes/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Do you import puppies from abroad?" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Do you deliver?" })).not.toBeInTheDocument();
  });

  it("shows a helpful empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<FaqBoard faqs={faqs} />);

    await user.type(screen.getByLabelText("sniff out a question"), "zzzzzz");
    expect(screen.getByText(/0 notes/)).toBeInTheDocument();
  });
});
