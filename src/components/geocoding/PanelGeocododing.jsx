import React, { useEffect, useRef, useState } from 'react'


import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SubirCordenadasPanel from './SubirCordenadasPanel';
import PanelGrafica from './PanelGrafica';
import PanelMapa from './PanelMapa';
import { useSelector } from 'react-redux';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

 function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const [mapaVew,setMapaVew]=useState(false)
  const [mapa,setMapa]=useState(false)
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value)
    setMapaVew(value)
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  const cordenadas = useSelector(c => c.dataGeocoding?.cordenadas);
  const mapaRef = useRef(null);

  useEffect(() => {
    mapaRef.current=null
      mapboxgl.accessToken = 'pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ';

      const mapa = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12', 
          zoom: 10,
          center: [-102.552784, 23.634501] 
      });

      mapa.on('load', () => {
          mapaRef.current = mapa;
      });
      setTimeout(()=>{setMapaVew(1)},800)
      return () => {
          mapa.remove();
      };
  }, []);


  const generateMarker=()=>{
    cordenadas.forEach(coordenada => {
      const customMarker = document.createElement('div');
      customMarker.style.backgroundColor = 'red';
      customMarker.style.width = '10px';
      customMarker.style.height = '10px';
      customMarker.style.borderRadius = '50%';

      new mapboxgl.Marker(customMarker)
          .setLngLat([parseFloat(coordenada.longitud), parseFloat(coordenada.latitud)]) 
          .addTo(mapaRef.current);
  });
  if (cordenadas.length > 0) {
    mapaRef.current.setCenter([parseFloat(cordenadas[cordenadas.length - 1].longitud), parseFloat(cordenadas[cordenadas.length - 1].latitud)]);
}
  }

  useEffect(() => {
    // console.log(mapaRef) 
      if (!mapaRef.current) return; // Evitar errores si el mapa aún no se ha inicializado
      generateMarker()
  
  }, [cordenadas]);



  return (
    <Box sx={{ bgcolor: 'background.paper', width: 500 }} minHeight={"100%"} minWidth={"100%"}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="SUBIR O ACTUALIZAR" {...a11yProps(0)} />
          <Tab label="MAPA" {...a11yProps(1)} onClick={generateMarker} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
               <Box hidden={value !== 0}>
                    <SubirCordenadasPanel/>
                </Box>
                <Box hidden={value !== 1} >
                 {/* NO hay cotenido por el mapa, para renderizarlo una sola vez */} 
                </Box>
      </SwipeableViews>
      <div id="map" style={{ width:"100%", minHeight: '400px',backgroundColor:"white",display:mapaVew!=0?"none":"block" }}  ></div>
    </Box>
  );
}



export default FullWidthTabs