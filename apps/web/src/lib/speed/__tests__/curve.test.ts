import { describe, test, expect } from "bun:test";
import {
  evaluateSpeedAtTime,
  getSourceTimeForPlaybackTime,
  getEffectiveDuration,
} from "../curve";
import type { SpeedCurve } from "@/types/speed";

describe("speed curve math", () => {
  const constantSpeed2x: SpeedCurve = {
    points: [
      { time: 0, speed: 2.0 },
      { time: 1.0, speed: 2.0 },
    ],
    interpolation: "linear",
  };

  const rampUp: SpeedCurve = {
    points: [
      { time: 0, speed: 1.0 },
      { time: 1.0, speed: 3.0 },
    ],
    interpolation: "linear",
  };

  test("evaluateSpeedAtTime returns interpolated speed at normalized time", () => {
    expect(evaluateSpeedAtTime({ curve: constantSpeed2x, normalizedTime: 0.5 })).toBe(2.0);
    expect(evaluateSpeedAtTime({ curve: rampUp, normalizedTime: 0.0 })).toBe(1.0);
    expect(evaluateSpeedAtTime({ curve: rampUp, normalizedTime: 0.5 })).toBe(2.0);
    expect(evaluateSpeedAtTime({ curve: rampUp, normalizedTime: 1.0 })).toBe(3.0);
  });

  test("getSourceTimeForPlaybackTime maps playback time to source time", () => {
    const sourceAt1s = getSourceTimeForPlaybackTime({
      curve: constantSpeed2x,
      playbackTime: 0.5,
      elementDuration: 1.0,
    });
    expect(sourceAt1s).toBeCloseTo(1.0, 1);
  });

  test("getEffectiveDuration returns adjusted duration for speed curve", () => {
    const duration = getEffectiveDuration({
      curve: constantSpeed2x,
      sourceDuration: 4.0,
    });
    expect(duration).toBeCloseTo(2.0, 1);
  });

  test("getEffectiveDuration handles ramp curve", () => {
    const duration = getEffectiveDuration({
      curve: rampUp,
      sourceDuration: 4.0,
    });
    expect(duration).toBeCloseTo(2.0, 1);
  });

  test("evaluateSpeedAtTime clamps to edge values outside range", () => {
    expect(evaluateSpeedAtTime({ curve: rampUp, normalizedTime: -0.5 })).toBe(1.0);
    expect(evaluateSpeedAtTime({ curve: rampUp, normalizedTime: 1.5 })).toBe(3.0);
  });
});
