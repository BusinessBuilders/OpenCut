export interface GifExportConfig {
  width: number;
  height: number;
  fps: number;
  quality: number;      // 1-30, lower = better quality
  dithering: boolean;
  loop: number;          // 0 = infinite, >0 = number of loops
  startTime: number;     // seconds
  endTime: number;       // seconds
}

export const GIF_QUALITY_PRESETS: Record<string, Omit<GifExportConfig, "startTime" | "endTime" | "width" | "height">> = {
  "high": {
    fps: 15,
    quality: 5,
    dithering: true,
    loop: 0,
  },
  "medium": {
    fps: 12,
    quality: 10,
    dithering: true,
    loop: 0,
  },
  "small": {
    fps: 10,
    quality: 15,
    dithering: false,
    loop: 0,
  },
};

export const DEFAULT_GIF_CONFIG: Omit<GifExportConfig, "startTime" | "endTime" | "width" | "height"> = GIF_QUALITY_PRESETS["medium"];

/**
 * Calculate frame timestamps for GIF export.
 * Returns an array of timestamps (in seconds) at which frames should be captured.
 */
export function getGifFrameTimestamps({
  startTime,
  endTime,
  fps,
}: {
  startTime: number;
  endTime: number;
  fps: number;
}): number[] {
  const duration = endTime - startTime;
  if (duration <= 0) return [];

  const frameInterval = 1 / fps;
  const timestamps: number[] = [];

  for (let t = startTime; t < endTime; t += frameInterval) {
    timestamps.push(Math.round(t * 1000) / 1000);
  }

  return timestamps;
}

/**
 * Estimate the output GIF file size in bytes.
 * This is a rough estimate based on resolution, frame count, and quality.
 */
export function estimateGifSize({
  width,
  height,
  fps,
  duration,
  quality,
}: {
  width: number;
  height: number;
  fps: number;
  duration: number;
  quality: number;
}): number {
  const frameCount = Math.ceil(fps * duration);
  const pixelsPerFrame = width * height;
  // Rough estimate: higher quality (lower number) = more bytes per pixel
  const bytesPerPixel = (35 - quality) / 30 * 0.5;
  return Math.round(frameCount * pixelsPerFrame * bytesPerPixel);
}

/**
 * Format file size in human-readable form.
 */
export function formatFileSize({ bytes }: { bytes: number }): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
