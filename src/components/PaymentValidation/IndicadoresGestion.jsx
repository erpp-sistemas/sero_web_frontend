// src/components/PaymentValidation/IndicadoresGestion.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Grow,
  Divider,
  LinearProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhotoCameraFrontOutlinedIcon from "@mui/icons-material/PhotoCameraFrontOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import LocationOffOutlinedIcon from "@mui/icons-material/LocationOffOutlined";

const IndicadoresGestion = ({ pagosValidos = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Cálculo de métricas
  const data = useMemo(() => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO"
    );

    const pagosNoValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] !== "Gestión válida" ||
        (p["estatus de gestion valida"] === "Gestión válida" &&
          p.evaluacion_periodos === "PERIODO_NO_VALIDO")
    );

    const sinPosicion = pagosValidosFiltrados.filter(
      (p) => !p.latitud || p.latitud === 0
    );
    const sinFotoFachada = pagosValidosFiltrados.filter(
      (p) => p["foto fachada predio"] === 0
    );
    const sinFotoEvidencia = pagosValidosFiltrados.filter(
      (p) => p["foto evidencia predio"] === 0
    );
    const prediosNoLocalizados = pagosValidosFiltrados.filter(
      (p) => p.estatus_predio !== "Predio localizado"
    );

    // 🔹 MANTENEMOS cálculo de montos para Resumen de Pagos
    const sum = (arr) =>
      arr.reduce((acc, cur) => acc + (parseFloat(cur.total_pagado) || 0), 0);

    const totalValidos = pagosValidosFiltrados.length || 1;

    return {
      total_gestiones_validas: pagosValidosFiltrados.length,
      pagos_validos: {
        count: pagosValidosFiltrados.length,
        monto: sum(pagosValidosFiltrados), // ✅ MANTENEMOS monto
      },
      pagos_no_validos: {
        count: pagosNoValidosFiltrados.length,
        monto: sum(pagosNoValidosFiltrados), // ✅ MANTENEMOS monto
      },
      sin_posicion: {
        count: sinPosicion.length,
        pct: (sinPosicion.length / totalValidos) * 100,
        total: totalValidos,
      },
      sin_foto_fachada: {
        count: sinFotoFachada.length,
        pct: (sinFotoFachada.length / totalValidos) * 100,
        total: totalValidos,
      },
      sin_foto_evidencia: {
        count: sinFotoEvidencia.length,
        pct: (sinFotoEvidencia.length / totalValidos) * 100,
        total: totalValidos,
      },
      predios_no_localizados: {
        count: prediosNoLocalizados.length,
        pct: (prediosNoLocalizados.length / totalValidos) * 100,
        total: totalValidos,
      },
    };
  }, [pagosValidos]);

  // 🔹 Color invertido: menor porcentaje = mejor (verde), mayor = peor (rojo)
  const getProgressColor = (pct) => {
    if (pct <= 5) return colors.greenAccent[400]; // Excelente (0-5%)
    if (pct <= 15) return colors.greenAccent[300]; // Bueno (5-15%)
    if (pct <= 30) return colors.yellowAccent[400]; // Regular (15-30%)
    if (pct <= 50) return colors.yellowAccent[500]; // Preocupante (30-50%)
    return colors.redAccent[400]; // Crítico (>50%)
  };

  // 🔹 Obtener etiqueta del nivel de calidad
  const getQualityLabel = (pct) => {
    if (pct <= 5) return "Excelente";
    if (pct <= 15) return "Bueno";
    if (pct <= 30) return "Regular";
    if (pct <= 50) return "Preocupante";
    return "Crítico";
  };

  // 🔹 Card compacta para Calidad de Datos (SIN montos)
  const CardCalidadDatos = ({
    icon: Icon,
    title,
    count,
    pct,
    total,
    delay = 0,
  }) => {
    const progressColor = getProgressColor(pct);
    const qualityLabel = getQualityLabel(pct);

    return (
      <Grow in={true} timeout={400 + delay}>
        <Box
          className="p-3 rounded-xl"
          sx={{
            backgroundColor: colors.bgContainer,
            border: `1px solid ${colors.borderContainer}`,
            transition: "all 0.2s ease",
            height: "100%",
            minHeight: "120px",
            display: "flex",
            flexDirection: "column",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
          }}
        >
          {/* Header compacto */}
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
          >
            {/* Icono sin fondo, solo con color */}
            <Box sx={{ color: progressColor, flexShrink: 0 }}>
              <Icon sx={{ fontSize: 24 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: colors.grey[100],
                  lineHeight: 1.3,
                  fontSize: "0.9rem",
                }}
              >
                {title}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right", minWidth: "60px" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: progressColor,
                  lineHeight: 1,
                }}
              >
                {pct.toFixed(1)}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: progressColor,
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                }}
              >
                {qualityLabel}
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar compacta */}
          <Box sx={{ mb: 2, mt: "auto" }}>
            <LinearProgress
              variant="determinate"
              value={pct > 100 ? 100 : pct}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.grey[700],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progressColor,
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Solo conteo de registros - más simple */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: colors.grey[300],
                fontWeight: 500,
                fontSize: "0.8rem",
                lineHeight: 1.4,
              }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 600, color: colors.grey[100] }}
              >
                {count.toLocaleString("es-MX")}
              </Box>
              <Box
                component="span"
                sx={{ color: colors.grey[500], fontSize: "0.75rem", ml: 0.5 }}
              >
                de {total.toLocaleString("es-MX")} registros
              </Box>
            </Typography>
          </Box>
        </Box>
      </Grow>
    );
  };

  // 🔹 Componente de leyenda de colores
  const ColorLegend = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: colors.grey[500], mr: 1, fontSize: "0.7rem" }}
      >
        Calidad:
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.greenAccent[400],
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: colors.grey[400], fontSize: "0.65rem" }}
          >
            0-5% Excelente
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.greenAccent[300],
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: colors.grey[400], fontSize: "0.65rem" }}
          >
            5-15% Bueno
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.yellowAccent[400],
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: colors.grey[400], fontSize: "0.65rem" }}
          >
            15-30% Regular
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.yellowAccent[500],
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: colors.grey[400], fontSize: "0.65rem" }}
          >
            30-50% Preocupante
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.redAccent[400],
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: colors.grey[400], fontSize: "0.65rem" }}
          >
            {`>50% Crítico`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ mt: 6 }}>
      {/* Título principal */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: colors.grey[200],
          fontWeight: 600,
          fontSize: "1.125rem",
        }}
      >
        Indicadores de Gestión
      </Typography>

      {/* 🧱 Resumen de Pagos (CON montos) */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            color: colors.grey[300],
            fontWeight: 500,
          }}
        >
          Resumen de Pagos
        </Typography>
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <Grow in={true} timeout={400}>
            <Box
              className="p-4 rounded-xl shadow-sm"
              sx={{
                backgroundColor: colors.bgContainer,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ color: colors.greenAccent[400], fontSize: 28 }}>
                <PaidOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {data.pagos_validos.count.toLocaleString("es-MX")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], mb: 0.5 }}
                >
                  Pagos válidos
                </Typography>
                {/* ✅ MANTENEMOS monto en Resumen de Pagos */}
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[500], fontWeight: 500 }}
                >
                  ${data.pagos_validos.monto.toLocaleString("es-MX")}
                </Typography>
              </Box>
            </Box>
          </Grow>

          <Grow in={true} timeout={500}>
            <Box
              className="p-4 rounded-xl shadow-sm"
              sx={{
                backgroundColor: colors.bgContainer,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ color: colors.redAccent[400], fontSize: 28 }}>
                <BlockOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {data.pagos_no_validos.count.toLocaleString("es-MX")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], mb: 0.5 }}
                >
                  Pagos no válidos
                </Typography>
                {/* ✅ MANTENEMOS monto en Resumen de Pagos */}
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[500], fontWeight: 500 }}
                >
                  ${data.pagos_no_validos.monto.toLocaleString("es-MX")}
                </Typography>
              </Box>
            </Box>
          </Grow>
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderColor: colors.borderContainer }} />

      {/* 📊 Calidad de Datos (SIN montos) */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: colors.grey[300],
              fontWeight: 500,
            }}
          >
            Calidad de Datos en Gestiones Válidas
          </Typography>

          {/* Leyenda de colores */}
          <ColorLegend />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: colors.grey[500],
            mb: 3,
            fontSize: "0.75rem",
            fontStyle: "italic",
          }}
        >
          Porcentaje menor indica mejor calidad de datos
        </Typography>

        {/* Grid compacto 2x2 */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CardCalidadDatos
            icon={PlaceOutlinedIcon}
            title="Sin posición GPS"
            count={data.sin_posicion.count}
            pct={data.sin_posicion.pct}
            total={data.sin_posicion.total}
            delay={0}
          />
          <CardCalidadDatos
            icon={PhotoCameraFrontOutlinedIcon}
            title="Sin foto de fachada"
            count={data.sin_foto_fachada.count}
            pct={data.sin_foto_fachada.pct}
            total={data.sin_foto_fachada.total}
            delay={100}
          />
          <CardCalidadDatos
            icon={PhotoOutlinedIcon}
            title="Sin foto de evidencia"
            count={data.sin_foto_evidencia.count}
            pct={data.sin_foto_evidencia.pct}
            total={data.sin_foto_evidencia.total}
            delay={200}
          />
          <CardCalidadDatos
            icon={LocationOffOutlinedIcon}
            title="Predios no localizados"
            count={data.predios_no_localizados.count}
            pct={data.predios_no_localizados.pct}
            total={data.predios_no_localizados.total}
            delay={300}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default IndicadoresGestion;
