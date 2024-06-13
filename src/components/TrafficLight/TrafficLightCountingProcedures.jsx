import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import Bar from '../NivoChart/BarCustomized'

function TrafficLightCountingProcedures({ data }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (!data) {
      return null;
  }

  console.log(data)

  const order = [
    'sin gestion', 'vencidas', '7 dias', '14 dias', '21 dias', '30 dias', 'en proceso', 'gestion actual'
  ];

  const sortData = (data, order) => {
      return data.sort((a, b) => order.indexOf(a.color_meaning) - order.indexOf(b.color_meaning));
  };

  const convertData = (data) => {
    return data.map(item => {
      
      const statusKey = item.color_meaning.split(' ').map(word => word[0]).join('');
      return {
        color_meaning: `${item.color_meaning}`,
        [`${item.color_meaning}`]: item.count,
        color: item.color
        // [`${statusKey}_Color`]: "hsl(0, 70%, 50%)"
      };
    });
  };   
  
  const formattedData = convertData(data);

  const getColorMeaningNamesKeys = (data) => {
    return sortData(data, order).map(item => item.color_meaning);
  };

  const colorMeaningNamesKeys = getColorMeaningNamesKeys(data);

  console.log(colorMeaningNamesKeys)   
    
  return (

    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="390px"
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
                    SEMAFORO POR CUENTAS
                </Typography>
            </Box>
            {data.length > 0 && (
                <Bar data={ formattedData } index='color_meaning' keys={ colorMeaningNamesKeys } position='vertical' format='>-0,~d'/>
              )}
        </Box>
    </Box>    
  )
}

export default TrafficLightCountingProcedures