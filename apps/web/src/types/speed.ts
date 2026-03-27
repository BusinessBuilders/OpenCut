export interface SpeedCurvePoint {
  time: number;
  speed: number;
}

export interface SpeedCurve {
  points: SpeedCurvePoint[];
  interpolation: "linear" | "bezier";
}

export const SPEED_PRESETS: Record<string, SpeedCurve> = {
  "montage": {
    points: [
      { time: 0, speed: 1.0 },
      { time: 0.3, speed: 2.5 },
      { time: 0.7, speed: 2.5 },
      { time: 1.0, speed: 1.0 },
    ],
    interpolation: "bezier",
  },
  "bullet-time": {
    points: [
      { time: 0, speed: 1.0 },
      { time: 0.3, speed: 0.2 },
      { time: 0.7, speed: 0.2 },
      { time: 1.0, speed: 1.0 },
    ],
    interpolation: "bezier",
  },
  "ramp-up": {
    points: [
      { time: 0, speed: 0.3 },
      { time: 1.0, speed: 3.0 },
    ],
    interpolation: "bezier",
  },
  "ramp-down": {
    points: [
      { time: 0, speed: 3.0 },
      { time: 1.0, speed: 0.3 },
    ],
    interpolation: "bezier",
  },
};
