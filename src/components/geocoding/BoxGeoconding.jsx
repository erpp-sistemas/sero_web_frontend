import React from 'react';
import { Grid } from '@mui/material';
import Geocoding from './Geocoding';
import PanelGeocododing from './PanelGeocododing';




const BoxGeoconding = () => {
  return (
  
  <>
      <Grid container  justifyContent={"space-between"} minHeight={"300px"}>
        <Grid item md={6} sm={12} xl={4} style={{backgroundColor:"#f8f8f8ba"}} margin={"0 auto"} padding={"20px"} minHeight={"300px"}>
            <Geocoding/>
        </Grid>
        
        
        <Grid item md={6} sm={12} minHeight={"300px"}>
            <PanelGeocododing/>
        </Grid>
      </Grid>
  </>
  );
};

export default BoxGeoconding;
