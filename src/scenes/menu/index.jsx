import { Box, useTheme } from '@mui/material';
import React from 'react'
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import MenuCrud from '../../components/MenuCrud';
/**
 * Componente funcional para la gestión de Menús.
 * 
 * @component
 * @returns {JSX.Element} Elemento JSX que representa la interfaz de gestión de Menús.
 */
function Menu() {
    const user = useSelector((state) => state.user);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
    <Header title="Gestiòn de Menus" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Menus en el Sistema" />
    <MenuCrud/>
    </Box>
  )
}

export default Menu