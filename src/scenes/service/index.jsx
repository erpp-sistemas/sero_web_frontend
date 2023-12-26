import { Box, useTheme } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import ServiceCrud from '../../components/ServiceCrud';
/**
 * Página principal para la gestión de servicios.
 *
 * @component
 * @returns {JSX.Element} - Elemento JSX que representa la página de gestión de servicios.
 */
function Service() {
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
console.log("prueba");
  return (
    <Box m="20px">
    <Header title="Gestiòn de Servicios" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Servicios en el Sistema" />
 <ServiceCrud/>
    
  </Box>
  )
}

export default Service