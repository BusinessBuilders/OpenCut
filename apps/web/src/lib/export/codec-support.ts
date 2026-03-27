export type VideoCodec = "h264" | "h265" | "av1" | "vp9";

export interface CodecOption {
  id: VideoCodec;
  name: string;
  webCodecId: string;
  mimeType: string;
  description: string;
}

export const CODEC_OPTIONS: CodecOption[] = [
  {
    id: "h264",
    name: "H.264",
    webCodecId: "avc1.640034",
    mimeType: "video/mp4",
    description: "Universal compatibility, good quality",
  },
  {
    id: "h265",
    name: "H.265 (HEVC)",
    webCodecId: "hev1.1.6.L153.B0",
    mimeType: "video/mp4",
    description: "Better compression, smaller files",
  },
  {
    id: "av1",
    name: "AV1",
    webCodecId: "av01.0.12M.08",
    mimeType: "video/mp4",
    description: "Best compression, slower encode",
  },
  {
    id: "vp9",
    name: "VP9",
    webCodecId: "vp09.00.31.08",
    mimeType: "video/webm",
    description: "Good compression, WebM format",
  },
];

export interface ResolutionOption {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { id: "720p", name: "720p HD", width: 1280, height: 720 },
  { id: "1080p", name: "1080p Full HD", width: 1920, height: 1080 },
  { id: "2k", name: "2K QHD", width: 2560, height: 1440 },
  { id: "4k", name: "4K Ultra HD", width: 3840, height: 2160 },
];

export const FRAMERATE_OPTIONS = [24, 30, 60] as const;
export type FrameRate = (typeof FRAMERATE_OPTIONS)[number];

export interface ExportConfig {
  codec: VideoCodec;
  resolution: string;
  frameRate: FrameRate;
  quality: "low" | "medium" | "high" | "max";
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  codec: "h264",
  resolution: "1080p",
  frameRate: 30,
  quality: "high",
};

/**
 * Check if WebCodecs API is available in the browser.
 */
export function isWebCodecsSupported(): boolean {
  return typeof VideoEncoder !== "undefined" && typeof VideoDecoder !== "undefined";
}

/**
 * Check if a specific codec is supported by the browser's WebCodecs implementation.
 */
export async function isCodecSupported({
  codec,
  width,
  height,
  frameRate,
}: {
  codec: VideoCodec;
  width: number;
  height: number;
  frameRate: number;
}): Promise<boolean> {
  if (!isWebCodecsSupported()) return false;

  const option = CODEC_OPTIONS.find((o) => o.id === codec);
  if (!option) return false;

  try {
    const support = await VideoEncoder.isConfigSupported({
      codec: option.webCodecId,
      width,
      height,
      framerate: frameRate,
      bitrate: getBitrateForConfig({ width, height, quality: "high" }),
    });
    return support.supported === true;
  } catch {
    return false;
  }
}

/**
 * Get all supported codecs for the given resolution and frame rate.
 */
export async function getSupportedCodecs({
  width,
  height,
  frameRate,
}: {
  width: number;
  height: number;
  frameRate: number;
}): Promise<CodecOption[]> {
  const supported: CodecOption[] = [];
  for (const option of CODEC_OPTIONS) {
    const isSupported = await isCodecSupported({
      codec: option.id,
      width,
      height,
      frameRate,
    });
    if (isSupported) supported.push(option);
  }
  return supported;
}

/**
 * Calculate recommended bitrate based on resolution and quality.
 */
export function getBitrateForConfig({
  width,
  height,
  quality,
}: {
  width: number;
  height: number;
  quality: ExportConfig["quality"];
}): number {
  const pixels = width * height;
  const baseBitrate = pixels * 0.07; // ~7 bits per pixel

  const qualityMultiplier = {
    low: 0.5,
    medium: 0.75,
    high: 1.0,
    max: 1.5,
  };

  return Math.round(baseBitrate * qualityMultiplier[quality]);
}
