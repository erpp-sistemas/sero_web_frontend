// src/components/CoordinatorMonitor/PerformanceMonitor.jsx
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
} from "@mui/icons-material";
import { tokens } from "../../theme";

import GestorDetallesDialog from "./PerformanceMonitor/GestorDetallesDialog";

const PerformanceMonitor = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabActiva, setTabActiva] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  // 🔹 Colores
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_PRIMARIO = colors.primary[400];
  const COLOR_EFICIENTE = colors.accentGreen[100];
  const COLOR_REGULAR = colors.yellowAccent[400];
  const COLOR_ATENCION = colors.redAccent[400];
  const COLOR_TAB_ACTIVA = colors.blueAccent[600];

  // ============================================
  // ANÁLISIS DE DATOS (SIMPLIFICADO - YA VIENE FOTOS COMO ARRAY)
  // ============================================

  const { usuarios, resumen } = useMemo(() => {
    if (!data.length) return { usuarios: [], resumen: {} };

    const usuariosMap = {};

    data.forEach((registro) => {
      const userId = registro.id_usuario;

      if (!usuariosMap[userId]) {
        usuariosMap[userId] = {
          id: userId,
          nombre: registro.nombre_usuario,
          total: 0,
          completas: 0,
          incompletas: 0,
          invalidas: 0,
          motivos: {},
          registros: [],
          fechas: new Set(),
        };
      }

      const usuario = usuariosMap[userId];
      usuario.total++;
      usuario.fechas.add(new Date(registro.fecha).toISOString().split("T")[0]);

      // 🔹 Fotos ya vienen como array desde el backend - sin necesidad de parseo
      const fotosArray = Array.isArray(registro.fotos) ? registro.fotos : [];
      
      // 🔹 Clasificar fotos por tipo (opcional, para facilitar acceso en el modal)
      const fotosFachada = fotosArray.filter(foto => {
        if (!foto || typeof foto !== 'object') return false;
        const tipo = (foto.tipo || '').toLowerCase();
        return tipo.includes('fachada') || tipo.includes('predio');
      });
      
      const fotosEvidencia = fotosArray.filter(foto => {
        if (!foto || typeof foto !== 'object') return false;
        const tipo = (foto.tipo || '').toLowerCase();
        return tipo.includes('evidencia');
      });

      usuario.registros.push({
        id: registro.id,
        cuenta: registro.cuenta,
        fecha: registro.fecha,
        estatus_gestion: registro.estatus_gestion,
        motivo_gestion: registro.motivo_gestion,
        tieneGPS:
          registro.latitud &&
          registro.longitud &&
          registro.latitud !== 0 &&
          registro.longitud !== 0,
        // 🔹 Usar campos numéricos del backend (ya deberían estar correctos)
        fotosFachada: registro.fotos_fachada || 0,
        fotosEvidencia: registro.fotos_evidencia || 0,
        totalFotos: registro.total_fotos || 0,
        // 🔹 Array de fotos ya procesado desde el backend
        fotos: fotosArray,
        // 🔹 Opcional: fotos separadas por tipo para fácil acceso en el modal
        fotosPorTipo: {
          fachada: fotosFachada,
          evidencia: fotosEvidencia,
        },
        // 🔹 Información adicional
        coordenadas: registro.latitud && registro.longitud ? {
          latitud: registro.latitud,
          longitud: registro.longitud,
        } : null,
      });

      if (registro.estatus_gestion === "COMPLETA") {
        usuario.completas++;
      } else if (registro.estatus_gestion === "INCOMPLETA") {
        usuario.incompletas++;
      } else if (registro.estatus_gestion === "INVALIDA") {
        usuario.invalidas++;
      }

      const motivo = registro.motivo_gestion || "COMPLETA";
      if (!usuario.motivos[motivo]) {
        usuario.motivos[motivo] = 0;
      }
      usuario.motivos[motivo]++;
    });

    const usuariosArray = Object.values(usuariosMap).map((usuario) => {
      const porcentajeExito =
        usuario.total > 0 ? (usuario.completas / usuario.total) * 100 : 0;

      const diasTrabajados = usuario.fechas.size;

      let nivel = "regular";
      let color = COLOR_REGULAR;
      let icono = <Warning />;

      if (porcentajeExito >= 90) {
        nivel = "eficiente";
        color = COLOR_EFICIENTE;
        icono = <CheckCircle />;
      } else if (porcentajeExito < 70) {
        nivel = "atencion";
        color = COLOR_ATENCION;
        icono = <Error />;
      }

      return {
        ...usuario,
        porcentajeExito,
        diasTrabajados,
        nivel,
        color,
        icono,
      };
    });

    const totalUsuarios = usuariosArray.length;
    const usuariosAtencion = usuariosArray.filter(
      (u) => u.nivel === "atencion",
    ).length;
    const usuariosEficientes = usuariosArray.filter(
      (u) => u.nivel === "eficiente",
    ).length;
    const usuariosRegulares = usuariosArray.filter(
      (u) => u.nivel === "regular",
    ).length;

    const totalGestiones = usuariosArray.reduce((sum, u) => sum + u.total, 0);
    const totalCompletas = usuariosArray.reduce(
      (sum, u) => sum + u.completas,
      0,
    );
    const promedioGeneral =
      totalGestiones > 0 ? (totalCompletas / totalGestiones) * 100 : 0;

    return {
      usuarios: usuariosArray,
      resumen: {
        totalUsuarios,
        usuariosAtencion,
        usuariosEficientes,
        usuariosRegulares,
        totalGestiones,
        totalCompletas,
        promedioGeneral,
      },
    };
  }, [data]);

  // ============================================
  // FUNCIONES PRINCIPALES
  // ============================================

  const verDetallesUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setDialogoAbierto(true);
  };

  const descargarReporteUsuario = (usuario) => {
    const reporte = {
      gestor: usuario.nombre,
      id: usuario.id,
      completas: usuario.completas,
      incompletas: usuario.incompletas,
      invalidas: usuario.invalidas,
      porcentaje: usuario.porcentajeExito.toFixed(1) + "%",
    };

    const dataStr = JSON.stringify(reporte, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `gestor_${usuario.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // 🔹 Función para obtener color de tab activa
  const getColorTabActiva = (index) => {
    if (index === 1) return COLOR_ATENCION;
    if (index === 2) return COLOR_REGULAR;
    if (index === 3) return COLOR_EFICIENTE;
    return COLOR_TAB_ACTIVA;
  };

  const getColorIndicador = () => {
    return getColorTabActiva(tabActiva);
  };

  // 🔹 Filtrar usuarios según tabs y búsqueda
  const usuariosFiltrados = useMemo(() => {
    let filtrados = [...usuarios];

    if (busqueda) {
      filtrados = filtrados.filter(
        (usuario) =>
          usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          usuario.id.toString().includes(busqueda),
      );
    }

    if (tabActiva === 1)
      filtrados = filtrados.filter((u) => u.nivel === "atencion");
    else if (tabActiva === 2)
      filtrados = filtrados.filter((u) => u.nivel === "regular");
    else if (tabActiva === 3)
      filtrados = filtrados.filter((u) => u.nivel === "eficiente");

    return filtrados;
  }, [usuarios, busqueda, tabActiva]);

  // ============================================
  // CONFIGURACIÓN DATAGRID (SIMPLIFICADA)
  // ============================================

  const columns = [
    {
      field: "icono",
      headerName: "Estado",
      flex: 0.6,
      minWidth: 60,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box sx={{ color: params.row.color }}>
            {params.row.nivel === "eficiente" ? (
              <CheckCircle sx={{ fontSize: 20 }} />
            ) : params.row.nivel === "regular" ? (
              <Warning sx={{ fontSize: 20 }} />
            ) : (
              <Error sx={{ fontSize: 20 }} />
            )}
          </Box>
        </Box>
      ),
      sortable: false,
    },
    {
      field: "nombre",
      headerName: "Gestor",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: COLOR_TEXTO }}
          >
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            ID: {params.row.id} • {params.row.diasTrabajados} días
          </Typography>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Total Gestiones",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: COLOR_TEXTO, fontWeight: 600 }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "completas",
      headerName: "Completas",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: COLOR_EFICIENTE, fontWeight: 600 }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "incompletas",
      headerName: "Con Problemas",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: COLOR_REGULAR, fontWeight: 600 }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "invalidas",
      headerName: "Inválidas",
      flex: 0.7,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: COLOR_ATENCION, fontWeight: 600 }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "porcentajeExito",
      headerName: "% Éxito",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              color: params.row.color,
              fontWeight: 700,
              textAlign: "right",
              mb: 0.5,
            }}
          >
            {params.value.toFixed(1)}%
          </Typography>
          <Box
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.primary[600],
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${params.value}%`,
                height: "100%",
                backgroundColor: params.row.color,
              }}
            />
          </Box>
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={() => verDetallesUsuario(params.row)}
              sx={{
                color: colors.grey[400],
                "&:hover": {
                  color: COLOR_PRIMARIO,
                  backgroundColor: COLOR_PRIMARIO + "20",
                },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar reporte">
            <IconButton
              size="small"
              onClick={() => descargarReporteUsuario(params.row)}
              sx={{
                color: colors.grey[400],
                "&:hover": {
                  color: COLOR_EFICIENTE,
                  backgroundColor: COLOR_EFICIENTE + "20",
                },
              }}
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      sortable: false,
    },
  ];

  // 🔹 Calcular altura dinámica del DataGrid
  const alturaTabla = useMemo(() => {
    const alturaHeader = 56;
    const alturaFila = 52;
    const margenExtra = 16;
    
    if (usuariosFiltrados.length <= 5) {
      return alturaHeader + (usuariosFiltrados.length * alturaFila) + margenExtra;
    }
    
    return 500;
  }, [usuariosFiltrados.length]);

  // ============================================
  // RENDER PRINCIPAL (SIMPLIFICADO)
  // ============================================

  return (
    <>
      <Box sx={{ mt: 6 }}>
        {/* Título principal */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: COLOR_TEXTO,
              fontWeight: 600,
              fontSize: "1.125rem",
              mb: 0.5,
            }}
          >
            Análisis de Desempeño
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.grey[400],
              fontSize: "0.875rem",
            }}
          >
            Eficiencia y métricas por miembro del equipo
          </Typography>
        </Box>

        {/* Header con estadísticas generales */}
        <Box className="grid grid-cols-1 gap-3 mb-4">
          <Grow in={true} timeout={400}>
            <Box
              className="p-4 rounded-xl shadow-sm"
              sx={{
                backgroundColor: COLOR_FONDO,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.grey[400],
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontWeight: 500, color: COLOR_TEXTO }}
                    >
                      {resumen.totalUsuarios} gestores activos
                    </Box>
                    <Box component="span" sx={{ color: colors.grey[500] }}>
                      •
                    </Box>
                    <Box component="span">
                      {resumen.totalGestiones} registros
                    </Box>
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: COLOR_EFICIENTE,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: colors.grey[400], fontSize: "0.75rem" }}
                      >
                        {resumen.usuariosEficientes} Excelente/Alto desempeño
                      </Typography>
                    </Box>
                    <Box
                      component="span"
                      sx={{ color: colors.grey[500], fontSize: "0.75rem" }}
                    >
                      •
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: COLOR_REGULAR,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: colors.grey[400], fontSize: "0.75rem" }}
                      >
                        {resumen.usuariosRegulares} Regular/Medio desempeño
                      </Typography>
                    </Box>
                    <Box
                      component="span"
                      sx={{ color: colors.grey[500], fontSize: "0.75rem" }}
                    >
                      •
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: COLOR_ATENCION,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: colors.grey[400], fontSize: "0.75rem" }}
                      >
                        {resumen.usuariosAtencion} Crítico/Bajo desempeño
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: COLOR_TEXTO,
                      lineHeight: 1,
                    }}
                  >
                    {resumen.promedioGeneral.toFixed(0)}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.grey[400],
                      fontSize: "0.75rem",
                    }}
                  >
                    Registros completos
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grow>
        </Box>

        {/* Filtros y Tabs */}
        <Box
          className="p-4 rounded-xl shadow-sm mb-4"
          sx={{
            backgroundColor: COLOR_FONDO,
          }}
        >
          {/* Barra de búsqueda ampliada */}
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
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.borderContainer,
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accentGreen[100],
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accentGreen[200],
                    boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
                  },

                  "& input::placeholder": {
                    color: colors.grey[400],
                    opacity: 1,
                  },
                },

                "& .MuiInputAdornment-root": {
                  marginRight: "8px",
                },
              }}
            />
          </Box>

          {/* Tabs */}
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
                  minHeight: 48,
                  "&:hover": {
                    color: (theme) => {
                      return getColorTabActiva(theme.tabIndex);
                    },
                  },
                },
                "& .Mui-selected": {
                  color: (theme) => {
                    const color = getColorTabActiva(theme.tabIndex);
                    return `${color} !important`;
                  },
                  fontWeight: 600,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: getColorIndicador(),
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "inherit",
                        fontWeight: "inherit",
                      }}
                    >
                      Todos
                    </Typography>
                    <Chip
                      label={resumen.totalUsuarios}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 0 ? COLOR_TAB_ACTIVA : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20,
                      }}
                    />
                  </Box>
                }
                sx={{
                  "&.Mui-selected": {
                    color: `${COLOR_TAB_ACTIVA} !important`,
                  },
                  "&:hover": {
                    color: `${COLOR_TAB_ACTIVA} !important`,
                    "& .MuiChip-root": {
                      color: `${COLOR_TAB_ACTIVA} !important`,
                    },
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Error
                      sx={{
                        fontSize: 20,
                        color: tabActiva === 1 ? COLOR_ATENCION : COLOR_TEXTO,
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        color: tabActiva === 1 ? COLOR_ATENCION : COLOR_TEXTO,
                        fontSize: "inherit",
                        fontWeight: "inherit",
                      }}
                    >
                      Crítico/Bajo
                    </Typography>
                    <Chip
                      label={resumen.usuariosAtencion}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 1 ? COLOR_ATENCION : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20,
                      }}
                    />
                  </Box>
                }
                sx={{
                  "&.Mui-selected": {
                    color: `${COLOR_ATENCION} !important`,
                  },
                  "&:hover": {
                    color: `${COLOR_ATENCION} !important`,
                    "& .MuiChip-root": {
                      color: `${COLOR_ATENCION} !important`,
                    },
                    "& .MuiSvgIcon-root": {
                      color: `${COLOR_ATENCION} !important`,
                    },
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Warning
                      sx={{
                        fontSize: 20,
                        color: tabActiva === 2 ? COLOR_REGULAR : COLOR_TEXTO,
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        color: tabActiva === 2 ? COLOR_REGULAR : COLOR_TEXTO,
                        fontSize: "inherit",
                        fontWeight: "inherit",
                      }}
                    >
                      Regular/Medio
                    </Typography>
                    <Chip
                      label={resumen.usuariosRegulares}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 2 ? COLOR_REGULAR : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20,
                      }}
                    />
                  </Box>
                }
                sx={{
                  "&.Mui-selected": {
                    color: `${COLOR_REGULAR} !important`,
                  },
                  "&:hover": {
                    color: `${COLOR_REGULAR} !important`,
                    "& .MuiChip-root": {
                      color: `${COLOR_REGULAR} !important`,
                    },
                    "& .MuiSvgIcon-root": {
                      color: `${COLOR_REGULAR} !important`,
                    },
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle
                      sx={{
                        fontSize: 20,
                        color: tabActiva === 3 ? COLOR_EFICIENTE : COLOR_TEXTO,
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        color: tabActiva === 3 ? COLOR_EFICIENTE : COLOR_TEXTO,
                        fontSize: "inherit",
                        fontWeight: "inherit",
                      }}
                    >
                      Excelente/Alto
                    </Typography>
                    <Chip
                      label={resumen.usuariosEficientes}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === 3 ? COLOR_EFICIENTE : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20,
                      }}
                    />
                  </Box>
                }
                sx={{
                  "&.Mui-selected": {
                    color: `${COLOR_EFICIENTE} !important`,
                  },
                  "&:hover": {
                    color: `${COLOR_EFICIENTE} !important`,
                    "& .MuiChip-root": {
                      color: `${COLOR_EFICIENTE} !important`,
                    },
                    "& .MuiSvgIcon-root": {
                      color: `${COLOR_EFICIENTE} !important`,
                    },
                  },
                }}
              />
            </Tabs>
          </Box>
        </Box>

        {/* 🔹 DataGrid para mostrar gestores */}
        <Box
          className="rounded-xl shadow-sm"
          sx={{
            backgroundColor: COLOR_FONDO,
            overflow: "hidden",
          }}
        >
          {usuariosFiltrados.length === 0 ? (
            <Box
              className="p-6 text-center"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Search sx={{ fontSize: 48, color: colors.grey[500] }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: COLOR_TEXTO }}
              >
                No se encontraron gestores
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.grey[400], maxWidth: 400 }}
              >
                {busqueda
                  ? `No hay resultados para "${busqueda}". Intenta con otro término.`
                  : "No hay gestores disponibles para la categoría seleccionada."}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                height: alturaTabla,
                width: "100%",
                "& .MuiDataGrid-root": {
                  border: "none",
                  color: COLOR_TEXTO,
                  backgroundColor: COLOR_FONDO,
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${COLOR_BORDE}`,
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: COLOR_FONDO,
                  borderBottom: `1px solid ${COLOR_BORDE}`,
                  fontWeight: 600,
                },
                "& .MuiDataGrid-footerContainer": {
                  display: "none",
                },
                "& .MuiDataGrid-row": {
                  "&:hover": {
                    backgroundColor: colors.primary[400],
                  },
                },
                "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox":
                  {
                    display: "none",
                  },
              }}
            >
              <DataGrid
                rows={usuariosFiltrados}
                columns={columns}
                disableRowSelectionOnClick
                disableColumnMenu={false} // Permite sorting nativo
                disableColumnSelector
                disableDensitySelector
                disableMultipleRowSelection
                getRowId={(row) => row.id}
                hideFooter
                sortingMode="client"
                initialState={{
                  sorting: {
                    sortModel: [
                      {
                        field: "porcentajeExito",
                        sort: "desc",
                      },
                    ],
                  },
                }}
                sx={{
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: COLOR_FONDO,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: COLOR_FONDO,
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: colors.grey[400],
                  },
                  "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortIcon": {
                    color: colors.accentGreen[100],
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* 🔹 Contador de resultados */}
        {usuariosFiltrados.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              Mostrando {usuariosFiltrados.length} gestores
              {busqueda && ` • Filtrado por: "${busqueda}"`}
              {tabActiva > 0 && ` • Categoría: ${["Todos", "Crítico/Bajo", "Regular/Medio", "Excelente/Alto"][tabActiva]}`}
            </Typography>
            {tabActiva === 0 && usuariosFiltrados.length > 0 && (
              <Button
                startIcon={<Download />}
                size="small"
                sx={{
                  color: COLOR_TEXTO,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: colors.primary[400],
                  },
                }}
                onClick={() => {
                  const reporteCompleto = usuariosFiltrados.map((u) => ({
                    gestor: u.nombre,
                    id: u.id,
                    total: u.total,
                    completas: u.completas,
                    incompletas: u.incompletas,
                    invalidas: u.invalidas,
                    porcentaje: u.porcentajeExito.toFixed(1) + "%",
                    nivel: u.nivel,
                  }));
                  const dataStr = JSON.stringify(reporteCompleto, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute(
                    "download",
                    `reporte_gestores_${tabActiva === 0 ? "todos" : tabActiva === 1 ? "critico" : tabActiva === 2 ? "regular" : "excelente"}.json`,
                  );
                  linkElement.click();
                }}
              >
                Exportar lista completa
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* 🔹 Diálogo de detalles - Ahora recibe información completa de fotos */}
      <GestorDetallesDialog
        open={dialogoAbierto}
        onClose={() => {
          setDialogoAbierto(false);
          setUsuarioSeleccionado(null);
        }}
        usuario={usuarioSeleccionado}
        colors={colors}
        COLOR_TEXTO={COLOR_TEXTO}
        COLOR_FONDO={COLOR_FONDO}
        COLOR_BORDE={COLOR_BORDE}
        COLOR_EFICIENTE={COLOR_EFICIENTE}
        COLOR_REGULAR={COLOR_REGULAR}
        COLOR_ATENCION={COLOR_ATENCION}
      />
    </>
  );
};

export default PerformanceMonitor;