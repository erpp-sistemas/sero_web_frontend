import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import Bar from '../NivoChart/Bar'

function TypeProperty({ data }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    

    console.log(data)

    const convertData = (data) => {
        return data.map(item => {
          
          const statusKey = item.type_property.split(' ').map(word => word[0]).join('');
          return {
            type_property: `${item.type_property}`,
            [`${item.type_property}`]: item.count,
            [`${statusKey}_Color`]: "hsl(0, 70%, 50%)"
          };
        });
      };   
      
      const formattedData = convertData(data);

      const getTypePropertyNamesKeys = (data) => {
        return data.map(item => item.type_property);
      };   
      
      const typePropertyNamesKeys = getTypePropertyNamesKeys(data);

      console.log(typePropertyNamesKeys)
    
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
                    TIPO DE PREDIO
                </Typography>
            </Box>
            {data.length > 0 && (
                <Bar data={ formattedData } index='type_property' keys={ typePropertyNamesKeys } position='vertical' color='category10'/>
              )}
        </Box>
    </Box>    
  )
}

export default TypeProperty