import React from 'react'
import StepperComponent from '../../components/StepperComponent'
import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
import Header from '../../components/Header';


const index = () => {
    return (
        <Box m="20px">
            <Header title="Crea un nuevo usuario" subtitle="Ingresa los datos" />            
          {/*   <StepperComponent /> */}
          
        </Box>
    )
}

export default index