varying vec3 vNormal;
varying vec3 vNormalW;
varying vec3 vPosition;
varying vec3 vPositionW;
varying vec2 vUv;
varying vec3 eyeVector;
varying vec3 worldNormal;
    
void main() {
  vNormal = normalize(normalMatrix * normal);
  vNormalW = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
  vPosition = position;
  vPositionW = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}