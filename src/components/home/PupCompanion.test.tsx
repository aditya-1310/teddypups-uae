import { describe, expect, it } from "vitest";
import { interpolatePupStops, type PupStopRect } from "./PupCompanion";

const stops: PupStopRect[] = [
  { x: 500, y: 400, w: 300, h: 240, pageY: 400, pose: "peek", behind: true, facing: 1 },
  { x: 200, y: 1200, w: 220, h: 176, pageY: 1200, pose: "walk", behind: false, facing: 1 },
  { x: 600, y: 2200, w: 240, h: 192, pageY: 2200, pose: "sit", behind: false, facing: -1 },
];

describe("interpolatePupStops", () => {
  it("pins to the first stop at the top of the page", () => {
    const pose = interpolatePupStops(stops, 200);
    expect(pose.x).toBeCloseTo(500, 1);
    expect(pose.y).toBeCloseTo(400, 1);
    expect(pose.scale).toBeCloseTo(1, 2);
    expect(pose.pose).toBe("peek");
    expect(pose.behind).toBe(true);
  });

  it("smoothly interpolates position, scale, and walking state between stops", () => {
    const mid = interpolatePupStops(stops, 800);
    expect(mid.x).toBeCloseTo(350, 1);
    expect(mid.y).toBeCloseTo(800, 1);
    expect(mid.scale).toBeCloseTo(260 / 300, 2);
    expect(mid.traveling).toBe(true);
    expect(mid.facing).toBe(-1);
  });

  it("pins to the last stop at the bottom of the page", () => {
    const end = interpolatePupStops(stops, 3000);
    expect(end.x).toBeCloseTo(600, 1);
    expect(end.y).toBeCloseTo(2200, 1);
    expect(end.pose).toBe("sit");
    expect(end.traveling).toBe(false);
  });
});
