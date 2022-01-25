import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import CelestialBody from "./celestialBody";
import Star from "./star";
import * as MAT from "./materials";
import { Random } from "./global";
//@ts-ignore
import Freeverb from "freeverb";

const celestialCount = 8;
const F0 = 50; // A2

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

// Sun
const sun = new Star(listener, F0);
scene.add(sun.mesh);

// Celestial bodies
const celestialBodies: CelestialBody[] = [];
for (let i = 1; i < celestialCount; i++) {
	const body = (celestialBodies[i] = new CelestialBody(listener, F0 + F0 * i));
	initOrbit(body, i);
	scene.add(body.mesh);
}

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 15;
controls.enablePan = false;

// Update loop
let time = 0;
const update = () => {
	requestAnimationFrame(update);

	// sun.update()
	celestialBodies.forEach((body) => {
		rotate(body);
		if (body.orbit) orbit(body);
	});

	time += 0.001;
	MAT.star.uniforms.time.value = time;

	controls.update();
	composer.render();
};

window.onresize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};

window.onclick = () => {
	ctx.resume();
	master.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 3);
	const app = document.querySelector<HTMLDivElement>("#solaris")!;
	app.replaceWith(renderer.domElement);

	// begin update loop
	update();

	window.onclick = null;
};

window.onblur = () => {
	ctx.suspend();
};

window.onfocus = () => {
	ctx.resume();
};

function initOrbit(body: CelestialBody, index: number) {
	const phi = Random.value() * Math.PI * 2;
	body.orbit = new THREE.Spherical(1 + index, phi, 0);
	body.mesh.position.x = body.orbit.radius;
}

function orbit(body: CelestialBody) {
	if (!body.orbit) return;
	body.orbit.phi += 0.001;
	body.mesh.position.setFromSpherical(body.orbit);
}

function rotate(body: CelestialBody) {
	body.mesh.rotation.x += body.angularVelocity.x;
	body.mesh.rotation.y += body.angularVelocity.y;
	body.mesh.rotation.z += body.angularVelocity.z;
}
