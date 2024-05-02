import React from 'react';
import { GoogleMap, StreetViewPanorama, LoadScript } from '@react-google-maps/api';

const GoogleMaps = ({ options }) => {
  return (
    <LoadScript googleMapsApiKey="TU_API_KEY">
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 50%', height: '400px', paddingRight: '10px' }}>
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={options.center}
            zoom={options.zoom}
          />
        </div>
        <div style={{ flex: '1 1 50%', height: '400px', paddingLeft: '10px' }}>
          <StreetViewPanorama
            position={options.center}
            visible={true}
          />
        </div>
      </div>
    </LoadScript>
  );
};

export default GoogleMaps;
