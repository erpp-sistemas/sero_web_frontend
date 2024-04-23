import React from 'react';
import { Grid, useTheme} from '@mui/material';
import Geocoding from './Geocoding';
import PanelGeocododing from './PanelGeocododing';

import { tokens } from '../../theme'


const BoxGeoconding = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
  
  <>
      <Grid container  justifyContent={"space-between"} minHeight={"300px"}>
        <Grid item md={6} sm={12} xl={4} style={{backgroundColor: colors.primary[400]}} margin={"0 auto"} padding={"20px"} minHeight={"300px"}>
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
