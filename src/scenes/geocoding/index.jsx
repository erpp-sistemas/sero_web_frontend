import { Box, Grow, Slide} from '@mui/material';
import { useRef, useState } from 'react';
import InserApikey from '../../components/geocoding/InsertApikey'
import { useDispatch, useSelector } from 'react-redux';
import { setApikeyGeocodingSlice } from '../../redux/apikeyGeocodingSlice';
import BoxGeoconding from '../../components/geocoding/BoxGeoconding';



const index = () => {
  const apikeySlice=useSelector((a)=>a.apikeyGeocoding)

 
  return (

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Grow  in={!apikeySlice} style={{ transformOrigin: '0 20 0' }}   {...(!apikeySlice ? { timeout:2000 } : {})}>
      {!apikeySlice?<div style={{width:'100%',display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <InserApikey /> 
      </div>:<span></span>}
    </Grow>

    <Slide direction="up" in={apikeySlice} mountOnEnter unmountOnExit>
      <Box  style={{ width:'100%',display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
      <BoxGeoconding />
      </Box>
    </Slide>  
    </Box>
  );
};

export default index;