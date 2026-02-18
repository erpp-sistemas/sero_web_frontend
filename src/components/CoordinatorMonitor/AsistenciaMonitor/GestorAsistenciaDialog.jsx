// src/components/CoordinatorMonitor/AsistenciaMonitor/GestorAsistenciaDialog.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
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
  useTheme,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Close,
  Download,
  Person,
  AssignmentOutlined,
  CheckCircle,
  Warning,
  Error,
  Login,
  Logout,
  EventBusy,
  AccessTime,
  LocationOn,
  Today,
  ExpandMore,
  ExpandLess,
  GpsFixed,
  PhotoCamera,
  Schedule,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

// ============================================
// COMPONENTE CARD RESUMEN (mismo diseño)
// ============================================
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

// ============================================
// COMPONENTE CHIP ESTATUS (mismo diseño)
// ============================================
const ChipEstatusAsistencia = ({
  estatus,
  getColorPorEstatus,
  getIconoPorEstatus,
  getLabelPorEstatus,
}) => {
  const color = getColorPorEstatus(estatus);
  const icono = getIconoPorEstatus(estatus);
  const label = getLabelPorEstatus(estatus);

  return (
    <Tooltip title={label}>
      <Chip
        icon={icono}
        label={estatus.replace("_", " ")}
        size="small"
        sx={{
          backgroundColor: color + "20",
          color: color,
          fontWeight: 600,
          fontSize: "0.7rem",
          minWidth: 90,
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    </Tooltip>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const GestorAsistenciaDialog = ({
  open,
  onClose,
  gestor,
  colors: colorsProp,
  COLOR_TEXTO: COLOR_TEXTO_PROPS,
  COLOR_FONDO: COLOR_FONDO_PROPS,
  COLOR_BORDE: COLOR_BORDE_PROPS,
  COLOR_COMPLETA: COLOR_COMPLETA_PROPS,
  COLOR_SIN_SALIDA: COLOR_SIN_SALIDA_PROPS,
  COLOR_SIN_ENTRADA: COLOR_SIN_ENTRADA_PROPS,
  COLOR_SIN_ASISTENCIA: COLOR_SIN_ASISTENCIA_PROPS,
  formatFecha,
  formatFechaLegible,
  formatHora,
  getColorPorEstatus,
  getIconoPorEstatus,
  getLabelPorEstatus,
}) => {
  const theme = useTheme();
  const colors = colorsProp || tokens(theme.palette.mode);

  // Props con valores por defecto
  const COLOR_TEXTO = COLOR_TEXTO_PROPS || colors.grey[100];
  const COLOR_FONDO = COLOR_FONDO_PROPS || colors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || colors.primary[500];
  const COLOR_COMPLETA = COLOR_COMPLETA_PROPS || colors.accentGreen[100];
  const COLOR_SIN_SALIDA = COLOR_SIN_SALIDA_PROPS || colors.blueAccent[400];
  const COLOR_SIN_ENTRADA = COLOR_SIN_ENTRADA_PROPS || colors.yellowAccent[400];
  const COLOR_SIN_ASISTENCIA =
    COLOR_SIN_ASISTENCIA_PROPS || colors.redAccent[400];

  // Estados
  const [filtroEstatus, setFiltroEstatus] = useState("TODOS");
  const [pagina, setPagina] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [diaExpandido, setDiaExpandido] = useState(null);

  const gestorAnteriorRef = useRef(null);

  // ============================================
  // OBTENER COLOR PARA FILTROS
  // ============================================
  const getColorFiltro = (estatus) => {
    switch (estatus) {
      case "TODOS":
        return colors.blueAccent[600];
      case "COMPLETA":
        return COLOR_COMPLETA;
      case "SIN_SALIDA":
        return COLOR_SIN_SALIDA;
      case "SIN_ENTRADA":
        return COLOR_SIN_ENTRADA;
      case "SIN_ASISTENCIA":
        return COLOR_SIN_ASISTENCIA;
      default:
        return COLOR_TEXTO;
    }
  };

  // ============================================
  // OBTENER ÍCONO PARA FILTROS
  // ============================================
  const getIconoFiltro = (estatus) => {
    switch (estatus) {
      case "TODOS":
        return <AssignmentOutlined sx={{ fontSize: 18 }} />;
      case "COMPLETA":
        return <CheckCircle sx={{ fontSize: 18 }} />;
      case "SIN_SALIDA":
        return <Logout sx={{ fontSize: 18, transform: "rotate(180deg)" }} />;
      case "SIN_ENTRADA":
        return <Login sx={{ fontSize: 18 }} />;
      case "SIN_ASISTENCIA":
        return <EventBusy sx={{ fontSize: 18 }} />;
      default:
        return <Warning sx={{ fontSize: 18 }} />;
    }
  };

  // ============================================
  // FILTRAR ASISTENCIAS
  // ============================================
  const asistenciasFiltradas = useMemo(() => {
    if (!gestor?.asistencias) return [];

    if (filtroEstatus === "TODOS") {
      return gestor.asistencias;
    }

    return gestor.asistencias.filter(
      (dia) => dia.estatus_asistencia === filtroEstatus,
    );
  }, [gestor, filtroEstatus]);

  // ============================================
  // PAGINACIÓN
  // ============================================
  const asistenciasPaginadas = useMemo(() => {
    const start = pagina * pageSize;
    return asistenciasFiltradas.slice(start, start + pageSize);
  }, [asistenciasFiltradas, pagina, pageSize]);

  // ============================================
  // CONTEO DE ESTATUS PARA FILTROS
  // ============================================
  const conteoEstatus = useMemo(() => {
    if (!gestor?.asistencias) {
      return {
        TODOS: 0,
        COMPLETA: 0,
        SIN_SALIDA: 0,
        SIN_ENTRADA: 0,
        SIN_ASISTENCIA: 0,
      };
    }

    const completas = gestor.asistencias.filter(
      (d) => d.estatus_asistencia === "COMPLETA",
    ).length;
    const sinSalida = gestor.asistencias.filter(
      (d) => d.estatus_asistencia === "SIN_SALIDA",
    ).length;
    const sinEntrada = gestor.asistencias.filter(
      (d) => d.estatus_asistencia === "SIN_ENTRADA",
    ).length;
    const sinAsistencia = gestor.asistencias.filter(
      (d) => d.estatus_asistencia === "SIN_ASISTENCIA",
    ).length;

    return {
      TODOS: gestor.asistencias.length,
      COMPLETA: completas,
      SIN_SALIDA: sinSalida,
      SIN_ENTRADA: sinEntrada,
      SIN_ASISTENCIA: sinAsistencia,
    };
  }, [gestor]);

  // ============================================
  // MANEJADORES
  // ============================================
  const handleClicChip = (estatus) => {
    setFiltroEstatus(estatus);
    setPagina(0);
    setDiaExpandido(null);
  };

  // ============================================
  // RESET AL CAMBIAR GESTOR
  // ============================================
  useEffect(() => {
    if (open && gestor && gestor.id !== gestorAnteriorRef.current) {
      setPagina(0);
      setPageSize(10);
      setFiltroEstatus("TODOS");
      setDiaExpandido(null);
      gestorAnteriorRef.current = gestor.id;
    }
  }, [open, gestor]);

  if (!gestor) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: COLOR_FONDO,
        },
      }}
    >
      {/* HEADER */}
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
          <Avatar sx={{ bgcolor: colors.primary[500], width: 48, height: 48 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: COLOR_TEXTO }}
            >
              {gestor.nombre}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              ID: {gestor.id} • {gestor.totalRegistros.toLocaleString()}{" "}
              registros • {gestor.totalDias} días trabajados
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.grey[400] }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: COLOR_FONDO,
          p: 3,
          overflow: "auto",
        }}
      >
        {/* 4 CARDS DE RESUMEN */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardResumenDialog
            titulo="Total días"
            valor={gestor.totalDias || 0}
            color={COLOR_TEXTO}
            icono={<Today sx={{ color: colors.grey[400] }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
          <CardResumenDialog
            titulo="Asistencia completa"
            valor={gestor.completas || 0}
            color={COLOR_COMPLETA}
            icono={<CheckCircle sx={{ color: COLOR_COMPLETA }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
          <CardResumenDialog
            titulo="Sin salida"
            valor={gestor.sinSalida || 0}
            color={COLOR_SIN_SALIDA}
            icono={
              <Logout
                sx={{ color: COLOR_SIN_SALIDA, transform: "rotate(180deg)" }}
              />
            }
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
          <CardResumenDialog
            titulo="Sin entrada"
            valor={gestor.sinEntrada + gestor.sinAsistencia || 0}
            color={COLOR_SIN_ASISTENCIA}
            icono={<EventBusy sx={{ color: COLOR_SIN_ASISTENCIA }} />}
            colors={colors}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_FONDO={COLOR_FONDO}
            COLOR_BORDE={colors.borderContainer}
          />
        </Box>

        {/* FILTROS POR ESTATUS */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: COLOR_TEXTO,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📊 Filtrar por estatus de asistencia
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: colors.grey[500],
                fontWeight: 400,
                ml: 1,
              }}
            >
              (Haz clic para filtrar)
            </Typography>
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[
              "TODOS",
              "COMPLETA",
              "SIN_SALIDA",
              "SIN_ENTRADA",
              "SIN_ASISTENCIA",
            ].map((estatus) => {
              const color = getColorFiltro(estatus);
              const estaActivo = filtroEstatus === estatus;
              const cantidad = conteoEstatus[estatus] || 0;

              if (cantidad === 0 && estatus !== "TODOS") return null;

              return (
                <Chip
                  key={estatus}
                  icon={getIconoFiltro(estatus)}
                  label={`${estatus === "TODOS" ? "Todos" : estatus.replace("_", " ")} (${cantidad})`}
                  onClick={() => handleClicChip(estatus)}
                  sx={{
                    backgroundColor: estaActivo ? color + "30" : color + "10",
                    color: estaActivo ? color : COLOR_TEXTO,
                    border: `1px solid ${estaActivo ? color : "transparent"}`,
                    "&:hover": {
                      backgroundColor: color + "20",
                      transform: "translateY(-1px)",
                    },
                    fontSize: "0.75rem",
                    height: 28,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "& .MuiChip-icon": {
                      color: estaActivo ? color : colors.grey[500],
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* TABLA DE ASISTENCIA DIARIA */}
        <Box sx={{ mt: 3 }}>
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
              📅 Historial diario
              
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.grey[400], fontSize: "0.875rem" }}
            >
              {filtroEstatus === "TODOS" ? (
                <>Mostrando {asistenciasFiltradas.length} días</>
              ) : (
                <>
                  Filtrado: <strong>{filtroEstatus.replace("_", " ")}</strong> •
                  {asistenciasFiltradas.length} de {gestor.totalDias} días
                </>
              )}
            </Typography>
          </Box>

          {asistenciasPaginadas.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: colors.primary[900],
                borderRadius: "8px",
                border: `1px solid ${COLOR_BORDE}`,
              }}
            >
              <EventBusy
                sx={{ fontSize: 48, color: colors.grey[600], mb: 2 }}
              />
              <Typography variant="h6" sx={{ color: COLOR_TEXTO, mb: 1 }}>
                No hay registros para mostrar
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {filtroEstatus !== "TODOS"
                  ? `No hay días con estatus "${filtroEstatus.replace("_", " ")}"`
                  : "Este gestor no tiene registros de asistencia"}
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: COLOR_FONDO,
                border: `1px solid ${COLOR_BORDE}`,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 60,
                      }}
                    >
                      Fecha
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 80,
                      }}
                    >
                      Estatus
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 65,
                      }}
                    >
                      <Tooltip title="Hora de entrada" arrow>
                        <span>Entrada</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 65,
                      }}
                    >
                      <Tooltip title="Hora de salida" arrow>
                        <span>Salida</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 70,
                      }}
                    >
                      <Tooltip
                        title="Tiempo desde que llegó hasta su primer registro"
                        arrow
                      >
                        <span>Inicio</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 70,
                      }}
                    >
                      <Tooltip
                        title="Tiempo entre su último registro y su salida"
                        arrow
                      >
                        <span>Fin</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 70,
                      }}
                    >
                      <Tooltip
                        title="Distancia entre donde marcó entrada y su primer registro"
                        arrow
                      >
                        <span>Dist. inicio</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 70,
                      }}
                    >
                      <Tooltip
                        title="Distancia entre su último registro y donde marcó salida"
                        arrow
                      >
                        <span>Dist. fin</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: COLOR_TEXTO,
                        fontWeight: 600,
                        borderBottom: `1px solid ${COLOR_BORDE}`,
                        width: 70,
                      }}
                      align="center"
                    >
                      <Tooltip title="Ver ubicaciones en mapa" arrow>
                        <span>📍</span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asistenciasPaginadas.map((dia) => {
                    // Función para determinar color según tiempo (minutos)
                    const getColorPorTiempo = (minutos) => {
                      if (!minutos) return colors.grey[500];
                      if (minutos <= 15) return COLOR_COMPLETA; // Verde - Bueno
                      if (minutos <= 30) return COLOR_SIN_ENTRADA; // Amarillo - Precaución
                      return COLOR_SIN_ASISTENCIA; // Rojo - Grave
                    };

                    // Función para determinar color según distancia (metros)
                    const getColorPorDistancia = (metros) => {
                      if (!metros) return colors.grey[500];
                      if (metros <= 500) return COLOR_COMPLETA; // Verde - Cerca
                      if (metros <= 2000) return COLOR_SIN_ENTRADA; // Amarillo - Regular
                      return COLOR_SIN_ASISTENCIA; // Rojo - Muy lejos
                    };

                    // Formatear distancia (metros a km si es necesario)
                    const formatearDistancia = (metros) => {
                      if (!metros) return "—";
                      if (metros < 1000) return `${Math.round(metros)} m`;
                      return `${(metros / 1000).toFixed(1)} km`;
                    };

                    return (
                      <TableRow
                        key={dia.fechaKey}
                        sx={{
                          "&:hover": { backgroundColor: colors.primary[400] },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: COLOR_TEXTO }}
                          >
                            {formatFecha(dia.fecha)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <ChipEstatusAsistencia
                            estatus={dia.estatus_asistencia}
                            getColorPorEstatus={getColorPorEstatus}
                            getIconoPorEstatus={getIconoPorEstatus}
                            getLabelPorEstatus={getLabelPorEstatus}
                          />
                        </TableCell>

                        <TableCell>
                          {dia.horaEntrada ? (
                            <Typography
                              variant="body2"
                              sx={{ color: COLOR_TEXTO }}
                            >
                              {formatHora(dia.horaEntrada)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[500] }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {dia.horaSalida ? (
                            <Typography
                              variant="body2"
                              sx={{ color: COLOR_TEXTO }}
                            >
                              {formatHora(dia.horaSalida)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[500] }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {dia.minutos_desde_entrada ? (
                            <Tooltip
                              title={`Tiempo hasta primer registro: ${dia.minutos_desde_entrada} minutos`}
                              arrow
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getColorPorTiempo(
                                    dia.minutos_desde_entrada,
                                  ),
                                  fontWeight:
                                    dia.minutos_desde_entrada > 15 ? 600 : 400,
                                }}
                              >
                                {dia.minutos_desde_entrada} min
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[500] }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {dia.minutos_hasta_salida ? (
                            <Tooltip
                              title={`Tiempo desde último registro: ${dia.minutos_hasta_salida} minutos`}
                              arrow
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getColorPorTiempo(
                                    dia.minutos_hasta_salida,
                                  ),
                                  fontWeight:
                                    dia.minutos_hasta_salida > 15 ? 600 : 400,
                                }}
                              >
                                {dia.minutos_hasta_salida} min
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[500] }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {dia.metros_desde_entrada ? (
                            <Tooltip
                              title={`Distancia al primer registro: ${formatearDistancia(dia.metros_desde_entrada)}`}
                              arrow
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getColorPorDistancia(
                                    dia.metros_desde_entrada,
                                  ),
                                  fontWeight:
                                    dia.metros_desde_entrada > 500 ? 600 : 400,
                                }}
                              >
                                {formatearDistancia(dia.metros_desde_entrada)}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[500] }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {dia.metros_hasta_salida ? (
                            <Tooltip
                              title={`Distancia al último registro: ${formatearDistancia(dia.metros_hasta_salida)}`}
                              arrow
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getColorPorDistancia(
                                    dia.metros_hasta_salida,
                                  ),
                                  fontWeight:
                                    dia.metros_hasta_salida > 500 ? 600 : 400,
                                }}
                              >
                                {formatearDistancia(dia.metros_hasta_salida)}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[500] }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            {dia.lugarEntrada && (
                              <Tooltip title="Ver ubicación de entrada" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    window.open(dia.lugarEntrada, "_blank")
                                  }
                                  sx={{ color: colors.grey[400], p: 0.5 }}
                                >
                                  <LocationOn sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {dia.lugarSalida && (
                              <Tooltip title="Ver ubicación de salida" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    window.open(dia.lugarSalida, "_blank")
                                  }
                                  sx={{ color: colors.grey[400], p: 0.5 }}
                                >
                                  <Logout
                                    sx={{
                                      fontSize: 16,
                                      transform: "rotate(180deg)",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {!dia.lugarEntrada && !dia.lugarSalida && (
                              <Typography
                                variant="body2"
                                sx={{ color: colors.grey[500] }}
                              >
                                —
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          backgroundColor: COLOR_FONDO,
          p: 2,
          borderTop: `1px solid ${COLOR_BORDE}`,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} sx={{ color: colors.grey[400] }}>
          Cerrar
        </Button>

        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => {
            const reporte = {
              gestor: gestor.nombre,
              id: gestor.id,
              total_dias: gestor.totalDias,
              estadisticas: {
                completas: gestor.completas,
                sin_salida: gestor.sinSalida,
                sin_entrada: gestor.sinEntrada,
                sin_asistencia: gestor.sinAsistencia,
                porcentaje_asistencia: gestor.porcentajeAsistencia + "%",
              },
              historial: gestor.asistencias.map((dia) => ({
                fecha: formatFecha(dia.fecha),
                estatus: dia.estatus_asistencia,
                entrada: formatHora(dia.horaEntrada),
                salida: formatHora(dia.horaSalida),
                horas: dia.horasTrabajadas || "—",
                gestiones: dia.totalGestionesDia,
                eficiencia: dia.eficienciaDia + "%",
                fotos: dia.fotosDia,
              })),
            };

            const dataStr = JSON.stringify(reporte, null, 2);
            const dataUri =
              "data:application/json;charset=utf-8," +
              encodeURIComponent(dataStr);
            const link = document.createElement("a");
            link.href = dataUri;
            link.download = `asistencia_${gestor.nombre.replace(/\s+/g, "_")}_${gestor.id}.json`;
            link.click();
          }}
          sx={{
            backgroundColor: COLOR_COMPLETA,
            color: colors.grey[900],
            fontWeight: 600,
            "&:hover": { backgroundColor: COLOR_COMPLETA + "CC" },
          }}
        >
          Descargar reporte
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GestorAsistenciaDialog;
