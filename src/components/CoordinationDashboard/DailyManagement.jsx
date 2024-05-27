import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import Line from '../../components/NivoChart/Line'

function DailyManagement({ data }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    

    // Función para generar un color aleatorio
  const generateColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

  // Agrupar y transformar los datos
  const groupedData = data.reduce((acc, curr) => {
    const { month_year, day, count } = curr;
    if (!acc[month_year]) {
      acc[month_year] = {
        id: month_year,
        color: generateColor(),
        data: []
      };
    }
    acc[month_year].data.push({ x: day.toString(), y: count });
    return acc;
  }, {});

  // Obtener todos los días presentes en los datos
  const allDays = new Set();
  Object.values(groupedData).forEach(group => {
    group.data.forEach(point => {
      allDays.add(point.x);
    });
  });

  // Asegurarse de que todos los días están presentes en cada mes
  Object.values(groupedData).forEach(group => {
    const daySet = new Set(group.data.map(point => point.x));
    allDays.forEach(day => {
      if (!daySet.has(day)) {
        group.data.push({ x: day, y: 0 });
      }
    });
    // Ordenar los días del mes de menor a mayor
    group.data.sort((a, b) => parseInt(a.x) - parseInt(b.x));
  });

  const formattedData = Object.values(groupedData);

  console.log(formattedData);
    
  return (

    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="490px"
      gap="15px"
      width='100%'      
      padding='5px'
    >   
      <Box
        gridColumn='span 12'
        backgroundColor='rgba(128, 128, 128, 0.1)'
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
                    color={colors.grey[200]}
                    textAlign={'center'}
                >
                    GESTIONES REALIZADAS
                </Typography>
            </Box>
            {data.length > 0 && (
                <Line data={ formattedData } />
              )}
        </Box>
    </Box>
  )
}

export default DailyManagement