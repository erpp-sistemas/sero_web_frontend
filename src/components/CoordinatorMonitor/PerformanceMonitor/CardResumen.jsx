// src/components/CoordinatorMonitor/CardResumen.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const CardResumen = ({
  titulo,
  valor,
  color,
  icono,
  colors,
  COLOR_TEXTO,
  COLOR_FONDO,
  COLOR_BORDE,
}) => (
  <Box
    className="p-4 rounded-xl shadow-sm"
    sx={{
      backgroundColor: COLOR_FONDO,
      display: "flex",
      alignItems: "center",
      gap: 2,
      border: `1px solid ${COLOR_BORDE}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Box sx={{ color: icono.props?.sx?.color || color, fontSize: 28 }}>
      {icono}
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
        {valor}
      </Typography>
      <Typography variant="body2" sx={{ color: colors.grey[400] }}>
        {titulo}
      </Typography>
    </Box>
  </Box>
);

export default CardResumen;