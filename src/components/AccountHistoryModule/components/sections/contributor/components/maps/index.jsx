import React from 'react'
import { LoadScript } from "@react-google-maps/api";
import "../maps/GoogleMaps.css";
import PropTypes from 'prop-types';
import { withErrorBoundary } from '@sentry/react';

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
  const lat =latitude?latitude: 19.6593364
  const lng =longitude?longitude: -99.2093698
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
  

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <div className={classNames.principal}>
    <LoadScript googleMapsApiKey={apiKey} onLoad={onMapLoad}>
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