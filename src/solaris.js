import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Freeverb from 'freeverb'
import fragStar from './shaders/star.frag?raw'
import vertStar from './shaders/star.vert?raw'
import fragGlow from './shaders/glow.frag?raw'
import vertGlow from './shaders/glow.vert?raw'

const materials = {
  star: new THREE.ShaderMaterial({
    uniforms: {
      time: {type: 'float', value: 0.0 },
      octaves: {type: 'int', value: 6 },
      lacunarity: {type: 'float', value: 1.8 },
      persistence: {type: 'float', value: 0.7 },

    },
    vertexShader: vertStar,
    fragmentShader: fragStar,
    side: THREE.FrontSide,
  }),

  glow: new THREE.ShaderMaterial({
    uniforms: {
      color: {type: 'vec3', value: new THREE.Color('orange')},
      exponent: {type: 'float', value: 5.0},
      falloff: {type: 'float', value: 0.5},
    },
    vertexShader: vertGlow,
    fragmentShader: fragGlow,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  }),
}

export class SolarSystem {
  constructor(size, F0) {
    // < SCENE > //
    var scene = this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.domElement.className = 'solaris'

    // < AUDIO > //
    // AudioListener, AudioContext & master gain
    var listener = this.listener = new THREE.AudioListener()
    this.camera.add(listener)
    var ctx = this.ctx = this.listener.context
    this.master = this.listener.gain
    this.master.gain.value = 0

    // Reverb
    var reverb = this.reverb = new Freeverb(ctx)
    reverb.roomSize = 0.9
    reverb.dampening = 500
    reverb.dry.value = 0.0
    reverb.wet.value = 0.5
    listener.setFilter(reverb)

    // Filtered noise (for textural ambience)
    var filter = this.noiseFilter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.Q.value = 0.7
    filter.frequency.value = 200
    // this.noiseFilter.connect(this.reverb)

    var noise = noise = ctx.createBufferSource()
    noise.buffer = whiteNoiseBuffer(1, ctx, 0.02)
    noise.loop = true
    noise.start()
    noise.connect(filter)
    
    // Lighting
    scene.add(new THREE.PointLight('orange', 2, 10))
    // scene.add(new THREE.AmbientLight('white', 0.1))

    // Random function with seed: 0
    this.random = mulberry32(0)
    this.camera.position.x = 5

    // Sun
    this.sun = new Sun(listener, 0, F0, this.random, 1)
    scene.add(this.sun.mesh)
    scene.add(this.sun.glow)

    // Celestial bodies
    this.celestialBodies = []
    for (let i = 1; i < size; i++) {
      var body = this.celestialBodies[i] = new CelestialBody(listener, i, F0, this.random, 0.25)
      scene.add(body.mesh)
    }

    // Events
    window.addEventListener('focus', () => ctx.resume(), false)
    window.addEventListener('blur', () => ctx.suspend(), false)
    window.addEventListener('resize', () => this.onResize(), false)

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true;

    // Update
    this.time = 0
    this.update = () => {
      requestAnimationFrame(this.update)

      this.celestialBodies.forEach(body => body.update())

      this.time += 0.001
      materials.star.uniforms.time.value = this.time

      this.controls.update()
      this.renderer.render( this.scene, this.camera )
    }
    this.update()
  }
  start() {
    this.master.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 1)
    document.getElementById('solaris').replaceWith(this.renderer.domElement)
    this.update()
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth/window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  destroy() {
    this.ctx.close()
  }
}

export class CelestialBody {
  constructor(listener, index, fundamental, random, scale) {
    // Gain
    var gain = listener.context.createGain()
    gain.gain.value = Math.pow(0.5 + 0.25, index)

    // Oscillator
    var osc = listener.context.createOscillator() // default sine wave
    osc.frequency.value = fundamental + index * fundamental // harmonic series
    osc.connect(gain)
    osc.start()

    // Positional audio source (three.js) attenuation model: 1/x
    var sound = new THREE.PositionalAudio(listener)
    sound.setRolloffFactor(0.25)
    sound.setNodeSource(gain)

    this.audio = {
      gain: gain,
      osc: osc,
      sound: sound
    }

    var texture = new THREE.TextureLoader().load('/src/moonbump1k.jpg')
    var mesh = this.mesh = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(scale, 8), 
      new THREE.MeshStandardMaterial({bumpMap: texture, bumpScale: 0.008, color: 0xffffff * random()})
    )

    mesh.add(sound)

    this.orbit = new THREE.Spherical(index, random()*Math.PI*2, 0)
    mesh.position.x = this.orbit.radius
    
  }

  update() {
    this.orbit.phi += 0.001
    this.mesh.position.setFromSpherical(this.orbit)
    this.mesh.rotation.x += 0.002
  }
}

export class Sun extends CelestialBody {
  constructor(...args) {
    super(...args)
    this.mesh.material = materials.star
     // glow
    this.glow = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(1.25, 8), 
      materials.glow
    )
  }
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function whiteNoiseBuffer(duration, ctx, gain=0.11)
{
  var sampleRate = ctx.sampleRate
  var bufferSize = duration * sampleRate
  var buffer = ctx.createBuffer(1, bufferSize, sampleRate)
  var channel = buffer.getChannelData(0)
  for (var i = 0; i < bufferSize; i++) { channel[i] = gain * Math.random() * 2 - 1 }
  return buffer
}