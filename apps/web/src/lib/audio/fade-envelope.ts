import type { AudioFade } from "@/types/audio-fade";

/**
 * Apply fade in/out gain automation to a GainNode.
 *
 * @param gainNode - The GainNode to automate
 * @param fade - The fade configuration
 * @param startTime - AudioContext time when the clip starts playing
 * @param duration - Total duration of the clip in seconds
 * @param volume - Base volume level (0-1)
 */
export function applyFadeEnvelope({
  gainNode,
  fade,
  startTime,
  duration,
  volume,
}: {
  gainNode: GainNode;
  fade: AudioFade;
  startTime: number;
  duration: number;
  volume: number;
}): void {
  const { fadeIn, fadeOut, curve } = fade;
  const gain = gainNode.gain;

  // Cancel any existing automation
  gain.cancelScheduledValues(startTime);

  if (fadeIn > 0 && fadeOut > 0) {
    // Both fades
    const fadeInEnd = startTime + fadeIn;
    const fadeOutStart = startTime + duration - fadeOut;

    // Start at 0
    gain.setValueAtTime(0, startTime);

    // Fade in
    if (curve === "exponential") {
      // exponentialRampToValueAtTime doesn't accept 0, use small value
      gain.setValueAtTime(0.001, startTime);
      gain.exponentialRampToValueAtTime(volume, fadeInEnd);
    } else if (curve === "scurve") {
      // S-curve approximation using multiple linear ramps
      const midTime = startTime + fadeIn / 2;
      gain.linearRampToValueAtTime(volume * 0.15, midTime);
      gain.linearRampToValueAtTime(volume, fadeInEnd);
    } else {
      gain.linearRampToValueAtTime(volume, fadeInEnd);
    }

    // Hold at volume
    gain.setValueAtTime(volume, fadeOutStart);

    // Fade out
    if (curve === "exponential") {
      gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else if (curve === "scurve") {
      const midTime = fadeOutStart + fadeOut / 2;
      gain.linearRampToValueAtTime(volume * 0.85, midTime);
      gain.linearRampToValueAtTime(0, startTime + duration);
    } else {
      gain.linearRampToValueAtTime(0, startTime + duration);
    }
  } else if (fadeIn > 0) {
    // Only fade in
    gain.setValueAtTime(0, startTime);
    if (curve === "exponential") {
      gain.setValueAtTime(0.001, startTime);
      gain.exponentialRampToValueAtTime(volume, startTime + fadeIn);
    } else {
      gain.linearRampToValueAtTime(volume, startTime + fadeIn);
    }
    gain.setValueAtTime(volume, startTime + fadeIn);
  } else if (fadeOut > 0) {
    // Only fade out
    const fadeOutStart = startTime + duration - fadeOut;
    gain.setValueAtTime(volume, startTime);
    gain.setValueAtTime(volume, fadeOutStart);
    if (curve === "exponential") {
      gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else {
      gain.linearRampToValueAtTime(0, startTime + duration);
    }
  } else {
    // No fade — constant volume
    gain.setValueAtTime(volume, startTime);
  }
}
