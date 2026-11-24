import { describe, expect, it } from "vitest";
import { flightPose } from "./PathsScene";

describe("flightPose", () => {
  it("starts at Korea (40, 250) and lands at Dubai (620, 168)", () => {
    const start = flightPose(0);
    expect(start.x).toBeCloseTo(40, 1);
    expect(start.y).toBeCloseTo(250, 1);
    expect(start.angle).toBeLessThan(0); // climbing upward

    const end = flightPose(1);
    expect(end.x).toBeCloseTo(620, 1);
    expect(end.y).toBeCloseTo(168, 1);
    expect(end.angle).toBeGreaterThan(0); // descending toward Dubai
  });

  it("arcs high above both endpoints at mid-flight", () => {
    const mid = flightPose(0.5);
    expect(mid.x).toBeGreaterThan(250);
    expect(mid.x).toBeLessThan(400);
    expect(mid.y).toBeLessThan(100);
  });
});
