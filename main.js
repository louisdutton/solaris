import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sphere } from 'three';
import * as Tone from 'tone';

//#region Init

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.setZ(30);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// const composer = new THREE.Composer

// geometry
const torus = new THREE.TorusGeometry(10, 3, 16, 100);
const sphere = new THREE.SphereGeometry(10, 32, 32);

// materials
const material = new THREE.MeshBasicMaterial({ wireframe: false });

// mesh
const mesh = new THREE.Mesh(sphere, material);

// Audio
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.PositionalAudio(listener);
const oscillator = listener.context.createOscillator();
oscillator.type = 'sine';
oscillator.start(0);
sound.setNodeSource(oscillator);
sound.setRefDistance(20);
sound.setVolume(0.1);
mesh.add(sound);

// events & controls
const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('pointerdown', onMouseDown, false);

//#endregion

scene.add(mesh);
animate();

function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  var time = sound.context.currentTime;
  oscillator.frequency.setValueAtTime(440 + Math.sin(time * 40) * 8, time);

  controls.update();

  renderer.render(scene, camera);
}

//#region Events

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseDown(e) {
  listener.context.resume();
}

//#endregion