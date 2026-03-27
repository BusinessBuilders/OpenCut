import { describe, test, expect } from "bun:test";
import { detectFillerWords, getFillerSegments } from "../filler-words";
import type { TranscriptionSegment } from "../filler-words";

describe("filler word detection", () => {
  const segments: TranscriptionSegment[] = [
    { text: "Hello everyone", start: 0, end: 1 },
    { text: "um", start: 1, end: 1.3 },
    { text: "today we're going to", start: 1.3, end: 3 },
    { text: "like", start: 3, end: 3.2 },
    { text: "talk about", start: 3.2, end: 4 },
    { text: "you know", start: 4, end: 4.5 },
    { text: "the new features", start: 4.5, end: 6 },
    { text: "basically", start: 6, end: 6.5 },
    { text: "it works great", start: 6.5, end: 8 },
  ];

  test("detectFillerWords identifies fillers correctly", () => {
    const results = detectFillerWords({ segments });
    expect(results.length).toBe(9);

    // "um" is a filler
    expect(results[1].isFiller).toBe(true);
    expect(results[1].confidence).toBeGreaterThan(0.8);

    // "like" is a filler
    expect(results[3].isFiller).toBe(true);

    // "you know" is a filler
    expect(results[5].isFiller).toBe(true);

    // "basically" is a filler
    expect(results[7].isFiller).toBe(true);

    // Non-fillers
    expect(results[0].isFiller).toBe(false);
    expect(results[2].isFiller).toBe(false);
    expect(results[4].isFiller).toBe(false);
    expect(results[6].isFiller).toBe(false);
    expect(results[8].isFiller).toBe(false);
  });

  test("getFillerSegments returns only filler segments", () => {
    const fillers = getFillerSegments({ segments });
    expect(fillers.length).toBe(4);
    expect(fillers[0].text).toBe("um");
    expect(fillers[1].text).toBe("like");
    expect(fillers[2].text).toBe("you know");
    expect(fillers[3].text).toBe("basically");
  });

  test("handles punctuation in filler words", () => {
    const withPunctuation: TranscriptionSegment[] = [
      { text: "Um,", start: 0, end: 0.3 },
      { text: "uh.", start: 0.3, end: 0.5 },
    ];
    const results = detectFillerWords({ segments: withPunctuation });
    expect(results[0].isFiller).toBe(true);
    expect(results[1].isFiller).toBe(true);
  });

  test("returns empty for no segments", () => {
    const results = detectFillerWords({ segments: [] });
    expect(results.length).toBe(0);
  });
});
