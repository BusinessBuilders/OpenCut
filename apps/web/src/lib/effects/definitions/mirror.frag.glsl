precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_mode;
varying vec2 v_texCoord;

void main() {
  vec2 uv = v_texCoord;
  if (u_mode < 0.5) {
    // Horizontal mirror
    uv.x = uv.x < 0.5 ? uv.x : 1.0 - uv.x;
  } else if (u_mode < 1.5) {
    // Vertical mirror
    uv.y = uv.y < 0.5 ? uv.y : 1.0 - uv.y;
  } else {
    // Quad mirror
    uv.x = uv.x < 0.5 ? uv.x * 2.0 : (1.0 - uv.x) * 2.0;
    uv.y = uv.y < 0.5 ? uv.y * 2.0 : (1.0 - uv.y) * 2.0;
  }
  gl_FragColor = texture2D(u_texture, uv);
}
