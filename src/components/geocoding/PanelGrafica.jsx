import { Box, Typography } from '@mui/material'
import React from 'react'
import BarStack from '../NivoChart/BarStack'


import { data, data_campos_capturados, data_cuentas_pagadas, data_tipo_servicio_bar } from '../../data/BarStack'
import { data as data_pie, data_tipo_servicio } from '../../data/Pie'
import { useSelector } from 'react-redux'
const PanelGrafica = () => {
    
    const dataGeocoding=useSelector(c=>c.dataGeocoding)

    const data = [
        {
          "usuario": "Encontradas",
          "localizado": dataGeocoding.cordenadas.length,
          "localizadoColor": "hsl(21, 70%, 50%)",
          "no localizadoe": 90,
          "no localizadoColor": "hsl(239, 70%, 50%)",
        },
        {
          "usuario": "Errores",
          "localizadodrr": 170,
          "localizadoColor": "hsl(33, 70%, 50%)",
          "no localizado": dataGeocoding.cordenadasErrores.length,
          "no localizadoColor": "hsl(335, 70%, 50%)",
        }
      ]
      console.log( dataGeocoding)
  return (
    <Box
    id="grid-1"
    display="grid"
    gridTemplateColumns="repeat(12, 1fr)"
    gridAutoRows="350px"
    gap="15px"
    sx={{ margin: '20px 0' }}
>

    {/* GRAFICA DE BARRA EN STACK MOSTRANDO TOTAL DE GESTIONES POR GESTOR Y CUANTAS FUERON LOCALIZADAS */}
    <Box
        gridColumn='span 12'
        // backgroundColor="red"
        borderRadius="10px"
        sx={{ cursor: 'pointer' }}

    >

        <Box
            mt="10px"
            mb="-15px"
            p="0 10px"
            justifyContent="space-between"
            alignItems="center"
        >

            <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "2px 30px 0 5px" }}
                // color="red"
            >
                CORDENADAS
            </Typography>
        </Box>

        <BarStack data={data} position='vertical' color='nivo' keys={['localizado', 'no localizado']} groupMode={false} />
    </Box>
</Box>
  )
}

export default PanelGrafica