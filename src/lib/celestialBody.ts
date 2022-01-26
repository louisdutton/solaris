import * as THREE from "three";
import * as MAT from "./materials";
import Random from "./random";

export const createCelestialBody = (
	listener: THREE.AudioListener,
	frequency: number
) => {
	const color = 0xffffff * Random.value();
	const scale = 0.5 * Random.value();
	const details = [8, 2, 1];

	const texture = new THREE.TextureLoader().load("/textures/moonbump1k.jpg");
	const options = [
		{ bumpMap: texture, bumpScale: 0.008, color: color },
		{ color: color },
		{ color: color },
	];

	// LODs (level of detail)
	const lod = new THREE.LOD();
	for (let i = 0; i < 3; i++) {
		const geometry = new THREE.IcosahedronBufferGeometry(scale, details[i]);
		const material = new THREE.MeshStandardMaterial(options[i]);
		lod.addLevel(new THREE.Mesh(geometry, material), 25 * i);
	}

	// atmosphere
	const material = MAT.atmosphere.clone();
	material.uniforms.color.value = new THREE.Color(color);

	lod.add(
		new THREE.Mesh(
			new THREE.IcosahedronBufferGeometry(scale * 1.1, 4),
			material
		)
	);

	// Oscillator
	const osc = listener.context.createOscillator(); // default sine wave
	osc.type = "sine";
	osc.frequency.value = frequency; // harmonic series
	osc.start();

	// vibrato
	// const vibrato = listener.context.createOscillator();
	// vibrato.frequency.value = 6;
	// vibrato.start();
	// const depth = listener.context.createGain();
	// depth.gain.value = 1;
	// vibrato.connect(depth);
	// depth.connect(osc.frequency);

	// Positional audio source (three.js) attenuation model: 1/x
	const sound = new THREE.PositionalAudio(listener);
	sound.setRolloffFactor(0.4);
	// TODO: maybe create a PR to allow multiple node types
	//@ts-ignore
	sound.setNodeSource(osc);
	sound.panner.panningModel = "equalpower";

	lod.add(sound);
	return lod;
};

export function createOrbit(radius: number) {
	const points: THREE.Vector3[] = [];

	// 360 full circle will be drawn clockwise
	for (let i = 0; i <= 360; i++) {
		const angle = toRadians(i);
		points[i] = new THREE.Vector3(
			Math.sin(angle) * radius,
			Math.cos(angle) * radius,
			0
		);
	}

	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	const material = new THREE.LineDashedMaterial({
		color: 0xffffff,
		linewidth: 1,
		scale: 1,
		dashSize: 0.1,
		gapSize: 0.1,
	});

	const line = new THREE.Line(geometry, material);
	line.computeLineDistances();

	return line;
}

const toRadians = (x: number) => x * (Math.PI / 180);
