import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import './App.css'
import Render from './Render'
import GUI from './GUI'
import { FaPlay } from 'react-icons/fa'

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
  animation: fade-in 3s forwards 2s;
  text-shadow: 0 0 15px #CCC;
  margin: 0;
`

const Wrapper = styled.div`
  opacity: 0;
  animation: fade-in 3s forwards 0.5s;
`

const StartWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function App() {
  const [state, setState] = useState({start: false})

  const onStart = () => {
    setState({start: true})
    window.requestFullscreen();
  }
    
  // Hasn't launched yet
  if (!state.start) return (
    <StartWrapper>
      <button onClick={onStart}>
        <FaPlay/>
      </button>
    </StartWrapper>
  )

  // Start Button Pressed
  return (
    <Wrapper>
      <Render callback={(e) => console.log(e)}/>
      <Title>SOLARIS</Title>
      <GUI/>
    </Wrapper>
  )
}