precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_intensity;
uniform float u_seed;
varying vec2 v_texCoord;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float offset = u_intensity * (rand(vec2(floor(v_texCoord.y * 20.0), u_seed)) - 0.5) * 0.1;
  vec4 r = texture2D(u_texture, v_texCoord + vec2(offset, 0.0));
  vec4 g = texture2D(u_texture, v_texCoord);
  vec4 b = texture2D(u_texture, v_texCoord - vec2(offset, 0.0));
  gl_FragColor = vec4(r.r, g.g, b.b, g.a);
}
