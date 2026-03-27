precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_intensity;
varying vec2 v_texCoord;
void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  vec3 sepia;
  sepia.r = dot(color.rgb, vec3(0.393, 0.769, 0.189));
  sepia.g = dot(color.rgb, vec3(0.349, 0.686, 0.168));
  sepia.b = dot(color.rgb, vec3(0.272, 0.534, 0.131));
  gl_FragColor = vec4(mix(color.rgb, sepia, u_intensity), color.a);
}
