import { Box, useTheme } from '@mui/material';
import React from 'react'
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import PermissionModule from '../../components/PermissionModule';

/**
 * Componente para gestionar los permisos de usuario.
 * 
 * @returns {JSX.Element} Elemento JSX que representa la interfaz de gestión de permisos.
 */
function Permission() {
    const user = useSelector((state) => state.user);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
    <Header title="Gestiòn de Permisos" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Permisos en el Sistema" />
  <PermissionModule/>
    
  </Box>
  )
}

export default Permission