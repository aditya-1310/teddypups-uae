import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PawCursorTrail, stepPawTrail, type PawPrint } from "./PawCursorTrail";

describe("stepPawTrail", () => {
  it("spawns alternating left/right paw prints once pointer moves past stride threshold", () => {
    const prints: PawPrint[] = [];
    // First move sets anchor, too short to spawn
    const r1 = stepPawTrail(prints, { x: 100, y: 100 }, { x: 110, y: 100 }, 0, 1000);
    expect(r1.spawned).toBe(false);
    expect(prints).toHaveLength(0);

    // Move 50px right -> spawns paw 0 (side +1)
    const r2 = stepPawTrail(prints, { x: 100, y: 100 }, { x: 150, y: 100 }, 0, 1050);
    expect(r2.spawned).toBe(true);
    expect(r2.step).toBe(1);
    expect(prints).toHaveLength(1);
    expect(prints[0].born).toBe(1050);
    expect(prints[0].y).toBeGreaterThan(100); // offset to one side

    // Move another 50px right -> spawns paw 1 (opposite side -1)
    const r3 = stepPawTrail(prints, { x: 150, y: 100 }, { x: 200, y: 100 }, r2.step, 1100);
    expect(r3.spawned).toBe(true);
    expect(prints).toHaveLength(2);
    expect(prints[1].y).toBeLessThan(100); // opposite side
  });
});

describe("PawCursorTrail", () => {
  it("renders a full-viewport decorative canvas overlay", () => {
    const { container } = render(<PawCursorTrail />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas?.className).toContain("pointer-events-none");
  });
});
