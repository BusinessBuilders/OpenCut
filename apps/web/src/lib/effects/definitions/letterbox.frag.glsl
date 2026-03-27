precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;
uniform vec3 u_barColor;
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  float bar = u_amount;
  if (v_texCoord.y < bar || v_texCoord.y > 1.0 - bar) {
    gl_FragColor = vec4(u_barColor, 1.0);
  } else {
    gl_FragColor = color;
  }
}
