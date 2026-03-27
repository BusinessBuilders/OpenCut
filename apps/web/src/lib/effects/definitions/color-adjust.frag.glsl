precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_temperature;
uniform float u_exposure;
varying vec2 v_texCoord;

vec3 adjustBrightness(vec3 color, float value) {
  return color + value;
}
vec3 adjustContrast(vec3 color, float value) {
  float factor = (1.0 + value) / (1.0 - value + 0.001);
  return clamp((color - 0.5) * factor + 0.5, 0.0, 1.0);
}
vec3 adjustSaturation(vec3 color, float value) {
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(luminance), color, 1.0 + value);
}
vec3 adjustTemperature(vec3 color, float value) {
  color.r += value * 0.1;
  color.b -= value * 0.1;
  return clamp(color, 0.0, 1.0);
}
vec3 adjustExposure(vec3 color, float value) {
  return color * pow(2.0, value);
}
void main() {
  vec4 texColor = texture2D(u_texture, v_texCoord);
  vec3 color = texColor.rgb;
  color = adjustExposure(color, u_exposure);
  color = adjustBrightness(color, u_brightness);
  color = adjustContrast(color, u_contrast);
  color = adjustSaturation(color, u_saturation);
  color = adjustTemperature(color, u_temperature);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), texColor.a);
}
