import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  position: "relative",
};

const TooltipCard = ({ gestor, colors }) => (
  <Card
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: colors.bgContainer,
      border: `1px solid ${colors.borderContainer}`,
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      fontFamily: "sans-serif",
      minWidth: 180,
    }}
  >
    <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.2 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.grey[100] }} noWrap>
        {gestor.person_who_capture}
      </Typography>
      <Typography sx={{ fontSize: 11, color: colors.grey[300] }} noWrap>
        {gestor.task_done}
      </Typography>
      <Typography sx={{ fontSize: 10, color: colors.grey[400] }} noWrap>
        {new Date(gestor.date_capture).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 500,
          color: gestor.property_status.includes("no localizado")
            ? colors.redAccent[500]
            : colors.greenAccent[600],
        }}
        noWrap
      >
        {gestor.property_status}
      </Typography>
    </CardContent>
  </Card>
);

const MapPositions = ({ data, selectedGestor }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [elementsCount, setElementsCount] = useState(0);
  const [missingPositionsCount, setMissingPositionsCount] = useState(0);

  // ✅ Filtramos registros con coordenadas válidas (no null, no 0)
  const positionsToShow = React.useMemo(() => {
    const isValidCoord = (lat, lng) =>
      lat && lng && Math.abs(lat) > 0.001 && Math.abs(lng) > 0.001;

    let filteredData = [];
    let missingCount = 0;

    if (selectedGestor) {
      filteredData = data.filter((item) => {
        if (item.person_who_capture !== selectedGestor) return false;
        if (!isValidCoord(item.latitude, item.longitude)) {
          missingCount++;
          return false;
        }
        return true;
      });
      setMissingPositionsCount(missingCount);
    } else {
      filteredData = Object.values(
        data.reduce((acc, item) => {
          if (!isValidCoord(item.latitude, item.longitude)) return acc;
          const key = item.person_who_capture;
          const date = new Date(item.date_capture);
          if (!acc[key] || date > new Date(acc[key].date_capture)) {
            acc[key] = { ...item };
          }
          return acc;
        }, {})
      );
    }

    setElementsCount(filteredData.length);
    return filteredData;
  }, [data, selectedGestor]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || map.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ";

    const first = positionsToShow[0] || { longitude: -99.1332, latitude: 19.4326 };

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        theme.palette.mode === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/streets-v11",
      center: [parseFloat(first.longitude), parseFloat(first.latitude)],
      zoom: 12,
    });
  }, [theme, positionsToShow.length]);

  // Cambiar estilo al cambiar tema
  useEffect(() => {
    if (!map.current) return;
    const newStyle =
      theme.palette.mode === "dark"
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v11";
    map.current.setStyle(newStyle);
  }, [theme.palette.mode]);

  // Actualizar markers
  useEffect(() => {
    if (!map.current) return;

    const newKeys = new Set();
    positionsToShow.forEach((p) => {
      newKeys.add(`${p.cuenta}_${p.date_capture}`);
    });

    // 🔹 Si hay un gestor seleccionado, limpiar todos los markers
    if (selectedGestor) {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
    } else {
      // 🔹 Eliminar markers que ya no existen
      Object.keys(markersRef.current).forEach((key) => {
        if (!newKeys.has(key)) {
          markersRef.current[key].remove();
          delete markersRef.current[key];
        }
      });
    }

    // 🔹 Agregar markers nuevos
    positionsToShow.forEach((gestor) => {
      const key = `${gestor.cuenta}_${gestor.date_capture}`;
      if (markersRef.current[key]) return;

      const { latitude, longitude, photo_person_who_capture, property_status } = gestor;
      const isLastGestor = !selectedGestor;
      const borderColor = property_status?.toLowerCase().includes("no localizado")
        ? colors.redAccent[500]
        : colors.greenAccent[400];

      const markerEl = document.createElement("div");
      markerEl.style.display = "flex";
      markerEl.style.alignItems = "center";
      markerEl.style.justifyContent = "center";
      markerEl.style.border = `3px solid ${borderColor}`;
      markerEl.style.borderRadius = "50%";
      markerEl.style.width = isLastGestor ? "65px" : "55px";
      markerEl.style.height = isLastGestor ? "65px" : "55px";
      markerEl.style.backgroundColor = isLastGestor ? colors.primary[500] : "#fff";
      markerEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      markerEl.style.cursor = "pointer";

      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        markerEl.style.transform = blinkCount % 2 === 0 ? "scale(1.2)" : "scale(1)";
        blinkCount++;
        if (blinkCount > 3) clearInterval(blinkInterval);
      }, 250);

      createRoot(markerEl).render(
        <Avatar
          src={photo_person_who_capture}
          alt={gestor.person_who_capture}
          sx={{ width: "100%", height: "100%" }}
        />
      );

      const popupEl = document.createElement("div");
      createRoot(popupEl).render(<TooltipCard gestor={gestor} colors={colors} />);
      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupEl);

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current[key] = marker;
    });

    // Centrar mapa
    if (positionsToShow.length > 0) {
      const first = positionsToShow[0];
      map.current.flyTo({
        center: [parseFloat(first.longitude), parseFloat(first.latitude)],
        zoom: selectedGestor ? 14 : 12,
        speed: 0.8,
        curve: 1.5,
      });
    }
  }, [positionsToShow, selectedGestor, colors]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mapContainerRef} style={mapContainerStyle} />
      {elementsCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: colors.bgContainer,
            border: `1px solid ${colors.borderContainer}`,
            color: colors.grey[100],
            padding: "6px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            fontSize: 12,
            fontWeight: 500,
            pointerEvents: "none",
          }}
        >
          {selectedGestor
            ? `Mostrando ${elementsCount} gestiones de ${selectedGestor} (${missingPositionsCount} sin posición)`
            : `Mostrando ${elementsCount} últimas gestiones`}
        </div>
      )}
    </div>
  );
};

export default MapPositions;
