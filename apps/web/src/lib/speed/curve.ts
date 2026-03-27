import type { SpeedCurve } from "@/types/speed";

export function evaluateSpeedAtTime({
  curve,
  normalizedTime,
}: {
  curve: SpeedCurve;
  normalizedTime: number;
}): number {
  const { points } = curve;
  if (points.length === 0) return 1.0;
  if (points.length === 1) return points[0].speed;

  if (normalizedTime <= points[0].time) return points[0].speed;
  if (normalizedTime >= points[points.length - 1].time)
    return points[points.length - 1].speed;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    if (normalizedTime >= p0.time && normalizedTime <= p1.time) {
      const t = (normalizedTime - p0.time) / (p1.time - p0.time);
      return p0.speed + t * (p1.speed - p0.speed);
    }
  }

  return 1.0;
}

export function getSourceTimeForPlaybackTime({
  curve,
  playbackTime,
  elementDuration,
}: {
  curve: SpeedCurve;
  playbackTime: number;
  elementDuration: number;
}): number {
  const steps = 200;
  const dt = playbackTime / steps;
  let sourceTime = 0;

  for (let i = 0; i < steps; i++) {
    const t0 = (i * dt) / elementDuration;
    const t1 = ((i + 1) * dt) / elementDuration;
    const s0 = evaluateSpeedAtTime({ curve, normalizedTime: t0 });
    const s1 = evaluateSpeedAtTime({ curve, normalizedTime: t1 });
    sourceTime += ((s0 + s1) / 2) * dt;
  }

  return sourceTime;
}

export function getEffectiveDuration({
  curve,
  sourceDuration,
}: {
  curve: SpeedCurve;
  sourceDuration: number;
}): number {
  const steps = 200;
  const dt = 1.0 / steps;
  let totalSpeed = 0;

  for (let i = 0; i < steps; i++) {
    const t0 = i * dt;
    const t1 = (i + 1) * dt;
    const s0 = evaluateSpeedAtTime({ curve, normalizedTime: t0 });
    const s1 = evaluateSpeedAtTime({ curve, normalizedTime: t1 });
    totalSpeed += ((s0 + s1) / 2) * dt;
  }

  const averageSpeed = totalSpeed;
  return sourceDuration / averageSpeed;
}
