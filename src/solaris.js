import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Freeverb from 'freeverb'
import fragStar from './shaders/star.frag?raw'
import vertStar from './shaders/star.vert?raw'
import fragGlow from './shaders/glow.frag?raw'
import vertGlow from './shaders/glow.vert?raw'
import fragAtmosphere from './shaders/atmosphere.frag?raw'
import vertAtmosphere  from './shaders/atmosphere.vert?raw'
import anime from 'animejs'

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
  atmosphere: new THREE.ShaderMaterial({
    uniforms: {
      color: {type: 'vec3', value: new THREE.Color('cyan')},
      exponent: {type: 'float', value: 4.0},
      falloff: {type: 'float', value: 0.5},
    },
    vertexShader: vertAtmosphere,
    fragmentShader: fragAtmosphere,
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
    reverb.dampening = 3000
    reverb.dry.value = 0.0
    reverb.wet.value = 1.0
    // listener.setFilter(reverb)
    
    // Lighting
    scene.add(new THREE.PointLight('orange', 2, 50))
    // scene.add(new THREE.AmbientLight('white', 0.1))

    // Random function with seed: 0
    this.random = mulberry32(0)
    anime({
      targets: this.camera.position,
      z: [1000, 10],
      easing: 'easeOutExpo',
      // loop: true,
      // direction: 'alternate',
      duration: 3000,
    });
    
    // Stars
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 5000;
    const posArray = new Float32Array(starCount * 3)
    const starScale = 300
    const starMaterial = new THREE.PointsMaterial({size: 0.1})

    for (let i = 0; i < starCount; i++) {
      posArray[i] = (this.random() - 0.5) * starScale
      
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    scene.add(new THREE.Points(starGeometry, starMaterial))

    // Sun
    this.sun = new Sun(listener, F0)
    scene.add(this.sun.mesh)

    // Celestial bodies
    this.celestialBodies = []
    for (let i = 1; i < size; i++) {
      var body = this.celestialBodies[i] = new Planet(listener, i, F0, this.random)
      scene.add(body.mesh)
    }

    // Events
    window.addEventListener('focus', () => ctx.resume(), false)
    window.addEventListener('blur', () => ctx.suspend(), false)
    window.addEventListener('resize', () => this.onResize(), false)

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 10;
    // this.controls.maxDistance = 100;

    // Update
    this.time = 0
    this.update = () => {
      requestAnimationFrame(this.update)

      // this.sun.update()
      this.celestialBodies.forEach(body => body.update())

      this.time += 0.001
      materials.star.uniforms.time.value = this.time

      this.controls.update()
      this.renderer.render( this.scene, this.camera )
    }
  }
  start() {
    this.ctx.resume()
    this.master.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 3)
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
  constructor(listener, frequency, object3D) {
    // Oscillator
    var osc = listener.context.createOscillator() // default sine wave
    osc.frequency.value = frequency // harmonic series
    osc.start()

    // Positional audio source (three.js) attenuation model: 1/x
    var sound = new THREE.PositionalAudio(listener)
    sound.setRolloffFactor(0.4)
    sound.setNodeSource(osc)
    sound.panner.panningModel = 'equalpower'

    this.audio = {
      osc: osc,
      sound: sound
    }
  
    this.mesh = object3D
    this.mesh.add(sound)
  }

  update() {
    this.mesh.rotation.x += 0.002
  }
}

class Planet extends CelestialBody {
  constructor(listener, index, fundamental, random) {
    // randomly generated values
    var color = 0xffffff * random()
    var scale = 0.5 * random()
    var details = [8, 2, 1]

    var texture = new THREE.TextureLoader().load('/src/moonbump1k.jpg')
    var options = [
      {bumpMap: texture, bumpScale: 0.008, color: color},
      {color: color},
      {color: color},
    ]

    // LODs (level of detail)
    var lod = new THREE.LOD()
    for (var i = 0; i < 3; i++) {
      var geometry = new THREE.IcosahedronBufferGeometry(scale, details[i])
      var material = new THREE.MeshStandardMaterial(options[i])
      lod.addLevel(new THREE.Mesh(geometry, material), 25 * i)
    }

    // atmosphere
    var material = materials.atmosphere.clone();
    material.uniforms.color.value = new THREE.Color(color)

    lod.add(new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(scale * 1.1, 4), 
      material
    ))

    // call parent
    super(listener, fundamental + index * fundamental, lod)

    // orbit
    var rand = random()*Math.PI*2
    this.orbit = new THREE.Spherical(index, rand, 0)
    lod.position.x = this.orbit.radius
  }

  update() {
    this.orbit.phi += 0.001
    this.mesh.position.setFromSpherical(this.orbit)
  }
}

class Sun extends CelestialBody {
  constructor(listener, fundamental) {
    // var options = [
    //   {bumpMap: texture, bumpScale: 0.008, color: color},
    //   {color: color},
    //   {color: color},
    // ]

    var geometry = new THREE.IcosahedronBufferGeometry(1, 4)
    var material = materials.star
    var mesh = new THREE.Mesh(geometry, material)

    // glow
    var glow = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(1.25, 4), materials.glow)
    mesh.add(glow)

    super(listener, fundamental, mesh)
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