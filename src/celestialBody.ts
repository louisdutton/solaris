import * as THREE from "three";
import * as MAT from "./materials";
import { Random } from "./global";

export default class CelestialBody {
	mesh: THREE.Mesh | THREE.LOD;
	positionalAudio: THREE.PositionalAudio;
	oscillalator: OscillatorNode;
	orbit?: THREE.Spherical;
	angularVelocity: THREE.Euler;

	constructor(listener: THREE.AudioListener, frequency: number) {
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
				new THREE.IcosahedronBufferGeometry(scale * 1.05, 4),
				material
			)
		);

		// Oscillator
		const osc = listener.context.createOscillator(); // default sine wave
		osc.type = "sine";
		osc.frequency.value = frequency; // harmonic series
		osc.start();

		// Positional audio source (three.js) attenuation model: 1/x
		const sound = new THREE.PositionalAudio(listener);
		sound.setRolloffFactor(0.4);
		// TODO: maybe create a PR to allow multiple node types
		//@ts-ignore
		sound.setNodeSource(osc);
		sound.panner.panningModel = "equalpower";

		this.positionalAudio = sound;
		this.oscillalator = osc;

		this.mesh = lod;
		this.mesh.add(sound);

		this.angularVelocity = new THREE.Euler(0.002);
	}
}
