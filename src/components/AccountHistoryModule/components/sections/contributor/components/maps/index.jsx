import React from 'react'
import { LoadScript } from "@react-google-maps/api";
import "../maps/GoogleMaps.css";
import PropTypes from 'prop-types';
import { withErrorBoundary } from '@sentry/react';
import { Typography, Divider } from '@mui/material';;
import Grid from '@mui/material/Grid';
import LocationOffIcon from '@mui/icons-material/LocationOff';

const classNames = {
  principal: "GoogleMapsPrincipal",
  mapParent: "GoogleMapsPrincipalMapaParent",
  panoramaParent: "GoogleMapsPrincipalPanoramaParent",
  map: "GoogleMapsPrincipalMapa",
  panorama: "GoogleMapsPrincipalPanorama",
  // principal: 'GoogleMapsPrincipal'
};

/**
 * Componente que muestra un mapa de Google con vista satelital y de calle.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {number} props.latitude - La latitud para centrar el mapa (opcional).
 * @param {number} props.longitude - La longitud para centrar el mapa (opcional).
 * @returns {JSX.Element} - Elemento JSX que representa el componente GoogleMaps.
 */
function GoogleMaps({latitude,longitude}) {


  const lat =latitude ? latitude : 0
  const lng =longitude ? longitude : 0
  const mapRef = React.useRef(null);
  const panoramaRef = React.useRef(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);

  
/**
   * Maneja el evento onLoad del componente LoadScript.
   */
  const onMapLoad = () => {
    setMapLoaded(true);
  };

  React.useEffect(() => {
    if (mapLoaded && mapRef.current && panoramaRef.current) {
      const fenway = { lat, lng };

      const map = new google.maps.Map(mapRef.current, {
        center: fenway,
        zoom: 18,
      });

      const panorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
      });

      map.setStreetView(panorama);
    }
  }, [mapLoaded, lng, lat]);
  

  const apiKey = "AIzaSyBSbHAclLiEeiClEXfeZ2zn9OT850Mw55A";
  return (
    <div className={classNames.principal}>
    <LoadScript googleMapsApiKey={apiKey} onLoad={onMapLoad} loading="async">
      <div className={classNames.mapParent}>
        <div ref={mapRef} className={classNames.map}></div>
      </div>
      <div className={classNames.panoramaParent}>
        <div ref={panoramaRef} className={classNames.panorama}></div>
      </div>
    </LoadScript>
  </div>
  )
}
GoogleMaps.propTypes = {
  /**
   * La latitud para centrar el mapa (opcional).
   */
  latitude: PropTypes.number,
  /**
   * La longitud para centrar el mapa (opcional).
   */
  longitude: PropTypes.number,
};

 export default withErrorBoundary(GoogleMaps);