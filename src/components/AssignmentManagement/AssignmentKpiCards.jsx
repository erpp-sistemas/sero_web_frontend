import React, { useMemo } from "react";

import { Box, Typography, useTheme } from "@mui/material";

import { tokens } from "../../theme";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";

const AssignmentKpiCards = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const metrics = useMemo(() => {
    const totalAccounts = data.reduce(
      (total, item) => total + item.asignaciones_activas,
      0,
    );

    const managerMax =
      data.length > 0
        ? data.reduce((a, b) =>
            a.asignaciones_activas > b.asignaciones_activas ? a : b,
          )
        : null;

    const managerMin =
      data.length > 0
        ? data.reduce((a, b) =>
            a.asignaciones_activas < b.asignaciones_activas ? a : b,
          )
        : null;

    const lastAssignment =
      data.length > 0
        ? data.reduce((a, b) =>
            new Date(a.ultima_asignacion) > new Date(b.ultima_asignacion)
              ? a
              : b,
          )
        : null;

    return {
      totalAccounts,
      managerMax,
      managerMin,
      lastAssignment,
    };
  }, [data]);

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "-";

    return (
      new Date(value).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " hrs"
    );
  };

  /* ======================================================
     CARD BASE
  ====================================================== */

  const Card = ({ icon, children }) => (
    <Box
      className="p-4 rounded-xl shadow-sm"
      sx={{
        backgroundColor: colors.bgContainer,
        display: "flex",
        alignItems: "center",
        gap: 2,

        transition: "transform .2s ease",

        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          color: colors.grey[500],
          fontSize: 28,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <Card icon={<AssignmentOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {metrics.totalAccounts.toLocaleString()}
        </Typography>

        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Cuentas asignadas
        </Typography>
      </Card>

      <Card icon={<AccessTimeOutlinedIcon />}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colors.grey[100],
          }}
        >
          {formatDate(metrics.lastAssignment?.ultima_asignacion)}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: colors.grey[400],
          }}
        >
          Última asignación
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: colors.grey[500],
          }}
        >
          {formatTime(metrics.lastAssignment?.ultima_asignacion)}
        </Typography>
      </Card>

      <Card icon={<TrendingUpOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {metrics.managerMax?.asignaciones_activas ?? 0} cuentas
        </Typography>

        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Mayor carga
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: colors.grey[500],
          }}
        >
          {metrics.managerMax?.gestor ?? "-"}
        </Typography>
      </Card>

      <Card icon={<TrendingDownOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {metrics.managerMin?.asignaciones_activas ?? 0} cuentas
        </Typography>

        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Menor carga
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: colors.grey[500],
          }}
        >
          {metrics.managerMin?.gestor ?? "-"}
        </Typography>
      </Card>
    </Box>
  );
};

export default AssignmentKpiCards;
