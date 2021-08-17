import React, { useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa'
import Anime from 'react-anime'
import * as SOLARIS from './solaris'
import './App.css'

export default function App() {
  const [state, setState] = useState({
    system: null,
    start: false,
  })

  useEffect(() => {
    
  }, [])

  const onStart = () => {
    setState({start: true})
    state.system = new SOLARIS.SolarSystem(8, 55)
    state.system.start()
  }

  return (
    <div className='app'>
      <div id='solaris'/>
      {!state.start && <StartButton onStart={onStart}/>}
      {/* {state.start && <Header/>} */}
    </div>
  )
}

const StartButton = ({onStart}) => (
  <Anime easing={'easeOutElastic'} duration={1000} delay={250} scale={[0, 1]}>
    <button className='start-button' onClick={() => onStart()}>
      <FaPlay/>
    </button>
  </Anime>
)



function Header(props) {
  const [visible, setVisible] = useState(true)
  const delay = 10250
  const easeIn = 'easeInOutQuad'
  const easeOut = 'easeInQuad'

  useEffect(() => {
    setTimeout(() => {
      setVisible(false)
    }, delay)
  }, [delay])

  const calcDelay = (el, i) => 150 * (i+1)

  const splitText = (text) => (
    <h1 aria-label={text}>
      <Anime easing={easeIn} duration={2250} delay={calcDelay} opacity={[0, 1]}
      >
        {text.split('').map(function(char, index){
          return (
            <Anime easing={easeOut} duration={5000} delay={1000} opacity={0} key={index}>
             {char}
            </Anime>
          )
        })}
      </Anime>
    </h1>
  )

  return visible
    ? splitText('SOLARIS')
    : <div/>
}