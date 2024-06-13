import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import BarStack from '../../components/NivoChart/BarStack'

function BarStackManagementsByManagerAndLocationStatus({ data }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    

    console.log(data)
    
  return (

    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="790px"
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
                    GESTIONES POR GESTOR Y ESTATUS DE LOCALIZACIÓN
                </Typography>
            </Box>
            {data.length > 0 && (
                <BarStack data={ data } position='vertical' color='set3' keys={['localizado', 'no localizado']} groupMode={false} />
              )}
        </Box>
    </Box>

    // <Box        
    // display='flex'
    // justifyContent='space-evenly'
    // flexWrap='wrap'
    // gap='20px'
    // sx={{ backgroundColor: colors.primary[400], width: '100%' }}        
    // borderRadius='10px'
    // >
    //   <Typography
    //       variant="h6"          
    //       sx={{ padding: "2px 30px 0 5px" }}
    //       color={colors.grey[200]}
    //       textAlign={'center'}
    //   >
    //       GESTIONES POR GESTOR Y ESTATUS DE LOCALIZACIÓN
    //   </Typography>
    //   <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
    //     <Grid item xs={12}>
    //       <Box sx={{ width: '100%', height: '100%' }}>
    //         {(data.length === 0 ) ? (
    //           <div style={{ textAlign: 'center', padding: '20px' }}>No se encontraron resultados</div>
    //         ) : (
    //           <BarStack data={gestorCounts} position='vertical' color='nivo' keys={['localizado', 'no localizado']} groupMode={false} />
    //         )}
    //       </Box>
    //     </Grid>        
    //   </Grid>
    // </Box>
  )
}

export default BarStackManagementsByManagerAndLocationStatus