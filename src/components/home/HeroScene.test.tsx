import { describe, expect, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { HeroScene } from "./HeroScene";

afterEach(() => {
  vi.useRealTimers();
});

describe("HeroScene", () => {
  it("shows floating name tag on hover/focus and clears it on mouse leave", () => {
    const { container } = render(<HeroScene />);
    const firstPup = screen.getByRole("link", { name: /Meet Max/ });
    const ghosts = container.querySelectorAll(".tp-lineup__ghost");
    expect(ghosts).toHaveLength(6);

    fireEvent.mouseEnter(firstPup);
    expect(ghosts[0]).toHaveAttribute("data-tag", "show");

    fireEvent.mouseLeave(firstPup);
    expect(ghosts[0]).not.toHaveAttribute("data-tag", "show");
  });

  it("cycles puppies by ducking, swapping to the next puppy, and popping up with its name tag", () => {
    vi.useFakeTimers();
    const { container } = render(<HeroScene />);
    const initialHrefs = Array.from(container.querySelectorAll(".tp-lineup__pup")).map((a) => a.getAttribute("href"));

    // Trigger first cycle duck
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    const ducking = container.querySelectorAll('.tp-lineup__pup[data-state="duck"]');
    expect(ducking.length).toBe(1);

    // After duck finishes, seat swaps to a new puppy and pops up with its name tag
    act(() => {
      vi.advanceTimersByTime(400);
    });
    const popping = container.querySelectorAll('.tp-lineup__pup[data-state="pop"]');
    expect(popping.length).toBe(1);
    expect(container.querySelectorAll('.tp-lineup__ghost[data-tag="show"]').length).toBe(1);

    const nextHrefs = Array.from(container.querySelectorAll(".tp-lineup__pup")).map((a) => a.getAttribute("href"));
    expect(nextHrefs).not.toEqual(initialHrefs);
  });
});
