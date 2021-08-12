import React from 'react'
import styled from 'styled-components'
import { BiInfoCircle } from 'react-icons/bi'

const InfoWrapper = styled.div`
  position: absolute;
  height: 40px;
  width: 40px;
  left: 5%;
  top: 5%;
`

export default function GUI() {
  return (<>
      <InfoWrapper>
        <button onClick={() => console.log('test')}>
          <BiInfoCircle/>
        </button>
      </InfoWrapper>
    </>)
}
