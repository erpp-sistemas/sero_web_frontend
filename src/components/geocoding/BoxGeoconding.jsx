import React from 'react';
import { Grid } from '@mui/material';



import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box } from '@mui/system';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 20,
});

const InputFileUpload=()=> {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      color='secondary'
    >
      Selecciona un archivo
      <VisuallyHiddenInput type="file" accept=".csv" />
    </Button>
  );
}


const BoxGeoconding = ({resetApikey}) => {
  return (
  
  <>
      <Grid container  justifyContent={"space-between"}>
        <Grid item md={6} sm={12} xl={4} style={{backgroundColor:"#f8f8f8ba"}} margin={" auto"} padding={"20px"}>
            <Grid container  justifyContent={"space-between"}  >
                <InputFileUpload/>
        
                <Button variant="contained" color='success' startIcon={<InsertDriveFileIcon />}>
                Plantilla
                </Button>

            </Grid>
            <hr/>
            <Button  variant="contained" color='primary' style={{margin:"10px"}}  >
                GENERAR CORDENADAS
            </Button>

        </Grid>
        
        
        <Grid item md={6} sm={12}>
        Hola yo sere informes y mapas
        </Grid>
      </Grid>
  </>
  );
};

export default BoxGeoconding;
