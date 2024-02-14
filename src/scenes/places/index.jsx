import { Box, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../../theme';
import Header from '../../components/Header';
import PlacesModule from '../../components/PlacesModule';

function Places() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
    <Header title="Gestiòn de Plazas" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Procesos en el Sistema" />
  <PlacesModule/>
    
  </Box>
  )
}

export default Places