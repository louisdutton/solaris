import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

class CelestialBody {
  constructor(harmonic, radius = 2, padding = 5) {
    this.harmonic = harmonic;
    var sphere = new THREE.SphereGeometry(radius, 8, 8);
    this.mesh = new THREE.Mesh(sphere, material);;
    this.sound = new THREE.PositionalAudio(listener);
    this.osc = listener.context.createOscillator();
    this.osc.type = 'sine';
    this.baseFreq = 55 * harmonic;
    this.osc.frequency.setValueAtTime(this.baseFreq, this.sound.context.currentTime);
    this.osc.start(0);
    this.sound.setNodeSource(this.osc);
    this.sound.setRefDistance(10);
    this.sound.setVolume(gain * Math.pow(0.9, harmonic));
    this.mesh.add(this.sound);
    var phi = Math.random() * Math.PI;
    var theta = Math.random() * Math.PI;
    this.orbit = new THREE.Spherical(harmonic * padding, phi, theta);
    this.mesh.position.setFromSpherical(this.orbit);
    this.angularVelocity = { x: .005 * harmonic, y: 0 } ;

    scene.add(this.mesh);
  }

  update() {
    var t = this.sound.context.currentTime;
    this.mesh.rotation.x += 0.01;
    this.orbit.phi += this.angularVelocity.x;
    this.mesh.position.setFromSpherical(this.orbit);
    this.osc.frequency.setValueAtTime(this.baseFreq + 1 * Math.sin(t * 12), t)
  }
}

//#region Init

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.setZ(30);

// main renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// rendering stack (post-processing)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// composer.addPass(new UnrealBloomPass({x: 512, y: 512}, 2, 0, .75));
// composer.addPass(new AfterimagePass());

// materials
const material = new THREE.MeshBasicMaterial({ wireframe: true, opacity: .1});

// Audio
const listener = new THREE.AudioListener();
camera.add(listener);
const gain = .2;

// user interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 200;
controls.enablePan = false;
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('pointerdown', onMouseDown, false);
window.addEventListener('focus', onFocus, false);
window.addEventListener('blur', onBlur, false);

//#endregion

const origin = {x: 0, y: 0, z: 0};

// create celestial bodies
const sun = new CelestialBody(0, 4);

var planetCount = 12;
var planets = [];
for (var i = 0; i < planetCount; i++) { planets.push(new CelestialBody(i+1)); }

// start update loop
update();

function update() {
  requestAnimationFrame(update);
 
  sun.update();
  for (var i = 0; i < planets.length; i++) {
    planets[i].update();
  }

  controls.update();

  composer.render();
}

//#region event handlers

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseDown(e) {
  listener.context.resume();
}

function onFocus() {
  listener.context.resume();
}

function onBlur() {
  listener.context.suspend();
}
//#endregion

