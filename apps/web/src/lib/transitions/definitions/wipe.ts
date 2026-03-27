import type { TransitionDefinition } from "@/types/transition";

const fragmentShader = `
precision mediump float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_softness;
varying vec2 v_texCoord;
void main() {
  float edge = u_progress * (1.0 + u_softness) - u_softness;
  float mixVal = smoothstep(edge, edge + u_softness, v_texCoord.x);
  vec4 fromColor = texture2D(u_from, v_texCoord);
  vec4 toColor = texture2D(u_to, v_texCoord);
  gl_FragColor = mix(fromColor, toColor, mixVal);
}
`;

export const wipeTransition: TransitionDefinition = {
  type: "wipe",
  name: "Wipe",
  category: "basic",
  defaultDuration: 0.5,
  fragmentShader,
  defaultParams: { u_softness: 0.05 },
};
