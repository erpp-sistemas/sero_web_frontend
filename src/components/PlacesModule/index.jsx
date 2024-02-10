import React from 'react'
import Container from '../Container'
import { Stepper } from '@mui/material'
import StepperPlaces from './components/Stepper'
import PlacesForm from './components/PlacesForm'

function PlacesModule() {

    const [nextStep,setNextStep] = React.useState(0)
  return (
    <Container>
    
        <PlacesForm/>

    </Container>
  )
}

export default PlacesModule