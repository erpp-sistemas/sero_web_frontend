// src/components/PaymentValidation/ResumenEstatusGestion.jsx
import React, { useMemo } from "react";
import { Box, Typography, useTheme, Grow } from "@mui/material";
import { tokens } from "../../theme";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { PersonRemoveOutlined } from "@mui/icons-material";

const ResumenEstatusGestion = ({ pagosValidos = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Colores específicos para secciones importantes
  const COLOR_VALIDO = colors.accentGreen[100]; // Verde suave para válidos
  const COLOR_ESTANDAR = colors.grey[100]; // Gris estándar para el resto

  // 🔹 Función para obtener color de porcentaje según el estatus
  const getColorPorcentaje = (estatusNombre, evaluacion = null) => {
    // Caso especial: Gestión válida con período no válido
    if (
      estatusNombre === "Gestión válida" &&
      evaluacion === "PERIODO_NO_VALIDO"
    ) {
      return colors.redAccent[400];
    }

    // Para Gestión válida (incluyendo período válido), usar COLOR_VALIDO
    if (estatusNombre === "Gestión válida") {
      return COLOR_VALIDO;
    }

    // Para otros estatus, usar los colores definidos en getEstatusConfig
    const config = getEstatusConfig(estatusNombre);
    return config.color;
  };

  // 🔹 Cálculo de resumen por estatus
  const resumenEstatus = useMemo(() => {
    if (!Array.isArray(pagosValidos) || pagosValidos.length === 0) {
      return {
        totalGeneral: 0,
        montoGeneral: 0,
        estatus: [],
      };
    }

    // Agrupar por estatus de gestión
    const estatusMap = {};

    pagosValidos.forEach((pago) => {
      const estatus = pago["estatus de gestion valida"] || "Sin estatus";

      if (!estatusMap[estatus]) {
        estatusMap[estatus] = {
          count: 0,
          monto: 0,
          periodos: {},
        };
      }

      estatusMap[estatus].count++;
      estatusMap[estatus].monto += parseFloat(pago.total_pagado || 0);

      // Para gestión válida, subdividir por evaluación de periodos
      if (estatus === "Gestión válida") {
        const evaluacion = pago.evaluacion_periodos || "Sin evaluación";
        if (!estatusMap[estatus].periodos[evaluacion]) {
          estatusMap[estatus].periodos[evaluacion] = {
            count: 0,
            monto: 0,
          };
        }
        estatusMap[estatus].periodos[evaluacion].count++;
        estatusMap[estatus].periodos[evaluacion].monto += parseFloat(
          pago.total_pagado || 0
        );
      }
    });

    // Convertir a array y ordenar por count descendente
    const estatusArray = Object.entries(estatusMap)
      .map(([nombre, datos]) => ({
        nombre,
        ...datos,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalGeneral: pagosValidos.length,
      montoGeneral: pagosValidos.reduce(
        (sum, p) => sum + parseFloat(p.total_pagado || 0),
        0
      ),
      estatus: estatusArray,
    };
  }, [pagosValidos]);

  // 🔹 Obtener icono, color y descripción según estatus
  const getEstatusConfig = (nombre) => {
    const configs = {
      "Gestión válida": {
        icon: CheckCircleOutlineIcon,
        color: colors.accentGreen[100],
        descripcion:
          "Pago con gestión realizada antes del pago y dentro del rango de días válidos",
      },
      "Sin gestión": {
        icon: HelpOutlineOutlinedIcon,
        color: colors.grey[500],
        descripcion:
          "No se ha realizado ninguna acción de gestión sobre este pago",
      },
      "Gestión posterior": {
        icon: AccessTimeOutlinedIcon,
        color: colors.blueAccent[400],
        descripcion: "Tiene gestión realizada pero después de la fecha de pago",
      },
      "Gestión fuera de rango": {
        icon: CancelOutlinedIcon,
        color: colors.yellowAccent[500],
        descripcion:
          "Tiene gestión antes del pago pero supera el rango de días válidos",
      },
      "No existe en nuestra cartera": {
        icon: PersonRemoveOutlined,
        color: colors.redAccent[400],
        descripcion:
          "No se encuentra en nuestro padrón de contribuyentes o cuentas",
      },
    };

    return (
      configs[nombre] || {
        icon: HelpOutlineOutlinedIcon,
        color: colors.grey[500],
        descripcion: "Estatus no definido",
      }
    );
  };

  // 🔹 Obtener config para evaluación de periodos
  const getEvaluacionConfig = (evaluacion) => {
    if (evaluacion === "PERIODO_VALIDO") {
      return {
        label: "Período válido",
        color: COLOR_VALIDO,
        icon: ExpandLessOutlinedIcon,
      };
    } else if (evaluacion === "PERIODO_NO_VALIDO") {
      return {
        label: "Período no válido",
        color: colors.redAccent[400], // Rojo para período no válido
        icon: ExpandMoreOutlinedIcon,
      };
    } else {
      return {
        label: evaluacion,
        color: COLOR_ESTANDAR,
        icon: HelpOutlineOutlinedIcon,
      };
    }
  };

  // 🔹 Función para formatear números con comas en los miles
  const formatNumber = (number) => {
    return number.toLocaleString("es-MX");
  };

  // 🔹 Función para formatear montos en pesos
  const formatCurrency = (amount) => {
    return `$${formatNumber(amount)}`;
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
        Resumen por Estatus de Gestión
      </Typography>

      {/* Cards de estatus */}
      <Box className="grid grid-cols-1 gap-3">
        {resumenEstatus.estatus.map((estatus, index) => {
          const config = getEstatusConfig(estatus.nombre);
          const IconComponent = config.icon;

          // Determinar si es una sección de gestión válida
          const esGestionValida = estatus.nombre === "Gestión válida";
          const porcentaje =
            (estatus.count / resumenEstatus.totalGeneral) * 100;
          const colorPorcentaje = getColorPorcentaje(estatus.nombre);

          // Para secciones no válidas, usar COLOR_ESTANDAR para todo excepto porcentajes
          const colorIcono = esGestionValida ? config.color : COLOR_ESTANDAR;
          const colorTitulo = esGestionValida ? config.color : COLOR_ESTANDAR;
          const colorCantidad = esGestionValida ? config.color : COLOR_ESTANDAR;
          const colorMonto = esGestionValida ? COLOR_VALIDO : COLOR_ESTANDAR;

          return (
            <Grow
              key={estatus.nombre}
              in={true}
              style={{ transformOrigin: "0 0 0" }}
              timeout={400 + index * 100}
            >
              <Box
                className="p-4 rounded-xl shadow-sm"
                sx={{
                  backgroundColor: colors.bgContainer,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  },
                }}
              >
                {/* Header compacto */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 3,
                    mb: 2,
                  }}
                >
                  {/* Icono - COLOR_VALIDO para válidos, COLOR_ESTANDAR para otros */}
                  <Box sx={{ color: colorIcono, flexShrink: 0, mt: 0.5 }}>
                    <IconComponent sx={{ fontSize: 28 }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: colorTitulo, // COLOR_VALIDO para válidos, COLOR_ESTANDAR para otros
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {estatus.nombre}
                    </Typography>

                    {/* Descripción sutil */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.grey[400],
                        lineHeight: 1.4,
                        mb: 2,
                        fontSize: "0.875rem",
                      }}
                    >
                      {config.descripcion}
                    </Typography>

                    {/* Información de registros y monto - Formato unificado */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: colors.grey[100],
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: colorCantidad, // COLOR_VALIDO para válidos, COLOR_ESTANDAR para otros
                        }}
                      >
                        {formatNumber(estatus.count)}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          color: colors.grey[400],
                          mx: 1,
                          fontSize: "1rem",
                        }}
                      >
                        registros •
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          color: colorMonto, // COLOR_VALIDO para válidos, COLOR_ESTANDAR para otros
                        }}
                      >
                        {formatCurrency(estatus.monto)}
                      </Box>
                    </Typography>
                  </Box>

                  {/* Porcentaje - Mantiene colores del semáforo para todos */}
                  <Box sx={{ textAlign: "right", minWidth: "70px" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: colorPorcentaje, // Colores del semáforo para todos
                        lineHeight: 1,
                      }}
                    >
                      {porcentaje.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>

                {/* Subdivisión para Gestión válida */}
                {estatus.nombre === "Gestión válida" &&
                  Object.keys(estatus.periodos).length > 0 && (
                    <Box
                      sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: `1px solid ${colors.primary[500]}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.grey[400],
                          mb: 2,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        Desglose por evaluación de períodos:
                      </Typography>

                      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(estatus.periodos).map(
                          ([evaluacion, datos], subIndex) => {
                            const evalConfig = getEvaluacionConfig(evaluacion);
                            const EvalIcon = evalConfig.icon;
                            const esPeriodoValido =
                              evaluacion === "PERIODO_VALIDO";
                            const esPeriodoNoValido =
                              evaluacion === "PERIODO_NO_VALIDO";
                            const porcentajeInterno =
                              (datos.count / estatus.count) * 100;
                            const colorPorcentajeInterno = getColorPorcentaje(
                              estatus.nombre,
                              evaluacion
                            );

                            // Para período no válido, todo en rojo (incluyendo título, cantidad y monto)
                            const colorIconoInterno = esPeriodoNoValido
                              ? colors.redAccent[400]
                              : esPeriodoValido
                              ? COLOR_VALIDO
                              : COLOR_ESTANDAR;
                            const colorTituloInterno = esPeriodoNoValido
                              ? colors.redAccent[400]
                              : esPeriodoValido
                              ? COLOR_VALIDO
                              : COLOR_ESTANDAR;
                            const colorCantidadInterno = esPeriodoNoValido
                              ? colors.redAccent[400]
                              : esPeriodoValido
                              ? COLOR_VALIDO
                              : COLOR_ESTANDAR;
                            const colorMontoInterno = esPeriodoNoValido
                              ? colors.redAccent[400]
                              : esPeriodoValido
                              ? COLOR_VALIDO
                              : COLOR_ESTANDAR;

                            return (
                              <Box
                                key={evaluacion}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: colors.primary[400],
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  },
                                }}
                              >
                                <Box sx={{ color: colorIconoInterno }}>
                                  <EvalIcon sx={{ fontSize: 20 }} />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: colorTituloInterno,
                                      mb: 0.5,
                                    }}
                                  >
                                    {evalConfig.label}
                                  </Typography>

                                  {/* Cantidades internas con formato unificado */}
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 600,
                                      color: colors.grey[100],
                                    }}
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        color: colorCantidadInterno,
                                      }}
                                    >
                                      {formatNumber(datos.count)}
                                    </Box>
                                    <Box
                                      component="span"
                                      sx={{
                                        color: colors.grey[400],
                                        mx: 0.5,
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      registros •
                                    </Box>
                                    <Box
                                      component="span"
                                      sx={{
                                        color: colorMontoInterno,
                                      }}
                                    >
                                      {formatCurrency(datos.monto)}
                                    </Box>
                                  </Typography>
                                </Box>

                                {/* Porcentaje interno mantiene colores del semáforo */}
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: colorPorcentajeInterno,
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                  }}
                                >
                                  {porcentajeInterno.toFixed(1)}%
                                </Typography>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    </Box>
                  )}
              </Box>
            </Grow>
          );
        })}
      </Box>

      {/* Mensaje cuando no hay datos */}
      {resumenEstatus.estatus.length === 0 && (
        <Box
          className="p-6 rounded-xl text-center shadow-sm"
          sx={{
            backgroundColor: colors.bgContainer,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <HelpOutlineOutlinedIcon
            sx={{ fontSize: 48, color: colors.grey[500] }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
          >
            No hay datos disponibles para mostrar
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResumenEstatusGestion;
