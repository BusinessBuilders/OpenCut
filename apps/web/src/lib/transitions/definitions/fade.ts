import type { TransitionDefinition } from "@/types/transition";

const fragmentShader = `
precision mediump float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
  vec4 fromColor = texture2D(u_from, v_texCoord);
  vec4 toColor = texture2D(u_to, v_texCoord);
  gl_FragColor = mix(fromColor, toColor, u_progress);
}
`;

export const fadeTransition: TransitionDefinition = {
  type: "fade",
  name: "Fade",
  category: "basic",
  defaultDuration: 0.5,
  fragmentShader,
  defaultParams: {},
};
