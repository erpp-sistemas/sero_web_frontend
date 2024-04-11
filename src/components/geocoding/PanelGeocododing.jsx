import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@mui/material'
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SubirCordenadasPanel from './SubirCordenadasPanel';
import { useSelector } from 'react-redux';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { dispatch } from '../../redux/store';
import { setCordendasComparacion } from '../../redux/dataGeocodingSlice';

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

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
  const [value, setValue] = useState(1);
  const [mapaVew,setMapaVew]=useState(false)
  const [markerInstances,setMarkerInstances]=useState([])
  const [mark,setMark]=useState([])

  

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setMapaVew(value)
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  const cordenadas = useSelector(c => c.dataGeocoding?.cordenadas);
  const comparacion = useSelector(c => c.dataGeocoding?.cordendasComparacion);
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
 

const removeMarkers=()=>{
  // console.log("removimos")
  for(let marker of markerInstances){
    marker.remove();
  }
  setMarkerInstances([])
  
  generateMarker();
}


  const generateMarker = () => {
   
    const Instances = [];
    const markers = comparacion ? comparacion : cordenadas;
    // console.log(markers) 
    // console.log("hola") 
    markers.forEach(coordenada => {
   
      const customMarker = document.createElement('div');
      customMarker.className = 'customMarker';
      customMarker.style.backgroundColor = coordenada?.color ? coordenada.color : "red";

      const marker = new mapboxgl.Marker(customMarker)
        .setLngLat([parseFloat(coordenada.longitud), parseFloat(coordenada.latitud)])
        .addTo(mapaRef.current);
        Instances.push(marker);
     
    });
    setMarkerInstances(Instances)
    if (markers.length > 0) {
      mapaRef.current.setCenter([parseFloat(markers[markers.length - 1].longitud), parseFloat(markers[markers.length - 1].latitud)]);
    }
  }

  const markerDescart=()=>{ 
    console.log("RETOMAMOS ORIGINALES")
    const Instances = [...markerInstances];
   for(let c of cordenadas){
      const exist=mark.find(m=>m.cuenta==c.cuenta)
      if(!exist){
        console.log("metimos")
        Instances.push(c)
        generateMarker()
      }
    };

  }
  

  useEffect(() => {
    if (!mapaRef.current) return;
      markerDescart();
  }, [cordenadas]);


  useEffect(() => {
    
    if (!mapaRef.current) return;
      removeMarkers()
  }, [ comparacion]);


 
  
  const resetMarkers=()=>{
    dispatch(setCordendasComparacion())
    setValue(0)
  }
  const test=()=>{
    console.log(markerInstances)
   
  }

  return (
    
    <Box sx={{ bgcolor: 'background.paper', width: 500 }} minHeight={"100%"} minWidth={"100%"}>
      <button className='btn' onClick={test}>TEST</button>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="SUBIR O ACTUALIZAR" {...a11yProps(0)} onClick={resetMarkers} />
          <Tab label="MAPA" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
               <Box hidden={value !== 0}>
                    <SubirCordenadasPanel setValue={setValue}/>
                </Box>
                <Box hidden={value !== 1} >
                 {/* NO hay cotenido por el mapa, para renderizarlo una sola vez */} 
                </Box>
      </SwipeableViews>
      <div id="map" style={{ width:"100%", minHeight: '400px',position:"relative",backgroundColor:"white",display:value==0?"none":"block" }}  >
        <div className='panleMapInfo'>
            {
             comparacion?.length?
           <>
           {
            comparacion.map(c=>(
              <div key={c.longitud} style={{color:'black',padding:"5px"}}>
                <Button variant='contained'sx={{backgroundColor:c.color,width:"30px",marginRight:"10px"}}> {c.text}</Button>{c.cuenta}
              </div>
            ))
           }
           <div style={{display:'flex'}}>
           <Button variant='contained' color='primary' onClick={resetMarkers} sx={{margin:"0 0 0 auto",marginRight:"10px"}} > <KeyboardReturnIcon/> RETURN </Button>
           </div>
           </>
             :""
            }
        </div>
      </div>
    </Box>
  );
}



export default FullWidthTabs