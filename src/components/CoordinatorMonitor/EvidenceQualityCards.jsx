// src/components/HomeCoordination/EvidenceQualityCards.jsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import GpsOffIcon from "@mui/icons-material/GpsOff";
import PhotoCameraOffIcon from "@mui/icons-material/NoPhotography";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const EvidenceQualityCards = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const totalGestiones = data.length || 1; // evitar división entre 0

  // 🔹 Reglas
  const sinGPS = data.filter((d) => !d.has_gps).length;
  const sinFotoFachada = data.filter((d) => !d.foto_fachada).length;
  const sinFotoEvidencia = data.filter((d) => !d.foto_evidencia).length;

  const datosIncompletos = data.filter(
    (d) => !d.has_gps || !d.foto_fachada || !d.foto_evidencia
  ).length;

  const indicators = [
    {
      label: "Gestiones sin GPS",
      value: sinGPS,
      percentage: ((sinGPS / totalGestiones) * 100).toFixed(1),
      icon: <GpsOffIcon />,
    },
    {
      label: "Sin foto fachada",
      value: sinFotoFachada,
      percentage: ((sinFotoFachada / totalGestiones) * 100).toFixed(1),
      icon: <PhotoCameraOffIcon />,
    },
    {
      label: "Sin foto evidencia",
      value: sinFotoEvidencia,
      percentage: ((sinFotoEvidencia / totalGestiones) * 100).toFixed(1),
      icon: <PhotoCameraOffIcon />,
    },
    {
      label: "Datos mínimos incompletos",
      value: datosIncompletos,
      percentage: ((datosIncompletos / totalGestiones) * 100).toFixed(1),
      icon: <WarningAmberOutlinedIcon />,
    },
  ];

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {indicators.map((item, index) => (
        <Box
          key={index}
          className="p-4 rounded-xl shadow-sm"
          sx={{
            backgroundColor: colors.bgContainer,
            display: "flex",
            alignItems: "center",
            gap: 2,
            border: `1px solid ${colors.grey[800]}`,
          }}
        >
          <Box sx={{ color: colors.redAccent[500], fontSize: 28 }}>
            {item.icon}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {item.value}
              <Typography
                component="span"
                sx={{ color: colors.redAccent[500], ml: 1, fontSize: 14 }}
              >
                ({item.percentage}%)
              </Typography>
            </Typography>

            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              {item.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EvidenceQualityCards;
