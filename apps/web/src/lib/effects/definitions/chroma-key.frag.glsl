precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec3 u_keyColor;
uniform float u_similarity;
uniform float u_smoothness;
varying vec2 v_texCoord;

vec2 rgbToCbCr(vec3 rgb) {
  return vec2(0.5 + (-0.168736 * rgb.r - 0.331264 * rgb.g + 0.5 * rgb.b),
              0.5 + (0.5 * rgb.r - 0.418688 * rgb.g - 0.081312 * rgb.b));
}

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  vec2 cbcrKey = rgbToCbCr(u_keyColor);
  vec2 cbcrPixel = rgbToCbCr(color.rgb);
  float dist = distance(cbcrKey, cbcrPixel);
  float alpha = smoothstep(u_similarity, u_similarity + u_smoothness, dist);
  gl_FragColor = vec4(color.rgb, color.a * alpha);
}
