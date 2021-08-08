import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import styled from 'styled-components'
import Freeverb from 'freeverb'

const orbitCount = 16

// const AudioContext = window.AudioContext || window.webkitAudioContext
const listener = new THREE.AudioListener()
const ctx = listener.context
const reverb = new Freeverb(ctx)
reverb.roomSize = 0.99
reverb.dampening = 3000
reverb.wet.value = 1.0
reverb.dry.value = 0.0
listener.setFilter(reverb)
listener.setMasterVolume(0.01)
// listener.maxDistance = 1
const rolloff = 0.3

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const seed = 1
const random = mulberry32(seed)

function Star(props) {
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef()
  const t = 0.1;
  const index = props.index || 0
  // const sound = useState()
  
  useEffect(() => {
    var osc = ctx.createOscillator()
    osc.frequency.value = 32 + 32 * index
    osc.start()
    osc.type = 'triangle'

    var sound = new THREE.PositionalAudio(listener)
    sound.setRolloffFactor(rolloff)
    sound.setNodeSource(osc)
    mesh.current.add(sound)
  },[])

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // mesh.current.rotation.z += 0.001

    // console.log(osc)
    // oscillators[index].frequency.value += 0.1

    // scale
    var targetScale = hovered ? props.scale * 1.1 : props.scale
    var currentScale = mesh.current.scale.x
    if (targetScale == currentScale) return

    var scale = currentScale * (1-t) + targetScale * t
    mesh.current.scale.set(scale, scale, scale)
  })

  var onPointerOver = (e) => {
    // setHover(true)
  }

  var onPointerOut = (e) => {
    // setHover(false)
  }
  
  return (
    <mesh
      {...props}
      ref={mesh}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshToonMaterial color={props.color || 'orange'}/>
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
    // mesh.current.rotation.x += 0.01
    // mesh.current.rotation.y += 0.01
    rotation.x += props.speed || 0.015//, rotation.y, rotation.z)
    // line.current.rotation.z += props.speed || 0.015
    var rot = rotation
    var pos = new THREE.Vector3()
    pos.setFromSphericalCoords(props.scale, rot.x + offset, offset)
    setPosition(pos)
  })

  return (
    <>
      <Line
        {...props}
        points={circlePoints}       // Array of points
        color="white"                   // Default
        lineWidth={1}                   // In pixels (default)
        dashed={true}  
        dashSize={2} 
        dashScale={20}
        rotation={rotation} 
      />
      <Star
        index={props.index || 0}
        position={position}
        scale={0.25} 
        color={props.color || 'lightblue'}
        frequency={props.frequency}
      />
    </>
  )
}

function SolarSystem () {
  const camera = useThree(({ camera }) => camera)
  
  useEffect(() => {
    camera.add(listener)
    listener.gain.gain.value = 0
    listener.gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 5)
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
      <Star scale={1} />

      {orbitRings(orbitCount)}
    </>
  )
}

export default function Render() {
  return (
    <Canvas
      style={{width: '100vw', height: '100vh'}}
      dpr={ window.devicePixelRatio }
      camera={{fov: 60, aspect: window.innerWidth/window.innerHeight, position: [5, 0, 0]}}
    >
      <OrbitControls maxDistance={25} minDistance={5} enablePan={false} enableZoom={true} enableRotate={true} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={'white'}/>
      <Stars fade factor={10}/>
      <SolarSystem/>
    </Canvas>
  )
}