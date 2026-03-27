import type { TransitionDefinition } from "@/types/transition";

const fragmentShader = `
precision mediump float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_strength;
varying vec2 v_texCoord;
void main() {
  vec2 center = vec2(0.5);
  float fromScale = 1.0 + u_progress * u_strength;
  float toScale = 1.0 + (1.0 - u_progress) * u_strength;
  vec2 fromUV = (v_texCoord - center) / fromScale + center;
  vec2 toUV = (v_texCoord - center) / toScale + center;
  vec4 fromColor = texture2D(u_from, fromUV);
  vec4 toColor = texture2D(u_to, toUV);
  gl_FragColor = mix(fromColor, toColor, u_progress);
}
`;

export const zoomTransition: TransitionDefinition = {
  type: "zoom",
  name: "Zoom",
  category: "zoom",
  defaultDuration: 0.6,
  fragmentShader,
  defaultParams: { u_strength: 0.4 },
};
