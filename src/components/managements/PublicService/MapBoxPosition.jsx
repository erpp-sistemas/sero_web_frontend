import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// Mapbox Access Token
mapboxgl.accessToken = 'TU_MAPBOX_API_KEY';

const MapBoxPosition = ({ incidencesData }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Asignar un color dinámico para cada tipo de incidencia
  const getColorForIncidence = (incidenceType) => {
    const colors = {
      "Incidencia Tipo 1": "#FF5733",  // Rojo
      "Incidencia Tipo 2": "#33FF57",  // Verde
      "Incidencia Tipo 3": "#3357FF",  // Azul
      // Añadir más tipos según sea necesario
    };
    return colors[incidenceType] || "#000000"; // Negro por defecto
  };

  // Inicialización del mapa
  useEffect(() => {
    if (map) return; // Si ya hay un mapa, no inicializar uno nuevo

    const mapInstance = new mapboxgl.Map({
      container: "map",  // id del div del mapa
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],  // Coordenadas iniciales
      zoom: 9,
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [map]);

  // Función para agregar pines al mapa
  useEffect(() => {
    if (!map || !incidencesData) return;

    // Limpiar los marcadores antiguos
    markers.forEach(marker => marker.remove());

    // Añadir nuevos marcadores
    const newMarkers = incidencesData.map((incident) => {
      const color = getColorForIncidence(incident.tipo_incidencia);
      
      const marker = new mapboxgl.Marker({ color })
        .setLngLat([incident.longitud, incident.latitud])
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>${incident.tipo_incidencia}</h4><p>Más detalles...</p>`))
        .addTo(map);

      return marker;
    });

    // Guardar los nuevos marcadores
    setMarkers(newMarkers);
  }, [incidencesData, map]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '500px',
        marginTop: '20px',
      }}
    ></div>
  );
};

export default MapBoxPosition;
