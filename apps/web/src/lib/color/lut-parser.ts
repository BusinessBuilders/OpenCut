export interface LUTData {
  title: string;
  size: number;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
  data: Float32Array; // Flat array of RGB triplets: [r, g, b, r, g, b, ...]
}

/**
 * Parse a .CUBE LUT file content string into structured LUT data.
 * Format reference: https://wwwimages2.adobe.com/content/dam/acom/en/products/speedgrade/cc/pdfs/cube-lut-specification-1.0.pdf
 */
export function parseCubeLUT({ content }: { content: string }): LUTData {
  const lines = content.split(/\r?\n/);
  let title = "";
  let size = 0;
  let domainMin: [number, number, number] = [0, 0, 0];
  let domainMax: [number, number, number] = [1, 1, 1];
  const values: number[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip empty lines and comments
    if (line === "" || line.startsWith("#")) continue;

    // Parse metadata
    if (line.startsWith("TITLE")) {
      title = line.replace(/^TITLE\s*"?/, "").replace(/"?\s*$/, "");
      continue;
    }

    if (line.startsWith("LUT_3D_SIZE")) {
      size = parseInt(line.split(/\s+/)[1], 10);
      continue;
    }

    if (line.startsWith("DOMAIN_MIN")) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      domainMin = [parts[0], parts[1], parts[2]];
      continue;
    }

    if (line.startsWith("DOMAIN_MAX")) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      domainMax = [parts[0], parts[1], parts[2]];
      continue;
    }

    // Skip other metadata lines (LUT_1D_SIZE, etc.)
    if (/^[A-Z_]/.test(line)) continue;

    // Parse data line (three space-separated floats)
    const parts = line.split(/\s+/).map(Number);
    if (parts.length >= 3 && !parts.some(isNaN)) {
      values.push(parts[0], parts[1], parts[2]);
    }
  }

  if (size === 0) {
    throw new Error("Invalid .CUBE file: missing LUT_3D_SIZE");
  }

  const expectedCount = size * size * size * 3;
  if (values.length !== expectedCount) {
    throw new Error(
      `Invalid .CUBE file: expected ${expectedCount} values (${size}^3 * 3), got ${values.length}`,
    );
  }

  return {
    title,
    size,
    domainMin,
    domainMax,
    data: new Float32Array(values),
  };
}

/**
 * Convert LUT data to a flat RGBA texture suitable for WebGL.
 * The texture is a 2D unwrapped 3D texture: width = size * size, height = size.
 */
export function lutToTexture({
  lut,
}: {
  lut: LUTData;
}): { width: number; height: number; data: Uint8Array } {
  const { size, data } = lut;
  const width = size * size;
  const height = size;
  const rgba = new Uint8Array(width * height * 4);

  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        const srcIdx = (b * size * size + g * size + r) * 3;
        const x = b * size + r;
        const y = g;
        const dstIdx = (y * width + x) * 4;

        rgba[dstIdx] = Math.round(Math.min(1, Math.max(0, data[srcIdx])) * 255);
        rgba[dstIdx + 1] = Math.round(Math.min(1, Math.max(0, data[srcIdx + 1])) * 255);
        rgba[dstIdx + 2] = Math.round(Math.min(1, Math.max(0, data[srcIdx + 2])) * 255);
        rgba[dstIdx + 3] = 255;
      }
    }
  }

  return { width, height, data: rgba };
}
