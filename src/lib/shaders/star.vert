varying vec3 vNormalW;
varying vec3 vPositionW;
    
void main() {
  // vNormal = normalize(normalMatrix * normal);
  vNormalW = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
  vPositionW = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}