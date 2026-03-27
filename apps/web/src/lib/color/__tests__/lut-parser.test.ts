import { describe, test, expect } from "bun:test";
import { parseCubeLUT, lutToTexture } from "../lut-parser";

describe("LUT parser", () => {
  const minimalCube = `# Comment line
TITLE "Test LUT"
LUT_3D_SIZE 2
DOMAIN_MIN 0.0 0.0 0.0
DOMAIN_MAX 1.0 1.0 1.0
0.0 0.0 0.0
1.0 0.0 0.0
0.0 1.0 0.0
1.0 1.0 0.0
0.0 0.0 1.0
1.0 0.0 1.0
0.0 1.0 1.0
1.0 1.0 1.0`;

  test("parseCubeLUT parses a valid .cube file", () => {
    const lut = parseCubeLUT({ content: minimalCube });
    expect(lut.title).toBe("Test LUT");
    expect(lut.size).toBe(2);
    expect(lut.domainMin).toEqual([0, 0, 0]);
    expect(lut.domainMax).toEqual([1, 1, 1]);
    expect(lut.data.length).toBe(2 * 2 * 2 * 3); // 24
  });

  test("parseCubeLUT throws for missing size", () => {
    expect(() => parseCubeLUT({ content: "0.0 0.0 0.0" })).toThrow(
      "missing LUT_3D_SIZE",
    );
  });

  test("parseCubeLUT throws for wrong data count", () => {
    const bad = `LUT_3D_SIZE 2\n0.0 0.0 0.0`;
    expect(() => parseCubeLUT({ content: bad })).toThrow("expected");
  });

  test("lutToTexture converts to RGBA texture", () => {
    const lut = parseCubeLUT({ content: minimalCube });
    const tex = lutToTexture({ lut });
    expect(tex.width).toBe(4); // 2 * 2
    expect(tex.height).toBe(2);
    expect(tex.data.length).toBe(4 * 2 * 4); // width * height * 4 (RGBA)
    // Alpha should always be 255
    for (let i = 3; i < tex.data.length; i += 4) {
      expect(tex.data[i]).toBe(255);
    }
  });

  test("parseCubeLUT handles Windows line endings", () => {
    const windowsCube = minimalCube.replace(/\n/g, "\r\n");
    const lut = parseCubeLUT({ content: windowsCube });
    expect(lut.size).toBe(2);
    expect(lut.data.length).toBe(24);
  });
});
