// src/components/CoordinatorMonitor/CoordinatorSummary.jsx
import React, { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const SummaryCard = ({ title, value, subtitle, color }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: color,
      minWidth: 200,
    }}
  >
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const CoordinatorSummary = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const summary = useMemo(() => {
    const total = data.length;

    const completas = data.filter(
      (item) => item.estatus_gestion === "COMPLETA"
    ).length;

    const incompletas = total - completas;

    const calidad = total > 0
      ? Math.round((completas / total) * 100)
      : 0;

    return {
      total,
      completas,
      incompletas,
      calidad,
    };
  }, [data]);

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <SummaryCard
        title="Total de gestiones"
        value={summary.total}
        color={colors.primary[400]}
      />

      <SummaryCard
        title="Gestiones completas"
        value={summary.completas}
        subtitle={`${summary.calidad}% de calidad`}
        color={colors.greenAccent[600]}
      />

      <SummaryCard
        title="Gestiones incompletas"
        value={summary.incompletas}
        subtitle={`${100 - summary.calidad}% con incidencias`}
        color={colors.redAccent[600]}
      />
    </Box>
  );
};

export default CoordinatorSummary;
