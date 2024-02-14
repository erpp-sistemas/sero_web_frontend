import { Box, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react'


const steps = [
    'Select master blaster campaign settings',
    'Create an ad group',
    'Create an ad',
  ];

function StepperPlaces() {
  return (
    
    <Box sx={{ width: '100%' }}>
    <Stepper activeStep={1} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </Box>
  )
}

export default StepperPlaces