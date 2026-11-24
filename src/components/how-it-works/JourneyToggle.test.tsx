import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JourneyToggle } from "./JourneyToggle";
import journeys from "@/data/journeys.json";

describe("JourneyToggle", () => {
  it("starts on In Dubai and switches to Imported when clicked", async () => {
    const user = userEvent.setup();
    render(<JourneyToggle journeys={journeys} />);

    const dubai = screen.getByRole("tab", { name: /In Dubai/ });
    const imported = screen.getByRole("tab", { name: /Imported/ });
    expect(dubai).toHaveAttribute("aria-selected", "true");
    expect(imported).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("heading", { name: "Meet your puppy in person" })).toBeInTheDocument();

    await user.click(imported);
    expect(imported).toHaveAttribute("aria-selected", "true");
    expect(dubai).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("heading", { name: "Order upon request" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Import and arrival" })).toBeInTheDocument();
  });

  it("supports arrow-key navigation between tabs", async () => {
    const user = userEvent.setup();
    render(<JourneyToggle journeys={journeys} />);

    const dubai = screen.getByRole("tab", { name: /In Dubai/ });
    dubai.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Imported/ })).toHaveAttribute("aria-selected", "true");
  });
});
