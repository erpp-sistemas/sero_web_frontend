// src/components/HomeCoordination/KpiCards.jsx
import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useSpring, animated } from "@react-spring/web";

// 🔹 Componente para animar y resaltar cambios
const AnimatedValue = ({ value, highlight }) => {
  const prevValue = useRef(value);

  const { number } = useSpring({
    from: { number: prevValue.current },
    to: { number: value },
    config: { tension: 120, friction: 20 },
    onRest: () => {
      prevValue.current = value;
    },
  });

  return (
    <animated.span
      style={{
        transition: "color 0.5s ease",
        color: highlight ? "rgba(74, 222, 128, 0.8)" : "inherit", // verde suave
      }}
    >
      {number.to((n) => n.toFixed(0))}
    </animated.span>
  );
};

const KpiCards = ({ data = [], prevData = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Calculamos KPIs actuales
  const totalGestores = [...new Set(data.map((d) => d.person_who_capture))].length;
  const prediosLocalizados = data.filter((d) => d.property_status === "Predio localizado").length;
  const prediosNoLocalizados = data.filter((d) => d.property_status === "Predio no localizado").length;
  const totalGestiones = data.length;
  const gestionesConFoto = data.filter((d) => d.total_photos > 0).length;
  const gestionesSinFoto = totalGestiones - gestionesConFoto;

  // 🔹 Calculamos KPIs previos
  const prevTotalGestores = prevData ? [...new Set(prevData.map((d) => d.person_who_capture))].length : 0;
  const prevPrediosLocalizados = prevData ? prevData.filter((d) => d.property_status === "Predio localizado").length : 0;
  const prevPrediosNoLocalizados = prevData ? prevData.filter((d) => d.property_status === "Predio no localizado").length : 0;
  const prevTotalGestiones = prevData ? prevData.length : 0;
  const prevGestionesConFoto = prevData ? prevData.filter((d) => d.total_photos > 0).length : 0;
  const prevGestionesSinFoto = prevTotalGestiones - prevGestionesConFoto;

  const kpis = [
    { label: "Gestores activos", value: totalGestores, prevValue: prevTotalGestores, icon: <CheckCircleOutlineIcon /> },
    { label: "Predios localizados", value: prediosLocalizados, prevValue: prevPrediosLocalizados, icon: <CheckCircleOutlineIcon /> },
    { label: "Predios no localizados", value: prediosNoLocalizados, prevValue: prevPrediosNoLocalizados, icon: <WarningAmberOutlinedIcon />, color: colors.yellowAccent[500] },
    { label: "Total gestiones", value: totalGestiones, prevValue: prevTotalGestiones, icon: <CheckCircleOutlineIcon /> },
    { label: "Gestiones con foto", value: gestionesConFoto, prevValue: prevGestionesConFoto, icon: <CheckCircleOutlineIcon /> },
    { label: "Gestiones sin foto", value: gestionesSinFoto, prevValue: prevGestionesSinFoto, icon: <WarningAmberOutlinedIcon />, color: colors.redAccent[500] },
  ];

  // 🔹 Estado para manejar highlight temporal
  const [highlightMap, setHighlightMap] = useState({});

  useEffect(() => {
    const newHighlight = {};
    kpis.forEach((kpi) => {
      newHighlight[kpi.label] = kpi.value > kpi.prevValue;
    });
    setHighlightMap(newHighlight);

    // 🔹 Limpiar highlight después de 1s
    const timeout = setTimeout(() => {
      setHighlightMap({});
    }, 1000);

    return () => clearTimeout(timeout);
  }, [data]); // se dispara cada vez que cambian los datos

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
      {kpis.map((kpi, index) => (
        <Box
          key={index}
          className="p-4 rounded-xl shadow-sm"
          sx={{
            backgroundColor: highlightMap[kpi.label] ? "rgba(74, 222, 128, 0.1)" : colors.bgContainer,
            display: "flex",
            alignItems: "center",
            gap: 2,
            transition: "transform 0.3s ease, background-color 0.5s ease, box-shadow 0.3s ease",
            transform: highlightMap[kpi.label] ? "scale(1.05)" : "scale(1)",
            boxShadow: highlightMap[kpi.label] ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ color: kpi.color || colors.grey[500], fontSize: 28 }}>{kpi.icon}</Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <AnimatedValue value={kpi.value} highlight={highlightMap[kpi.label]} />
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              {kpi.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default KpiCards;
