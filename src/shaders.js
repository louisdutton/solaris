export const Atmosphere = {
  uniforms: {},
  vertexShader: [
    'varying vec3 vNormal;',
    'void main() {',
      'vNormal = normalize( normalMatrix * normal );',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join('\n'),
  fragmentShader: [
    'varying vec3 vNormal;',
    'void main() {',
      'float intensity = pow( 0.9 - dot( vNormal, vec3( 0, 0, 0.9 ) ), 6.0 );',
      'gl_FragColor = vec4( 1.0, 0.8, 0.5, 1.0 ) * intensity;',
    '}'
  ].join('\n')
}