precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;
varying vec2 v_texCoord;

void main() {
  vec2 offset = vec2(u_amount / u_resolution.x, 0.0);
  float r = texture2D(u_texture, v_texCoord + offset).r;
  float g = texture2D(u_texture, v_texCoord).g;
  float b = texture2D(u_texture, v_texCoord - offset).b;
  float a = texture2D(u_texture, v_texCoord).a;
  gl_FragColor = vec4(r, g, b, a);
}
