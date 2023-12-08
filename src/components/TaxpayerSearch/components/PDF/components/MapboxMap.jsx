import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { TOKEN_MAP_BOX } from "../../config";

const token = TOKEN_MAP_BOX;
//* longitud, latitud
const cordenadas = [-99.07076, 19.6363853];

const MapboxMap = ({ coordenadas }) => {
  useEffect(() => {
    if (!coordenadas || coordenadas?.length < 2) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: "map", // ID del elemento HTML donde se renderizará el mapa
      style: "mapbox://styles/mapbox/streets-v11", // Estilo del mapa (puedes cambiarlo),
      center: coordenadas, // Coordenadas del centro del mapa (longitud, latitud)
      zoom: 15.5, // Nivel de zoom
      preserveDrawingBuffer: true,
    });

    // Añadir marcadores, rutas, capas, etc. aquí

    const marker = new mapboxgl.Marker({ color: "black" });
    marker.setLngLat(coordenadas);
    marker.addTo(map);

    // Escuchar el evento de clic en el mapa
    map.on("click", (e) => {
      // const { lng, lat } = e.lngLat;

      // Mover el marcador a la ubicación del clic
      // marker.setLngLat([-99.07076, 19.6363853]);
      // marker.
      marker.addTo(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ width: "170px", height: "170px", }} />;
};

export default MapboxMap;
