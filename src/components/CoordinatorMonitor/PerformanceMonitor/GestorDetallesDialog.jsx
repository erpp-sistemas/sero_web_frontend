// src/components/CoordinatorMonitor/GestorDetallesDialog.jsx
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Close,
  Download,
  Person,
  AssignmentOutlined,
  CheckCircle,
  Warning,
  Error,
  FilterList,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

import CardResumen from "./CardResumen"; // Asegúrate de crear este componente

// 🔹 Componente CardResumen separado (si no existe)
// Si ya existe en otro archivo, puedes moverlo o reusarlo
const CardResumenDialog = ({
  titulo,
  valor,
  color,
  icono,
  colors,
  COLOR_TEXTO,
  COLOR_FONDO,
  COLOR_BORDE,
}) => (
  <Box
    className="p-4 rounded-xl shadow-sm"
    sx={{
      backgroundColor: COLOR_FONDO,
      display: "flex",
      alignItems: "center",
      gap: 2,
      border: `1px solid ${COLOR_BORDE}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Box sx={{ color: icono.props?.sx?.color || color, fontSize: 28 }}>
      {icono}
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
        {valor}
      </Typography>
      <Typography variant="body2" sx={{ color: colors.grey[400] }}>
        {titulo}
      </Typography>
    </Box>
  </Box>
);

const GestorDetallesDialog = ({
  open,
  onClose,
  usuario,
  colors: colorsProp,
  COLOR_TEXTO: COLOR_TEXTO_PROPS,
  COLOR_FONDO: COLOR_FONDO_PROPS,
  COLOR_BORDE: COLOR_BORDE_PROPS,
  COLOR_EFICIENTE: COLOR_EFICIENTE_PROPS,
  COLOR_REGULAR: COLOR_REGULAR_PROPS,
  COLOR_ATENCION: COLOR_ATENCION_PROPS,
}) => {
  const theme = useTheme();
  const colors = colorsProp || tokens(theme.palette.mode);
  
  // Usar props o valores por defecto
  const COLOR_TEXTO = COLOR_TEXTO_PROPS || colors.grey[100];
  const COLOR_FONDO = COLOR_FONDO_PROPS || colors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || colors.primary[500];
  const COLOR_EFICIENTE = COLOR_EFICIENTE_PROPS || colors.accentGreen[100];
  const COLOR_REGULAR = COLOR_REGULAR_PROPS || colors.yellowAccent[400];
  const COLOR_ATENCION = COLOR_ATENCION_PROPS || colors.redAccent[400];

  // 🔹 Estado local para el diálogo
  const [filtroMotivo, setFiltroMotivo] = useState(null);
  const [paginaGestiones, setPaginaGestiones] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 🔹 Funciones auxiliares
  const formatMotivoGestion = (motivo) => {
    if (!motivo || motivo === "COMPLETA" || motivo === null) return "Completa";

    const formatos = {
      SIN_GPS_Y_SIN_FOTOS: "Sin GPS y sin fotos",
      SIN_GPS_Y_FALTA_FOTO_FACHADA: "Sin GPS y falta foto fachada",
      SIN_GPS_Y_FALTA_FOTO_EVIDENCIA: "Sin GPS y falta foto evidencia",
      SIN_GPS: "Sin GPS",
      FALTAN_AMBAS_FOTOS: "Faltan ambas fotos",
      FALTA_FOTO_FACHADA: "Falta foto fachada",
      FALTA_FOTO_EVIDENCIA: "Falta foto evidencia",
    };

    return formatos[motivo] || motivo.replace(/_/g, " ").toLowerCase();
  };

  const getIconoMotivo = (motivo) => {
    if (!motivo || motivo === "COMPLETA")
      return <CheckCircle sx={{ color: COLOR_EFICIENTE }} />;

    if (motivo.includes("GPS")) return <Error sx={{ color: COLOR_ATENCION }} />;
    if (motivo.includes("FOTO"))
      return <Warning sx={{ color: COLOR_REGULAR }} />;

    return <Warning sx={{ color: COLOR_REGULAR }} />;
  };

  const getColorMotivo = (motivo) => {
    if (!motivo || motivo === "COMPLETA") return COLOR_EFICIENTE;
    if (motivo.includes("GPS")) return COLOR_ATENCION;
    if (motivo.includes("FOTO")) return COLOR_REGULAR;
    return COLOR_REGULAR;
  };

  // 🔹 Calcular motivos y gestiones filtradas
  const motivosArray = useMemo(() => {
    if (!usuario?.motivos) return [];
    return Object.entries(usuario.motivos).sort((a, b) => b[1] - a[1]);
  }, [usuario]);

  const gestionesFiltradas = useMemo(() => {
    if (!usuario?.registros) return [];
    return filtroMotivo
      ? usuario.registros.filter((r) => r.motivo_gestion === filtroMotivo)
      : usuario.registros;
  }, [usuario, filtroMotivo]);

  // 🔹 Configuración de columnas DataGrid para detalles
  const columnsDetalle = [
    {
      field: "cuenta",
      headerName: "Cuenta",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: COLOR_TEXTO }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: colors.grey[300] }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "estatus_gestion",
      headerName: "Estado",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor:
              params.value === "COMPLETA"
                ? COLOR_EFICIENTE + "20"
                : params.value === "INCOMPLETA"
                  ? COLOR_REGULAR + "20"
                  : COLOR_ATENCION + "20",
            color:
              params.value === "COMPLETA"
                ? COLOR_EFICIENTE
                : params.value === "INCOMPLETA"
                  ? COLOR_REGULAR
                  : COLOR_ATENCION,
            fontSize: "0.7rem",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "motivo_gestion",
      headerName: "Motivo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: getColorMotivo(params.value),
            fontStyle: params.value === "COMPLETA" ? "normal" : "italic",
          }}
        >
          {formatMotivoGestion(params.value)}
        </Typography>
      ),
    },
    {
      field: "gps",
      headerName: "GPS",
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => (
        <Box sx={{ textAlign: "center", width: "100%" }}>
          {params.row.tieneGPS ? (
            <CheckCircle sx={{ color: COLOR_EFICIENTE, fontSize: 18 }} />
          ) : (
            <Error sx={{ color: COLOR_ATENCION, fontSize: 18 }} />
          )}
        </Box>
      ),
    },
    {
      field: "fotos",
      headerName: "Fotos",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Chip
            label={params.row.fotosFachada}
            size="small"
            sx={{
              backgroundColor:
                params.row.fotosFachada > 0
                  ? COLOR_EFICIENTE + "20"
                  : COLOR_REGULAR + "20",
              color:
                params.row.fotosFachada > 0 ? COLOR_EFICIENTE : COLOR_REGULAR,
              fontSize: "0.7rem",
              minWidth: 32,
              height: 22,
            }}
          />
          <Chip
            label={params.row.fotosEvidencia}
            size="small"
            sx={{
              backgroundColor:
                params.row.fotosEvidencia > 0
                  ? COLOR_EFICIENTE + "20"
                  : COLOR_REGULAR + "20",
              color:
                params.row.fotosEvidencia > 0
                  ? COLOR_EFICIENTE
                  : COLOR_REGULAR,
              fontSize: "0.7rem",
              minWidth: 32,
              height: 22,
            }}
          />
        </Box>
      ),
    },
  ];

  // 🔹 Altura dinámica para DataGrid
  const alturaTablaDetalles = useMemo(() => {
    const alturaHeader = 56;
    const alturaFila = 52;
    const alturaFooter = 53;
    const margenExtra = 8;
    const filasAMostrar = Math.min(gestionesFiltradas.length, pageSize);

    return (
      alturaHeader + filasAMostrar * alturaFila + alturaFooter + margenExtra
    );
  }, [gestionesFiltradas.length, pageSize]);

  // 🔹 Función para descargar reporte
  const descargarReporte = () => {
    if (!usuario) return;

    const reporte = {
      usuario: usuario.nombre,
      id: usuario.id,
      estadisticas: {
        total: usuario.total,
        completas: usuario.completas,
        incompletas: usuario.incompletas,
        invalidas: usuario.invalidas,
        porcentajeExito: usuario.porcentajeExito?.toFixed(1) + "%",
      },
      motivos: usuario.motivos,
      registros: usuario.registros,
    };

    const dataStr = JSON.stringify(reporte, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `reporte_${usuario.nombre.replace(/\s+/g, "_")}_${usuario.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (!usuario) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: COLOR_FONDO,
          color: COLOR_TEXTO,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Person sx={{ color: COLOR_TEXTO, fontSize: 28 }} />
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: COLOR_TEXTO }}
            >
              {usuario.nombre}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              ID: {usuario.id} • {usuario.diasTrabajados || 0} días trabajados
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: colors.grey[400] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: COLOR_FONDO, p: 3 }}>
        {/* 🔹 4 CARDS DE RESUMEN */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-4">
          <CardResumenDialog
            titulo="Total gestiones"
            valor={usuario.total || 0}
            color={COLOR_TEXTO}
            icono={<AssignmentOutlined sx={{ color: colors.grey[400] }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
          <CardResumenDialog
            titulo="Completas"
            valor={usuario.completas || 0}
            color={COLOR_EFICIENTE}
            icono={<CheckCircle sx={{ color: COLOR_EFICIENTE }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
          <CardResumenDialog
            titulo="Con problemas"
            valor={usuario.incompletas || 0}
            color={COLOR_REGULAR}
            icono={<Warning sx={{ color: COLOR_REGULAR }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
          <CardResumenDialog
            titulo="Inválidas"
            valor={usuario.invalidas || 0}
            color={COLOR_ATENCION}
            icono={<Error sx={{ color: COLOR_ATENCION }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
        </Box>

        {/* Distribución por tipo de gestión */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: COLOR_TEXTO }}
            >
              📊 Distribución por tipo de gestión
            </Typography>
            {filtroMotivo && (
              <Button
                size="small"
                startIcon={<FilterList />}
                onClick={() => setFiltroMotivo(null)}
                sx={{
                  color: colors.grey[400],
                  fontSize: "0.75rem",
                }}
              >
                Limpiar filtro
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {motivosArray.map(([motivo, cantidad]) => {
              const color = getColorMotivo(motivo);
              const estaActivo = filtroMotivo === motivo;

              return (
                <Chip
                  key={motivo}
                  icon={getIconoMotivo(motivo)}
                  label={`${formatMotivoGestion(motivo)} (${cantidad})`}
                  onClick={() => {
                    setFiltroMotivo(estaActivo ? null : motivo);
                    setPaginaGestiones(0);
                  }}
                  sx={{
                    backgroundColor: estaActivo ? color + "30" : color + "10",
                    color: estaActivo ? color : COLOR_TEXTO,
                    border: `1px solid ${estaActivo ? color : "transparent"}`,
                    "&:hover": {
                      backgroundColor: color + "20",
                    },
                    fontSize: "0.75rem",
                    height: 28,
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* 🔹 DataGrid de gestiones */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: COLOR_TEXTO, mb: 2 }}
          >
            📝 Gestiones registradas{" "}
            {filtroMotivo &&
              `(Filtrado: ${formatMotivoGestion(filtroMotivo)})`}
          </Typography>

          <Box
            sx={{
              width: "100%",
              "& .MuiDataGrid-root": {
                border: "none",
                color: COLOR_TEXTO,
                backgroundColor: COLOR_FONDO,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${COLOR_BORDE}`,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: COLOR_FONDO,
                borderBottom: `1px solid ${COLOR_BORDE}`,
                fontWeight: 600,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: COLOR_FONDO,
                borderTop: `1px solid ${COLOR_BORDE}`,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox":
                {
                  display: "none",
                },
              "& .MuiTablePagination-root": {
                color: COLOR_TEXTO,
              },
              "& .MuiTablePagination-selectIcon": {
                color: COLOR_TEXTO,
              },
            }}
          >
            <DataGrid
              rows={gestionesFiltradas.map((g, idx) => ({ ...g, id: idx }))}
              columns={columnsDetalle}
              pageSizeOptions={[5, 10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: {
                    page: paginaGestiones,
                    pageSize: pageSize,
                  },
                },
              }}
              onPaginationModelChange={(model) => {
                setPaginaGestiones(model.page);
                setPageSize(model.pageSize);
              }}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
              disableMultipleRowSelection
              sx={{
                height: alturaTablaDetalles,
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: COLOR_FONDO,
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: COLOR_FONDO,
          p: 2,
          borderTop: `1px solid ${COLOR_BORDE}`,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{ color: colors.grey[400] }}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={descargarReporte}
          sx={{
            backgroundColor: COLOR_EFICIENTE,
            color: colors.grey[900],
            fontWeight: 600,
            "&:hover": { backgroundColor: COLOR_EFICIENTE + "CC" },
          }}
        >
          Descargar reporte
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GestorDetallesDialog;