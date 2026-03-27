import type { TransitionDefinition } from "@/types/transition";

const fragmentShader = `
precision mediump float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
  vec2 fromUV = v_texCoord + vec2(u_progress, 0.0);
  vec2 toUV = v_texCoord + vec2(u_progress - 1.0, 0.0);
  vec4 fromColor = texture2D(u_from, fromUV);
  vec4 toColor = texture2D(u_to, toUV);
  float showFrom = step(0.0, fromUV.x) * step(fromUV.x, 1.0);
  float showTo = step(0.0, toUV.x) * step(toUV.x, 1.0);
  gl_FragColor = fromColor * showFrom + toColor * showTo;
}
`;

export const slideTransition: TransitionDefinition = {
  type: "slide",
  name: "Slide",
  category: "slide",
  defaultDuration: 0.4,
  fragmentShader,
  defaultParams: {},
};
