import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import Pin from '../../../public/icons8-pin.png' 

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const MapboxMap = ({ latitude, longitude }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 16
    });

    const customMarkerElement = document.createElement('div');
    customMarkerElement.innerHTML = `<img src="${Pin}" style="width: 60px; height: 60px;">`;;

    new mapboxgl.Marker(customMarkerElement)
      .setLngLat([longitude, latitude])
      .addTo(map.current);
    
    return () => map.current.remove();
  }, [latitude, longitude]);

  return <div ref={mapContainerRef} style={mapContainerStyle} />;
};

export default MapboxMap;

