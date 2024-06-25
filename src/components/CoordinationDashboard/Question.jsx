import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import Bar from '../../components/NivoChart/Bar'

function Question({ data, campo, question }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    

    const conteo = {};
    
    data.forEach(item => {
        
        if (item[campo]) {
        
          let valorCampo = item[campo].trim();          
        
          if (valorCampo.toLowerCase() === 'indeciso' || valorCampo.toLowerCase() === 'no sabe') {
            valorCampo = 'Indeciso';
          }    
        
          conteo[valorCampo] = (conteo[valorCampo] || 0) + 1;
        }
      });  
            
    const arregloRespuestas = Object.entries(conteo).map(([respuesta, count]) => ({ count, answer: respuesta }));

    arregloRespuestas.sort((a, b) => b.count - a.count);

    const convertData = (data) => {
        return data.map(item => {
          
          return {
            answer: `${item.answer}`,
            [`${item.answer}`]: item.count,
            [`${item.answer}_Color`]: "hsl(0, 70%, 50%)"
          };
        });
      };   
      
      const formattedData = convertData(arregloRespuestas);

      const getLocationStatusNamesKeys = (data) => {
        return data.map(item => item.answer);
      };   
      
      const locationStatusNamesKeys = getLocationStatusNamesKeys(arregloRespuestas);
    
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
                    {question}
                </Typography>
            </Box>
            {data.length > 0 && (
                <Bar data={ formattedData } index='answer' keys={ locationStatusNamesKeys } position='vertical' color='yellow_green'/>
              )}
        </Box>
    </Box>    
  )
}

export default Question