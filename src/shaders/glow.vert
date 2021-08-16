varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
    
void main() {
  vNormal = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
  vPosition = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}