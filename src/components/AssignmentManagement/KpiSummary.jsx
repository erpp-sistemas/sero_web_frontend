import React, { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";

const KpiSummary = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const kpis = useMemo(() => {
    if (!data.length) return [];

    const totalManagers = data.length;

    const totalAssignments = data.reduce(
      (total, item) => total + (item.asignaciones_activas || 0),
      0,
    );

    const averageAssignments =
      totalManagers > 0 ? Math.round(totalAssignments / totalManagers) : 0;

    const maxAssignments = [...data].sort(
      (a, b) => b.asignaciones_activas - a.asignaciones_activas,
    )[0];

    const minAssignments = [...data].sort(
      (a, b) => a.asignaciones_activas - b.asignaciones_activas,
    )[0];

    return [
      {
        label: "Gestores activos",
        value: totalManagers,
        secondary: null,
        icon: <GroupsOutlinedIcon />,
      },
      {
        label: "Cuentas asignadas",
        value: totalAssignments.toLocaleString(),
        secondary: null,
        icon: <Inventory2OutlinedIcon />,
      },
      {
        label: "Promedio por gestor",
        value: averageAssignments.toLocaleString(),
        secondary: "cuentas",
        icon: <EqualizerOutlinedIcon />,
      },
      {
        label: "Mayor carga",
        value: maxAssignments?.gestor ?? "-",
        secondary: `${(
          maxAssignments?.asignaciones_activas ?? 0
        ).toLocaleString()} cuentas`,
        icon: <TrendingUpOutlinedIcon />,
      },
      {
        label: "Menor carga",
        value: minAssignments?.gestor ?? "-",
        secondary: `${(
          minAssignments?.asignaciones_activas ?? 0
        ).toLocaleString()} cuentas`,
        icon: <TrendingDownOutlinedIcon />,
      },
    ];
  }, [data]);

  if (!kpis.length) return null;

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 mb-6">
      {kpis.map((kpi, index) => (
        <Box
          key={index}
          className="p-4 rounded-xl"
          sx={{
            backgroundColor: colors.bgContainer,
            border: `1px solid ${colors.borderContainer}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
            transition: "all .25s ease",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,.05)",
            },
          }}
        >
          <Box
            sx={{
              color: colors.accentGreen[100],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            {kpi.icon}
          </Box>

          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {kpi.value}
            </Typography>

            {kpi.secondary && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: colors.grey[500],
                  mb: 0.3,
                }}
              >
                {kpi.secondary}
              </Typography>
            )}

            <Typography
              variant="body2"
              sx={{
                color: colors.grey[400],
              }}
            >
              {kpi.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default KpiSummary;
