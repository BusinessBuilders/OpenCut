export interface AudioFade {
  fadeIn: number;
  fadeOut: number;
  curve: "linear" | "exponential" | "scurve";
}

export const DEFAULT_AUDIO_FADE: AudioFade = {
  fadeIn: 0,
  fadeOut: 0,
  curve: "linear",
};
