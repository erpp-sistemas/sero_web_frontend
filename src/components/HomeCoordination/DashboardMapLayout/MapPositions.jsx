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
      transition:
        "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
    }}
  >
    <CardContent
      sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.2 }}
    >
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, color: colors.grey[100] }}
        noWrap
      >
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
  const markersRef = useRef([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [elementsCount, setElementsCount] = useState(0);

  const positionsToShow = React.useMemo(() => {
    if (!selectedGestor) {
      // Última gestión de cada gestor
      const grouped = {};
      data.forEach((item) => {
        if (!item.latitude || !item.longitude) return;
        const key = item.person_who_capture;
        const date = new Date(item.date_capture);
        if (!grouped[key] || date > new Date(grouped[key].date_capture)) {
          grouped[key] = { ...item };
        }
      });
      setElementsCount(Object.keys(grouped).length);
      return Object.values(grouped);
    } else {
      const filtered = data.filter(
        (item) =>
          item.person_who_capture === selectedGestor &&
          item.latitude &&
          item.longitude
      );
      setElementsCount(filtered.length);
      return filtered;
    }
  }, [data, selectedGestor]);

  useEffect(() => {
    if (!mapContainerRef.current || map.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ";

    const first = positionsToShow[0] || {
      longitude: -99.1332,
      latitude: 19.4326,
    };
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        theme.palette.mode === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/streets-v11",
      center: [parseFloat(first.longitude), parseFloat(first.latitude)],
      zoom: 12,
    });
  }, [theme, positionsToShow]);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    positionsToShow.forEach((gestor) => {
      const { latitude, longitude, photo_person_who_capture, property_status } =
        gestor;
      if (!latitude || !longitude) return;

      const isLastGestor = !selectedGestor; // true si estamos mostrando última gestión de cada gestor

      const borderColor = property_status
        ?.toLowerCase()
        .includes("no localizado")
        ? colors.redAccent[500]
        : colors.greenAccent[400];

      const markerEl = document.createElement("div");
      markerEl.style.display = "flex";
      markerEl.style.alignItems = "center";
      markerEl.style.justifyContent = "center";
      markerEl.style.border = `3px solid ${borderColor}`;
      markerEl.style.borderRadius = "50%";
      markerEl.style.width = isLastGestor ? "65px" : "55px"; // más grande si última gestión
      markerEl.style.height = isLastGestor ? "65px" : "55px";
      markerEl.style.backgroundColor = isLastGestor
        ? colors.primary[500]
        : "#fff"; // fondo distintivo
      markerEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      markerEl.style.cursor = "pointer";

      createRoot(markerEl).render(
        <Avatar
          src={photo_person_who_capture}
          alt={gestor.person_who_capture}
          sx={{ width: "100%", height: "100%" }}
        />
      );

      const popupEl = document.createElement("div");
      createRoot(popupEl).render(
        <TooltipCard gestor={gestor} colors={colors} />
      );
      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupEl);

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    if (positionsToShow.length > 0) {
      const first = positionsToShow[0];
      map.current.flyTo({
        center: [parseFloat(first.longitude), parseFloat(first.latitude)],
        zoom: selectedGestor ? 14 : 12,
        speed: 0.8,
        curve: 1.5,
      });
    }
  }, [positionsToShow, colors, selectedGestor]);

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
            color: colors.grey[100],
            padding: "6px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            fontSize: 12,
            fontWeight: 600,
            pointerEvents: "none",
          }}
        >
          {selectedGestor
            ? `Mostrando ${elementsCount} gestiones de ${selectedGestor}`
            : `Mostrando ${elementsCount} últimas gestiones`}
        </div>
      )}
    </div>
  );
};

export default MapPositions;
