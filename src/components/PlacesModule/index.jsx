import React from 'react'
import Container from '../Container'
import { Stepper } from '@mui/material'
import StepperPlaces from './components/Stepper'
import PlacesForm from './components/PlacesForm'
import PlacesGrid from './components/PlacesGrid'

function PlacesModule() {

    const [nextStep,setNextStep] = React.useState(0)
    const [componentesVisibility, setComponentesVisibility] = React.useState({
      form: false,
      placesGrid: true,
    });
  return (
    <Container>
      {componentesVisibility.form && (<PlacesForm      />)}
      {componentesVisibility.placesGrid &&( <PlacesGrid    setComponentesVisibility={setComponentesVisibility}/>)}
       

    </Container>
  )
}

export default PlacesModule