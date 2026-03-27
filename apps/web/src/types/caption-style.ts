export interface CaptionStyle {
  id: string;
  name: string;
  category: "minimal" | "bold" | "animated" | "social";
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundRadius?: number;
  position: "bottom" | "center" | "top";
  activeWordColor?: string;
  activeWordScale?: number;
}

export const CAPTION_STYLE_PRESETS: CaptionStyle[] = [
  {
    id: "minimal-white",
    name: "Minimal White",
    category: "minimal",
    fontFamily: "Inter, sans-serif",
    fontSize: 32,
    fontWeight: "normal",
    color: "#ffffff",
    shadowColor: "rgba(0,0,0,0.6)",
    shadowBlur: 4,
    position: "bottom",
  },
  {
    id: "bold-yellow",
    name: "Bold Yellow",
    category: "bold",
    fontFamily: "Inter, sans-serif",
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffdd00",
    strokeColor: "#000000",
    strokeWidth: 3,
    position: "bottom",
  },
  {
    id: "netflix-style",
    name: "Netflix",
    category: "minimal",
    fontFamily: "Inter, sans-serif",
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.75)",
    backgroundPadding: 8,
    backgroundRadius: 4,
    position: "bottom",
  },
  {
    id: "karaoke",
    name: "Karaoke",
    category: "animated",
    fontFamily: "Inter, sans-serif",
    fontSize: 38,
    fontWeight: "bold",
    color: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: 2,
    position: "bottom",
    activeWordColor: "#00ff88",
    activeWordScale: 1.2,
  },
  {
    id: "tiktok-pop",
    name: "TikTok Pop",
    category: "social",
    fontFamily: "Inter, sans-serif",
    fontSize: 44,
    fontWeight: "bold",
    color: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: 4,
    position: "center",
    activeWordColor: "#ff3366",
    activeWordScale: 1.3,
  },
  {
    id: "youtube-clean",
    name: "YouTube Clean",
    category: "social",
    fontFamily: "Inter, sans-serif",
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.8)",
    backgroundPadding: 10,
    backgroundRadius: 6,
    position: "bottom",
  },
  {
    id: "retro-green",
    name: "Retro Terminal",
    category: "bold",
    fontFamily: "monospace",
    fontSize: 30,
    fontWeight: "normal",
    color: "#00ff00",
    backgroundColor: "rgba(0,0,0,0.9)",
    backgroundPadding: 12,
    backgroundRadius: 0,
    position: "bottom",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    category: "bold",
    fontFamily: "Inter, sans-serif",
    fontSize: 38,
    fontWeight: "bold",
    color: "#ff00ff",
    shadowColor: "rgba(255,0,255,0.8)",
    shadowBlur: 12,
    position: "center",
  },
  {
    id: "highlight-box",
    name: "Highlight Box",
    category: "animated",
    fontFamily: "Inter, sans-serif",
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    position: "bottom",
    activeWordColor: "#000000",
    activeWordScale: 1.0,
    backgroundColor: "#ffdd00",
    backgroundPadding: 6,
    backgroundRadius: 4,
  },
  {
    id: "gradient-blue",
    name: "Ocean Blue",
    category: "minimal",
    fontFamily: "Inter, sans-serif",
    fontSize: 34,
    fontWeight: "bold",
    color: "#66ccff",
    shadowColor: "rgba(0,100,200,0.5)",
    shadowBlur: 8,
    position: "bottom",
  },
  {
    id: "comic-bubble",
    name: "Comic",
    category: "bold",
    fontFamily: "Inter, sans-serif",
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    backgroundColor: "#ffffff",
    backgroundPadding: 14,
    backgroundRadius: 20,
    strokeColor: "#000000",
    strokeWidth: 2,
    position: "center",
  },
  {
    id: "instagram-minimal",
    name: "Instagram",
    category: "social",
    fontFamily: "Inter, sans-serif",
    fontSize: 28,
    fontWeight: "normal",
    color: "#ffffff",
    position: "bottom",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowBlur: 2,
  },
];

export function getCaptionStylesByCategory({
  category,
}: {
  category: CaptionStyle["category"];
}): CaptionStyle[] {
  return CAPTION_STYLE_PRESETS.filter((s) => s.category === category);
}

export function getCaptionStyleById({
  id,
}: {
  id: string;
}): CaptionStyle | undefined {
  return CAPTION_STYLE_PRESETS.find((s) => s.id === id);
}
