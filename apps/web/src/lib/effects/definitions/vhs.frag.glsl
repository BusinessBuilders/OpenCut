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
  vec2 uv = v_texCoord;
  // Scanlines
  float scanline = sin(uv.y * u_resolution.y * 1.5) * 0.04 * u_intensity;
  // Horizontal jitter
  float jitter = (rand(vec2(floor(uv.y * 50.0), u_seed)) - 0.5) * 0.005 * u_intensity;
  uv.x += jitter;
  // Color bleeding
  float r = texture2D(u_texture, uv + vec2(0.002 * u_intensity, 0.0)).r;
  float g = texture2D(u_texture, uv).g;
  float b = texture2D(u_texture, uv - vec2(0.002 * u_intensity, 0.0)).b;
  vec3 color = vec3(r, g, b) + scanline;
  // Noise
  float noise = rand(uv * u_resolution + u_seed) * 0.08 * u_intensity;
  color += noise;
  // Slight desaturation
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(color, vec3(lum), 0.3 * u_intensity);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
