precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_intensity;
uniform float u_radius;
varying vec2 v_texCoord;
void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  vec2 center = v_texCoord - 0.5;
  float dist = length(center);
  float vignette = smoothstep(u_radius, u_radius - 0.3, dist);
  color.rgb *= mix(1.0, vignette, u_intensity);
  gl_FragColor = color;
}
