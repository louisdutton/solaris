import * as THREE from 'three';
import fragStar from './shaders/star.frag?raw';
import vertStar from './shaders/star.vert?raw';
import fragGlow from './shaders/glow.frag?raw';
import vertGlow from './shaders/glow.vert?raw';
import fragAtmosphere from './shaders/atmosphere.frag?raw';
import vertAtmosphere from './shaders/atmosphere.vert?raw';

export const star = new THREE.ShaderMaterial({
	uniforms: {
		time: new THREE.Uniform(0.0),
		octaves: new THREE.Uniform(6),
		lacunarity: new THREE.Uniform(1.8),
		persistence: new THREE.Uniform(0.7)
	},
	vertexShader: vertStar,
	fragmentShader: fragStar,
	side: THREE.FrontSide
});

export const glow = new THREE.ShaderMaterial({
	uniforms: {
		color: new THREE.Uniform(new THREE.Color('orange')),
		exponent: new THREE.Uniform(5.0),
		falloff: new THREE.Uniform(0.5)
	},
	vertexShader: vertGlow,
	fragmentShader: fragGlow,
	side: THREE.BackSide,
	blending: THREE.AdditiveBlending,
	transparent: true
});

export const atmosphere = new THREE.ShaderMaterial({
	uniforms: {
		color: new THREE.Uniform(new THREE.Color('cyan')),
		exponent: new THREE.Uniform(4.0),
		falloff: new THREE.Uniform(0.5)
	},
	vertexShader: vertAtmosphere,
	fragmentShader: fragAtmosphere,
	side: THREE.BackSide,
	blending: THREE.AdditiveBlending,
	transparent: true
});
