// DashboardMapLayout.jsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import SidePanelGestores from "./DashboardMapLayout/SidePanelGestores";
import MapPositions from "./DashboardMapLayout/MapPositions";

const DashboardMapLayout = ({ data }) => {
  const [selectedGestor, setSelectedGestor] = useState(null);

  const handleSelectGestor = (gestorName) => {
    setSelectedGestor(gestorName);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}> {/* padding general del dashboard */}
      {/* 🔹 Título de la sección */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Ubicaciones de Gestores
      </Typography>

      {/* 🔹 Contenedor principal: barra lateral + mapa */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          height: "700px", // altura fija para ambos
          alignItems: "stretch", // asegura alineación vertical
        }}
      >
        
        {/* Barra lateral */}
        <SidePanelGestores
          data={data}
          selectedGestor={selectedGestor}
          onSelectGestor={handleSelectGestor}
        />

        {/* Mapa */}
        <Box
          sx={{
            flex: 1,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <MapPositions data={data}  selectedGestor={selectedGestor} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardMapLayout;
