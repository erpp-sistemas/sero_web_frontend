import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Box } from '@mui/material';


const PanelMapa = ({mapa,setMapa,Test}) => {
    // const [mapa,setMapa]=useState(false)
    // const cordenadas=useSelector(c=>c.dataGeocoding)?.cordenadas

    // useEffect(() => {
    //    if(!mapa){
    //     mapboxgl.accessToken = 'pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ';
    //   setMapa(
    //      new mapboxgl.Map({
    //         container: 'map',
    //         style: 'mapbox://styles/mapbox/streets-v12', 
    //         zoom: 10,
    //         center: cordenadas[0] ? [cordenadas[0].longitud, cordenadas[0].latitud] : [-102.552784, 23.634501]
    //     })
    //   )
    //    }
    
    //     cordenadas.forEach(coordenada => {
    //        console.log("metimos")
    //         const customMarker = document.createElement('div');
    //         customMarker.style.backgroundColor = 'red';
    //         customMarker.style.width = '10px';
    //         customMarker.style.height = '10px';
    //         customMarker.style.borderRadius = '50%';
    
    //         new mapboxgl.Marker(customMarker)
    //             .setLngLat([parseFloat(coordenada.longitud), parseFloat(coordenada.latitud)]) 
    //             .addTo(mapa);
    //     });
    // }, [cordenadas]);
    

    return (
        <>
        {/* <button onClick={()=>console.log(mapa)}>TEST</button> */}
        {/* <h3>CORDENDAS {cordenadas.length}</h3> */}
        <Box id="map" style={{ width: '100%', height: '400px',backgroundColor:"white" }}></Box>
        <Test/>
        </>
    );
}

export default PanelMapa;
