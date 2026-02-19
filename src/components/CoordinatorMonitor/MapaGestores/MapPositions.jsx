// src/components/CoordinatorMonitor/MapaGestores/MapPositions.jsx
import React, { useEffect, useRef, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Alert from "@mui/material/Alert";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
  Person,
  AccessTime,
} from "@mui/icons-material";

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  position: "relative",
};

const getUniqueColorForEstatus = (estatus, colors) => {
  if (!estatus) return colors.primary[400];
  
  const hash = estatus.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const colorPalette = [
    colors.accentGreen[100],
    colors.blueAccent[400],
    colors.yellowAccent[400],
    colors.redAccent[400],
    colors.greenAccent[200],
    colors.blueAccent[500],
    colors.purpleAccent?.[400] || colors.blueAccent[600],
    colors.orangeAccent?.[400] || colors.yellowAccent[500],
    colors.tealAccent?.[400] || colors.greenAccent[300],
    colors.pinkAccent?.[400] || colors.redAccent[300],
  ];
  
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

const TooltipCard = ({ gestor, colors, formatHora, formatFecha }) => {
  const estatusColor = getUniqueColorForEstatus(gestor.estatus_predio, colors);
  
  return (
    <Card
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: colors.bgContainer,
        border: `1px solid ${colors.borderContainer}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        minWidth: 220,
        maxWidth: 260,
      }}
    >
      <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Person sx={{ fontSize: 14, color: colors.grey[400] }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.grey[100] }} noWrap>
            {gestor.nombre_usuario}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 12, color: colors.grey[300] }} noWrap>
          {gestor.cuenta}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AccessTime sx={{ fontSize: 12, color: colors.grey[400] }} />
          <Typography sx={{ fontSize: 11, color: colors.grey[400] }} noWrap>
            {formatFecha(gestor.fecha)} • {formatHora(gestor.fecha)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: estatusColor,
            }}
          />
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: estatusColor,
            }}
            noWrap
          >
            {gestor.estatus_predio || "Sin estatus"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const MapPositions = ({
  data,
  selectedGestor,
  filtroEstatus,
  onEstatusChange,
  colors,
  COLOR_TEXTO,
  COLOR_FONDO,
  COLOR_BORDE
}) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [estatusUnicos, setEstatusUnicos] = useState([]);
  const [loadingPuntos, setLoadingPuntos] = useState(false);

  const formatHora = (fechaISO) => {
    if (!fechaISO) return "—";
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "—";
    }
  };

  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "—";
    }
  };

  // ============================================
  // EFECTO 1: Calcular estatus únicos (para chips)
  // ============================================
  useEffect(() => {
    if (selectedGestor) {
      const puntosGestor = data.filter(item => 
        item.id_usuario === selectedGestor && 
        item.latitud && 
        item.longitud
      );

      const conteo = {};
      puntosGestor.forEach(p => {
        const estatus = p.estatus_predio || "Sin estatus";
        conteo[estatus] = (conteo[estatus] || 0) + 1;
      });

      const estatusArray = Object.entries(conteo).map(([estatus, count]) => ({
        estatus,
        count,
        color: getUniqueColorForEstatus(estatus, colors)
      }));

      estatusArray.sort((a, b) => a.count - b.count);
      setEstatusUnicos(estatusArray);
    } else {
      setEstatusUnicos([]);
    }
  }, [selectedGestor, data, colors]);

  // ============================================
  // Obtener puntos a mostrar según el contexto
  // ============================================
  const positionsToShow = useMemo(() => {
    if (!data.length) return [];

    // 🟢 CASO 1: Sin gestor seleccionado -> Última ubicación de cada gestor
    if (!selectedGestor) {
      const ultimasUbicaciones = new Map();
      data.forEach((item) => {
        if (!item.latitud || !item.longitud) return;
        const userId = item.id_usuario;
        const fecha = new Date(item.fecha);
        if (!ultimasUbicaciones.has(userId) || 
            fecha > new Date(ultimasUbicaciones.get(userId).fecha)) {
          ultimasUbicaciones.set(userId, { ...item });
        }
      });
      return Array.from(ultimasUbicaciones.values());
    }

    // 🟢 CASO 2: Gestor seleccionado pero SIN filtro -> No mostrar nada
    if (!filtroEstatus) return [];

    // 🟢 CASO 3: Gestor seleccionado CON filtro
    setLoadingPuntos(true);

    let puntos = data.filter(item => 
      item.id_usuario === selectedGestor && 
      item.latitud && 
      item.longitud
    );

    // Si el filtro es 'todos', mostrar TODOS los puntos
    if (filtroEstatus === 'todos') {
      setTimeout(() => setLoadingPuntos(false), 100);
      return puntos;
    }

    // Si es un estatus específico, filtrar
    const puntosFiltrados = puntos.filter(item => 
      (item.estatus_predio || "Sin estatus") === filtroEstatus
    );

    setTimeout(() => setLoadingPuntos(false), 100);
    return puntosFiltrados;
  }, [data, selectedGestor, filtroEstatus]);

  // ============================================
  // Inicializar mapa (una sola vez)
  // ============================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initializeMap = () => {
      try {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }

        map.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [-99.1332, 19.4326],
          zoom: 10,
        });

        map.current.on('load', () => {
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
          setMapLoaded(true);
          setMapError(null);
        });

        map.current.on('error', (e) => {
          setMapError("Error al cargar el mapa. Verifica tu conexión.");
          setMapLoaded(false);
        });

      } catch (error) {
        setMapError("Error al inicializar el mapa");
        setMapLoaded(false);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current = {};
    };
  }, []);

  // ============================================
  // Actualizar marcadores cuando cambian los puntos
  // ============================================
  useEffect(() => {
    if (!map.current || !mapLoaded || loadingPuntos) return;

    // Limpiar marcadores existentes
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (positionsToShow.length === 0) return;

    // Calcular centro del mapa
    let center;
    if (positionsToShow.length === 1) {
      const punto = positionsToShow[0];
      center = [parseFloat(punto.longitud) || -99.1332, parseFloat(punto.latitud) || 19.4326];
    } else {
      let latSum = 0, lngSum = 0;
      positionsToShow.forEach(p => {
        latSum += parseFloat(p.latitud) || 0;
        lngSum += parseFloat(p.longitud) || 0;
      });
      center = [lngSum / positionsToShow.length, latSum / positionsToShow.length];
    }

    map.current.flyTo({
      center,
      zoom: selectedGestor ? 13 : 11,
      essential: true,
    });

    // Agregar marcadores
    positionsToShow.forEach((gestor, index) => {
      const { latitud, longitud, id_usuario, foto_usuario } = gestor;
      if (!latitud || !longitud) return;

      const borderColor = getUniqueColorForEstatus(gestor.estatus_predio, colors);

      const markerElement = document.createElement("div");
      markerElement.style.display = "flex";
      markerElement.style.alignItems = "center";
      markerElement.style.justifyContent = "center";
      markerElement.style.border = `3px solid ${borderColor}`;
      markerElement.style.borderRadius = "50%";
      markerElement.style.width = selectedGestor ? "40px" : "48px";
      markerElement.style.height = selectedGestor ? "40px" : "48px";
      markerElement.style.backgroundColor = colors.bgContainer;
      markerElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      markerElement.style.cursor = "pointer";
      markerElement.style.overflow = "hidden";

      const avatarElement = (
        <Avatar
          src={foto_usuario}
          alt={gestor.nombre_usuario}
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: colors.primary[600],
          }}
        >
          {!foto_usuario && gestor.nombre_usuario?.charAt(0)}
        </Avatar>
      );

      const markerRoot = createRoot(markerElement);
      markerRoot.render(avatarElement);

      const tooltipContainer = document.createElement("div");
      const tooltipRoot = createRoot(tooltipContainer);
      tooltipRoot.render(
        <TooltipCard
          gestor={gestor}
          colors={colors}
          formatHora={formatHora}
          formatFecha={formatFecha}
        />
      );

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
      }).setDOMContent(tooltipContainer);

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([parseFloat(longitud), parseFloat(latitud)])
        .setPopup(popup)
        .addTo(map.current);

      const markerId = selectedGestor ? `${id_usuario}-${index}` : id_usuario;
      markersRef.current[markerId] = marker;
    });
  }, [positionsToShow, selectedGestor, mapLoaded, loadingPuntos, colors]);

  const totalPuntosGestor = useMemo(() => {
    if (!selectedGestor) return 0;
    return data.filter(item => 
      item.id_usuario === selectedGestor && 
      item.latitud && 
      item.longitud
    ).length;
  }, [data, selectedGestor]);

  const handleChipClick = (estatus) => {
    console.log("👆 Usuario seleccionó:", estatus);
    onEstatusChange(estatus);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Panel de filtros - solo cuando hay gestor seleccionado */}
      {selectedGestor && estatusUnicos.length > 0 && (
        <Grow in={true} timeout={400}>
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
              backgroundColor: colors.bgContainer,
              borderRadius: "12px",
              border: `1px solid ${COLOR_BORDE}`,
              p: 2,
              maxWidth: 400,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: colors.grey[400],
                display: 'block',
                mb: 1.5,
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}
            >
              FILTRAR POR ESTATUS
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {/* Chip "TODOS" */}
              <Chip
                label={`Todos (${totalPuntosGestor})`}
                size="small"
                onClick={() => handleChipClick('todos')}
                sx={{
                  backgroundColor: filtroEstatus === 'todos' ? colors.blueAccent[600] + '30' : 'transparent',
                  color: filtroEstatus === 'todos' ? colors.blueAccent[600] : COLOR_TEXTO,
                  border: `1px solid ${filtroEstatus === 'todos' ? colors.blueAccent[600] : 'transparent'}`,
                  "&:hover": {
                    backgroundColor: colors.blueAccent[600] + '20',
                    transform: 'translateY(-1px)',
                  },
                  fontSize: '0.7rem',
                  height: 24,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  fontWeight: filtroEstatus === 'todos' ? 600 : 400,
                }}
              />
              
              {/* Chips por estatus */}
              {estatusUnicos.map(({ estatus, count, color }) => {
                const estaActivo = filtroEstatus === estatus;
                
                return (
                  <Chip
                    key={estatus}
                    label={`${estatus} (${count})`}
                    size="small"
                    onClick={() => handleChipClick(estatus)}
                    sx={{
                      backgroundColor: estaActivo ? color + '30' : color + '10',
                      color: estaActivo ? color : COLOR_TEXTO,
                      border: `1px solid ${estaActivo ? color : 'transparent'}`,
                      "&:hover": {
                        backgroundColor: color + '20',
                        transform: 'translateY(-1px)',
                      },
                      fontSize: '0.7rem',
                      height: 24,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontWeight: estaActivo ? 600 : 400,
                    }}
                  />
                );
              })}
            </Box>

            {/* Mensaje cuando no hay filtro seleccionado */}
            {!filtroEstatus && (
              <Fade in={true} timeout={800}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 2,
                    pt: 1,
                    borderTop: `1px solid ${COLOR_BORDE}`,
                  }}
                >
                  <InfoOutlined sx={{ fontSize: 14, color: colors.grey[500] }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.grey[500],
                      fontSize: '0.65rem',
                      fontStyle: 'italic',
                    }}
                  >
                    Selecciona un estatus para ver las ubicaciones
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
        </Grow>
      )}

      {/* Mensaje cuando hay gestor seleccionado pero no filtro */}
      {selectedGestor && !filtroEstatus && (
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              position: "absolute",
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.grey[500],
                backgroundColor: colors.bgContainer + 'CC',
                backdropFilter: 'blur(4px)',
                px: 3,
                py: 1.5,
                borderRadius: '30px',
                border: `1px solid ${COLOR_BORDE}`,
                fontSize: '0.8rem',
              }}
            >
              👆 Selecciona un filtro para ver ubicaciones
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Loader mientras carga puntos */}
      {loadingPuntos && (
        <Fade in={true} timeout={400}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.bgContainer + '80',
              backdropFilter: 'blur(2px)',
              zIndex: 15,
              borderRadius: "12px",
            }}
          >
            <CircularProgress size={32} thickness={3} sx={{ color: colors.primary[400] }} />
          </Box>
        </Fade>
      )}

      {/* Mapa */}
      <div ref={mapContainerRef} style={mapContainerStyle} />
      
      {/* Loader inicial del mapa */}
      {!mapLoaded && !mapError && (
        <Fade in={true} timeout={400}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.bgContainer,
              zIndex: 20,
              borderRadius: "12px",
            }}
          >
            <CircularProgress size={32} thickness={3} sx={{ color: colors.primary[400] }} />
          </Box>
        </Fade>
      )}

      {/* Error */}
      {mapError && (
        <Fade in={true} timeout={400}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.bgContainer,
              zIndex: 20,
              borderRadius: "12px",
              p: 3,
            }}
          >
            <Alert severity="error" sx={{ maxWidth: 400 }}>
              {mapError}
            </Alert>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default MapPositions;