precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_intensity;
varying vec2 v_texCoord;

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 tl = texture2D(u_texture, v_texCoord + vec2(-texel.x, texel.y));
  vec4 br = texture2D(u_texture, v_texCoord + vec2(texel.x, -texel.y));
  vec4 embossed = vec4(vec3(0.5) + (br.rgb - tl.rgb) * u_intensity, 1.0);
  vec4 original = texture2D(u_texture, v_texCoord);
  gl_FragColor = mix(original, embossed, u_intensity);
}
