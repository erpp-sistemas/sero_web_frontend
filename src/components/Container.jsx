import React from 'react'
import { Box,useTheme } from '@mui/material'
import { tokens } from '../theme';


/**
 * Componente Container para envolver contenido con estilos específicos.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido a ser envuelto por el contenedor.
 * @return {JSX.Element} Componente Container con estilos específicos.
 */

function Container({children}) {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box  m='20px 0'
    display='flex'
    justifyContent='space-evenly'
    flexWrap='wrap'
    gap='20px'
    padding='15px 10px'
    borderRadius='10px'
    sx={{ backgroundColor: colors.primary[400], width: '100%' }}>
     {children}
    </Box>
  )
}

export default Container