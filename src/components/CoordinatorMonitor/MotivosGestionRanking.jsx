import React, { useMemo } from "react";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const MotivosGestionRanking = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Procesamiento de datos
  const motivos = useMemo(() => {
    const map = {};

    const gestionesProblematicas = data.filter(
      (d) =>
        d.estatus_gestion === "INCOMPLETA" ||
        d.estatus_gestion === "INVALIDA"
    );

    gestionesProblematicas.forEach((d) => {
      if (!d.motivo_gestion) return;

      map[d.motivo_gestion] = (map[d.motivo_gestion] || 0) + 1;
    });

    const total = gestionesProblematicas.length || 1;

    return Object.entries(map)
      .map(([motivo, count]) => ({
        motivo,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  if (motivos.length === 0) return null;

  return (
    <Box
      sx={{
        backgroundColor: colors.bgContainer,
        borderRadius: 2,
        p: 3,
        mt: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Motivos de gestión incompleta
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Principales causas detectadas en el periodo seleccionado
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Ranking */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {motivos.map((item, index) => (
          <Box key={item.motivo}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], width: 20 }}
                >
                  {index + 1}.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.motivo.replaceAll("_", " ")}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ color: colors.grey[300], fontWeight: 500 }}
              >
                {item.count} ({item.percentage}%)
              </Typography>
            </Box>

            {/* Barra visual */}
            <Box
              sx={{
                height: 6,
                width: "100%",
                backgroundColor: colors.grey[800],
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${item.percentage}%`,
                  backgroundColor: colors.redAccent[500],
                  opacity: 0.8,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MotivosGestionRanking;
