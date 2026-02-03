// src/components/HomeCoordination/PerformanceByGestor.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const getStatusColor = (percentage, colors) => {
  if (percentage >= 90) return colors.greenAccent[500];
  if (percentage >= 70) return colors.yellowAccent[500];
  return colors.redAccent[500];
};

const getStatusLabel = (percentage) => {
  if (percentage >= 90) return "Buen desempeño";
  if (percentage >= 70) return "Requiere atención";
  return "Crítico";
};

const PerformanceByGestor = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const gestores = useMemo(() => {
    const map = {};

    data.forEach((d) => {
      const gestor = d.nombre_usuario || "Sin nombre";

      if (!map[gestor]) {
        map[gestor] = {
          gestor,
          total: 0,
          completas: 0,
        };
      }

      map[gestor].total += 1;
      if (d.estatus_gestion === "COMPLETA") {
        map[gestor].completas += 1;
      }
    });

    return Object.values(map)
      .map((g) => ({
        ...g,
        percentage: g.total
          ? Math.round((g.completas / g.total) * 100)
          : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [data]);

  return (
    <Box mt={10}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Desempeño por gestor
      </Typography>

      <Box className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {gestores.map((g, index) => {
          const color = getStatusColor(g.percentage, colors);

          return (
            <Box
              key={index}
              className="p-4 rounded-xl shadow-sm"
              sx={{
                backgroundColor: colors.bgContainer,
                border: `1px solid ${colors.grey[800]}`,
              }}
            >
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PersonOutlineIcon sx={{ color }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {g.gestor}
                </Typography>
              </Box>

              {/* Métricas */}
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {g.completas} de {g.total} completas
              </Typography>

              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={g.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.grey[800],
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: color,
                    },
                  }}
                />
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color }}
                >
                  {g.percentage}%
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color }}
                >
                  {getStatusLabel(g.percentage)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PerformanceByGestor;
