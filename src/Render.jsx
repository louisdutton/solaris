import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import styled from 'styled-components'
import Freeverb from 'freeverb'
import { Atmosphere } from './shaders'

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const seed = Date.now()
const random = mulberry32(seed)

const orbitCount = 6 + Math.round(random() * 26)
const fundamental = 32 + random() * 32

const listener =new THREE.AudioListener()
const ctx = listener.context
const reverb = new Freeverb(ctx, {roomSize: 0.99})
// reverb.roomSize = 0.99
reverb.dampening = 3000
reverb.wet.value = 1.0
reverb.dry.value = 0.0
listener.setFilter(reverb)
listener.setMasterVolume(0.01)

function Star(props) {
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef()
  const t = 0.1;
  const index = props.index || 0
  const [color, setColor] = useState()
  // const sound = useState()
  const [hovered, setHover] = useState(false)

  useEffect(() => {
    setColor(0xffffff * random())

    var osc = listener.context.createOscillator()
    osc.frequency.value = fundamental + fundamental * index
    osc.start()
    osc.type = 'triangle'

    var sound = new THREE.PositionalAudio(listener)
    sound.setRolloffFactor(0.4)
    sound.setNodeSource(osc)
    mesh.current.add(sound)
  },[])

  useFrame((state, delta) => {
    // scale
    var targetScale = hovered ? props.scale * 1.1 : props.scale
    var currentScale = mesh.current.scale.x
    if (targetScale == currentScale) return

    var scale = currentScale * (1-t) + targetScale * t
    mesh.current.scale.set(scale, scale, scale)
  })

  const onPointerOver = (e) => setHover(true)
  const onPointerOut = (e) => setHover(false)
  
  return (
    <mesh
      {...props}
      ref={mesh}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          vertexShader={Atmosphere.vertexShader}
          fragmentShader={Atmosphere.fragmentShader}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent={true}
        />
      </mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={props.color || color} 
      />
    </mesh>
  )
}

var pos = new THREE.CircleBufferGeometry(1, 48).attributes.position;
const circlePoints = [];
for ( let i = 1, l = pos.count; i < l; i ++ ) // ignore first vertex
{
  circlePoints[i] = new THREE.Vector3().fromBufferAttribute(pos, i)
}

function Orbit(props) {
  const [rotation, setRotation] = useState(new THREE.Vector3(0, Math.PI/2, 0))
  const [position, setPosition] = useState()
  const [show, setShow] = useState(true)
  const offset = props.offset

  useFrame((state, delta) => {
    rotation.x += props.speed || 0.015
    var rot = rotation
    var pos = new THREE.Vector3()
    pos.setFromSphericalCoords(props.scale, rot.x + offset, offset)
    setPosition(pos)
  })

  return (
    <Star
      index={props.index || 0}
      position={position}
      scale={0.25} 
      frequency={props.frequency}
    />
  )
}

function SolarSystem(props) {
  const camera = useThree(({ camera }) => camera)
  
  useEffect(() => {
    camera.add(listener)
  })

  var orbitRings = (N) => {
    var rings = [];
    for (var i = 0; i < N; i++) {
      rings.push(<Orbit
        scale={1.5+0.5*i}
        speed={0.001+0.001*i}
        frequency={440+220*i}
        offset= {random() * 2*Math.PI}
        key={i}
        index={i}
      />);
    }
    return <>{rings}</>;
  }

  return (
    <>
      <Star scale={1} color={'orange'}/>
      {orbitRings(orbitCount)}
    </>
  )
}

export default function Render(props) {
  useEffect(() => {
    listener.gain.gain.value = 0
    listener.gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 6)
    props.callback(listener)
  })

  return (
    <Canvas
      style={{width: '100vw', height: '100vh'}}
      dpr={ window.devicePixelRatio }
      camera={{fov: 60, aspect: window.innerWidth/window.innerHeight, position: [5, 0, 0]}}
      onClick={() => state.ctx.resume()}
    >
      <OrbitControls maxDistance={50} minDistance={3} enablePan={false} enableZoom={true} enableRotate={true} />
      <ambientLight intensity={0.1}/>
      <pointLight intensity={10} color={'orange'}/>
      <Stars fade factor={10}/>
      <SolarSystem/>
    </Canvas>
  )
}