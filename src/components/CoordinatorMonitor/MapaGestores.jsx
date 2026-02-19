// src/components/CoordinatorMonitor/MapaGestores.jsx
import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import SidePanelGestores from "./MapaGestores/SidePanelGestores";
import MapPositions from "./MapaGestores/MapPositions";

const MapaGestores = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedGestor, setSelectedGestor] = useState(null);
  const [filtroEstatus, setFiltroEstatus] = useState(null);

  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];

  const handleSelectGestor = (gestorId) => {
    console.log("🔄 Gestor seleccionado:", gestorId);
    setSelectedGestor(gestorId);
    // ✅ Resetear filtro a null (sin selección)
    setFiltroEstatus(null);
  };

  const handleEstatusChange = (estatus) => {
    console.log("🎯 Filtro seleccionado:", estatus);
    setFiltroEstatus(estatus);
  };

  return (
    <Box sx={{ width: "100%", py: 3 }}>
      <Typography
        variant="h6"
        sx={{
          color: COLOR_TEXTO,
          fontWeight: 600,
          fontSize: "1.125rem",
          mb: 0.5,
        }}
      >
        Ubicaciones de Gestores
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colors.grey[400],
          fontSize: "0.875rem",
          mb: 2,
        }}
      >
        Posición geográfica de los gestores en campo
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          height: "700px",
          alignItems: "stretch",
        }}
      >
        <SidePanelGestores
          data={data}
          selectedGestor={selectedGestor}
          onSelectGestor={handleSelectGestor}
          colors={colors}
          COLOR_TEXTO={COLOR_TEXTO}
          COLOR_FONDO={COLOR_FONDO}
          COLOR_BORDE={COLOR_BORDE}
        />

        <Box
          sx={{
            flex: 1,
            borderRadius: "12px",
            overflow: "hidden",
            bgcolor: COLOR_FONDO,
            border: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <MapPositions
            data={data}
            selectedGestor={selectedGestor}
            filtroEstatus={filtroEstatus}
            onEstatusChange={handleEstatusChange}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={COLOR_BORDE}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MapaGestores;