// src/components/Inventory/InventoryDashboard.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Grow,
  LinearProgress,
  Divider,
} from "@mui/material";
import { tokens } from "../../theme";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";

const InventoryDashboard = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainerSecondary;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_DISPONIBLE = colors.accentGreen[100];
  const COLOR_ASIGNADO = colors.blueAccent[400];
  const COLOR_MANTENIMIENTO = colors.yellowAccent[400];
  const COLOR_BAJA = colors.redAccent[400];

  // ============================================
  // MÉTRICAS
  // ============================================
  const metrics = useMemo(() => {
    let disponibles = 0;
    let asignados = 0;
    let mantenimiento = 0;
    let baja = 0;

    data.forEach((item) => {
      if (item.activo === false) baja++;
      else if (item.condicion_actual === "malo") mantenimiento++;
      else if (item.id_usuario) asignados++;
      else disponibles++;
    });

    const total = data.length;

    // Todas las categorías
    const categorias = {};
    data.forEach((item) => {
      const cat = item.categoria || "Sin categoría";
      categorias[cat] = (categorias[cat] || 0) + 1;
    });

    const categoriasArray = Object.entries(categorias)
      .map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
        porcentaje: total > 0 ? (cantidad / total) * 100 : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // Todas las subcategorías
    const subcategorias = {};
    data.forEach((item) => {
      const sub = item.subcategoria || "Sin subcategoría";
      subcategorias[sub] = (subcategorias[sub] || 0) + 1;
    });

    const subcategoriasArray = Object.entries(subcategorias)
      .map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
        porcentaje: total > 0 ? (cantidad / total) * 100 : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return {
      total,
      disponibles,
      asignados,
      mantenimiento,
      baja,
      categorias: categoriasArray,
      subcategorias: subcategoriasArray,
    };
  }, [data]);

  // ============================================
  // COMPONENTE KPI CARD
  // ============================================
  const KpiCard = ({ icon, title, value, color }) => (
    <Grow in={true} timeout={400}>
      <Paper
        sx={{
          p: 1.5,
          bgcolor: COLOR_FONDO,
          borderRadius: "12px",
          border: `1px solid ${COLOR_BORDE}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          transition: "transform 0.2s ease",
          "&:hover": { transform: "translateY(-2px)" },
        }}
      >
        <Box
          sx={{
            color: color || colors.grey[500],
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: COLOR_TEXTO, lineHeight: 1.2 }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colors.grey[400], fontSize: "0.65rem" }}
          >
            {title}
          </Typography>
        </Box>
      </Paper>
    </Grow>
  );

  if (data.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          bgcolor: COLOR_FONDO,
          borderRadius: "12px",
          border: `1px solid ${COLOR_BORDE}`,
          mb: 3,
        }}
      >
        <DashboardIcon sx={{ fontSize: 48, color: colors.grey[500], mb: 2 }} />
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          No hay datos para mostrar en el dashboard
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* KPIs principales - más compactos */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 1,
          mb: 3,
        }}
      >
        <KpiCard
          icon={<InventoryIcon />}
          title="Total"
          value={metrics.total}
          color={COLOR_TEXTO}
        />
        <KpiCard
          icon={<CheckCircleIcon />}
          title="Disponibles"
          value={metrics.disponibles}
          color={COLOR_DISPONIBLE}
        />
        <KpiCard
          icon={<PersonIcon />}
          title="Asignados"
          value={metrics.asignados}
          color={COLOR_ASIGNADO}
        />
        <KpiCard
          icon={<WarningIcon />}
          title="Mantenimiento"
          value={metrics.mantenimiento}
          color={COLOR_MANTENIMIENTO}
        />
        <KpiCard
          icon={<ErrorIcon />}
          title="Baja"
          value={metrics.baja}
          color={COLOR_BAJA}
        />
      </Box>

      {/* Grid de 2 columnas para TODAS las categorías y subcategorías */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
      >
        {/* Todas las categorías */}
        <Paper
          sx={{
            p: 2,
            bgcolor: COLOR_FONDO,
            borderRadius: "12px",
            border: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <CategoryIcon sx={{ color: colors.grey[400], fontSize: 18 }} />
            <Typography
              variant="subtitle2"
              sx={{
                color: colors.grey[300],
                fontWeight: 500,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              Categorías
            </Typography>
          </Box>

          <Box sx={{ maxHeight: 200, overflowY: "auto", pr: 0.5 }}>
            {metrics.categorias.length > 0 ? (
              metrics.categorias.map((item) => (
                <Box key={item.nombre} sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: colors.grey[300], fontSize: "0.65rem" }}
                    >
                      {item.nombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 500,
                        fontSize: "0.65rem",
                      }}
                    >
                      {item.cantidad}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.porcentaje}
                    sx={{
                      height: 3,
                      borderRadius: 1.5,
                      backgroundColor: colors.primary[600] + "40",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: colors.accentGreen[100],
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              ))
            ) : (
              <Typography
                variant="caption"
                sx={{ color: colors.grey[500], fontStyle: "italic" }}
              >
                No hay categorías
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Todas las subcategorías */}
        <Paper
          sx={{
            p: 2,
            bgcolor: COLOR_FONDO,
            borderRadius: "12px",
            border: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <DashboardIcon sx={{ color: colors.grey[400], fontSize: 18 }} />
            <Typography
              variant="subtitle2"
              sx={{
                color: colors.grey[300],
                fontWeight: 500,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              Subcategorías
            </Typography>
          </Box>

          <Box sx={{ maxHeight: 200, overflowY: "auto", pr: 0.5 }}>
            {metrics.subcategorias.length > 0 ? (
              metrics.subcategorias.map((item) => (
                <Box key={item.nombre} sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: colors.grey[300], fontSize: "0.65rem" }}
                    >
                      {item.nombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 500,
                        fontSize: "0.65rem",
                      }}
                    >
                      {item.cantidad}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.porcentaje}
                    sx={{
                      height: 3,
                      borderRadius: 1.5,
                      backgroundColor: colors.primary[600] + "40",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: colors.blueAccent[400],
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              ))
            ) : (
              <Typography
                variant="caption"
                sx={{ color: colors.grey[500], fontStyle: "italic" }}
              >
                No hay subcategorías
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Mensaje de filtros activos */}
      {data.length > 0 && (
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.grey[500],
              fontSize: "0.6rem",
              fontStyle: "italic",
            }}
          >
            {metrics.categorias.length} categorías •{" "}
            {metrics.subcategorias.length} subcategorías
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InventoryDashboard;
