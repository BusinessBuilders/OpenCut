import type { TransitionDefinition } from "@/types/transition";

const fragmentShader = `
precision mediump float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
  float noise = hash(v_texCoord * u_resolution);
  float threshold = smoothstep(u_progress - 0.05, u_progress + 0.05, noise);
  vec4 fromColor = texture2D(u_from, v_texCoord);
  vec4 toColor = texture2D(u_to, v_texCoord);
  gl_FragColor = mix(toColor, fromColor, threshold);
}
`;

export const dissolveTransition: TransitionDefinition = {
  type: "dissolve",
  name: "Dissolve",
  category: "basic",
  defaultDuration: 0.5,
  fragmentShader,
  defaultParams: {},
};
