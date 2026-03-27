/**
 * Detect beats in an AudioBuffer using spectral energy flux.
 * Returns an array of beat timestamps in seconds.
 */
export function detectBeats({
  audioBuffer,
  threshold = 1.5,
  minInterval = 0.2,
}: {
  audioBuffer: AudioBuffer;
  threshold?: number;
  minInterval?: number;
}): number[] {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);

  // Compute energy in windows
  const windowSize = Math.floor(sampleRate * 0.02); // 20ms windows
  const hopSize = Math.floor(windowSize / 2);
  const numWindows = Math.floor((channelData.length - windowSize) / hopSize);

  const energies: number[] = [];
  for (let i = 0; i < numWindows; i++) {
    const start = i * hopSize;
    let energy = 0;
    for (let j = start; j < start + windowSize; j++) {
      energy += channelData[j] * channelData[j];
    }
    energies.push(energy / windowSize);
  }

  // Compute spectral flux (positive difference between consecutive windows)
  const flux: number[] = [];
  for (let i = 1; i < energies.length; i++) {
    const diff = energies[i] - energies[i - 1];
    flux.push(diff > 0 ? diff : 0);
  }

  // Adaptive threshold: local mean + multiplier * local std dev
  const localWindowSize = 20;
  const beats: number[] = [];
  let lastBeatTime = -Infinity;

  for (let i = 0; i < flux.length; i++) {
    // Compute local statistics
    const start = Math.max(0, i - localWindowSize);
    const end = Math.min(flux.length, i + localWindowSize);
    const window = flux.slice(start, end);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance =
      window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length;
    const stdDev = Math.sqrt(variance);

    const adaptiveThreshold = mean + threshold * stdDev;
    const time = ((i + 1) * hopSize) / sampleRate;

    if (flux[i] > adaptiveThreshold && time - lastBeatTime >= minInterval) {
      beats.push(Math.round(time * 1000) / 1000); // round to ms
      lastBeatTime = time;
    }
  }

  return beats;
}

/**
 * Estimate BPM from detected beat positions.
 */
export function estimateBPM({
  beats,
}: {
  beats: number[];
}): number | null {
  if (beats.length < 3) return null;

  // Calculate intervals between consecutive beats
  const intervals: number[] = [];
  for (let i = 1; i < beats.length; i++) {
    intervals.push(beats[i] - beats[i - 1]);
  }

  // Find the median interval
  const sorted = [...intervals].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  if (median <= 0) return null;

  const bpm = 60 / median;

  // Clamp to reasonable range
  if (bpm < 40 || bpm > 240) return null;

  return Math.round(bpm);
}
