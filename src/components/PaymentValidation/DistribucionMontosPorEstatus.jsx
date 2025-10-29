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

const DistribucionMontosPorEstatus = ({ pagosValidos = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [estatusActivo, setEstatusActivo] = useState(0);

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

  // 🔹 Columnas base para DataGrid (sin progressbar para Gestión válida)
  const columnasBase = [
    {
      field: "rango",
      headerName: "Rango de Monto",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
            color: params.value > 0 ? colors.blueAccent[300] : colors.grey[500],
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
            color:
              params.value > 0 ? colors.greenAccent[400] : colors.grey[500],
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
                  color: params.value > 0 ? colors.grey[100] : colors.grey[500],
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
                      backgroundColor:
                        params.row.porcentaje > 0
                          ? colors.blueAccent[400]
                          : colors.grey[600],
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      params.row.porcentaje > 0
                        ? colors.grey[400]
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
              sx={{ fontSize: 16, color: colors.greenAccent[400] }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Período Válido
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 16, color: colors.greenAccent[400] }}
          />
          <Typography
            variant="body2"
            sx={{
              color:
                params.value > 0 ? colors.blueAccent[300] : colors.grey[500],
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
              sx={{ fontSize: 16, color: colors.greenAccent[400] }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Monto Válido
            </Typography>
          </Box>
        </Tooltip>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 16, color: colors.greenAccent[400] }}
          />
          <Typography
            variant="body2"
            sx={{
              color:
                params.value > 0 ? colors.greenAccent[400] : colors.grey[500],
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
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
              color:
                params.value > 0 ? colors.blueAccent[300] : colors.grey[500],
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
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                params.value > 0 ? colors.greenAccent[400] : colors.grey[500],
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
        <ShowChartOutlinedIcon
          sx={{ color: colors.blueAccent[400], fontSize: 28 }}
        />
        <Typography
          variant="h6"
          sx={{
            color: colors.grey[200],
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
          <Typography variant="body1" sx={{ color: colors.grey[400] }}>
            No hay datos disponibles para mostrar
          </Typography>
        </Box>
      ) : (
        <>
          {/* Tabs de estatus */}
          <Box
            sx={{ borderBottom: 1, borderColor: colors.borderContainer, mb: 3 }}
          >
            <Tabs
              value={estatusActivo}
              onChange={(e, nuevoValor) => setEstatusActivo(nuevoValor)}
              sx={{
                "& .MuiTab-root": {
                  color: colors.grey[100],
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  minHeight: 48,
                },
                "& .Mui-selected": {
                  color: colors.greenAccent[400],
                  fontWeight: 600,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: colors.greenAccent[400],
                },
              }}
            >
              {estatusDisponibles.map((estatus, index) => (
                <Tab
                  key={estatus}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{estatus}</span>
                      <Chip
                        label={distribucion[estatus].total}
                        size="small"
                        sx={{
                          backgroundColor: colors.primary[500],
                          color: colors.grey[300],
                          fontSize: "0.7rem",
                          height: 20,
                          minWidth: 20,
                        }}
                      />
                    </Box>
                  }
                />
              ))}
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
                    sx={{ fontWeight: 600, color: colors.grey[100] }}
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
                    sx={{ fontWeight: 600, color: colors.greenAccent[400] }}
                  >
                    {formatCurrency(datosEstatusActual.montoTotal)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* DataGrid con el mismo estilo que GestoresTable */}
          {datosEstatusActual && (
            <Box
              sx={{
                height: 500,
                width: "100%",
                "& .MuiDataGrid-root": {
                  border: "none",
                  color: colors.grey[300],
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
                  borderTop: `1px solid ${colors.borderContainer}`,
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: colors.primary[400],
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columnas}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                disableColumnMenu
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DistribucionMontosPorEstatus;
