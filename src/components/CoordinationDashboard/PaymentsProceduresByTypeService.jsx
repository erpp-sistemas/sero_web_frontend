import React from 'react'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,  
  GridToolbarDensitySelector,
  GridToolbarExport,  
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Viewer from 'react-viewer';
import Pie from '../../components/NivoChart/Pie'

function PaymentsProceduresByTypeService({data}) {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data) {
    return null;
}

  return (

    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="450px"
      gap="15px"
      width='100%'      
    >   
      <Box
        gridColumn='span 12'
        backgroundColor='rgba(128, 128, 128, 0.1)'
        borderRadius="10px"
        sx={{ cursor: 'pointer' }}
      >
        <Box>
          <Typography
            variant="h6"          
            sx={{ padding: "2px 30px 0 5px" }}
            color={colors.grey[200]}
            textAlign={'center'}
          >
            GESTIONES CON PAGO POR TIPO DE SERVICIO
          </Typography>
        </Box>
        <Box
          gridColumn='span 12'          
          borderRadius="10px"
          sx={{ padding: '0 5px' }}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          height='380px'
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            {data.length > 0 && (
              <Pie data={data} color='nivo' />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentsProceduresByTypeService