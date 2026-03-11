// src/components/Inventory/InventoryDetailDialog.jsx
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
  Avatar,
  Grid,
  Paper,
  useTheme,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Close,
  Person,
  Inventory,
  Category,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Description,
  CheckCircle,
  Warning,
  Error,
  Email,
  Badge,
  Memory,
  Storage,
  Speed,
  ColorLens,
  LocalGasStation,
  DirectionsCar,
  Tv,
  Cable,
  Info,
  HomeWork,
  Tag,
  Event,
  PhotoLibrary,
  ArrowBack,
  ArrowForward,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

// ============================================
// COMPONENTE VISOR DE FOTOS
// ============================================
const FotoAmpliadaDialog = ({
  open,
  foto,
  onClose,
  onDownload,
  onNext,
  onPrev,
  totalFotos,
  index,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!foto) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "95vw",
          maxHeight: "95vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2.5,
          borderBottom: `1px solid ${colors.primary[700]}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            Foto del artículo
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.grey[400],
              display: "flex",
              alignItems: "center",
              mr: 1,
            }}
          >
            {index + 1} / {totalFotos}
          </Typography>
          <Tooltip title="Anterior">
            <span>
              <IconButton
                onClick={onPrev}
                disabled={index === 0}
                sx={{
                  color: colors.grey[100],
                  "&:disabled": { color: colors.grey[700] },
                }}
              >
                <ArrowBack />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Siguiente">
            <span>
              <IconButton
                onClick={onNext}
                disabled={index === totalFotos - 1}
                sx={{
                  color: colors.grey[100],
                  "&:disabled": { color: colors.grey[700] },
                }}
              >
                <ArrowForward />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Descargar">
            <IconButton
              onClick={() => onDownload(foto)}
              sx={{ color: colors.grey[100] }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <img
            src={foto.url_imagen}
            alt="Foto del artículo"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              borderRadius: "12px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              objectFit: "contain",
              backgroundColor: colors.primary[900],
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// COMPONENTE SECCIÓN CON BORDE
// ============================================
const Section = ({ title, icon, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 3,
        borderRadius: "12px",
        bgcolor: colors.bgContainer,
        border: `1px solid ${colors.primary[500]}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box sx={{ color: colors.blueAccent[400], fontSize: 20 }}>{icon}</Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: colors.grey[300],
            fontWeight: 600,
            fontSize: "0.85rem",
            letterSpacing: "0.3px",
          }}
        >
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, borderColor: colors.borderContainer }} />
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
      >
        {children}
      </Box>
    </Paper>
  );
};

