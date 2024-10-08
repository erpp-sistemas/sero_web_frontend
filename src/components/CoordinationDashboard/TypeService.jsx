import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import Bar from '../NivoChart/Bar'

function TypeService({ data }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    

    if (!data) {
      return null;
  }

    const convertData = (data) => {
        return data.map(item => {
          
          const statusKey = item.type_service.split(' ').map(word => word[0]).join('');
          return {
            type_service: `${item.type_service}`,
            [`${item.type_service}`]: item.count,
            [`${statusKey}_Color`]: "hsl(0, 70%, 50%)"
          };
        });
      };   
      
      const formattedData = convertData(data);

      const getTypeServiceNamesKeys = (data) => {
        return data.map(item => item.type_service);
      };   
      
      const typeServiceNamesKeys = getTypeServiceNamesKeys(data);
    
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
		sx={{ 
			cursor: 'pointer',
			gridColumn:'span 12',
			backgroundColor:'rgba(128, 128, 128, 0.1)',
			borderRadius:"10px",
			overflowY:'hidden',
			overflowX:'scroll'
		}}
      >

            <Box
                mt="10px"
                mb="-15px"
                p="0 10px"
                justifyContent="space-between"
                alignItems="center"
            >

              <Typography 
                variant="h4" 
                align="center" 
                sx={{ fontWeight: 'bold', paddingTop: 1 }}
              >
                    TIPO DE SERVICIO
                </Typography>
            </Box>
            {data.length > 0 && (
                <Bar data={ formattedData } index='type_service' keys={ typeServiceNamesKeys } position='vertical' color='category10'/>
              )}
        </Box>
    </Box>    
  )
}

export default TypeService