import { Box, useTheme } from '@mui/material'
import React from 'react'
import Header from '../../components/Header'
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import ProcessCrud from '../../components/ProcessCrud';
/**
 * Página principal para la gestión de procesos.
 *
 * @component
 * @returns {JSX.Element} Componente Process.
 */
function Process() {
    const user = useSelector((state) => state.user);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
    <Header title="Gestiòn de Procesos" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Procesos en el Sistema" />
  <ProcessCrud/>
    
  </Box>
  )
}

export default Process