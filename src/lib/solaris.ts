import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { createOrbit, createCelestialBody } from "./celestialBody";
import Star from "./star";
import * as MAT from "./materials";
import Random from "./random";
//@ts-ignore
import Freeverb from "freeverb";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.className = "solaris";

// Effect Composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(2, 2), 0.4, 2, 0));

// < AUDIO > //
// AudioListener, AudioContext & master gain
const listener = new THREE.AudioListener();
camera.add(listener);
const ctx = listener.context;
const master = listener.gain;
master.gain.value = 0;

// Reverb
const reverb = new Freeverb(ctx);
reverb.roomSize = 0.9;
reverb.dampening = 2000;
reverb.dry.value = 0.0;
reverb.wet.value = 1.0;
listener.setFilter(reverb);

// Load audio samples
const sourceGain = ctx.createGain();
const source = new AudioBufferSourceNode(ctx, {
	loop: true,
	loopStart: 0.25,
	loopEnd: 15,
});
const audioBuffer = await fetch("/audio/whispering.wav")
	.then((res) => res.arrayBuffer())
	.then((ArrayBuffer) => ctx.decodeAudioData(ArrayBuffer));

source.buffer = audioBuffer;
sourceGain.gain.value = 0.025;
source.connect(sourceGain); // bypass reverb
sourceGain.connect(ctx.destination);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 15;
controls.enablePan = false;
camera.position.z = 15;

// Lighting
scene.add(new THREE.PointLight("#ffaa00", 3, 10));
// scene.add(new THREE.AmbientLight('white', 0.1))

// Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const posArray = new Float32Array(starCount * 3);
const starScale = 300;
const starMaterial = new THREE.PointsMaterial({ size: 0.1 });

for (let i = 0; i < starCount; i++) {
	posArray[i] = (Random.value() - 0.5) * starScale;
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
scene.add(new THREE.Points(starGeometry, starMaterial));

const fundamental = 110;
const orbitCount = 5;

// Sun
const sun = new Star(listener, fundamental);
scene.add(sun.mesh);

// Generate celestial bodies
const orbits: THREE.Object3D[] = [];
for (let i = 1; i < orbitCount; i++) {
	const radius = 1 + i;
	const orbit = createOrbit(radius);
	// Random orbital phase
	orbit.rotation.z = Random.range(0, Math.PI * 2);

	const body = createCelestialBody(listener, fundamental + fundamental * i);
	orbit.add(body);
	body.position.x = radius;
	orbits.push(orbit);
	sun.mesh.add(orbit);
}

// Update loop
let time = 0;
const update = (orbits: THREE.Object3D[]) => {
	requestAnimationFrame(() => update(orbits));

	orbits.forEach((o) => (o.rotation.z += 0.001));

	time += 0.001;
	MAT.star.uniforms.time.value = time;

	controls.update();
	composer.render();
};

export const handleResize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};

export const handleStart = () => {
	ctx.resume();
	master.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 3);
	const app = document.querySelector<HTMLDivElement>("#solaris")!;
	renderer.domElement.className = "fade-in";
	app.appendChild(renderer.domElement);
	source.start();

	// begin update loop
	update(orbits);

	window.onclick = null;
};

export const handleBlur = () => {
	ctx.suspend();
};

export const handleFocus = () => {
	ctx.resume();
};
