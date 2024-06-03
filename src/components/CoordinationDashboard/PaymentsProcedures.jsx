import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import Bar from '../NivoChart/Bar'

function PaymentsProcedures({ data }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    if (!data) {
      return null;
  }
    
    const conceptNamesKeys = ['gestiones_con_pago', 'gestiones_sin_pago'];
    
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
                    GESTIONES Y CUANTAS FUERON PAGADAS
                </Typography>
            </Box>
            {data.length > 0 && (
                <Bar data={ data } index='concept' keys={ conceptNamesKeys } position='vertical' color='category10'/>
              )}
        </Box>
    </Box>    
  )
}

export default PaymentsProcedures