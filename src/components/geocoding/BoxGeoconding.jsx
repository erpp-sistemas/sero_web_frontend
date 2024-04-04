import React from 'react';
import { Grid } from '@mui/material';
import Geocoding from './Geocoding';




const BoxGeoconding = () => {
  return (
  
  <>
      <Grid container  justifyContent={"space-between"}>
        <Grid item md={6} sm={12} xl={4} style={{backgroundColor:"#f8f8f8ba"}} margin={" auto"} padding={"20px"}>
        <Geocoding/>
        </Grid>
        
        
        <Grid item md={6} sm={12}>
        Hola yo sere informes y mapas
        </Grid>
      </Grid>
  </>
  );
};

export default BoxGeoconding;
