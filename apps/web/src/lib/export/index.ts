export {
  isWebCodecsSupported,
  isCodecSupported,
  getSupportedCodecs,
  getBitrateForConfig,
  CODEC_OPTIONS,
  RESOLUTION_OPTIONS,
  FRAMERATE_OPTIONS,
  DEFAULT_EXPORT_CONFIG,
  type VideoCodec,
  type CodecOption,
  type ResolutionOption,
  type FrameRate,
  type ExportConfig,
} from "./codec-support";

export {
  getGifFrameTimestamps,
  estimateGifSize,
  formatFileSize,
  GIF_QUALITY_PRESETS,
  DEFAULT_GIF_CONFIG,
  type GifExportConfig,
} from "./gif-config";
