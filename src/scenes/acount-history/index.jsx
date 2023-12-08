import { Box, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';

import Header from '../../components/Header';
import AccountHistoryModule from '../../components/AccountHistoryModule';

function AcountHistory() {
  const user = useSelector(state => state.user)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Historial de cuenta" subtitle="Ingresa los datos" /> 
    {/* <Header title="Crea un nuevo usuario" subtitle="Ingresa los datos" />  
              
    <StepperComponent /> */}
    <AccountHistoryModule />
    
</Box>

  )
}

export default AcountHistory