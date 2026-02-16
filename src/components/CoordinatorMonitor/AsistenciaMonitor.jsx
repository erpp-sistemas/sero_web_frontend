// src/components/CoordinatorMonitor/AsistenciaMonitor.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grow,
  Paper,
  useTheme
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Search,
  Download,
  Visibility,
  CheckCircle,
  Warning,
  Error,
  Login,
  Logout,
  EventBusy,
  Assignment
} from "@mui/icons-material";
import { tokens } from "../../theme";
import GestorAsistenciaDialog from "./AsistenciaMonitor/GestorAsistenciaDialog";

const AsistenciaMonitor = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // ============================================
  // ESTADOS
  // ============================================
  const [tabActiva, setTabActiva] = useState(0); // 0:Todos, 1:Completa, 2:Sin salida, 3:Sin entrada, 4:Sin asistencia
  const [busqueda, setBusqueda] = useState("");
  const [gestorSeleccionado, setGestorSeleccionado] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  // ============================================
  // COLORES - Misma paleta
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_PRIMARIO = colors.primary[400];
  const COLOR_TAB_ACTIVA = colors.blueAccent[600];
  
  const COLOR_COMPLETA = colors.accentGreen[100];
  const COLOR_SIN_SALIDA = colors.blueAccent[400];
  const COLOR_SIN_ENTRADA = colors.yellowAccent[400];
  const COLOR_SIN_ASISTENCIA = colors.redAccent[400];

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const formatHora = (fechaISO) => {
    if (!fechaISO) return "—";
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "—";
    }
  };

  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    try {
      const fecha = new Date(fechaISO);
      return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
    } catch {
      return "—";
    }
  };

  const formatFechaLegible = (fechaISO) => {
    if (!fechaISO) return "—";
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-MX', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "—";
    }
  };

  const getColorPorEstatus = (estatus) => {
    switch (estatus) {
      case "COMPLETA": return COLOR_COMPLETA;
      case "SIN_SALIDA": return COLOR_SIN_SALIDA;
      case "SIN_ENTRADA": return COLOR_SIN_ENTRADA;
      case "SIN_ASISTENCIA": return COLOR_SIN_ASISTENCIA;
      default: return COLOR_TEXTO;
    }
  };

  const getIconoPorEstatus = (estatus) => {
    switch (estatus) {
      case "COMPLETA": return <CheckCircle sx={{ fontSize: 20 }} />;
      case "SIN_SALIDA": return <Logout sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />;
      case "SIN_ENTRADA": return <Login sx={{ fontSize: 20 }} />;
      case "SIN_ASISTENCIA": return <EventBusy sx={{ fontSize: 20 }} />;
      default: return <Warning sx={{ fontSize: 20 }} />;
    }
  };

  const getLabelPorEstatus = (estatus) => {
    switch (estatus) {
      case "COMPLETA": return "Asistencia completa";
      case "SIN_SALIDA": return "Registró entrada, sin salida";
      case "SIN_ENTRADA": return "Registró salida, sin entrada";
      case "SIN_ASISTENCIA": return "Sin registro de asistencia";
      default: return estatus;
    }
  };

  // ============================================
  // ANÁLISIS - MANTENEMOS LA ESTRUCTURA ORIGINAL
  // ============================================
  const { gestores, resumenDias } = useMemo(() => {
    if (!data.length) {
      return {
        gestores: [],
        resumenDias: {
          totalGestores: 0,
          totalDias: 0,
          totalRegistros: 0,
          completas: 0,
          sinSalida: 0,
          sinEntrada: 0,
          sinAsistencia: 0
        }
      };
    }

    // Agrupar por USUARIO y por FECHA
    const asistenciasPorGestor = new Map();
    const fechasUnicas = new Set();

    data.forEach(registro => {
      const userId = registro.id_usuario;
      const fechaKey = new Date(registro.fecha).toISOString().split('T')[0];
      
      fechasUnicas.add(fechaKey);
      
      if (!asistenciasPorGestor.has(userId)) {
        asistenciasPorGestor.set(userId, {
          id: userId,
          nombre: registro.nombre_usuario,
          asistencias: new Map(),
          totalRegistros: 0,
          ultimaActualizacion: null
        });
      }

      const gestor = asistenciasPorGestor.get(userId);
      gestor.totalRegistros++;

      if (!gestor.asistencias.has(fechaKey)) {
        gestor.asistencias.set(fechaKey, {
          fecha: registro.fecha,
          fechaKey,
          estatus_asistencia: registro.estatus_asistencia || "SIN_ASISTENCIA",
          horaEntrada: null,
          horaSalida: null,
          lugarEntrada: null,
          lugarSalida: null,
          totalGestionesDia: 0,
          gestionesCompletasDia: 0,
          fotosDia: 0,
          registros: []
        });
      }

      const asistenciaDia = gestor.asistencias.get(fechaKey);
      
      if (registro.estatus_asistencia) {
        asistenciaDia.estatus_asistencia = registro.estatus_asistencia;
      }
      
      // Buscar registro MÁS TEMPRANO (entrada)
      if (registro.hora_entrada) {
        if (!asistenciaDia.horaEntrada || new Date(registro.hora_entrada) < new Date(asistenciaDia.horaEntrada)) {
          asistenciaDia.horaEntrada = registro.hora_entrada;
          asistenciaDia.lugarEntrada = registro.lugar_asistencia_entrada;
        }
      }
      
      // Buscar registro MÁS TARDÍO (salida)
      if (registro.hora_salida) {
        if (!asistenciaDia.horaSalida || new Date(registro.hora_salida) > new Date(asistenciaDia.horaSalida)) {
          asistenciaDia.horaSalida = registro.hora_salida;
          asistenciaDia.lugarSalida = registro.lugar_asistencia_salida;
        }
      }

      asistenciaDia.totalGestionesDia++;
      if (registro.estatus_gestion === "COMPLETA") {
        asistenciaDia.gestionesCompletasDia++;
      }
      asistenciaDia.fotosDia += registro.total_fotos || 0;
      asistenciaDia.registros.push(registro);
    });

    // Convertir Maps a Arrays y calcular métricas
    const gestoresArray = Array.from(asistenciasPorGestor.values()).map(gestor => {
      const asistenciasArray = Array.from(gestor.asistencias.values())
        .map(asistencia => {
          let horasTrabajadas = null;
          if (asistencia.horaEntrada && asistencia.horaSalida) {
            const entrada = new Date(asistencia.horaEntrada);
            const salida = new Date(asistencia.horaSalida);
            const diffMs = salida - entrada;
            const diffHoras = diffMs / (1000 * 60 * 60);
            horasTrabajadas = diffHoras.toFixed(1);
          }

          return {
            ...asistencia,
            horasTrabajadas,
            eficienciaDia: asistencia.totalGestionesDia > 0 
              ? (asistencia.gestionesCompletasDia / asistencia.totalGestionesDia * 100).toFixed(1)
              : 0
          };
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      const totalDias = asistenciasArray.length;
      const completas = asistenciasArray.filter(a => a.estatus_asistencia === "COMPLETA").length;
      const sinSalida = asistenciasArray.filter(a => a.estatus_asistencia === "SIN_SALIDA").length;
      const sinEntrada = asistenciasArray.filter(a => a.estatus_asistencia === "SIN_ENTRADA").length;
      const sinAsistencia = asistenciasArray.filter(a => a.estatus_asistencia === "SIN_ASISTENCIA").length;

      return {
        ...gestor,
        asistencias: asistenciasArray,
        totalDias,
        completas,
        sinSalida,
        sinEntrada,
        sinAsistencia,
        porcentajeAsistencia: totalDias > 0 ? ((completas + sinSalida) / totalDias * 100).toFixed(1) : 0,
        ultimoEstatus: asistenciasArray[0]?.estatus_asistencia || null,
        ultimoIcono: asistenciasArray[0]?.estatus_asistencia ? getIconoPorEstatus(asistenciasArray[0].estatus_asistencia) : null,
        ultimoColor: asistenciasArray[0]?.estatus_asistencia ? getColorPorEstatus(asistenciasArray[0].estatus_asistencia) : null,
        ultimoLabel: asistenciasArray[0]?.estatus_asistencia ? getLabelPorEstatus(asistenciasArray[0].estatus_asistencia) : null
      };
    });

    // Resumen en DÍAS (¡LO QUE QUEREMOS!)
    const resumenDias = {
      totalGestores: gestoresArray.length,
      totalDias: fechasUnicas.size,
      totalRegistros: data.length,
      completas: gestoresArray.reduce((acc, g) => acc + g.completas, 0),
      sinSalida: gestoresArray.reduce((acc, g) => acc + g.sinSalida, 0),
      sinEntrada: gestoresArray.reduce((acc, g) => acc + g.sinEntrada, 0),
      sinAsistencia: gestoresArray.reduce((acc, g) => acc + g.sinAsistencia, 0)
    };

    return {
      gestores: gestoresArray.sort((a, b) => b.completas - a.completas),
      resumenDias
    };
  }, [data]);

  // ============================================
  // FILTROS - Tabs por estatus
  // ============================================
  const gestoresFiltrados = useMemo(() => {
    let filtrados = [...gestores];

    if (busqueda) {
      filtrados = filtrados.filter(g => 
        g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        g.id.toString().includes(busqueda)
      );
    }

    // Filtrar por el ÚLTIMO estatus del gestor
    if (tabActiva === 1) {
      filtrados = filtrados.filter(g => g.ultimoEstatus === "COMPLETA");
    } else if (tabActiva === 2) {
      filtrados = filtrados.filter(g => g.ultimoEstatus === "SIN_SALIDA");
    } else if (tabActiva === 3) {
      filtrados = filtrados.filter(g => g.ultimoEstatus === "SIN_ENTRADA");
    } else if (tabActiva === 4) {
      filtrados = filtrados.filter(g => g.ultimoEstatus === "SIN_ASISTENCIA");
    }

    return filtrados;
  }, [gestores, busqueda, tabActiva]);

  // ============================================
  // COLORES PARA TABS
  // ============================================
  const getColorTabActiva = (index) => {
    if (index === 1) return COLOR_COMPLETA;
    if (index === 2) return COLOR_SIN_SALIDA;
    if (index === 3) return COLOR_SIN_ENTRADA;
    if (index === 4) return COLOR_SIN_ASISTENCIA;
    return COLOR_TAB_ACTIVA;
  };

  // ============================================
  // COLUMNAS DEL DATAGRID - IGUAL QUE EN LA VERSIÓN BASE
  // ============================================
  const columns = [
    {
      field: "ultimoEstatus",
      headerName: "Hoy",
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => (
        <Tooltip title={params.row.ultimoLabel || "Sin información"}>
          <Box sx={{ 
            color: params.row.ultimoColor, 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}>
            {params.row.ultimoIcono}
          </Box>
        </Tooltip>
      ),
      sortable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "nombre",
      headerName: "Gestor",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            ID: {params.row.id} • {params.row.totalRegistros.toLocaleString()} registros
          </Typography>
        </Box>
      )
    },
    {
      field: "totalDias",
      headerName: "Días",
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
          {params.value}
        </Typography>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "completas",
      headerName: "Completas",
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLOR_COMPLETA, fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            {params.row.totalDias > 0 ? ((params.value / params.row.totalDias) * 100).toFixed(0) : 0}%
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "sinSalida",
      headerName: "Sin salida",
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLOR_SIN_SALIDA, fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            {params.row.totalDias > 0 ? ((params.value / params.row.totalDias) * 100).toFixed(0) : 0}%
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "sinEntrada",
      headerName: "Sin entrada",
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLOR_SIN_ENTRADA, fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            {params.row.totalDias > 0 ? ((params.value / params.row.totalDias) * 100).toFixed(0) : 0}%
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "sinAsistencia",
      headerName: "Sin asistencia",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLOR_SIN_ASISTENCIA, fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            {params.row.totalDias > 0 ? ((params.value / params.row.totalDias) * 100).toFixed(0) : 0}%
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "porcentajeAsistencia",
      headerName: "% Asistencia",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ width: "100%", pr: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: params.value >= 90 ? COLOR_COMPLETA : 
                     params.value >= 70 ? COLOR_SIN_SALIDA : COLOR_SIN_ASISTENCIA,
              fontWeight: 700,
              textAlign: "right",
              mb: 0.5
            }}
          >
            {params.value}%
          </Typography>
          <Box sx={{ 
            height: 4, 
            borderRadius: 2, 
            bgcolor: colors.primary[600], 
            overflow: "hidden",
            width: "100%"
          }}>
            <Box sx={{ 
              width: `${params.value}%`, 
              height: "100%", 
              bgcolor: params.value >= 90 ? COLOR_COMPLETA : 
                       params.value >= 70 ? COLOR_SIN_SALIDA : COLOR_SIN_ASISTENCIA 
            }} />
          </Box>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "acciones",
      headerName: "",
      flex: 0.4,
      minWidth: 50,
      renderCell: (params) => (
        <Tooltip title="Ver historial de asistencia">
          <IconButton
            size="small"
            onClick={() => {
              setGestorSeleccionado(params.row);
              setDialogoAbierto(true);
            }}
            sx={{
              color: colors.grey[400],
              "&:hover": { color: COLOR_PRIMARIO, bgcolor: COLOR_PRIMARIO + "20" }
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
      sortable: false
    }
  ];

  // Altura dinámica
  const alturaTabla = useMemo(() => {
    const alturaHeader = 56;
    const alturaFila = 72;
    const margenExtra = 16;
    
    if (gestoresFiltrados.length <= 5) {
      return alturaHeader + (gestoresFiltrados.length * alturaFila) + margenExtra;
    }
    return 500;
  }, [gestoresFiltrados.length]);

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <>
      <Box sx={{ mt: 6 }}>
        {/* HEADER - Simplificado con resumen en DÍAS */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: COLOR_TEXTO, fontWeight: 600, fontSize: "1.125rem", mb: 0.5 }}>
            Control de Asistencia
          </Typography>
          <Typography variant="body2" sx={{ color: colors.grey[400], fontSize: "0.875rem" }}>
            Registros de entrada/salida por gestor
          </Typography>
        </Box>

        {/* TARJETA DE RESUMEN EN DÍAS - NUEVA */}
        <Grow in={true} timeout={400}>
          <Paper
            sx={{
              p: 2.5,
              mb: 3,
              bgcolor: COLOR_FONDO,
              borderRadius: "16px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: colors.grey[400], fontWeight: 500 }}>
                Resumen en días (total de todos los gestores)
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_TEXTO, fontWeight: 600 }}>
                {resumenDias.totalDias} días analizados
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ color: COLOR_COMPLETA, fontWeight: 700, lineHeight: 1.2 }}>
                  {resumenDias.completas}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                  dias completos
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: COLOR_SIN_SALIDA, fontWeight: 700, lineHeight: 1.2 }}>
                  {resumenDias.sinSalida}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                  dias sin salida
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: COLOR_SIN_ENTRADA, fontWeight: 700, lineHeight: 1.2 }}>
                  {resumenDias.sinEntrada}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                  dias sin entrada
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: COLOR_SIN_ASISTENCIA, fontWeight: 700, lineHeight: 1.2 }}>
                  {resumenDias.sinAsistencia}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                  dias sin asistencia
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grow>

        {/* FILTROS Y TABS */}
        <Box className="p-4 rounded-xl shadow-sm mb-4" sx={{ backgroundColor: COLOR_FONDO }}>
          {/* Barra de búsqueda */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Buscar gestor por nombre o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ color: colors.grey[300], fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  backgroundColor: colors.bgContainer,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.borderContainer },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.accentGreen[100] },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accentGreen[200],
                    boxShadow: "0 0 0 3px rgba(34,197,94,0.15)"
                  }
                }
              }}
            />
          </Box>

          {/* Tabs - Filtrar por estatus de HOY */}
          <Box sx={{ borderBottom: 1, borderColor: colors.borderContainer }}>
            <Tabs
              value={tabActiva}
              onChange={(e, nuevoValor) => setTabActiva(nuevoValor)}
              sx={{
                "& .MuiTab-root": {
                  color: COLOR_TEXTO,
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  minHeight: 48
                },
                "& .Mui-selected": {
                  color: `${getColorTabActiva(tabActiva)} !important`,
                  fontWeight: 600
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: getColorTabActiva(tabActiva)
                }
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography component="span">Todos</Typography>
                    <Chip
                      label={resumenDias.totalGestores}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 0 ? COLOR_TAB_ACTIVA : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 18, color: tabActiva === 1 ? COLOR_COMPLETA : COLOR_TEXTO }} />
                    <Typography component="span" sx={{ color: tabActiva === 1 ? COLOR_COMPLETA : COLOR_TEXTO }}>
                      Completa
                    </Typography>
                    <Chip
                      label={gestores.filter(g => g.ultimoEstatus === "COMPLETA").length}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 1 ? COLOR_COMPLETA : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Logout sx={{ fontSize: 18, transform: 'rotate(180deg)', color: tabActiva === 2 ? COLOR_SIN_SALIDA : COLOR_TEXTO }} />
                    <Typography component="span" sx={{ color: tabActiva === 2 ? COLOR_SIN_SALIDA : COLOR_TEXTO }}>
                      Sin salida
                    </Typography>
                    <Chip
                      label={gestores.filter(g => g.ultimoEstatus === "SIN_SALIDA").length}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 2 ? COLOR_SIN_SALIDA : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Login sx={{ fontSize: 18, color: tabActiva === 3 ? COLOR_SIN_ENTRADA : COLOR_TEXTO }} />
                    <Typography component="span" sx={{ color: tabActiva === 3 ? COLOR_SIN_ENTRADA : COLOR_TEXTO }}>
                      Sin entrada
                    </Typography>
                    <Chip
                      label={gestores.filter(g => g.ultimoEstatus === "SIN_ENTRADA").length}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 3 ? COLOR_SIN_ENTRADA : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EventBusy sx={{ fontSize: 18, color: tabActiva === 4 ? COLOR_SIN_ASISTENCIA : COLOR_TEXTO }} />
                    <Typography component="span" sx={{ color: tabActiva === 4 ? COLOR_SIN_ASISTENCIA : COLOR_TEXTO }}>
                      Sin asistencia
                    </Typography>
                    <Chip
                      label={gestores.filter(g => g.ultimoEstatus === "SIN_ASISTENCIA").length}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 4 ? COLOR_SIN_ASISTENCIA : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20
                      }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Box>
        </Box>

        {/* DATAGRID - IGUAL QUE EN LA VERSIÓN BASE */}
        <Paper sx={{ bgcolor: COLOR_FONDO, borderRadius: "16px", overflow: "hidden" }}>
          {gestoresFiltrados.length === 0 ? (
            <Box sx={{ p: 6, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Search sx={{ fontSize: 48, color: colors.grey[500] }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                No se encontraron gestores
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {busqueda ? `No hay resultados para "${busqueda}"` : "No hay datos de asistencia disponibles"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: alturaTabla, width: "100%" }}>
              <DataGrid
                rows={gestoresFiltrados}
                columns={columns}
                disableRowSelectionOnClick
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                getRowId={(row) => row.id}
                hideFooter
                sortingMode="client"
                initialState={{ sorting: { sortModel: [{ field: "completas", sort: "desc" }] } }}
                sx={{
                  border: "none",
                  color: COLOR_TEXTO,
                  bgcolor: COLOR_FONDO,
                  "& .MuiDataGrid-cell": { borderBottom: `1px solid ${COLOR_BORDE}`, display: "flex", alignItems: "center" },
                  "& .MuiDataGrid-columnHeaders": { bgcolor: COLOR_FONDO, borderBottom: `1px solid ${COLOR_BORDE}`, fontWeight: 600 },
                  "& .MuiDataGrid-footerContainer": { display: "none" },
                  "& .MuiDataGrid-row:hover": { bgcolor: colors.primary[400] + "20" },
                  "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": { display: "none" },
                  "& .MuiDataGrid-columnSeparator": { display: "none" },
                  "& .MuiDataGrid-virtualScroller": { bgcolor: COLOR_FONDO },
                  "& .MuiDataGrid-columnHeaders": { position: "sticky", top: 0, zIndex: 1 }
                }}
              />
            </Box>
          )}
        </Paper>

        {/* CONTADOR DE RESULTADOS */}
        {gestoresFiltrados.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              Mostrando {gestoresFiltrados.length} gestores
              {busqueda && ` • Filtrado: "${busqueda}"`}
              {tabActiva > 0 && ` • ${["Todos", "Completa", "Sin salida", "Sin entrada", "Sin asistencia"][tabActiva]}`}
            </Typography>
            <Button
              startIcon={<Download />}
              size="small"
              sx={{
                color: COLOR_TEXTO,
                textTransform: "none",
                "&:hover": { bgcolor: colors.primary[400] + "20" }
              }}
              onClick={() => {
                const reporte = gestoresFiltrados.map(g => ({
                  gestor: g.nombre,
                  id: g.id,
                  dias_totales: g.totalDias,
                  completas: g.completas,
                  sin_salida: g.sinSalida,
                  sin_entrada: g.sinEntrada,
                  sin_asistencia: g.sinAsistencia,
                  porcentaje_asistencia: g.porcentajeAsistencia + "%",
                  ultimo_estatus: g.ultimoEstatus
                }));
                
                const dataStr = JSON.stringify(reporte, null, 2);
                const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
                const link = document.createElement("a");
                link.href = dataUri;
                link.download = `reporte_asistencia_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
              }}
            >
              Exportar reporte
            </Button>
          </Box>
        )}
      </Box>

      {/* DIALOG */}
      <GestorAsistenciaDialog
        open={dialogoAbierto}
        onClose={() => {
          setDialogoAbierto(false);
          setGestorSeleccionado(null);
        }}
        gestor={gestorSeleccionado}
        colors={colors}
        COLOR_TEXTO={COLOR_TEXTO}
        COLOR_FONDO={COLOR_FONDO}
        COLOR_BORDE={COLOR_BORDE}
        COLOR_COMPLETA={COLOR_COMPLETA}
        COLOR_SIN_SALIDA={COLOR_SIN_SALIDA}
        COLOR_SIN_ENTRADA={COLOR_SIN_ENTRADA}
        COLOR_SIN_ASISTENCIA={COLOR_SIN_ASISTENCIA}
        formatFecha={formatFecha}
        formatFechaLegible={formatFechaLegible}
        formatHora={formatHora}
        getColorPorEstatus={getColorPorEstatus}
        getIconoPorEstatus={getIconoPorEstatus}
        getLabelPorEstatus={getLabelPorEstatus}
      />
    </>
  );
};

export default AsistenciaMonitor;