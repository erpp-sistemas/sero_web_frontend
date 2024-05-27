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

function PieManagementByTypeOfServiceAndLocationStatus({datatype, datalocation}) {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const generateRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30 + 70);
    const l = Math.floor(Math.random() * 30 + 50);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const generateRandomColorRGBA = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random().toFixed(2); 
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };  

  console.log(datatype)
  console.log(datalocation)

  return (

    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="390px"
      gap="15px"
      width='100%'
      padding='15px'
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
            GESTIONES POR TIPO DE SERVICIO Y ESTATUS DE LOCALIZACIÓN
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
          <Box sx={{ width: '49%', height: '100%' }}>
            {datatype.length > 0 && (
              <Pie data={datatype} color='dark2' /> 
            )}
          </Box>
        
          <Box sx={{ width: '49%', height: '100%' }}>
            {datalocation.length > 0 && (
              <Pie data={datalocation} color='dark2' />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PieManagementByTypeOfServiceAndLocationStatus