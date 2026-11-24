import { describe, expect, it } from "vitest";
import { computeCorridorState } from "./MeetScene";

describe("computeCorridorState", () => {
  it("translates the door track from 0 to maxTranslate as scroll progresses", () => {
    const start = computeCorridorState(0, 2400, [600, 950, 1300], 500);
    expect(start.translateX).toBe(0);
    expect(start.openDoors).toEqual([false, false, false]);

    const mid = computeCorridorState(0.5, 2400, [600, 950, 1300], 500);
    expect(mid.translateX).toBe(1200);
    // Shifted centers: -600, -250, +100 -> all <= 500 so all three have opened
    expect(mid.openDoors).toEqual([true, true, true]);
  });

  it("opens each door only once it reaches Teddy's trigger point", () => {
    // At translateX = 200: door 0 is at 400 (<= 500 -> open), door 1 is at 750 (> 500 -> closed)
    const state = computeCorridorState(200 / 2000, 2000, [600, 950, 1300], 500);
    expect(state.translateX).toBe(200);
    expect(state.openDoors).toEqual([true, false, false]);
  });

  it("clamps progress outside [0, 1]", () => {
    expect(computeCorridorState(-0.4, 2000, [600], 500).translateX).toBe(0);
    expect(computeCorridorState(1.8, 2000, [600], 500).translateX).toBe(2000);
  });
});
