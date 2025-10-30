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

  // 🔹 Colores específicos para secciones importantes
  const COLOR_VALIDO = colors.accentGreen[100];  // Verde suave para válidos
  const COLOR_ESTANDAR = colors.grey[100];       // Gris estándar para el resto

  // 🔹 Semaforo vial con AZUL para no confundir con el verde de válidos
  const getSemaforoColor = (pct) => {
    if (pct <= 5) return colors.blueAccent[600];   // Azul - Excelente (0-5%)
    if (pct <= 15) return colors.blueAccent[600];  // Azul claro - Bueno (5-15%)
    if (pct <= 30) return colors.yellowAccent[400]; // Amarillo - Regular (15-30%)
    if (pct <= 50) return colors.yellowAccent[500]; // Amarillo oscuro - Preocupante (30-50%)
    return colors.redAccent[400];                  // Rojo - Crítico (>50%)
  };

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

    const sum = (arr) =>
      arr.reduce((acc, cur) => acc + (parseFloat(cur.total_pagado) || 0), 0);

    const totalValidos = pagosValidosFiltrados.length || 1;

    return {
      total_gestiones_validas: pagosValidosFiltrados.length,
      pagos_validos: {
        count: pagosValidosFiltrados.length,
        monto: sum(pagosValidosFiltrados),
      },
      pagos_no_validos: {
        count: pagosNoValidosFiltrados.length,
        monto: sum(pagosNoValidosFiltrados),
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

  // 🔹 Card compacta para Calidad de Datos con semáforo AZUL
  const CardCalidadDatos = ({
    icon: Icon,
    title,
    count,
    pct,
    total,
    delay = 0,
  }) => {
    const semaforoColor = getSemaforoColor(pct);

    return (
      <Grow in={true} timeout={400 + delay}>
        <Box
          className="p-4 rounded-xl"
          sx={{
            backgroundColor: colors.bgContainer,
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
            {/* Icono en color estándar */}
            <Box sx={{ color: COLOR_ESTANDAR, flexShrink: 0 }}>
              <Icon sx={{ fontSize: 24 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: COLOR_ESTANDAR,
                  lineHeight: 1.3,
                  fontSize: "0.9rem",
                }}
              >
                {title}
              </Typography>
            </Box>

            {/* Porcentaje con color del semáforo AZUL/AMARILLO/ROJO */}
            <Box sx={{ textAlign: "right", minWidth: "60px" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: semaforoColor,
                  lineHeight: 1,
                }}
              >
                {pct.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar con color del semáforo AZUL/AMARILLO/ROJO */}
          <Box sx={{ mb: 2, mt: "auto" }}>
            <LinearProgress
              variant="determinate"
              value={pct > 100 ? 100 : pct}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.grey[700],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: semaforoColor,
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Conteo de registros en color estándar */}
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
                sx={{
                  fontWeight: 600,
                  color: COLOR_ESTANDAR,
                }}
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

  return (
    <Box sx={{ mt: 6 }}>
      {/* Título principal */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: COLOR_ESTANDAR,
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
          {/* PAGOS VÁLIDOS - Color específico verde */}
          <Grow in={true} timeout={400}>
            <Box
              className="p-4 rounded-xl"
              sx={{
                backgroundColor: colors.bgContainer,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ color: COLOR_VALIDO, fontSize: 28 }}>
                <PaidOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: COLOR_VALIDO }}
                >
                  {data.pagos_validos.count.toLocaleString("es-MX")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], mb: 0.5 }}
                >
                  Pagos válidos
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLOR_VALIDO, fontWeight: 500 }}
                >
                  ${data.pagos_validos.monto.toLocaleString("es-MX")}
                </Typography>
              </Box>
            </Box>
          </Grow>

          {/* PAGOS NO VÁLIDOS - Colores estándar */}
          <Grow in={true} timeout={500}>
            <Box
              className="p-4 rounded-xl"
              sx={{
                backgroundColor: colors.bgContainer,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ color: COLOR_ESTANDAR, fontSize: 28 }}>
                <BlockOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}>
                  {data.pagos_no_validos.count.toLocaleString("es-MX")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], mb: 0.5 }}
                >
                  Pagos no válidos
                </Typography>
                <Typography variant="body2" sx={{ color: COLOR_ESTANDAR, fontWeight: 500 }}>
                  ${data.pagos_no_validos.monto.toLocaleString("es-MX")}
                </Typography>
              </Box>
            </Box>
          </Grow>
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderColor: colors.borderContainer }} />

      {/* 📊 Calidad de Datos (SIN montos) - CON SEMÁFORO AZUL */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: colors.grey[300],
            fontWeight: 500,
            mb: 3,
          }}
        >
          Calidad de Datos en Gestiones Válidas
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