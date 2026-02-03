// src/components/CoordinatorMonitor/CriticalAlerts.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Warning,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  Person,
  LocationOff,
  CameraAlt,
  Schedule,
  Phone,
  Email,
  Visibility,
  TrendingDown,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";

const CriticalAlerts = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [expandedSection, setExpandedSection] = useState(true);

  // 🔹 Colores específicos para secciones importantes
  const COLOR_ESTANDAR = colors.grey[100]; // Gris estándar para textos
  const COLOR_FONDO = colors.bgContainer; // Color de fondo minimalista
  const COLOR_BORDE = colors.borderContainer; // Color de bordes
  const COLOR_PRIMARIO = colors.primary[400]; // Color primario
  const COLOR_ALERTA_ALTA = colors.redAccent[400]; // Rojo para alertas altas
  const COLOR_ALERTA_MEDIA = colors.yellowAccent[400]; // Amarillo para alertas media (en lugar de orange)

  // ============================================
  // ANÁLISIS DE DATOS PARA DETECCIÓN DE ALERTAS
  // ============================================

  const { alertas, resumen, hayAlertas } = useMemo(() => {
    if (!data.length) {
      return { alertas: [], resumen: {}, hayAlertas: false };
    }

    // Agrupar por usuario
    const usuarios = {};
    const problemasGlobales = {
      sinGPS: 0,
      sinFotoFachada: 0,
      sinFotoEvidencia: 0,
      incompletas: 0,
      invalidas: 0,
    };

    data.forEach((registro) => {
      const userId = registro.id_usuario;

      if (!usuarios[userId]) {
        usuarios[userId] = {
          id: userId,
          nombre: registro.nombre_usuario,
          registros: [],
          totalRegistros: 0,
          completas: 0,
          incompletas: 0,
          invalidas: 0,
          sinGPS: 0,
          sinFotoFachada: 0,
          sinFotoEvidencia: 0,
          fechas: new Set(),
          ultimaFecha: null,
        };
      }

      const usuario = usuarios[userId];
      usuario.registros.push(registro);
      usuario.totalRegistros++;

      // Seguimiento de fechas
      const fecha = new Date(registro.fecha);
      usuario.fechas.add(fecha.toISOString().split("T")[0]);
      if (!usuario.ultimaFecha || fecha > usuario.ultimaFecha) {
        usuario.ultimaFecha = fecha;
      }

      // Categorizar problemas
      if (registro.estatus_gestion === "COMPLETA") {
        usuario.completas++;
      } else if (registro.estatus_gestion === "INCOMPLETA") {
        usuario.incompletas++;
        problemasGlobales.incompletas++;
      } else if (registro.estatus_gestion === "INVALIDA") {
        usuario.invalidas++;
        problemasGlobales.invalidas++;
      }

      // Problemas de GPS
      if (
        !registro.latitud ||
        !registro.longitud ||
        registro.latitud === 0 ||
        registro.longitud === 0
      ) {
        usuario.sinGPS++;
        problemasGlobales.sinGPS++;
      }

      // Problemas de fotos
      if (registro.fotos_fachada === 0) {
        usuario.sinFotoFachada++;
        problemasGlobales.sinFotoFachada++;
      }
      if (registro.fotos_evidencia === 0) {
        usuario.sinFotoEvidencia++;
        problemasGlobales.sinFotoEvidencia++;
      }
    });

    // Convertir usuarios a array y calcular métricas
    const usuariosArray = Object.values(usuarios);

    // Calcular tasas de completitud
    usuariosArray.forEach((usuario) => {
      usuario.tasaCompletitud =
        usuario.totalRegistros > 0
          ? (usuario.completas / usuario.totalRegistros) * 100
          : 0;
      usuario.tasaProblemas =
        usuario.totalRegistros > 0
          ? ((usuario.incompletas + usuario.invalidas) /
              usuario.totalRegistros) *
            100
          : 0;
      usuario.diasTrabajados = usuario.fechas.size;
      usuario.promedioDiario =
        usuario.diasTrabajados > 0
          ? usuario.totalRegistros / usuario.diasTrabajados
          : 0;
    });

    // Generar alertas
    const listaAlertas = [];

    usuariosArray.forEach((usuario) => {
      const alertasUsuario = [];

      // ALERTA: Baja tasa de completitud (< 70%)
      if (usuario.tasaCompletitud < 70 && usuario.totalRegistros >= 10) {
        alertasUsuario.push({
          tipo: "baja_completitud",
          severidad: usuario.tasaCompletitud < 50 ? "alta" : "media",
          titulo: "Baja completitud",
          descripcion: `${Math.round(usuario.tasaCompletitud)}% de completitud vs promedio del equipo`,
          icono: <TrendingDown />,
          acciones: ["contactar", "revisar", "capacitar"],
        });
      }

      // ALERTA: Problemas persistentes de GPS (> 30%)
      if (usuario.sinGPS > 0 && usuario.sinGPS / usuario.totalRegistros > 0.3) {
        alertasUsuario.push({
          tipo: "problemas_gps",
          severidad: "alta",
          titulo: "Problemas persistentes de GPS",
          descripcion: `${usuario.sinGPS} registros sin GPS (${Math.round((usuario.sinGPS / usuario.totalRegistros) * 100)}%)`,
          icono: <LocationOff />,
          acciones: ["contactar", "revisar_dispositivo"],
        });
      }

      // ALERTA: Faltan fotos de fachada (> 40%)
      if (
        usuario.sinFotoFachada > 0 &&
        usuario.sinFotoFachada / usuario.totalRegistros > 0.4
      ) {
        alertasUsuario.push({
          tipo: "faltan_fotos_fachada",
          severidad: "media",
          titulo: "Faltan fotos de fachada",
          descripcion: `${usuario.sinFotoFachada} registros sin foto de fachada`,
          icono: <CameraAlt />,
          acciones: ["recordatorio", "revisar"],
        });
      }

      // ALERTA: Solo trabajó 1 día en el período
      if (usuario.diasTrabajados === 1 && usuario.totalRegistros > 0) {
        alertasUsuario.push({
          tipo: "baja_asistencia",
          severidad: "media",
          titulo: "Baja asistencia",
          descripcion: `Solo trabajó ${usuario.diasTrabajados} día en el período`,
          icono: <Schedule />,
          acciones: ["contactar", "revisar_horario"],
        });
      }

      // ALERTA: Faltan fotos de evidencia (> 50%)
      if (
        usuario.sinFotoEvidencia > 0 &&
        usuario.sinFotoEvidencia / usuario.totalRegistros > 0.5
      ) {
        alertasUsuario.push({
          tipo: "faltan_fotos_evidencia",
          severidad: "media",
          titulo: "Faltan fotos de evidencia",
          descripcion: `${usuario.sinFotoEvidencia} registros sin foto de evidencia`,
          icono: <CameraAlt />,
          acciones: ["recordatorio", "revisar"],
        });
      }

      // Agregar usuario a alertas si tiene alguna
      if (alertasUsuario.length > 0) {
        listaAlertas.push({
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            tasaCompletitud: usuario.tasaCompletitud,
            totalRegistros: usuario.totalRegistros,
            diasTrabajados: usuario.diasTrabajados,
            promedioDiario: usuario.promedioDiario,
          },
          alertas: alertasUsuario,
          totalAlertas: alertasUsuario.length,
          severidadMaxima: alertasUsuario.reduce(
            (max, alerta) =>
              alerta.severidad === "alta"
                ? "alta"
                : alerta.severidad === "media" && max !== "alta"
                  ? "media"
                  : max,
            "baja",
          ),
        });
      }
    });

    return {
      alertas: listaAlertas.sort((a, b) => {
        // Ordenar por severidad y luego por número de alertas
        const ordenSeveridad = { alta: 3, media: 2, baja: 1 };
        return (
          ordenSeveridad[b.severidadMaxima] -
            ordenSeveridad[a.severidadMaxima] || b.totalAlertas - a.totalAlertas
        );
      }),
      resumen: {
        totalUsuarios: usuariosArray.length,
        usuariosConProblemas: listaAlertas.length,
        totalAlertas: listaAlertas.reduce(
          (sum, usuario) => sum + usuario.totalAlertas,
          0,
        ),
        altaPrioridad: listaAlertas.filter((a) => a.severidadMaxima === "alta")
          .length,
        problemasGlobales,
      },
      hayAlertas: listaAlertas.length > 0,
    };
  }, [data]);

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  const getColorSeveridad = (severidad) => {
    switch (severidad) {
      case "alta":
        return COLOR_ALERTA_ALTA;
      case "media":
        return COLOR_ALERTA_MEDIA;
      case "baja":
        return colors.blueAccent[400];
      default:
        return colors.grey[400];
    }
  };

  const getIconoSeveridad = (severidad) => {
    switch (severidad) {
      case "alta":
        return <Error sx={{ fontSize: 16 }} />;
      case "media":
        return <Warning sx={{ fontSize: 16 }} />;
      case "baja":
        return <Info sx={{ fontSize: 16 }} />;
      default:
        return <Info sx={{ fontSize: 16 }} />;
    }
  };

  const handleAccionAlerta = (accion, userId, tipoAlerta) => {
    console.log(
      `Acción: ${accion} para usuario ${userId}, alerta: ${tipoAlerta}`,
    );
    // Aquí implementarías los handlers de acción
  };

  // ============================================
  // RENDER SIN ALERTAS
  // ============================================

  if (!hayAlertas) {
    return (
      <Box
        sx={{
          backgroundColor: COLOR_FONDO,
          borderRadius: 2,
          p: 3,
          mt: 3,
          border: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <CheckCircle sx={{ color: colors.accentGreen[100], fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
          >
            Sin alertas críticas
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Todo el personal está operando dentro de los parámetros normales para
          el período seleccionado.
        </Typography>
        {resumen && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={`${resumen.totalUsuarios} usuarios analizados`}
              size="small"
              sx={{
                backgroundColor: colors.primary[500],
                color: COLOR_ESTANDAR,
                fontSize: "0.75rem",
              }}
            />
            <Chip
              label={`${data.length} registros totales`}
              size="small"
              sx={{
                backgroundColor: colors.primary[500],
                color: COLOR_ESTANDAR,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // ============================================
  // RENDER CON ALERTAS
  // ============================================

  return (
    <Box
      sx={{
        backgroundColor: COLOR_FONDO,
        borderRadius: 2,
        overflow: "hidden",
        mt: 3,
        border: `1px solid ${COLOR_BORDE}`,
      }}
    >
      {/* Encabezado de la sección */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          backgroundColor: COLOR_PRIMARIO,
          borderBottom: `1px solid ${COLOR_BORDE}`,
        }}
        onClick={() => setExpandedSection(!expandedSection)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: COLOR_ALERTA_ALTA,
              borderRadius: "6px",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Warning sx={{ color: colors.white, fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
            >
              Alertas Críticas que Requieren Atención
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              {resumen.altaPrioridad} alta prioridad •{" "}
              {resumen.usuariosConProblemas} usuarios con problemas
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: COLOR_ESTANDAR }}>
          {expandedSection ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Barra de resumen */}
      <Collapse in={expandedSection}>
        <Box
          sx={{
            p: 2,
            backgroundColor: colors.primary[500],
            borderBottom: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Chip
              icon={<Person sx={{ fontSize: 16 }} />}
              label={`${resumen.usuariosConProblemas}/${resumen.totalUsuarios} usuarios necesitan atención`}
              size="small"
              sx={{
                backgroundColor:
                  resumen.usuariosConProblemas / resumen.totalUsuarios > 0.3
                    ? COLOR_ALERTA_ALTA + "20"
                    : COLOR_ALERTA_MEDIA + "20",
                color: COLOR_ESTANDAR,
                fontSize: "0.75rem",
                height: 24,
              }}
            />
            <Chip
              icon={<Error sx={{ fontSize: 16 }} />}
              label={`${resumen.altaPrioridad} alertas de alta prioridad`}
              size="small"
              sx={{
                backgroundColor: COLOR_ALERTA_ALTA + "20",
                color: COLOR_ALERTA_ALTA,
                fontSize: "0.75rem",
                height: 24,
              }}
            />
            <Chip
              icon={<LocationOff sx={{ fontSize: 16 }} />}
              label={`${resumen.problemasGlobales.sinGPS} registros sin GPS`}
              size="small"
              sx={{
                backgroundColor: colors.primary[600],
                color: COLOR_ESTANDAR,
                fontSize: "0.75rem",
                height: 24,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: colors.grey[400], ml: "auto" }}
            >
              Haz clic en cualquier alerta para ver detalles y tomar acción
            </Typography>
          </Box>
        </Box>

        {/* Lista de alertas */}
        <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
          {alertas.map((alertaUsuario, index) => (
            <Box key={alertaUsuario.usuario.id}>
              <Divider sx={{ borderColor: COLOR_BORDE }} />
              <Box sx={{ p: 3 }}>
                {/* Encabezado del usuario */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Person sx={{ color: colors.grey[400] }} />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
                      >
                        {alertaUsuario.usuario.nombre}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colors.grey[400] }}
                      >
                        ID: {alertaUsuario.usuario.id} •{" "}
                        {alertaUsuario.usuario.totalRegistros} registros •{" "}
                        {alertaUsuario.usuario.diasTrabajados} días
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`${Math.round(alertaUsuario.usuario.tasaCompletitud)}% completitud`}
                      size="small"
                      sx={{
                        backgroundColor:
                          alertaUsuario.usuario.tasaCompletitud < 70
                            ? COLOR_ALERTA_ALTA + "20"
                            : colors.accentGreen[100] + "20",
                        color:
                          alertaUsuario.usuario.tasaCompletitud < 70
                            ? COLOR_ALERTA_ALTA
                            : colors.accentGreen[100],
                        fontSize: "0.75rem",
                        height: 24,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        setExpandedAlert(
                          expandedAlert === alertaUsuario.usuario.id
                            ? null
                            : alertaUsuario.usuario.id,
                        )
                      }
                      sx={{ color: COLOR_ESTANDAR }}
                    >
                      {expandedAlert === alertaUsuario.usuario.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* Alertas del usuario */}
                <Collapse in={expandedAlert === alertaUsuario.usuario.id}>
                  <Box sx={{ ml: 4, mt: 2 }}>
                    {alertaUsuario.alertas.map((alerta, alertaIndex) => (
                      <Box
                        key={alertaIndex}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: colors.primary[500],
                          borderLeft: `3px solid ${getColorSeveridad(alerta.severidad)}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              color: getColorSeveridad(alerta.severidad),
                              mt: 0.5,
                            }}
                          >
                            {alerta.icono}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              {getIconoSeveridad(alerta.severidad)}
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
                              >
                                {alerta.titulo}
                              </Typography>
                              <Chip
                                label={
                                  alerta.severidad === "alta" ? "Alta" : "Media"
                                }
                                size="small"
                                sx={{
                                  backgroundColor:
                                    getColorSeveridad(alerta.severidad) + "20",
                                  color: getColorSeveridad(alerta.severidad),
                                  height: 20,
                                  fontSize: "0.7rem",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[300], mb: 2 }}
                            >
                              {alerta.descripcion}
                            </Typography>

                            {/* Botones de acción */}
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
                              {alerta.acciones.includes("contactar") && (
                                <Button
                                  size="small"
                                  startIcon={<Phone sx={{ fontSize: 16 }} />}
                                  sx={{
                                    backgroundColor:
                                      colors.blueAccent[400] + "20",
                                    color: colors.blueAccent[400],
                                    fontSize: "0.75rem",
                                    textTransform: "none",
                                    "&:hover": {
                                      backgroundColor:
                                        colors.blueAccent[400] + "40",
                                    },
                                  }}
                                  onClick={() =>
                                    handleAccionAlerta(
                                      "contactar",
                                      alertaUsuario.usuario.id,
                                      alerta.tipo,
                                    )
                                  }
                                >
                                  Contactar
                                </Button>
                              )}
                              {alerta.acciones.includes("revisar") && (
                                <Button
                                  size="small"
                                  startIcon={
                                    <Visibility sx={{ fontSize: 16 }} />
                                  }
                                  sx={{
                                    backgroundColor: colors.primary[700],
                                    color: COLOR_ESTANDAR,
                                    fontSize: "0.75rem",
                                    textTransform: "none",
                                  }}
                                  onClick={() =>
                                    handleAccionAlerta(
                                      "revisar",
                                      alertaUsuario.usuario.id,
                                      alerta.tipo,
                                    )
                                  }
                                >
                                  Revisar detalles
                                </Button>
                              )}
                              {alerta.acciones.includes("capacitar") && (
                                <Button
                                  size="small"
                                  sx={{
                                    backgroundColor: COLOR_ALERTA_MEDIA + "20",
                                    color: COLOR_ALERTA_MEDIA,
                                    fontSize: "0.75rem",
                                    textTransform: "none",
                                  }}
                                  onClick={() =>
                                    handleAccionAlerta(
                                      "capacitar",
                                      alertaUsuario.usuario.id,
                                      alerta.tipo,
                                    )
                                  }
                                >
                                  Programar capacitación
                                </Button>
                              )}
                              {alerta.acciones.includes("recordatorio") && (
                                <Button
                                  size="small"
                                  startIcon={<Email sx={{ fontSize: 16 }} />}
                                  sx={{
                                    backgroundColor: colors.grey[700],
                                    color: COLOR_ESTANDAR,
                                    fontSize: "0.75rem",
                                    textTransform: "none",
                                  }}
                                  onClick={() =>
                                    handleAccionAlerta(
                                      "recordatorio",
                                      alertaUsuario.usuario.id,
                                      alerta.tipo,
                                    )
                                  }
                                >
                                  Enviar recordatorio
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Recomendación global si hay muchos problemas de GPS */}
        {resumen.problemasGlobales.sinGPS / data.length > 0.2 && (
          <Box
            sx={{
              p: 3,
              backgroundColor: colors.primary[500],
              borderTop: `1px solid ${COLOR_BORDE}`,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: COLOR_ESTANDAR, mb: 1 }}
            >
              <LocationOff
                sx={{
                  verticalAlign: "middle",
                  mr: 1,
                  color: COLOR_ALERTA_MEDIA,
                }}
              />
              Recomendación Global
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[300] }}>
              <strong>Problema de GPS detectado:</strong>{" "}
              {Math.round(
                (resumen.problemasGlobales.sinGPS / data.length) * 100,
              )}
              % de todos los registros carecen de coordenadas GPS. Considera un
              recordatorio general al equipo sobre la activación del GPS o
              revisa posibles problemas de dispositivos.
            </Typography>
          </Box>
        )}

        {/* Botón para ver todas las alertas */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <Button
            endIcon={<ArrowForward />}
            sx={{
              color: COLOR_ESTANDAR,
              fontSize: "0.875rem",
              textTransform: "none",
              "&:hover": {
                backgroundColor: colors.primary[600],
              },
            }}
          >
            Ver todas las alertas en detalle
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CriticalAlerts;
