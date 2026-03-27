const FILLER_WORDS = new Set([
  "um", "uh", "uhm", "hmm", "hm",
  "like", "you know", "i mean",
  "basically", "literally", "actually",
  "so", "well", "right", "okay",
]);

const FILLER_PHRASES = [
  "you know", "i mean", "kind of", "sort of",
];

export interface TranscriptionSegment {
  text: string;
  start: number;  // seconds
  end: number;    // seconds
}

export interface FillerDetectionResult {
  segment: TranscriptionSegment;
  isFiller: boolean;
  confidence: number;  // 0-1
}

export function detectFillerWords({
  segments,
}: {
  segments: TranscriptionSegment[];
}): FillerDetectionResult[] {
  return segments.map((segment) => {
    const text = segment.text.trim().toLowerCase().replace(/[.,!?]/g, "");

    // Check exact filler word match
    if (FILLER_WORDS.has(text)) {
      return { segment, isFiller: true, confidence: 0.95 };
    }

    // Check filler phrase match
    for (const phrase of FILLER_PHRASES) {
      if (text === phrase) {
        return { segment, isFiller: true, confidence: 0.9 };
      }
    }

    // Check if segment is very short and matches a filler pattern
    const words = text.split(/\s+/);
    if (words.length === 1 && FILLER_WORDS.has(words[0])) {
      return { segment, isFiller: true, confidence: 0.9 };
    }

    return { segment, isFiller: false, confidence: 0 };
  });
}

export function getFillerSegments({
  segments,
}: {
  segments: TranscriptionSegment[];
}): TranscriptionSegment[] {
  return detectFillerWords({ segments })
    .filter((r) => r.isFiller)
    .map((r) => r.segment);
}
