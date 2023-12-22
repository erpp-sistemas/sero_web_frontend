import { Box, useTheme } from '@mui/material'
import React from 'react'
import Header from "../../components/Header";
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
function Task() {
    const user = useSelector((state) => state.user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
    <Header title="Gestiòn de Tareas" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Tareas en el Sistema" />
  Task Crud Module
    
  </Box>
  )
}

export default Task