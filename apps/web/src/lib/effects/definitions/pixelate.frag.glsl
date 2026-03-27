precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_blockSize;
varying vec2 v_texCoord;

void main() {
  vec2 blocks = u_resolution / u_blockSize;
  vec2 uv = floor(v_texCoord * blocks) / blocks;
  gl_FragColor = texture2D(u_texture, uv);
}
