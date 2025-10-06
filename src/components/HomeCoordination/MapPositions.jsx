import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
  borderRadius: "12px",
  overflow: "hidden",  
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
};

const TooltipCard = ({ gestor, colors }) => (
  <Card
    variant="outlined"
    sx={{
      p: 2, // padding compacto
      borderRadius: 2,
      bgcolor: colors.bgContainer, // fondo sutil según modo
      border: `1px solid ${colors.borderContainer}`, // borde suave
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // sombra ligera
      fontFamily: "sans-serif",
      minWidth: 180,
      transition:
        "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
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



const MapPositions = ({ data }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // 🔹 Agrupar y obtener la última gestión de cada gestor
  const lastPositions = React.useMemo(() => {
    const grouped = {};
    data.forEach((item) => {
      if (!item.latitude || !item.longitude) return;
      const key = item.person_who_capture;
      const date = new Date(item.date_capture);
      if (!grouped[key] || date > new Date(grouped[key].date_capture)) {
        grouped[key] = { ...item };
      }
    });
    return Object.values(grouped);
  }, [data]);

  useEffect(() => {
    if (!mapContainerRef.current || lastPositions.length === 0) return;

    if (map.current) {
      map.current.remove();
    }

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ";

    const first = lastPositions[0];
    const center = [
      parseFloat(first.longitude) || -99.1332,
      parseFloat(first.latitude) || 19.4326,
    ];

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        theme.palette.mode === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/streets-v11",
      center,
      zoom: 12,
    });

    // 🔹 Agregar marcadores
    lastPositions.forEach((gestor) => {
      const { latitude, longitude, photo_person_who_capture, property_status } = gestor;
      if (!latitude || !longitude) return;

      // 🟢 Determinar color del borde según el estatus
      const borderColor =
        property_status?.toLowerCase().includes("no localizado")
          ? colors.redAccent[500] // rojo
          : colors.greenAccent[400]; // verde

      const customMarkerElement = document.createElement("div");
      customMarkerElement.style.display = "flex";
      customMarkerElement.style.alignItems = "center";
      customMarkerElement.style.justifyContent = "center";
      customMarkerElement.style.border = `3px solid ${borderColor}`;
      customMarkerElement.style.borderRadius = "50%";
      customMarkerElement.style.width = "55px";
      customMarkerElement.style.height = "55px";
      customMarkerElement.style.backgroundColor = "#fff";
      customMarkerElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)";
      customMarkerElement.style.cursor = "pointer";

      const avatarElement = (
        <Avatar
          src={photo_person_who_capture}
          alt={gestor.person_who_capture}
          sx={{ width: "100%", height: "100%" }}
        />
      );

      const markerRoot = createRoot(customMarkerElement);
      markerRoot.render(avatarElement);

      const tooltipContainer = document.createElement("div");
      const tooltipRoot = createRoot(tooltipContainer);
      tooltipRoot.render(<TooltipCard gestor={gestor} colors={colors} />);

      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(tooltipContainer);

      new mapboxgl.Marker(customMarkerElement)
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(popup)
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lastPositions, theme]);

  return <div ref={mapContainerRef} style={mapContainerStyle} />;
};

export default MapPositions;
