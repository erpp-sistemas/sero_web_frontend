// src/components/PaymentValidation/DistribucionMontosPorEstatus.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { PersonRemoveOutlined } from "@mui/icons-material";

const DistribucionMontosPorEstatus = ({ pagosValidos = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [estatusActivo, setEstatusActivo] = useState(0);

  // 🔹 Colores específicos para secciones importantes
  const COLOR_VALIDO = colors.accentGreen[100]; // Verde suave para válidos
  const COLOR_ESTANDAR = colors.grey[100]; // Gris estándar para el resto
  const COLOR_TAB_ACTIVA = colors.blueAccent[600]; // ✅ Azul para tabs activas

  // 🔹 Definición de rangos de monto
  const rangosMonto = [
    { label: "Hasta 1,000", min: 0, max: 1000 },
    { label: "1,000 a 5,000", min: 1000, max: 5000 },
    { label: "5,000 a 10,000", min: 5000, max: 10000 },
    { label: "10,000 a 25,000", min: 10000, max: 25000 },
    { label: "25,000 a 50,000", min: 25000, max: 50000 },
    { label: "50,000 a 100,000", min: 50000, max: 100000 },
    { label: "100,000 a 500,000", min: 100000, max: 500000 },
    { label: "Más de 500,000", min: 500000, max: Infinity },
  ];

  // 🔹 Configuración de estatus con iconos y colores
  const getEstatusConfig = (nombre) => {
    const configs = {
      "Gestión válida": {
        icon: CheckCircleOutlineIcon,
        color: COLOR_VALIDO, // ✅ Usar COLOR_VALIDO estandarizado
        descripcion:
          "Pago con gestión realizada antes del pago y dentro del rango de días válidos",
      },
      "Sin gestión": {
        icon: HelpOutlineOutlinedIcon,
        color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
        descripcion:
          "No se ha realizado ninguna acción de gestión sobre este pago",
      },
      "Gestión posterior": {
        icon: AccessTimeOutlinedIcon,
        color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
        descripcion: "Tiene gestión realizada pero después de la fecha de pago",
      },
      "Gestión fuera de rango": {
        icon: CancelOutlinedIcon,
        color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
        descripcion:
          "Tiene gestión antes del pago pero supera el rango de días válidos",
      },
      "No existe en nuestra cartera": {
        icon: PersonRemoveOutlined,
        color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
        descripcion:
          "No se encuentra en nuestro padrón de contribuyentes o cuentas",
      },
    };

    return (
      configs[nombre] || {
        icon: HelpOutlineOutlinedIcon,
        color: COLOR_ESTANDAR,
        descripcion: "Estatus no definido",
      }
    );
  };

  // 🔹 Cálculo de distribución por estatus y rangos
  const distribucion = useMemo(() => {
    if (!Array.isArray(pagosValidos) || pagosValidos.length === 0) {
      return {};
    }

    const resultado = {};

    // Agrupar por estatus de gestión
    pagosValidos.forEach((pago) => {
      const estatus = pago["estatus de gestion valida"] || "Sin estatus";
      const monto = parseFloat(pago.total_pagado || 0);

      if (!resultado[estatus]) {
        resultado[estatus] = {
          total: 0,
          montoTotal: 0,
          rangos: rangosMonto.map((rango) => ({
            ...rango,
            count: 0,
            monto: 0,
            porcentaje: 0,
          })),
          // Para Gestión válida, agregar subcategorías
          subcategorias:
            estatus === "Gestión válida"
              ? {
                  PERIODO_VALIDO: {
                    total: 0,
                    montoTotal: 0,
                    rangos: rangosMonto.map((rango) => ({
                      ...rango,
                      count: 0,
                      monto: 0,
                    })),
                  },
                  PERIODO_NO_VALIDO: {
                    total: 0,
                    montoTotal: 0,
                    rangos: rangosMonto.map((rango) => ({
                      ...rango,
                      count: 0,
                      monto: 0,
                    })),
                  },
                }
              : null,
        };
      }

      // Encontrar el rango correspondiente
      const rangoIndex = rangosMonto.findIndex((rango) => {
        if (rango.max === Infinity) {
          return monto >= rango.min;
        }
        return monto >= rango.min && monto < rango.max;
      });

      if (rangoIndex !== -1) {
        resultado[estatus].total++;
        resultado[estatus].montoTotal += monto;
        resultado[estatus].rangos[rangoIndex].count++;
        resultado[estatus].rangos[rangoIndex].monto += monto;

        // Para Gestión válida, procesar subcategorías
        if (estatus === "Gestión válida" && resultado[estatus].subcategorias) {
          const evaluacion = pago.evaluacion_periodos;
          if (
            evaluacion === "PERIODO_VALIDO" ||
            evaluacion === "PERIODO_NO_VALIDO"
          ) {
            resultado[estatus].subcategorias[evaluacion].total++;
            resultado[estatus].subcategorias[evaluacion].montoTotal += monto;
            resultado[estatus].subcategorias[evaluacion].rangos[rangoIndex]
              .count++;
            resultado[estatus].subcategorias[evaluacion].rangos[
              rangoIndex
            ].monto += monto;
          }
        }
      }
    });

    // Calcular porcentajes
    Object.values(resultado).forEach((estatusData) => {
      estatusData.rangos.forEach((rango) => {
        rango.porcentaje =
          estatusData.total > 0 ? (rango.count / estatusData.total) * 100 : 0;
      });
    });

    return resultado;
  }, [pagosValidos]);

  // 🔹 Obtener estatus disponibles
  const estatusDisponibles = Object.keys(distribucion);
  const estatusActual = estatusDisponibles[estatusActivo] || "";
  const datosEstatusActual = distribucion[estatusActual];
  const esGestionValida = estatusActual === "Gestión válida";
  const configEstatusActual = getEstatusConfig(estatusActual);

  // 🔹 Función para formatear números
  const formatNumber = (number) => number.toLocaleString("es-MX");
  const formatCurrency = (amount) => `$${formatNumber(amount)}`;

  // 🔹 Preparar datos para DataGrid
  const rows = useMemo(() => {
    if (!datosEstatusActual) return [];

    return datosEstatusActual.rangos.map((rango, index) => {
      const baseRow = {
        id: index,
        rango: rango.label,
        registros: rango.count,
        montoTotal: rango.monto,
        porcentaje: rango.porcentaje,
      };

      // Agregar subcategorías para Gestión válida
      if (esGestionValida && datosEstatusActual.subcategorias) {
        return {
          ...baseRow,
          registrosValido:
            datosEstatusActual.subcategorias.PERIODO_VALIDO.rangos[index].count,
          montoValido:
            datosEstatusActual.subcategorias.PERIODO_VALIDO.rangos[index].monto,
          registrosNoValido:
            datosEstatusActual.subcategorias.PERIODO_NO_VALIDO.rangos[index]
              .count,
          montoNoValido:
            datosEstatusActual.subcategorias.PERIODO_NO_VALIDO.rangos[index]
              .monto,
        };
      }

      return baseRow;
    });
  }, [datosEstatusActual, esGestionValida]);

  // 🔹 Calcular altura dinámica basada en número de filas
  const alturaTabla = useMemo(() => {
    const alturaHeader = 56;
    const alturaFila = 52;
    const alturaFooter = 0;
    const margenExtra = 8;

    return alturaHeader + rows.length * alturaFila + alturaFooter + margenExtra;
  }, [rows.length]);

  // 🔹 Columnas base para DataGrid (sin progressbar para Gestión válida)
  const columnasBase = [
    {
      field: "rango",
      headerName: "Rango de Monto",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: COLOR_ESTANDAR }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "registros",
      headerName: "Registros",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: params.value > 0 ? COLOR_ESTANDAR : colors.grey[500],
            fontWeight: params.value > 0 ? 600 : 400,
            fontStyle: params.value === 0 ? "italic" : "normal",
          }}
        >
          {params.value > 0 ? formatNumber(params.value) : "0"}
        </Typography>
      ),
    },
    {
      field: "montoTotal",
      headerName: "Monto Total",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            // ✅ AJUSTE: Para Gestión válida usar COLOR_ESTANDAR, para otros usar color del estatus
            color: esGestionValida
              ? params.value > 0
                ? COLOR_ESTANDAR
                : colors.grey[500]
              : params.value > 0
              ? configEstatusActual.color
              : colors.grey[500],
            fontWeight: params.value > 0 ? 600 : 400,
            fontStyle: params.value === 0 ? "italic" : "normal",
          }}
        >
          {params.value > 0 ? formatCurrency(params.value) : "$0"}
        </Typography>
      ),
    },
    ...(esGestionValida
      ? []
      : [
          {
            field: "porcentaje",
            headerName: "Porcentaje",
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
              <Typography
                variant="body2"
                sx={{
                  color:
                    params.value > 0
                      ? configEstatusActual.color
                      : colors.grey[500],
                  fontWeight: params.value > 0 ? 600 : 400,
                  fontStyle: params.value === 0 ? "italic" : "normal",
                }}
              >
                {params.value.toFixed(1)}%
              </Typography>
            ),
          },
          {
            field: "distribucion",
            headerName: "Distribución",
            flex: 1.2,
            minWidth: 150,
            renderCell: (params) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={params.row.porcentaje}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.grey[700],
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: configEstatusActual.color,
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      params.row.porcentaje > 0
                        ? COLOR_ESTANDAR
                        : colors.grey[500],
                    minWidth: 35,
                    fontStyle:
                      params.row.porcentaje === 0 ? "italic" : "normal",
                  }}
                >
                  {params.row.porcentaje.toFixed(1)}%
                </Typography>
              </Box>
            ),
          },
        ]),
  ];

  // 🔹 Columnas adicionales para Gestión válida con diferenciadores visuales
  const columnasGestionValida = [
    {
      field: "registrosValido",
      headerName: "Registros",
      flex: 0.8,
      minWidth: 100,
      renderHeader: () => (
        <Tooltip title="Período Válido - Gestión realizada en período correcto">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircleOutlineIcon
              sx={{ fontSize: 16, color: COLOR_VALIDO }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
            >
              Período Válido
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 16, color: COLOR_VALIDO }} />
          <Typography
            variant="body2"
            sx={{
              // ✅ AJUSTE: Cantidades de período válido en COLOR_VALIDO
              color: params.value > 0 ? COLOR_VALIDO : colors.grey[500],
              fontWeight: params.value > 0 ? 600 : 400,
              fontStyle: params.value === 0 ? "italic" : "normal",
            }}
          >
            {params.value > 0 ? formatNumber(params.value) : "0"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "montoValido",
      headerName: "Monto",
      flex: 1,
      minWidth: 120,
      renderHeader: () => (
        <Tooltip title="Monto en Período Válido">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircleOutlineIcon
              sx={{ fontSize: 16, color: COLOR_VALIDO }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
            >
              Monto Válido
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 16, color: COLOR_VALIDO }} />
          <Typography
            variant="body2"
            sx={{
              color: params.value > 0 ? COLOR_VALIDO : colors.grey[500],
              fontWeight: params.value > 0 ? 600 : 400,
              fontStyle: params.value === 0 ? "italic" : "normal",
            }}
          >
            {params.value > 0 ? formatCurrency(params.value) : "$0"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "registrosNoValido",
      headerName: "Registros",
      flex: 0.8,
      minWidth: 100,
      renderHeader: () => (
        <Tooltip title="Período No Válido - Gestión fuera del período correcto">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CancelOutlinedIcon
              sx={{ fontSize: 16, color: colors.redAccent[400] }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
            >
              Período No Válido
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CancelOutlinedIcon
            sx={{ fontSize: 16, color: colors.redAccent[400] }}
          />
          <Typography
            variant="body2"
            sx={{
              // ✅ AJUSTE: Cantidades de período no válido en redAccent
              color:
                params.value > 0 ? colors.redAccent[400] : colors.grey[500],
              fontWeight: params.value > 0 ? 600 : 400,
              fontStyle: params.value === 0 ? "italic" : "normal",
            }}
          >
            {params.value > 0 ? formatNumber(params.value) : "0"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "montoNoValido",
      headerName: "Monto",
      flex: 1,
      minWidth: 120,
      renderHeader: () => (
        <Tooltip title="Monto en Período No Válido">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CancelOutlinedIcon
              sx={{ fontSize: 16, color: colors.redAccent[400] }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
            >
              Monto No Válido
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CancelOutlinedIcon
            sx={{ fontSize: 16, color: colors.redAccent[400] }}
          />
          <Typography
            variant="body2"
            sx={{
              color:
                params.value > 0 ? colors.redAccent[400] : colors.grey[500],
              fontWeight: params.value > 0 ? 600 : 400,
              fontStyle: params.value === 0 ? "italic" : "normal",
            }}
          >
            {params.value > 0 ? formatCurrency(params.value) : "$0"}
          </Typography>
        </Box>
      ),
    },
  ];

  // 🔹 Combinar columnas según el estatus
  const columnas = esGestionValida
    ? [...columnasBase, ...columnasGestionValida]
    : columnasBase;

  return (
    <Box sx={{ mt: 6 }}>
      {/* Título principal */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
            fontWeight: 600,
            fontSize: "1.125rem",
          }}
        >
          Distribución de Montos por Estatus
        </Typography>
      </Box>

      {estatusDisponibles.length === 0 ? (
        /* Estado vacío */
        <Box
          className="p-6 rounded-xl text-center"
          sx={{
            backgroundColor: colors.bgContainer,
            border: `1px solid ${colors.borderContainer}`,
          }}
        >
          <AttachMoneyOutlinedIcon
            sx={{ fontSize: 48, color: colors.grey[500], mb: 2 }}
          />
          <Typography variant="body1" sx={{ color: COLOR_ESTANDAR }}>
            {" "}
            {/* ✅ Usar COLOR_ESTANDAR */}
            No hay datos disponibles para mostrar
          </Typography>
        </Box>
      ) : (
        <>
          {/* Tabs de estatus con iconos y color azul para activas */}
          <Box
            sx={{ borderBottom: 1, borderColor: colors.borderContainer, mb: 3 }}
          >
            <Tabs
              value={estatusActivo}
              onChange={(e, nuevoValor) => setEstatusActivo(nuevoValor)}
              sx={{
                "& .MuiTab-root": {
                  color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  minHeight: 48,
                  "&:hover": {
                    color: COLOR_TAB_ACTIVA, // ✅ Usar COLOR_TAB_ACTIVA (azul)
                  },
                },
                "& .Mui-selected": {
                  color: COLOR_TAB_ACTIVA, // ✅ Usar COLOR_TAB_ACTIVA (azul)
                  fontWeight: 600,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: COLOR_TAB_ACTIVA, // ✅ Usar COLOR_TAB_ACTIVA (azul)
                },
              }}
            >
              {estatusDisponibles.map((estatus, index) => {
                const config = getEstatusConfig(estatus);
                const IconComponent = config.icon;

                return (
                  <Tab
                    key={estatus}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 20,
                            // ✅ AJUSTE: Iconos de tabs activas en azul
                            color:
                              estatusActivo === index
                                ? COLOR_TAB_ACTIVA
                                : config.color,
                          }}
                        />
                        <span>{estatus}</span>
                        <Chip
                          label={distribucion[estatus].total}
                          size="small"
                          sx={{
                            backgroundColor: colors.bgContainerSticky,
                            color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
                            fontSize: "0.7rem",
                            height: 20,
                            minWidth: 20,
                          }}
                        />
                      </Box>
                    }
                  />
                );
              })}
            </Tabs>
          </Box>

          {/* Resumen del estatus actual */}
          {datosEstatusActual && (
            <Box sx={{ mb: 3 }}>
              <Box
                className="p-4 rounded-xl"
                sx={{
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${colors.borderContainer}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.grey[400], mb: 0.5 }}
                  >
                    Total para {estatusActual}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      // ✅ Para Gestión válida usar COLOR_VALIDO, para otros COLOR_ESTANDAR
                      color: esGestionValida ? COLOR_VALIDO : COLOR_ESTANDAR,
                    }}
                  >
                    {formatNumber(datosEstatusActual.total)} registros
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.grey[400], mb: 0.5 }}
                  >
                    Monto total
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      // ✅ Para Gestión válida usar COLOR_VALIDO, para otros usar color del estatus
                      color: esGestionValida
                        ? COLOR_VALIDO
                        : configEstatusActual.color,
                    }}
                  >
                    {formatCurrency(datosEstatusActual.montoTotal)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* DataGrid con altura dinámica y sin paginación */}
          {datosEstatusActual && (
            <Box
              sx={{
                height: alturaTabla,
                width: "100%",
                "& .MuiDataGrid-root": {
                  border: "none",
                  color: COLOR_ESTANDAR, // ✅ Usar COLOR_ESTANDAR
                  backgroundColor: colors.bgContainer,
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${colors.borderContainer}`,
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.bgContainer,
                  borderBottom: `1px solid ${colors.borderContainer}`,
                  fontWeight: 600,
                },
                "& .MuiDataGrid-footerContainer": {
                  display: "none",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox":
                  {
                    display: "none",
                  },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columnas}
                disableSelectionOnClick
                disableColumnMenu
                hideFooter
                disableColumnSelector
                disableDensitySelector
                disableMultipleRowSelection
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DistribucionMontosPorEstatus;
