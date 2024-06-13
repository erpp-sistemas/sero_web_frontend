import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const mapContainerStyle = {
  width: '100%',
  height: '400px' 
};

const TooltipCard = ({ account, latitude, longitude, property_status, date_capture, task }) => (
  <Card variant="outlined" sx={{ maxWidth: 200, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
    <CardContent>
      <Typography sx={{ fontSize: 12 }}>
        <strong>Cuenta:</strong> {account}
      </Typography>
      <Typography sx={{ fontSize: 12 }}>
        <strong>Tarea realizada:</strong> {task}
      </Typography>
      <Typography sx={{ fontSize: 12 }}>
        <strong>Fecha de gestion:</strong> {date_capture}
      </Typography>
      <Typography sx={{ fontSize: 12 }}>
        <strong>Estatus del predio:</strong> {property_status}
      </Typography>
      <Typography sx={{ fontSize: 12 }}>
        <strong>Latitud:</strong> {latitude}
      </Typography>
      <Typography sx={{ fontSize: 12 }}>
        <strong>Longitud:</strong> {longitude}
      </Typography> 
    </CardContent>
  </Card>
);

const MapboxMap = ({ positions, onClickMarker, setIsLoading }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);  

  useEffect(() => {
    if (map.current) {
      map.current.remove();
    }

    setIsLoading(true);

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [positions[0].longitude, positions[0].latitude],
      zoom: 14
    });

    map.current.on('load', () => {
      setIsLoading(false);
    });

    positions.forEach(({ latitude, longitude, photo, account, property_status, date_capture, task }) => {
      const markerColor = property_status !== 'Predio no localizado' ? 'green' : 'red';

      const customMarkerElement = document.createElement('div');
      customMarkerElement.style.display = 'flex';
      customMarkerElement.style.alignItems = 'center';
      customMarkerElement.style.justifyContent = 'center';
      customMarkerElement.style.border = `4px solid ${markerColor}`;
      customMarkerElement.style.borderRadius = '50%';
      customMarkerElement.style.width = '60px';
      customMarkerElement.style.height = '60px';
      customMarkerElement.style.backgroundColor = 'white';

      const avatarElement = (
        <Avatar
          src={photo}
          sx={{ width: '100%', height: '100%' }}
        />
      );

      const markerRoot = createRoot(customMarkerElement);
      markerRoot.render(avatarElement);

      const tooltipContainer = document.createElement('div');
      const tooltipRoot = createRoot(tooltipContainer);
      tooltipRoot.render(
        <TooltipCard
          account={account}
          latitude={latitude}
          longitude={longitude}
          property_status={property_status}
          date_capture={date_capture}
          task={task}
        />
      );

      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(tooltipContainer);

      new mapboxgl.Marker(customMarkerElement)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current);

        customMarkerElement.addEventListener('click', () => {
          onClickMarker({
            account,
            dateCapture: date_capture,
            latitude,
            longitude
          });
        });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [positions, setIsLoading]);

  

  return <div ref={mapContainerRef} style={mapContainerStyle} />;
  
};

export default MapboxMap;
