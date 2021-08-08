import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import './App.css'
import Render from './Render'

const Title = styled.h1`
  font-size: 8em;
  font-weight: light;
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, 50%);
  user-select: none;
  cursor: default;
  opacity: 0;
  animation: fade-in 3s forwards 0.5s;
  text-shadow: 0 0 15px #CCC;
  margin: 0;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Render/>
      <Title>SOLARIS</Title>
    </div>
  )
}

export default App
