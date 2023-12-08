import React, { useEffect, useRef, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { TOKEN_GOOGLE_MAPS } from "../config";
import "./styles/GoogleMaps.css";

const classNames = {
  principal: "GoogleMapsPrincipal",
  mapParent: "GoogleMapsPrincipalMapaParent",
  panoramaParent: "GoogleMapsPrincipalPanoramaParent",
  map: "GoogleMapsPrincipalMapa",
  panorama: "GoogleMapsPrincipalPanorama",
  // principal: 'GoogleMapsPrincipal'
};

const GoogleMaps = ({ lng, lat }) => {
  const mapRef = useRef(null);
  const panoramaRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onMapLoad = () => {
    setMapLoaded(true);
  };

  useEffect(() => {
    if (mapLoaded && mapRef.current && panoramaRef.current) {
      const fenway = { lat, lng };

      const map = new google.maps.Map(mapRef.current, {
        center: fenway,
        zoom: 14,
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

  return (
    <div className={classNames.principal}>
      <LoadScript googleMapsApiKey={TOKEN_GOOGLE_MAPS} onLoad={onMapLoad}>
        <div className={classNames.mapParent}>
          <div ref={mapRef} className={classNames.map}></div>
        </div>
        <div className={classNames.panoramaParent}>
          <div ref={panoramaRef} className={classNames.panorama}></div>
        </div>
      </LoadScript>
    </div>
  );
};
// const googleNode = {
//   node: GoogleMaps
// }

// googleNode.node
export default GoogleMaps;
