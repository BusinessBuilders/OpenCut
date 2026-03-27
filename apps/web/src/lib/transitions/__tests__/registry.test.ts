import { describe, test, expect } from "bun:test";
import {
  registerTransition,
  getTransition,
  getAllTransitions,
  getTransitionsByCategory,
  hasTransition,
} from "../registry";

const mockFade = {
  type: "test-fade",
  name: "Test Fade",
  category: "basic" as const,
  defaultDuration: 0.5,
  fragmentShader: "void main() { gl_FragColor = vec4(1.0); }",
  defaultParams: {},
};

const mockSlide = {
  type: "test-slide",
  name: "Test Slide",
  category: "slide" as const,
  defaultDuration: 0.3,
  fragmentShader: "void main() { gl_FragColor = vec4(0.0); }",
  defaultParams: { direction: [1, 0] },
};

describe("transition registry", () => {
  test("registerTransition stores definition and getTransition retrieves it", () => {
    registerTransition({ definition: mockFade });
    const result = getTransition({ transitionType: "test-fade" });
    expect(result.name).toBe("Test Fade");
    expect(result.category).toBe("basic");
  });

  test("getTransition throws for unknown type", () => {
    expect(() =>
      getTransition({ transitionType: "nonexistent" }),
    ).toThrow("Unknown transition type: nonexistent");
  });

  test("hasTransition returns correct boolean", () => {
    registerTransition({ definition: mockFade });
    expect(hasTransition({ transitionType: "test-fade" })).toBe(true);
    expect(hasTransition({ transitionType: "nonexistent" })).toBe(false);
  });

  test("getAllTransitions returns all registered", () => {
    registerTransition({ definition: mockFade });
    registerTransition({ definition: mockSlide });
    const all = getAllTransitions();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  test("getTransitionsByCategory filters correctly", () => {
    registerTransition({ definition: mockFade });
    registerTransition({ definition: mockSlide });
    const slides = getTransitionsByCategory({ category: "slide" });
    expect(slides.some((t) => t.type === "test-slide")).toBe(true);
    expect(slides.some((t) => t.type === "test-fade")).toBe(false);
  });
});
