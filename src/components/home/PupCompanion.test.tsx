import { describe, expect, it } from "vitest";
import { buildHolds, evalPupFrame, findHoldSegment, treadmillDecision, type MeasuredStop } from "./PupCompanion";

const safe = { left: 10, top: 86, right: 1430, bottom: 890 };

const sampleStops: MeasuredStop[] = [
  // 0: Hero quilt peek
  {
    x: 600,
    s: 0.9,
    behind: true,
    sink: 0,
    box: [148, 34, 280, 163],
    track: { kind: "page", top: 320 },
  },
  // 1: Meet the pups sticky pinned stop (from scrollY=680 to scrollY=3200)
  {
    x: 200,
    s: 0.75,
    behind: false,
    sink: 0,
    box: [48, 30, 288, 236],
    track: { kind: "pin", top: 520, from: 680, to: 3200 },
  },
  // 2: Footer basket snug stop
  {
    x: 240,
    s: 0.8,
    behind: true,
    sink: 0,
    box: [148, 40, 280, 163],
    track: { kind: "page", top: 4400 },
  },
];

describe("PupCompanion end-to-end scroll choreography", () => {
  const rawHolds: [number, number][] = [
    [0, 220],
    [680, 3200],
    [4000, 4600],
  ];
  const holds = buildHolds(rawHolds, [380, 500], 4500);

  it("holds Teddy stationary (t = 0) at Meet throughout the entire sticky door-corridor scroll", () => {
    for (const sy of [700, 1500, 2400, 3150]) {
      const seg = findHoldSegment(holds, sy);
      expect(seg).toEqual({ k: 1, t: 0 });
      const frame = evalPupFrame(sampleStops, holds, sy, { safe, blend: 100 });
      expect(frame.k).toBe(1);
      expect(frame.t).toBe(0);
    }
  });

  it("faces RIGHT (+1) and walks when doors move right-to-left during downward scroll, and faces LEFT (-1) when scrolling up", () => {
    // Doors moving left (trackLeft went from -100 to -125 -> delta = -25 < 0)
    expect(treadmillDecision(-25, 0)).toEqual({ mode: "walk", facing: 1, idle: 0 });
    // Doors moving right when scrolling back up (delta = +20 > 0)
    expect(treadmillDecision(20, 0)).toEqual({ mode: "walk", facing: -1, idle: 0 });
    // Paused scrolling beyond 0.25s -> stands calmly
    expect(treadmillDecision(0, 0.3)).toEqual({ mode: "stand", facing: null, idle: 0.3 });
  });

  it("hops over the hero quilt when leaving stop 0 and hops into the basket (behind rim) at the end", () => {
    // Early in transition 0 -> 1: airborne hop over quilt
    const hopOut = evalPupFrame(sampleStops, holds, holds[0][1] + 40, { safe, blend: 100 });
    expect(hopOut.k).toBe(0);
    expect(hopOut.t).toBeGreaterThan(0);
    expect(hopOut.airborne).toBe(true);

    // Late in transition 1 -> 2 (approaching basket): airborne hop, then drops behind front rim (front = false)
    const span = holds[2][0] - holds[1][1];
    const hopIn = evalPupFrame(sampleStops, holds, holds[1][1] + span * 0.8, { safe, blend: 100 });
    expect(hopIn.airborne).toBe(true);

    const inBasket = evalPupFrame(sampleStops, holds, holds[1][1] + span * 0.96, { safe, blend: 100 });
    expect(inBasket.front).toBe(false);
  });
});