// ============================================
// COMPONENTE INFO ROW
// ============================================
const InfoRow = ({ icon, label, value, color }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!value && value !== 0) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
      <Box sx={{ color: color || colors.grey[500], fontSize: 18, mt: 0.2 }}>
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: colors.grey[500], display: "block", lineHeight: 1.2 }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: colors.grey[100], fontWeight: 500 }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const InventoryDetailDialog = ({ open, onClose, articulo }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ✅ TODOS LOS HOOKS VAN PRIMERO (antes de cualquier return condicional)
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [fotoAmpliadaIndex, setFotoAmpliadaIndex] = useState(0);

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainerSecondary;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_DISPONIBLE = colors.accentGreen[100];
  const COLOR_ASIGNADO = colors.blueAccent[400];
  const COLOR_MANTENIMIENTO = colors.yellowAccent[400];
  const COLOR_BAJA = colors.redAccent[400];

  // Determinar color según estado
  const getEstadoColor = () => {
    if (!articulo) return COLOR_DISPONIBLE;
    if (articulo.activo === false) return COLOR_BAJA;
    if (articulo.condicion_actual === "malo") return COLOR_MANTENIMIENTO;
    if (articulo.id_usuario) return COLOR_ASIGNADO;
    return COLOR_DISPONIBLE;
  };

  const getEstadoTexto = () => {
    if (!articulo) return "—";
    if (articulo.activo === false) return "Dado de baja";
    if (articulo.condicion_actual === "malo") return "Mantenimiento";
    if (articulo.id_usuario) return "Asignado";
    return "Disponible";
  };

  const getEstadoIcono = () => {
    if (!articulo) return <CheckCircle />;
    if (articulo.activo === false) return <Error />;
    if (articulo.condicion_actual === "malo") return <Warning />;
    if (articulo.id_usuario) return <Person />;
    return <CheckCircle />;
  };

  // Parsear datos del usuario asignado
  const usuarioData = useMemo(() => {
    if (!articulo?.datos_usuario_asignado) return null;
    try {
      return JSON.parse(articulo.datos_usuario_asignado)[0];
    } catch {
      return null;
    }
  }, [articulo]);

  // ============================================
  // AGRUPACIÓN DE CAMPOS
  // ============================================
  const infoBasica = useMemo(() => {
    if (!articulo) return [];
    return [
      { label: "Folio", value: articulo.folio, icon: <Tag /> },
      {
        label: "Categoría",
        value: `${articulo.categoria} / ${articulo.subcategoria}`,
        icon: <Category />,
      },
      { label: "Marca", value: articulo.marca, icon: <Info /> },
      { label: "Modelo", value: articulo.modelo, icon: <Info /> },
      { label: "N° Serie", value: articulo.numero_serie, icon: <Badge /> },
    ].filter((item) => item.value);
  }, [articulo]);

  const infoAdquisicion = useMemo(() => {
    if (!articulo) return [];
    return [
      {
        label: "Precio",
        value: articulo.precio_articulo
          ? `$${articulo.precio_articulo.toLocaleString()}`
          : null,
        icon: <AttachMoney />,
      },
      {
        label: "Fecha compra",
        value: articulo.fecha_compra
          ? new Date(articulo.fecha_compra).toLocaleDateString()
          : null,
        icon: <CalendarToday />,
      },
      {
        label: "Garantía",
        value: articulo.fecha_garantia
          ? new Date(articulo.fecha_garantia).toLocaleDateString()
          : null,
        icon: <Event />,
      },
      {
        label: "Antigüedad",
        value: articulo.antiguedad_anios
          ? `${articulo.antiguedad_anios} años`
          : null,
        icon: <Event />,
      },
    ].filter((item) => item.value);
  }, [articulo]);

  const infoUbicacion = useMemo(() => {
    if (!articulo) return [];
    return [
      { label: "Área", value: articulo.area, icon: <HomeWork /> },
      { label: "Ubicación", value: articulo.ubicacion, icon: <LocationOn /> },
      { label: "Plaza", value: articulo.plaza, icon: <LocationOn /> },
    ].filter((item) => item.value);
  }, [articulo]);

  // Campos específicos
  const infoEspecifica = useMemo(() => {
    if (!articulo) return [];
    const campos = [];

    if (articulo.procesador)
      campos.push({
        label: "Procesador",
        value: articulo.procesador,
        icon: <Memory />,
      });
    if (articulo.almacenamiento)
      campos.push({
        label: "Almacenamiento",
        value: articulo.almacenamiento,
        icon: <Storage />,
      });
    if (articulo.memoria_ram)
      campos.push({
        label: "Memoria RAM",
        value: articulo.memoria_ram,
        icon: <Speed />,
      });
    if (articulo.cilindraje)
      campos.push({
        label: "Cilindraje",
        value: articulo.cilindraje,
        icon: <LocalGasStation />,
      });
    if (articulo.color)
      campos.push({
        label: "Color",
        value: articulo.color,
        icon: <ColorLens />,
      });
    if (articulo.placa)
      campos.push({
        label: "Placa",
        value: articulo.placa,
        icon: <DirectionsCar />,
      });
    if (articulo.pulgadas)
      campos.push({
        label: "Pulgadas",
        value: articulo.pulgadas,
        icon: <Tv />,
      });
    if (articulo.cable)
      campos.push({ label: "Cable", value: articulo.cable, icon: <Cable /> });

    return campos;
  }, [articulo]);

  // Manejadores para el visor de fotos
  const handleFotoClick = (index) => {
    if (!articulo?.fotos) return;
    setFotoAmpliadaIndex(index);
    setFotoAmpliada(articulo.fotos[index]);
  };

  const handleNextFoto = () => {
    if (!articulo?.fotos) return;
    if (fotoAmpliadaIndex < articulo.fotos.length - 1) {
      setFotoAmpliadaIndex(fotoAmpliadaIndex + 1);
      setFotoAmpliada(articulo.fotos[fotoAmpliadaIndex + 1]);
    }
  };

  const handlePrevFoto = () => {
    if (fotoAmpliadaIndex > 0) {
      setFotoAmpliadaIndex(fotoAmpliadaIndex - 1);
      setFotoAmpliada(articulo.fotos[fotoAmpliadaIndex - 1]);
    }
  };

  const descargarFoto = (foto) => {
    if (!foto) return;
    const link = document.createElement("a");
    link.href = foto.url_imagen;
    link.download = `articulo_${articulo?.folio || "unknown"}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ AHORA SÍ, podemos hacer el return condicional
  if (!articulo) return null;

  return (
    <>
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
            <Avatar
              sx={{ bgcolor: colors.primary[500], width: 48, height: 48 }}
            >
              <Inventory />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: COLOR_TEXTO }}
              >
                {articulo.nombre_articulo}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {articulo.categoria} • {articulo.subcategoria}
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
          {/* SECCIÓN DE ESTADO - Rediseñada */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              borderRadius: "12px",
              bgcolor: colors.bgContainer,
              border: `1px solid ${colors.primary[500]}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  backgroundColor: getEstadoColor() + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: getEstadoColor(),
                }}
              >
                {getEstadoIcono()}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: colors.grey[500] }}>
                  Estado del artículo
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: getEstadoColor() }}
                  >
                    {getEstadoTexto()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                    •
                  </Typography>

                  <Chip
                    label={articulo.condicion_actual || "Sin condición"}
                    size="small"
                    sx={{
                      backgroundColor:
                        articulo.condicion_actual === "excelente"
                          ? COLOR_DISPONIBLE + "20"
                          : articulo.condicion_actual === "bueno"
                            ? COLOR_ASIGNADO + "20"
                            : colors.grey[600] + "20",
                      color:
                        articulo.condicion_actual === "excelente"
                          ? COLOR_DISPONIBLE
                          : articulo.condicion_actual === "bueno"
                            ? COLOR_ASIGNADO
                            : colors.grey[300],
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Información básica */}
          {infoBasica.length > 0 && (
            <Section title="Información básica" icon={<Tag />}>
              {infoBasica.map((campo, index) => (
                <InfoRow
                  key={index}
                  icon={campo.icon}
                  label={campo.label}
                  value={campo.value}
                />
              ))}
            </Section>
          )}

          <Grid container spacing={2}>
            {/* Columna izquierda */}
            <Grid item xs={12} md={6}>
              {/* Ubicación */}
              {infoUbicacion.length > 0 && (
                <Section title="Ubicación" icon={<LocationOn />}>
                  {infoUbicacion.map((campo, index) => (
                    <InfoRow
                      key={index}
                      icon={campo.icon}
                      label={campo.label}
                      value={campo.value}
                    />
                  ))}
                </Section>
              )}
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={6}>
              {/* Adquisición */}
              {infoAdquisicion.length > 0 && (
                <Section title="Adquisición" icon={<AttachMoney />}>
                  {infoAdquisicion.map((campo, index) => (
                    <InfoRow
                      key={index}
                      icon={campo.icon}
                      label={campo.label}
                      value={campo.value}
                    />
                  ))}
                </Section>
              )}
            </Grid>
          </Grid>

          {/* Usuario asignado */}
          {articulo.id_usuario && usuarioData && (
            <Section title="Asignado a" icon={<Person />}>
              <Box sx={{ gridColumn: "span 2", mb: 1 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar
                    src={usuarioData?.imagen_usuario}
                    sx={{ width: 48, height: 48, bgcolor: colors.primary[600] }}
                  >
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: COLOR_TEXTO }}
                    >
                      {articulo.usuario}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: colors.grey[400] }}
                    >
                      ID: {articulo.id_usuario}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {usuarioData?.email_usuario_asignado && (
                <InfoRow
                  icon={<Email />}
                  label="Email"
                  value={usuarioData.email_usuario_asignado}
                />
              )}
              {usuarioData?.curp_usuario_asignado && (
                <InfoRow
                  icon={<Badge />}
                  label="CURP"
                  value={usuarioData.curp_usuario_asignado}
                />
              )}
            </Section>
          )}

          {/* Especificaciones técnicas */}
          {infoEspecifica.length > 0 && (
            <Section title="Especificaciones técnicas" icon={<Memory />}>
              {infoEspecifica.map((campo, index) => (
                <InfoRow
                  key={index}
                  icon={campo.icon}
                  label={campo.label}
                  value={campo.value}
                />
              ))}
            </Section>
          )}

          {/* Fotos */}
          {articulo.fotos?.length > 0 && (
            <Section
              title={`Fotos (${articulo.fotos.length})`}
              icon={<PhotoLibrary />}
            >
              <Box
                sx={{
                  gridColumn: "span 2",
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {articulo.fotos.map((foto, index) => (
                  <Tooltip key={index} title="Ver ampliada">
                    <Box
                      component="img"
                      src={foto.url_imagen}
                      alt={`Foto ${index + 1}`}
                      onClick={() => handleFotoClick(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "6px",
                        objectFit: "cover",
                        border: `1px solid ${COLOR_BORDE}`,
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        },
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Section>
          )}

          {/* Observaciones */}
          {articulo.observaciones && (
            <Section title="Observaciones" icon={<Description />}>
              <Box sx={{ gridColumn: "span 2" }}>
                <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                  {articulo.observaciones}
                </Typography>
              </Box>
            </Section>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: COLOR_FONDO,
            p: 2,
            borderTop: `1px solid ${COLOR_BORDE}`,
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose} sx={{ color: colors.grey[400] }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Visor de fotos ampliadas */}
      <FotoAmpliadaDialog
        open={Boolean(fotoAmpliada)}
        foto={fotoAmpliada}
        onClose={() => setFotoAmpliada(null)}
        onDownload={descargarFoto}
        onNext={handleNextFoto}
        onPrev={handlePrevFoto}
        totalFotos={articulo.fotos?.length || 0}
        index={fotoAmpliadaIndex}
      />
    </>
  );
};

export default InventoryDetailDialog;
