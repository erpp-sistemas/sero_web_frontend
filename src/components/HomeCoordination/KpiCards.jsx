import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const KpiCards = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const totalGestores = [...new Set(data.map(d => d.person_who_capture))].length;
  const prediosLocalizados = data.filter(d => d.property_status === "Predio localizado").length;
  const prediosNoLocalizados = data.filter(d => d.property_status === "Predio no localizado").length;
  const totalGestiones = data.length;
  const gestionesConFoto = data.filter(d => d.total_photos > 0).length;
  const gestionesSinFoto = totalGestiones - gestionesConFoto;

  const kpis = [
    { label: "Gestores activos", value: totalGestores, icon: <CheckCircleOutlineIcon /> },
    { label: "Predios localizados", value: prediosLocalizados, icon: <CheckCircleOutlineIcon /> },
    { label: "Predios no localizados", value: prediosNoLocalizados, icon: <WarningAmberOutlinedIcon />, color: colors.yellowAccent[500] },
    { label: "Total gestiones", value: totalGestiones, icon: <CheckCircleOutlineIcon /> },
    { label: "Gestiones con foto", value: gestionesConFoto, icon: <CheckCircleOutlineIcon /> },
    { label: "Gestiones sin foto", value: gestionesSinFoto, icon: <WarningAmberOutlinedIcon />, color: colors.redAccent[500] },
  ];

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
      {kpis.map((kpi, index) => (
        <Box
          key={index}
          className="p-4 rounded-xl shadow-sm"
          sx={{
            backgroundColor: colors.bgContainer,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ color: kpi.color || colors.grey[500] }}>{kpi.icon}</Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {kpi.value}
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
