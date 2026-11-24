import { describe, expect, it } from "vitest";
import { blobPath, sketchDecor } from "./sketch";

describe("sketchDecor", () => {
  it("is deterministic for a given puppy, so server and client render the same drawing", () => {
    expect(sketchDecor("maltipoo-max-male", 0)).toEqual(sketchDecor("maltipoo-max-male", 0));
  });

  it("gives different puppies different drawings", () => {
    expect(sketchDecor("maltipoo-max-male", 0).ink).not.toBe(sketchDecor("copper-male", 0).ink);
  });

  it("staggers the reveal in rows of eight, 70ms apart", () => {
    expect(sketchDecor("a", 0).delay).toBe("0ms");
    expect(sketchDecor("a", 3).delay).toBe("210ms");
    expect(sketchDecor("a", 8).delay).toBe("0ms");
  });

  it("keeps tilt subtle and wash colours on palette", () => {
    for (const slug of ["a", "b", "c", "d", "e", "f"]) {
      const d = sketchDecor(slug, 0);
      expect(Math.abs(d.tilt)).toBeLessThanOrEqual(2.5);
      expect(["#f2be6b", "#bfddf5", "#fbe3b4", "#e8c39a", "#f9cdbf"]).toContain(d.wash);
      expect(d.doodles.length).toBeGreaterThanOrEqual(1);
      expect(d.doodles.length).toBeLessThanOrEqual(3);
    }
  });
});

describe("blobPath", () => {
  it("draws a closed wobbly loop inside the 100x100 box", () => {
    const d = blobPath(() => 0.5, 46, 0.04);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    const nums = d.match(/-?\d+\.\d+/g)!.map(Number);
    expect(Math.min(...nums)).toBeGreaterThan(-2);
    expect(Math.max(...nums)).toBeLessThan(102);
  });
});
