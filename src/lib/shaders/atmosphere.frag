varying vec3 vNormalW;
varying vec3 vPositionW;

uniform vec3 color;
uniform float falloff;
uniform float exponent;

// converts brightness to solar color
// vec3 sunColor(float b) {
//   b *= 0.3;
//   return vec3(b, b*b, b*b*b*b) * 3.0;
// }

void main() {
  vec3 viewDirection = normalize(cameraPosition - vPositionW);
  float fres = dot(viewDirection, vNormalW);
  float glow = pow(falloff - fres, exponent);

  float brightness = 1. + glow * 0.75;
  vec3 col = color*glow;

 gl_FragColor = vec4(col, glow);
}
