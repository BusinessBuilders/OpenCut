export interface ColorAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  exposure: number;
}

export const DEFAULT_COLOR_ADJUSTMENTS: ColorAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  exposure: 0,
};

export function isColorAdjusted(adjustments: ColorAdjustments): boolean {
  return Object.values(adjustments).some((v) => v !== 0);
}
