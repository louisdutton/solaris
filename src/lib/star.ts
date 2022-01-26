import * as THREE from "three";
import Random from "./random";

// interface SpectralClassification {
// 	mk: "O" | "B" | "A" | "F" | "G" | "K" | "M"; // morgan-keenan type
// 	numeral: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // arabic numeral sub-classification
// 	yerkes: "V"; // main sequence luminosity
// }

const TEMPERATURE_RANGE = [2400, 35000];
import * as MAT from "./materials";

export default class Star {
	mesh: THREE.Mesh | THREE.LOD;
	positionalAudio: THREE.PositionalAudio;
	oscillalator: OscillatorNode;
	angularVelocity: THREE.Euler;
	temperature: number;
	// mass: number;
	// radius: number; // solar radius
	// luminosity: number;
	// classification: SpectralClassification;

	constructor(listener: THREE.AudioListener, frequency: number) {
		const mesh = new THREE.Mesh(
			new THREE.IcosahedronBufferGeometry(1, 4),
			MAT.star
		);

		const glow = new THREE.Mesh(
			new THREE.IcosahedronBufferGeometry(1.25, 4),
			MAT.glow
		);
		mesh.add(glow);

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

		this.mesh = mesh;
		this.mesh.add(sound);

		this.angularVelocity = new THREE.Euler(0.002);

		this.temperature = Random.range(TEMPERATURE_RANGE[0], TEMPERATURE_RANGE[1]);
	}
}
