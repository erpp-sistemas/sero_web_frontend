// src/components/CoordinatorMonitor/GestorDetallesDialog.jsx
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
  Card,
  CardMedia,
  Tooltip,
  Badge,
  Zoom,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Download,
  Person,
  AssignmentOutlined,
  CheckCircle,
  Warning,
  Error,
  Apps,
  PhotoCamera,
  PhotoLibrary,
  Home,
  Verified,
  Download as DownloadIcon,
  ExpandMore,
  ExpandLess,
  Visibility,
  ArrowForward,
  ArrowBack,
  Place as GpsIcon,
  Image as ImageIcon,
  House as HouseIcon,
  Description as DescriptionIcon,
  Photo as PhotoIcon,
  MoreVert,
  Edit,
  Delete,
  AddPhotoAlternate,
  Save,
  Cancel,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import * as ExcelJS from "exceljs";
import { TIPOS_FOTO } from "../../../constants/catalogos";
import {
  insertFotoRequest,
  updateFotoRequest,
  deleteFotoRequest,
  fileToBase64,
} from "../../../api/photo";
import { useSelector } from "react-redux";

// 🔹 Componente para vista modal ampliada de foto
const FotoAmpliadaDialog = ({
  open,
  foto,
  onClose,
  onDownload,
  onNext,
  onPrev,
  onEdit,
  onDelete,
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
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "min(90vw, 900px)", // ← Limitar ancho máximo
          maxHeight: "min(90vh, 700px)", // ← Limitar altura máxima
          margin: "auto",
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
          <Box
            sx={{
              backgroundColor:
                foto.tipo === "FACHADA"
                  ? colors.greenAccent[900]
                  : colors.blueAccent[900],
              borderRadius: "8px",
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {foto.tipo === "FACHADA" ? (
              <HouseIcon
                sx={{ color: colors.greenAccent[300], fontSize: 20 }}
              />
            ) : (
              <DescriptionIcon
                sx={{ color: colors.blueAccent[300], fontSize: 20 }}
              />
            )}
            <Typography
              variant="subtitle2"
              sx={{ color: colors.grey[100], fontWeight: 600 }}
            >
              {foto.tipo === "FACHADA" ? "Fachada" : "Evidencia"}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {foto.cuenta}
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
          <Tooltip title="Editar foto">
            <IconButton
              onClick={() => onEdit(foto)}
              sx={{ color: colors.grey[100] }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar foto">
            <IconButton
              onClick={() => onDelete(foto)}
              sx={{ color: colors.grey[100] }}
            >
              <Delete />
            </IconButton>
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
            p: 2,
          }}
        >
          <img
            src={foto.urlImagen || foto.url}
            alt={foto.nombreFoto || foto.descripcion}
            style={{
              maxWidth: "100%",
              maxHeight: "calc(90vh - 180px)", // ← Altura dinámica
              borderRadius: "12px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              objectFit: "contain",
              backgroundColor: colors.primary[900],
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.75)",
              borderRadius: "24px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              backdropFilter: "blur(8px)",
            }}
          >
            {foto.verificada && (
              <Tooltip title="Verificada">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: colors.greenAccent[800],
                    borderRadius: "12px",
                    p: "4px 8px",
                  }}
                >
                  <Verified
                    sx={{ fontSize: 16, color: colors.greenAccent[300] }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: colors.grey[100], fontWeight: 500 }}
                  >
                    Verificada
                  </Typography>
                </Box>
              </Tooltip>
            )}
            <Typography variant="caption" sx={{ color: colors.grey[300] }}>
              {foto.nombreFoto || "Sin nombre"}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.grey[500] }}>
              {new Date(foto.fechaCaptura || foto.fecha).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// 🔹 Componente para editar/agregar foto - VERSIÓN OPTIMIZADA
const FotoEditorDialog = ({
  open,
  onClose,
  onSave,
  foto,
  modo,
  cuenta,
  fechaRegistro,
  existingFechasCaptura = [],
  colors,
  COLOR_TEXTO,
  COLOR_FONDO,
  COLOR_BORDE,
}) => {
  const theme = useTheme();
  const themeColors = colors || tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    tipo: "Evidencia",
    fechaCaptura: "",
    horaCaptura: "",
  });

  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Función para generar nombre de foto basado en cuenta + fecha
  const generarNombreFoto = (fecha) => {
    return `${cuenta}${fecha.toISOString()}`;
  };

  // Función para generar hora sugerida (basada en la última foto + 1 minuto)
  const generarHoraSugerida = (fechasExistentes, fechaBase) => {
    if (!fechasExistentes || fechasExistentes.length === 0) {
      const fechaSugerida = new Date(fechaBase);
      fechaSugerida.setMinutes(fechaSugerida.getMinutes() + 18);
      return fechaSugerida;
    }

    const fechasExistentesDate = fechasExistentes.map((f) => new Date(f));
    const fechaMasReciente = new Date(Math.max(...fechasExistentesDate));
    fechaMasReciente.setMinutes(fechaMasReciente.getMinutes() + 1);

    return fechaMasReciente;
  };

  // Cargar datos al abrir el diálogo
  useEffect(() => {
    if (open) {
      if (foto && modo === "editar") {
        // Normalizar el tipo de foto (capitalizado)
        let tipoNormalizado = "Evidencia";
        const tipoOriginal = (foto.tipo || "").toUpperCase();
        if (tipoOriginal === "FACHADA" || tipoOriginal === "FACHADA PREDIO") {
          tipoNormalizado = "Fachada predio";
        } else if (tipoOriginal === "EVIDENCIA") {
          tipoNormalizado = "Evidencia";
        } else if (foto.tipo === "Fachada predio") {
          tipoNormalizado = "Fachada predio";
        }

        const fechaCaptura = new Date(foto.fechaCaptura);
        setFormData({
          tipo: tipoNormalizado,
          fechaCaptura: fechaCaptura.toISOString().slice(0, 10),
          horaCaptura: fechaCaptura.toTimeString().slice(0, 8),
        });
        setImagenPreview(foto.urlImagen || foto.url || null);
        setImagenFile(null);
      } else if (modo === "agregar") {
        const fechaBase = fechaRegistro ? new Date(fechaRegistro) : new Date();
        const fechaSugerida = generarHoraSugerida(
          existingFechasCaptura,
          fechaBase,
        );

        setFormData({
          tipo: "Evidencia",
          fechaCaptura: fechaSugerida.toISOString().slice(0, 10),
          horaCaptura: fechaSugerida.toTimeString().slice(0, 8),
        });
        setImagenPreview(null);
        setImagenFile(null);
      }
      setErrors({});
    }
  }, [foto, modo, cuenta, fechaRegistro, open, existingFechasCaptura]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validar que la hora no duplique una existente
  const validarHoraUnica = (fechaCapturaStr, horaStr, fechasExistentes) => {
    const fechaHoraSeleccionada = new Date(`${fechaCapturaStr}T${horaStr}`);

    for (const fechaExistente of fechasExistentes) {
      const fechaExistenteDate = new Date(fechaExistente);
      if (
        Math.abs(
          fechaExistenteDate.getTime() - fechaHoraSeleccionada.getTime(),
        ) < 1000
      ) {
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        imagen: "Solo se permiten archivos de imagen",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imagen: "La imagen no debe exceder los 10MB",
      }));
      return;
    }

    setCargandoImagen(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result);
      setImagenFile(file);
      setCargandoImagen(false);
      if (errors.imagen) {
        setErrors((prev) => ({ ...prev, imagen: null }));
      }
    };
    reader.onerror = () => {
      setCargandoImagen(false);
      setErrors((prev) => ({ ...prev, imagen: "Error al leer el archivo" }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagenPreview(null);
    setImagenFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // En edición, la imagen es opcional (puede mantener la existente)
    if (!imagenFile && modo === "agregar") {
      newErrors.imagen = "La imagen es requerida";
    }
    if (!formData.tipo) {
      newErrors.tipo = "El tipo de foto es requerido";
    }
    if (!formData.fechaCaptura) {
      newErrors.fechaCaptura = "La fecha es requerida";
    }
    if (!formData.horaCaptura) {
      newErrors.horaCaptura = "La hora es requerida";
    }

    // Validar hora única (solo en agregar)
    if (modo === "agregar" && existingFechasCaptura.length > 0) {
      const esUnica = validarHoraUnica(
        formData.fechaCaptura,
        formData.horaCaptura,
        existingFechasCaptura,
      );
      if (!esUnica) {
        newErrors.horaCaptura =
          "Ya existe una foto con esta hora. Por favor, selecciona una hora diferente.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setEnviando(true);

    try {
      // Combinar fecha y hora
      const fechaCapturaCompleta = new Date(
        `${formData.fechaCaptura}T${formData.horaCaptura}`,
      );

      // Generar nombre de foto automáticamente
      const nombreFoto = generarNombreFoto(fechaCapturaCompleta);

      // Convertir imagen a base64 si existe una nueva imagen seleccionada
      let imagenBase64 = null;
      if (imagenFile) {
        imagenBase64 = await fileToBase64(imagenFile);
        console.log("📸 Nueva imagen seleccionada, convertida a base64");
      } else if (modo === "editar" && !imagenFile) {
        console.log(
          "📸 Manteniendo imagen existente, no se envía nueva imagen",
        );
      }

      // Capitalizar el tipo para enviar a BD
      const tipoCapitalizado =
        formData.tipo === "Fachada predio" ? "FACHADA" : "EVIDENCIA";

      const datosParaGuardar = {
        nombreFoto: nombreFoto,
        tipo: tipoCapitalizado,
        fechaCaptura: fechaCapturaCompleta.toISOString(),
        imagenBase64: imagenBase64, // Si es null, el backend mantendrá la imagen existente
        urlImagenExistente: modo === "editar" ? foto?.urlImagen : null,
        idRegistroFotoExistente:
          modo === "editar" ? foto?.idRegistroFoto : null,
      };

      console.log("📤 Enviando datos para edición:", {
        tieneNuevaImagen: !!imagenBase64,
        idRegistroFoto: datosParaGuardar.idRegistroFotoExistente,
        nombreFoto: datosParaGuardar.nombreFoto,
      });

      await onSave(datosParaGuardar);
    } catch (error) {
      console.error("❌ Error al preparar datos:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!enviando ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLOR_FONDO,
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: COLOR_FONDO,
          borderBottom: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: themeColors.blueAccent[500] + "10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {modo === "agregar" ? (
              <AddPhotoAlternate
                sx={{ color: themeColors.blueAccent[400], fontSize: 20 }}
              />
            ) : (
              <Edit sx={{ color: themeColors.blueAccent[400], fontSize: 20 }} />
            )}
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: COLOR_TEXTO,
                fontWeight: 500,
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
              }}
            >
              {modo === "agregar" ? "Nueva foto" : "Editar foto"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: themeColors.grey[500],
                display: "block",
                mt: 0.25,
              }}
            >
              {cuenta}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={enviando}
          sx={{ color: themeColors.grey[400], mt: -0.5 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1, backgroundColor: COLOR_FONDO }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Área de imagen */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: themeColors.grey[500],
                display: "block",
                mb: 1,
                fontWeight: 500,
                textTransform: "uppercase",
                fontSize: "0.65rem",
                letterSpacing: "0.02em",
              }}
            >
              {modo === "agregar" ? "Imagen" : "Imagen actual"}
            </Typography>

            {!imagenPreview ? (
              <Box
                onClick={() => !enviando && fileInputRef.current?.click()}
                sx={{
                  width: "100%",
                  height: 160,
                  border: `2px dashed ${errors.imagen ? themeColors.redAccent[400] : COLOR_BORDE}`,
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  cursor: enviando ? "not-allowed" : "pointer",
                  opacity: enviando ? 0.6 : 1,
                  backgroundColor: themeColors.primary[800] + "30",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: !enviando
                      ? themeColors.blueAccent[400]
                      : COLOR_BORDE,
                    backgroundColor: !enviando
                      ? themeColors.primary[800] + "50"
                      : themeColors.primary[800] + "30",
                  },
                }}
              >
                {cargandoImagen ? (
                  <>
                    <CircularProgress
                      size={32}
                      sx={{ color: themeColors.blueAccent[400] }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: themeColors.grey[500] }}
                    >
                      Procesando imagen...
                    </Typography>
                  </>
                ) : (
                  <>
                    <PhotoCamera
                      sx={{ color: themeColors.grey[500], fontSize: 32 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: themeColors.grey[500] }}
                    >
                      Haz clic para seleccionar imagen
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: themeColors.grey[600] }}
                    >
                      JPG, PNG, GIF hasta 10MB
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: themeColors.primary[900],
                  border: `1px solid ${COLOR_BORDE}`,
                }}
              >
                <img
                  src={imagenPreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                {!enviando && (
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.8)",
                      },
                    }}
                    size="small"
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={enviando}
              style={{ display: "none" }}
            />
            {errors.imagen && (
              <Typography
                variant="caption"
                sx={{
                  color: themeColors.redAccent[400],
                  mt: 0.5,
                  display: "block",
                  ml: 0.5,
                }}
              >
                {errors.imagen}
              </Typography>
            )}
          </Box>

          {/* Tipo de foto - chips minimalistas */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: themeColors.grey[500],
                display: "block",
                mb: 1,
                ml: 0.5,
                fontWeight: 500,
                textTransform: "uppercase",
                fontSize: "0.65rem",
                letterSpacing: "0.02em",
              }}
            >
              Tipo de foto
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {TIPOS_FOTO.map((tipo) => (
                <Box
                  key={tipo.value}
                  onClick={() =>
                    !enviando &&
                    setFormData((prev) => ({ ...prev, tipo: tipo.value }))
                  }
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: "30px",
                    backgroundColor:
                      formData.tipo === tipo.value
                        ? tipo.value === "Fachada predio"
                          ? themeColors.greenAccent[500] + "15"
                          : themeColors.blueAccent[500] + "15"
                        : "transparent",
                    border: `1px solid ${
                      formData.tipo === tipo.value
                        ? tipo.value === "Fachada predio"
                          ? themeColors.greenAccent[500]
                          : themeColors.blueAccent[500]
                        : COLOR_BORDE
                    }`,
                    color:
                      formData.tipo === tipo.value
                        ? tipo.value === "Fachada predio"
                          ? themeColors.greenAccent[300]
                          : themeColors.blueAccent[300]
                        : themeColors.grey[400],
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: enviando ? "not-allowed" : "pointer",
                    opacity: enviando ? 0.6 : 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor:
                        !enviando && formData.tipo === tipo.value
                          ? tipo.value === "Fachada predio"
                            ? themeColors.greenAccent[500] + "25"
                            : themeColors.blueAccent[500] + "25"
                          : !enviando
                            ? themeColors.primary[700] + "30"
                            : "transparent",
                    },
                  }}
                >
                  {tipo.label}
                </Box>
              ))}
            </Box>
            {errors.tipo && (
              <Typography
                variant="caption"
                sx={{
                  color: themeColors.redAccent[400],
                  mt: 0.5,
                  display: "block",
                  ml: 0.5,
                }}
              >
                {errors.tipo}
              </Typography>
            )}
          </Box>

          {/* Fecha y hora de captura */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: themeColors.grey[500],
                display: "block",
                mb: 1,
                ml: 0.5,
                fontWeight: 500,
                textTransform: "uppercase",
                fontSize: "0.65rem",
                letterSpacing: "0.02em",
              }}
            >
              Fecha y hora de captura
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Fecha - siempre deshabilitada */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: themeColors.grey[500],
                    display: "block",
                    mb: 0.5,
                    ml: 0.5,
                    fontSize: "0.7rem",
                  }}
                >
                  Fecha
                </Typography>
                <TextField
                  type="date"
                  value={formData.fechaCaptura}
                  disabled={true}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiInputLabel-root": { color: themeColors.grey[400] },
                    "& .MuiOutlinedInput-root": {
                      color: COLOR_TEXTO,
                      "& fieldset": { borderColor: COLOR_BORDE },
                      "&.Mui-disabled": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: themeColors.primary[700],
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Hora - editable */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: themeColors.grey[500],
                    display: "block",
                    mb: 0.5,
                    ml: 0.5,
                    fontSize: "0.7rem",
                  }}
                >
                  Hora
                </Typography>
                <TextField
                  type="time"
                  value={formData.horaCaptura}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      horaCaptura: e.target.value,
                    }));
                    if (errors.horaCaptura) {
                      setErrors((prev) => ({ ...prev, horaCaptura: null }));
                    }
                  }}
                  disabled={enviando}
                  fullWidth
                  size="small"
                  error={!!errors.horaCaptura}
                  helperText={errors.horaCaptura}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 1,
                  }}
                  sx={{
                    "& .MuiInputLabel-root": { color: themeColors.grey[400] },
                    "& .MuiOutlinedInput-root": {
                      color: COLOR_TEXTO,
                      "& fieldset": { borderColor: COLOR_BORDE },
                      "&:hover fieldset": {
                        borderColor: themeColors.blueAccent[400],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: themeColors.blueAccent[400],
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${COLOR_BORDE}`,
          p: 2.5,
          gap: 1,
          backgroundColor: COLOR_FONDO,
        }}
      >
        <Button
          onClick={onClose}
          disabled={enviando}
          sx={{
            color: themeColors.grey[400],
            textTransform: "none",
            fontWeight: 400,
            "&:hover": {
              backgroundColor: themeColors.primary[400] + "20",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={enviando || cargandoImagen}
          sx={{
            backgroundColor: themeColors.blueAccent[600],
            color: themeColors.grey[100],
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            minWidth: 140,
            "&:hover": {
              backgroundColor: themeColors.blueAccent[700],
            },
            "&.Mui-disabled": {
              backgroundColor: themeColors.primary[600],
              color: themeColors.grey[500],
            },
          }}
        >
          {enviando ? (
            <>
              <CircularProgress
                size={16}
                sx={{ color: themeColors.grey[100], mr: 1 }}
              />
              {modo === "agregar" ? "Agregando..." : "Guardando..."}
            </>
          ) : cargandoImagen ? (
            "Procesando imagen..."
          ) : modo === "agregar" ? (
            "Agregar foto"
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 🔹 Componente para confirmar eliminación
const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  foto,
  colors,
  COLOR_FONDO,
  COLOR_BORDE,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLOR_FONDO,
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${COLOR_BORDE}`,
          p: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: colors.redAccent[400], fontWeight: 600 }}
        >
          Confirmar eliminación
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ color: colors.grey[300] }}>
            ¿Estás seguro de que deseas eliminar esta foto?
          </Typography>
          {foto && (
            <Box
              sx={{
                p: 2,
                backgroundColor: colors.bgContainerSecondary,
                borderRadius: "8px",
                border: `1px solid ${COLOR_BORDE}`,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                <strong>Nombre:</strong> {foto.nombreFoto || "Sin nombre"}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                <strong>Tipo:</strong>{" "}
                {foto.tipo === "FACHADA" ? "Fachada predio" : "Evidencia"}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                <strong>Cuenta:</strong> {foto.cuenta}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${COLOR_BORDE}`,
          p: 2.5,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: colors.grey[400],
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          startIcon={<Delete />}
          sx={{
            backgroundColor: colors.redAccent[600],
            color: colors.grey[100],
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.redAccent[700],
            },
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 🔹 Componente ChipContadorFoto
const ChipContadorFoto = ({
  tipo,
  cantidad,
  COLOR_EFICIENTE,
  COLOR_REGULAR,
  icono,
  tooltipTitle,
}) => {
  const tieneFotos = cantidad > 0;

  return (
    <Tooltip
      title={
        tooltipTitle ||
        `${cantidad} ${tipo === "FACHADA" ? "fachada" : "evidencia"}${cantidad !== 1 ? "s" : ""}`
      }
    >
      <Chip
        label={cantidad}
        size="small"
        icon={icono}
        sx={{
          backgroundColor: tieneFotos
            ? COLOR_EFICIENTE + "20"
            : COLOR_REGULAR + "20",
          color: tieneFotos ? COLOR_EFICIENTE : COLOR_REGULAR,
          fontSize: "0.7rem",
          minWidth: 40,
          height: 22,
          "& .MuiChip-icon": {
            fontSize: "0.8rem",
            marginLeft: "4px",
            marginRight: "2px",
          },
          "& .MuiChip-label": {
            px: 0.5,
          },
        }}
      />
    </Tooltip>
  );
};

// 🔹 Componente para mini galería inline - CON BOTÓN DE AGREGAR MINIMALISTA
const MiniGaleria = ({
  fotos,
  cuenta,
  onImageClick,
  onEditFoto,
  onDeleteFoto,
  onAgregarFoto,
  startingIndex = 0,
  COLOR_EFICIENTE,
  COLOR_REGULAR,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFoto, setSelectedFoto] = useState(null);

  const fotosFachada = fotos.filter((f) => f.tipo === "FACHADA");
  const fotosEvidencia = fotos.filter((f) => f.tipo === "EVIDENCIA");
  const todasLasFotos = [...fotosFachada, ...fotosEvidencia];
  const tieneFotos = todasLasFotos.length > 0;

  const fotosParaMostrar = todasLasFotos.slice(0, 4);
  const fotosRestantes = todasLasFotos.length - 4;

  const handleMenuOpen = (event, foto) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedFoto(foto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFoto(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (selectedFoto) {
      onEditFoto(selectedFoto);
    }
  };

  const handleDelete = () => {
    handleMenuClose();
    if (selectedFoto) {
      onDeleteFoto(selectedFoto);
    }
  };

  return (
    <Box>
      {/* Contadores de fotos */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          justifyContent: "center",
        }}
      >
        <ChipContadorFoto
          tipo="FACHADA"
          cantidad={fotosFachada.length}
          COLOR_EFICIENTE={COLOR_EFICIENTE}
          COLOR_REGULAR={COLOR_REGULAR}
          icono={<HouseIcon sx={{ fontSize: 12 }} />}
        />

        <ChipContadorFoto
          tipo="EVIDENCIA"
          cantidad={fotosEvidencia.length}
          COLOR_EFICIENTE={COLOR_EFICIENTE}
          COLOR_REGULAR={COLOR_REGULAR}
          icono={<DescriptionIcon sx={{ fontSize: 12 }} />}
        />
      </Box>

      {/* Galería de fotos + Botón agregar minimalista */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1,
          backgroundColor: colors.bgContainerSecondary,
          borderRadius: "12px",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colors.primary[600],
            borderRadius: 2,
          },
        }}
      >
        {/* Botón para agregar foto - ESTILO MINIMALISTA */}
        <Tooltip title="Agregar foto" arrow>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              cursor: "pointer",
              backgroundColor: "transparent",
              border: `1px dashed ${colors.primary[500]}`,
              transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
              flexShrink: 0,
              "&:hover": {
                borderColor: colors.blueAccent[400],
                backgroundColor: colors.blueAccent[400] + "08",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => onAgregarFoto()}
          >
            <AddPhotoAlternate
              sx={{
                color: colors.grey[500],
                fontSize: 20,
                transition: "color 0.2s ease",
                ".MuiBox-root:hover &": {
                  color: colors.blueAccent[400],
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: colors.grey[500],
                fontSize: "0.65rem",
                fontWeight: 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s ease",
                ".MuiBox-root:hover &": {
                  color: colors.blueAccent[400],
                },
              }}
            >
              Agregar
            </Typography>
          </Box>
        </Tooltip>

        {/* Mostrar fotos existentes */}
        {!tieneFotos ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 2,
              color: colors.grey[500],
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem", letterSpacing: "0.01em" }}
            >
              Sin fotos registradas
            </Typography>
          </Box>
        ) : (
          <>
            {fotosParaMostrar.map((foto, index) => {
              const imagenUrl = foto.urlImagen || foto.url;
              const esFachada = foto.tipo === "FACHADA";

              return (
                <Box key={foto.id} sx={{ position: "relative", flexShrink: 0 }}>
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="caption" display="block">
                          {esFachada ? "Fachada predio" : "Evidencia"}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ fontSize: "0.65rem", color: colors.grey[100] }}
                        >
                          {new Date(foto.fechaCaptura).toLocaleString("es-MX", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })}
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Card
                      sx={{
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        width: 72,
                        height: 72,
                        border: `1px solid ${esFachada ? colors.greenAccent[700] : colors.blueAccent[700]}`,
                        transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          "& .foto-actions": {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={() => onImageClick(startingIndex + index)}
                    >
                      <CardMedia
                        component="img"
                        height="72"
                        image={imagenUrl}
                        alt={foto.nombreFoto || `Foto ${index + 1}`}
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          backgroundColor: colors.primary[900],
                        }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/72/${esFachada ? "1b5e20" : "0d47a1"}/ffffff?text=${esFachada ? "F" : "E"}`;
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                        }}
                      >
                        {foto.verificada && (
                          <Tooltip title="Verificada" arrow>
                            <Verified
                              sx={{
                                fontSize: 12,
                                color: colors.greenAccent[500],
                                filter:
                                  "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: "4px",
                          width: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        {esFachada ? (
                          <HouseIcon
                            sx={{
                              fontSize: 10,
                              color: colors.greenAccent[300],
                            }}
                          />
                        ) : (
                          <DescriptionIcon
                            sx={{ fontSize: 10, color: colors.blueAccent[300] }}
                          />
                        )}
                      </Box>

                      {/* Botón de acciones al hacer hover */}
                      <Box
                        className="foto-actions"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          zIndex: 10,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, foto)}
                          sx={{
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: "2px",
                            width: 20,
                            height: 20,
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 12,
                            },
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Card>
                  </Tooltip>
                </Box>
              );
            })}

            {fotosRestantes > 0 && (
              <Tooltip title={`${fotosRestantes} fotos más`} arrow>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    backgroundColor: colors.primary[800],
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${colors.primary[600]}`,
                    cursor: "pointer",
                    flexDirection: "column",
                    gap: 0.5,
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: colors.primary[700],
                      transform: "scale(1.02)",
                    },
                  }}
                  onClick={() => onImageClick(startingIndex + 4)}
                >
                  <PhotoIcon sx={{ fontSize: 18, color: colors.grey[400] }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.grey[400],
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  >
                    +{fotosRestantes}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </>
        )}
      </Box>

      {/* Menú de acciones para fotos */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.bgContainer,
            border: `1px solid ${colors.primary[700]}`,
            borderRadius: "10px",
            minWidth: 150,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            color: colors.grey[300],
            fontSize: "0.8rem",
            py: 0.75,
            "&:hover": {
              backgroundColor: colors.primary[700] + "40",
            },
          }}
        >
          <ListItemIcon>
            <Edit sx={{ color: colors.blueAccent[400], fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText
            sx={{ "& .MuiTypography-root": { fontSize: "0.8rem" } }}
          >
            Editar
          </ListItemText>
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.primary[700], my: 0.5 }} />
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: colors.grey[300],
            fontSize: "0.8rem",
            py: 0.75,
            "&:hover": {
              backgroundColor: colors.redAccent[800] + "40",
            },
          }}
        >
          <ListItemIcon>
            <Delete sx={{ color: colors.redAccent[400], fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText
            sx={{ "& .MuiTypography-root": { fontSize: "0.8rem" } }}
          >
            Eliminar
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// 🔹 Componente CardResumenDialog
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
  onUsuarioUpdate,
  placeId = null, // ← Nueva prop
  servicioId = null, // ← Nueva prop
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
  const user = useSelector((state) => state.user);

  const userIdSession = user?.user_id || null;
  
  console.log("user en dialog:", user);
  console.log("userIdSession extraído:", userIdSession);
  
  // Validación
  if (!userIdSession && open) {
    console.warn("⚠️ No se pudo obtener el user_id desde Redux. La bitácora no registrará quién hizo la acción.");
  }

  // Usar props o valores por defecto
  const COLOR_TEXTO = COLOR_TEXTO_PROPS || colors.grey[100];
  const COLOR_FONDO = COLOR_FONDO_PROPS || colors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || colors.primary[500];
  const COLOR_EFICIENTE = COLOR_EFICIENTE_PROPS || colors.accentGreen[100];
  const COLOR_REGULAR = COLOR_REGULAR_PROPS || colors.yellowAccent[400];
  const COLOR_ATENCION = COLOR_ATENCION_PROPS || colors.redAccent[400];
  const COLOR_TODOS_ACTIVE = colors.blueAccent[600];
  const COLOR_TODOS_INACTIVE = colors.primary[400];

  // 🔹 Estados principales
  const [filtroMotivo, setFiltroMotivo] = useState("TODOS");
  const [paginaGestiones, setPaginaGestiones] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [gestionExpandida, setGestionExpandida] = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [fotoAmpliadaIndex, setFotoAmpliadaIndex] = useState(0);

  // 🔹 Estados para edición de fotos
  const [fotoEditando, setFotoEditando] = useState(null);
  const [modoEditor, setModoEditor] = useState(null);
  const [gestionSeleccionada, setGestionSeleccionada] = useState(null);
  const [fotoEliminar, setFotoEliminar] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // 🔹 Estado para loading y notificaciones
  const [cargandoGuardado, setCargandoGuardado] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // 🔹 Ref para seguimiento
  const usuarioAnteriorRef = useRef(null);

  const fechasCapturaExistentes = useMemo(() => {
    if (!gestionSeleccionada?.fotos) return [];
    return gestionSeleccionada.fotos.map((f) => f.fechaCaptura).filter(Boolean);
  }, [gestionSeleccionada]);

  console.log("usuario", usuario);

  // 🔹 FUNCIONES AUXILIARES
  const normalizarMotivo = (motivo) => {
    if (!motivo || motivo === "COMPLETA" || motivo === "null") {
      return "COMPLETA";
    }
    return motivo;
  };

  const formatMotivoGestion = (motivo) => {
    if (motivo === "TODOS") return "Todos";

    const motivoNormalizado = normalizarMotivo(motivo);

    if (motivoNormalizado === "COMPLETA") return "Completa";

    const formatos = {
      SIN_GPS_Y_SIN_FOTOS: "Sin GPS y sin fotos",
      SIN_GPS_Y_FALTA_FOTO_FACHADA: "Sin GPS y falta foto fachada",
      SIN_GPS_Y_FALTA_FOTO_EVIDENCIA: "Sin GPS y falta foto evidencia",
      SIN_GPS: "Sin GPS",
      FALTAN_AMBAS_FOTOS: "Faltan ambas fotos",
      FALTA_FOTO_FACHADA: "Falta foto fachada",
      FALTA_FOTO_EVIDENCIA: "Falta foto evidencia",
    };

    return (
      formatos[motivoNormalizado] ||
      motivoNormalizado.replace(/_/g, " ").toLowerCase()
    );
  };

  const getColorMotivo = (motivo) => {
    if (motivo === "TODOS") {
      return filtroMotivo === "TODOS"
        ? COLOR_TODOS_ACTIVE
        : COLOR_TODOS_INACTIVE;
    }

    const motivoNormalizado = normalizarMotivo(motivo);

    if (motivoNormalizado === "COMPLETA") return COLOR_EFICIENTE;
    if (motivoNormalizado.includes("GPS")) return COLOR_ATENCION;
    if (motivoNormalizado.includes("FOTO")) return COLOR_REGULAR;
    return COLOR_REGULAR;
  };

  const getIconoMotivo = (motivo) => {
    if (motivo === "TODOS") {
      const color =
        filtroMotivo === "TODOS" ? COLOR_TODOS_ACTIVE : COLOR_TODOS_INACTIVE;
      return <Apps sx={{ color }} />;
    }

    const motivoNormalizado = normalizarMotivo(motivo);

    if (motivoNormalizado === "COMPLETA")
      return <CheckCircle sx={{ color: COLOR_EFICIENTE }} />;

    if (motivoNormalizado.includes("GPS"))
      return <Error sx={{ color: COLOR_ATENCION }} />;
    if (motivoNormalizado.includes("FOTO"))
      return <Warning sx={{ color: COLOR_REGULAR }} />;

    return <Warning sx={{ color: COLOR_REGULAR }} />;
  };

  const getColorEstado = (estado) => {
    if (estado === "COMPLETA") return COLOR_EFICIENTE;
    if (estado === "INCOMPLETA") return COLOR_REGULAR;
    return COLOR_ATENCION;
  };

  // 🔹 Calcular gestiones filtradas
  const gestionesFiltradas = useMemo(() => {
    if (!usuario?.registros) return [];

    const registros = usuario.registros || [];

    if (filtroMotivo && filtroMotivo !== "TODOS") {
      const motivoFiltroNormalizado = normalizarMotivo(filtroMotivo);

      return registros.filter(
        (registro) =>
          normalizarMotivo(registro.motivo_gestion) === motivoFiltroNormalizado,
      );
    }

    return registros;
  }, [usuario, filtroMotivo]);

  // 🔹 Resetear filtro si el motivo activo ya no tiene registros
  useEffect(() => {
    if (
      filtroMotivo !== "TODOS" &&
      gestionesFiltradas.length === 0 &&
      usuario?.registros?.length > 0
    ) {
      setFiltroMotivo("TODOS");
      setPaginaGestiones(0);
    }
  }, [filtroMotivo, gestionesFiltradas.length, usuario?.registros?.length]);

  // 🔹 Calcular páginas
  const paginatedGestiones = useMemo(() => {
    const startIndex = paginaGestiones * pageSize;
    return gestionesFiltradas.slice(startIndex, startIndex + pageSize);
  }, [gestionesFiltradas, paginaGestiones, pageSize]);

  // 🔹 Extraer todas las fotos de todas las gestiones filtradas
  const fotosFiltradas = useMemo(() => {
    const fotos = [];

    gestionesFiltradas.forEach((gestion) => {
      if (Array.isArray(gestion.fotos)) {
        gestion.fotos.forEach((foto) => {
          if (foto && typeof foto === "object" && foto.urlImagen) {
            const tipoFoto = (foto.tipo || "").toUpperCase();
            const esFachada =
              tipoFoto.includes("FACHADA") || tipoFoto.includes("PREDIO");

            fotos.push({
              id: `${getRegistroKey(gestion)}-${foto.idRegistroFoto || Date.now()}`,
              urlImagen: foto.urlImagen,
              url: foto.urlImagen,
              tipo: esFachada ? "FACHADA" : "EVIDENCIA",
              cuenta: gestion.cuenta,
              fecha: gestion.fecha,
              fechaCaptura: foto.fechaCaptura,
              nombreFoto: foto.nombreFoto,
              descripcion:
                foto.tipo || (esFachada ? "Fachada predio" : "Evidencia"),
              verificada: foto.verificada || false,
              gestionId: getRegistroKey(gestion),
              metadata: foto,
              idRegistroFoto: foto.idRegistroFoto,
            });
          }
        });
      }
    });

    return fotos;
  }, [gestionesFiltradas]);

  // 🔹 Extraer todas las fotos de todas las gestiones (para el total)
  const todasLasFotos = useMemo(() => {
    const fotos = [];

    (usuario?.registros || []).forEach((gestion) => {
      if (Array.isArray(gestion.fotos)) {
        gestion.fotos.forEach((foto) => {
          if (foto && typeof foto === "object" && foto.urlImagen) {
            const tipoFoto = (foto.tipo || "").toUpperCase();
            const esFachada =
              tipoFoto.includes("FACHADA") || tipoFoto.includes("PREDIO");

            fotos.push({
              id: `${getRegistroKey(gestion)}-${foto.idRegistroFoto || Date.now()}`,
              urlImagen: foto.urlImagen,
              url: foto.urlImagen,
              tipo: esFachada ? "FACHADA" : "EVIDENCIA",
              cuenta: gestion.cuenta,
              fecha: gestion.fecha,
              fechaCaptura: foto.fechaCaptura,
              nombreFoto: foto.nombreFoto,
              descripcion:
                foto.tipo || (esFachada ? "Fachada predio" : "Evidencia"),
              verificada: foto.verificada || false,
              gestionId: getRegistroKey(gestion),
              metadata: foto,
              idRegistroFoto: foto.idRegistroFoto,
            });
          }
        });
      }
    });

    return fotos;
  }, [usuario]);

  const getFotosDeGestion = (gestion) => {
    if (!gestion || !Array.isArray(gestion.fotos)) return [];

    return gestion.fotos
      .map((foto, index) => {
        const tipoFoto = (foto.tipo || "").toUpperCase();
        const esFachada =
          tipoFoto.includes("FACHADA") || tipoFoto.includes("PREDIO");

        return {
          id: `${getRegistroKey(gestion)}-${foto.idRegistroFoto || index}`,
          urlImagen: foto.urlImagen,
          url: foto.urlImagen,
          tipo: esFachada ? "FACHADA" : "EVIDENCIA",
          cuenta: gestion.cuenta,
          fecha: gestion.fecha,
          fechaCaptura: foto.fechaCaptura,
          nombreFoto: foto.nombreFoto,
          descripcion:
            foto.tipo || (esFachada ? "Fachada predio" : "Evidencia"),
          verificada: foto.verificada || false,
          metadata: foto,
          idRegistroFoto: foto.idRegistroFoto,
          gestionId: getRegistroKey(gestion),
        };
      })
      .filter((foto) => foto.urlImagen)
      .sort((a, b) => new Date(b.fechaCaptura) - new Date(a.fechaCaptura)); // Ordenar por fecha descendente
  };

  // 🔹 Función para encontrar el índice global de una foto
  const findFotoGlobalIndex = (fotoLocal, gestion) => {
    if (!fotoLocal || !gestion) return 0;

    const gestionIndex = gestionesFiltradas.findIndex(
      (g) => getRegistroKey(g) === getRegistroKey(gestion),
    );
    let fotoIndex = 0;

    for (let i = 0; i < gestionIndex; i++) {
      fotoIndex += getFotosDeGestion(gestionesFiltradas[i]).length;
    }

    const fotosDeGestion = getFotosDeGestion(gestion);
    const localIndex = fotosDeGestion.findIndex((f) => f.id === fotoLocal.id);

    return fotoIndex + localIndex;
  };

  // 🔹 Calcular motivos
  const motivosArray = useMemo(() => {
    if (!usuario?.motivos && !usuario?.registros) return [];

    const motivosContados = {};

    (usuario.registros || []).forEach((registro) => {
      const motivo = normalizarMotivo(registro.motivo_gestion);
      motivosContados[motivo] = (motivosContados[motivo] || 0) + 1;
    });

    return Object.entries(motivosContados).sort((a, b) => b[1] - a[1]);
  }, [usuario]);

  // 🔹 Obtener todos los motivos incluyendo "TODOS"
  const todosMotivosArray = useMemo(() => {
    const totalRegistros = usuario?.registros?.length || 0;
    const motivos = [["TODOS", totalRegistros]];
    return [...motivos, ...motivosArray];
  }, [usuario, motivosArray]);

  // 🔹 Manejar clic en foto
  const handleFotoClick = (foto, gestion) => {
    const globalIndex = findFotoGlobalIndex(foto, gestion);
    setFotoAmpliadaIndex(globalIndex);
    setFotoAmpliada(foto);
  };

  // 🔹 Navegar entre fotos ampliadas
  const handleNextFoto = () => {
    if (fotoAmpliadaIndex < fotosFiltradas.length - 1) {
      setFotoAmpliadaIndex(fotoAmpliadaIndex + 1);
      setFotoAmpliada(fotosFiltradas[fotoAmpliadaIndex + 1]);
    }
  };

  const handlePrevFoto = () => {
    if (fotoAmpliadaIndex > 0) {
      setFotoAmpliadaIndex(fotoAmpliadaIndex - 1);
      setFotoAmpliada(fotosFiltradas[fotoAmpliadaIndex - 1]);
    }
  };

  // 🔹 Función para manejar clic en chip
  const manejarClicChip = (motivo) => {
    setFiltroMotivo(motivo);
    setPaginaGestiones(0);
    setGestionExpandida(null);
  };

  // 🔹 Función para descargar foto individual
  const calcularEstadoYMotivo = (registro) => {
    const fotos = registro.fotos || [];
    const fotosFachada = fotos.filter((f) => {
      const tipo = (f.tipo || "").toString().toUpperCase();
      return tipo.includes("FACHADA") || tipo.includes("PREDIO");
    }).length;
    const fotosEvidencia = fotos.filter((f) => {
      const tipo = (f.tipo || "").toString().toUpperCase();
      return tipo.includes("EVIDENCIA");
    }).length;
    const tieneGPS =
      registro.tieneGPS ??
      Boolean(
        registro.latitud &&
        registro.longitud &&
        registro.latitud !== 0 &&
        registro.longitud !== 0,
      );

    let motivo = "COMPLETA";
    if (!tieneGPS) {
      if (fotosFachada === 0 && fotosEvidencia === 0) {
        motivo = "SIN_GPS_Y_SIN_FOTOS";
      } else if (fotosFachada === 0) {
        motivo = "SIN_GPS_Y_FALTA_FOTO_FACHADA";
      } else if (fotosEvidencia === 0) {
        motivo = "SIN_GPS_Y_FALTA_FOTO_EVIDENCIA";
      } else {
        motivo = "SIN_GPS";
      }
    } else {
      if (fotosFachada === 0 && fotosEvidencia === 0) {
        motivo = "FALTAN_AMBAS_FOTOS";
      } else if (fotosFachada === 0) {
        motivo = "FALTA_FOTO_FACHADA";
      } else if (fotosEvidencia === 0) {
        motivo = "FALTA_FOTO_EVIDENCIA";
      } else {
        motivo = "COMPLETA";
      }
    }

    const estado =
      registro.estatus_gestion === "INVALIDA"
        ? "INVALIDA"
        : motivo === "COMPLETA"
          ? "COMPLETA"
          : "INCOMPLETA";

    return {
      motivo_gestion: motivo,
      estatus_gestion: estado,
      fotosFachada, // Preservar para cálculos internos
      fotosEvidencia, // Preservar para cálculos internos
      totalFotos: fotos.length, // Preservar para cálculos internos
      // Campos en formato snake_case para consistencia con backend
      fotos_fachada: fotosFachada,
      fotos_evidencia: fotosEvidencia,
      total_fotos: fotos.length,
    };
  };

  function getRegistroKey(registro) {
    if (!registro) return null;

    const cuenta = registro.cuenta || "";
    const fecha =
      registro.fecha || registro.date_capture || registro.fechaCaptura || "";

    return registro.id ? registro.id : `${cuenta}-${fecha}`;
  }

  const descargarFoto = (foto) => {
    const url = foto.urlImagen || foto.url;
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = `${foto.tipo}_${foto.cuenta}_${foto.nombreFoto || new Date(foto.fecha).toISOString().split("T")[0]}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================
  // FUNCIÓN CENTRALIZADA PARA RECALCULAR REGISTRO
  // Basada en la lógica SQL proporcionada
  // ============================================

  const recalcularRegistro = (registro) => {
    // 1. Obtener fotos (asegurar array)
    const fotos = Array.isArray(registro.fotos) ? registro.fotos : [];

    // 2. Calcular conteos de fotos
    const fotosFachada = fotos.filter((foto) => {
      const tipo = (foto.tipo || "").toString().toUpperCase();
      return tipo.includes("FACHADA") || tipo.includes("PREDIO");
    }).length;

    const fotosEvidencia = fotos.filter((foto) => {
      const tipo = (foto.tipo || "").toString().toUpperCase();
      return tipo.includes("EVIDENCIA");
    }).length;

    const totalFotos = fotos.length;

    // 3. Determinar si tiene GPS válido
    const tieneGPS = Boolean(
      registro.latitud &&
      registro.longitud &&
      registro.latitud !== 0 &&
      registro.longitud !== 0,
    );

    // 4. Obtener estatus_predio (normalizar a minúsculas para comparación)
    const estatusPredio = (registro.estatus_predio || "").toLowerCase();
    const esNoLocalizado = estatusPredio !== "predio localizado";

    // 5. Aplicar lógica SQL para estatus_gestion
    let estatusGestion = "INCOMPLETA";

    if (esNoLocalizado && fotosEvidencia >= 1) {
      estatusGestion = "COMPLETA";
    } else if (esNoLocalizado && fotosEvidencia === 0) {
      estatusGestion = "INCOMPLETA";
    } else if (!tieneGPS && totalFotos === 0) {
      estatusGestion = "INVALIDA";
    } else if (fotosFachada >= 1 && fotosEvidencia >= 1 && !tieneGPS) {
      estatusGestion = "INCOMPLETA";
    } else if (tieneGPS && fotosFachada >= 1 && fotosEvidencia >= 1) {
      estatusGestion = "COMPLETA";
    } else {
      estatusGestion = "INCOMPLETA";
    }

    // 6. Aplicar lógica SQL para motivo_gestion
    let motivoGestion = null;

    if (esNoLocalizado && fotosEvidencia >= 1) {
      motivoGestion = null;
    } else if (esNoLocalizado && fotosEvidencia === 0) {
      motivoGestion = "NO_LOCALIZADO_SIN_EVIDENCIA";
    } else if (!tieneGPS && totalFotos === 0) {
      motivoGestion = "SIN_GPS_Y_SIN_FOTOS";
    } else if (!tieneGPS && fotosFachada === 0 && fotosEvidencia >= 1) {
      motivoGestion = "SIN_GPS_Y_FALTA_FOTO_FACHADA";
    } else if (!tieneGPS && fotosFachada >= 1 && fotosEvidencia === 0) {
      motivoGestion = "SIN_GPS_Y_FALTA_FOTO_EVIDENCIA";
    } else if (!tieneGPS && fotosFachada >= 1 && fotosEvidencia >= 1) {
      motivoGestion = "SIN_GPS";
    } else if (fotosFachada === 0 && fotosEvidencia === 0) {
      motivoGestion = "FALTAN_AMBAS_FOTOS";
    } else if (fotosFachada === 0) {
      motivoGestion = "FALTA_FOTO_FACHADA";
    } else if (fotosEvidencia === 0) {
      motivoGestion = "FALTA_FOTO_EVIDENCIA";
    } else {
      motivoGestion = null;
    }

    // 7. Devolver registro actualizado con todos los campos
    return {
      ...registro,
      total_fotos: totalFotos,
      fotos_fachada: fotosFachada,
      fotos_evidencia: fotosEvidencia,
      totalFotos: totalFotos, // camelCase para uso interno
      fotosFachada: fotosFachada, // camelCase para uso interno
      fotosEvidencia: fotosEvidencia, // camelCase para uso interno
      tieneGPS: tieneGPS,
      estatus_gestion: estatusGestion,
      motivo_gestion: motivoGestion,
      estatusGestion: estatusGestion, // camelCase para uso interno
      motivoGestion: motivoGestion, // camelCase para uso interno
    };
  };

  // ============================================
  // FUNCIÓN PARA RECALCULAR TOTALES DEL USUARIO
  // ============================================

  const recalcularTotalesUsuario = (usuario) => {
    const registros = usuario.registros || [];

    let total = 0;
    let completas = 0;
    let incompletas = 0;
    let invalidas = 0;
    const motivos = {};

    registros.forEach((registro) => {
      total++;

      const estatus =
        registro.estatus_gestion || registro.estatusGestion || "INCOMPLETA";

      if (estatus === "COMPLETA") {
        completas++;
      } else if (estatus === "INCOMPLETA") {
        incompletas++;
      } else if (estatus === "INVALIDA") {
        invalidas++;
      }

      const motivo =
        registro.motivo_gestion || registro.motivoGestion || "COMPLETA";
      const motivoKey = motivo === null ? "COMPLETA" : motivo;
      motivos[motivoKey] = (motivos[motivoKey] || 0) + 1;
    });

    const porcentajeExito = total > 0 ? (completas / total) * 100 : 0;

    // Determinar nivel de desempeño
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
      total,
      completas,
      incompletas,
      invalidas,
      motivos,
      porcentajeExito,
      nivel,
      color,
      icono,
    };
  };

  // ============================================
  // VERSIÓN CORREGIDA DE actualizarRegistroEnUsuario
  // ============================================

  const actualizarRegistroEnUsuario = useCallback(
    (registroId, updater) => {
      if (!usuario?.registros) return;

      // 1. Actualizar el registro específico
      const registrosActualizados = usuario.registros.map((registro) => {
        if (getRegistroKey(registro) === registroId) {
          // Aplicar el updater para modificar fotos
          const registroModificado = updater(registro);
          // Recalcular completamente el registro con la nueva lógica
          return recalcularRegistro(registroModificado);
        }
        return recalcularRegistro(registro); // Asegurar que todos los registros estén bien formados
      });

      // 2. Crear usuario actualizado
      let usuarioActualizado = {
        ...usuario,
        registros: registrosActualizados,
      };

      // 3. Recalcular todos los totales del usuario
      usuarioActualizado = recalcularTotalesUsuario(usuarioActualizado);

      // 4. Preparar datos para enviar al padre (convertir a snake_case si es necesario)
      const registrosParaPadre = usuarioActualizado.registros.map((reg) => ({
        ...reg,
        // Asegurar campos snake_case para el padre (Index)
        total_fotos: reg.total_fotos ?? reg.totalFotos,
        fotos_fachada: reg.fotos_fachada ?? reg.fotosFachada,
        fotos_evidencia: reg.fotos_evidencia ?? reg.fotosEvidencia,
        estatus_gestion: reg.estatus_gestion ?? reg.estatusGestion,
        motivo_gestion: reg.motivo_gestion ?? reg.motivoGestion,
      }));

      const usuarioParaPadre = {
        ...usuarioActualizado,
        registros: registrosParaPadre,
      };

      // 5. Notificar al padre
      if (onUsuarioUpdate) {
        onUsuarioUpdate(usuarioParaPadre);
      }
    },
    [usuario, onUsuarioUpdate],
  );

  // 🔹 FUNCIONES PARA MANEJO DE FOTOS CON LLAMADA REAL AL BACKEND
  const handleAgregarFoto = (gestion) => {
    setGestionSeleccionada(gestion);
    setFotoEditando(null);
    setModoEditor("agregar");
  };

  const handleEditarFoto = (foto) => {
    setFotoEditando(foto);
    setGestionSeleccionada(
      gestionesFiltradas.find((g) => getRegistroKey(g) === foto.gestionId),
    );
    setModoEditor("editar");
  };

  const handleEliminarFoto = (foto) => {
    setFotoEliminar(foto);
    setConfirmDeleteOpen(true);
  };

  // 🔹 FUNCIÓN PARA GUARDAR FOTO (CREAR O ACTUALIZAR)
  const handleGuardarFoto = async (datos) => {
    setCargandoGuardado(true);

    try {
      let urlImagen = datos.urlImagenExistente;
      let idRegistroFoto = datos.idRegistroFotoExistente;
      const fechaCapturaEnvio = datos.fechaCaptura;

      console.log("📸 Procesando foto:", {
        modo: modoEditor,
        tieneNuevaImagen: !!datos.imagenBase64,
        idRegistroFoto: idRegistroFoto,
        nombreFoto: datos.nombreFoto,
      });

      // Preparar datos para enviar al backend
      const fotoData = {
        place_id: placeId,
        cuenta: gestionSeleccionada?.cuenta,
        idAspUser: usuario?.id,
        nombreFoto: datos.nombreFoto,
        fechaCaptura: fechaCapturaEnvio,
        tipo: datos.tipo, // Ya viene capitalizado del modal
        imagenBase64: datos.imagenBase64 || null,
        urlImagenExistente: datos.urlImagenExistente,
        id_servicio: servicioId || 2,
        medio_carga: false,
        tipo_carga: false,
        id_usuario_session: userIdSession,
      };

      // En edición, asegurar que enviamos el idRegistroFoto
      if (modoEditor === "editar" && datos.idRegistroFotoExistente) {
        fotoData.idRegistroFoto = datos.idRegistroFotoExistente;
      }

      console.log("📤 Enviando al backend:", {
        ...fotoData,
        imagenBase64: fotoData.imagenBase64
          ? `[BASE64 length: ${fotoData.imagenBase64.length}]`
          : "null",
      });

      let response;

      if (modoEditor === "agregar") {
        console.log("📤 Insertando nueva foto...");
        response = await insertFotoRequest(fotoData);
      } else {
        console.log("✏️ Actualizando foto existente...");
        response = await updateFotoRequest(fotoData);
      }

      console.log("📥 Respuesta del backend:", response.data);

      if (response.data.success) {
        urlImagen = response.data.urlImagen || datos.urlImagenExistente;
        idRegistroFoto =
          response.data.idRegistroFoto || datos.idRegistroFotoExistente;

        const fotoGuardada = {
          idRegistroFoto: idRegistroFoto, // Asegurar que este ID es correcto
          cuenta: gestionSeleccionada?.cuenta,
          idAspUser: usuario?.id,
          nombreFoto: datos.nombreFoto,
          fechaCaptura: fechaCapturaEnvio,
          tipo: datos.tipo,
          urlImagen: urlImagen,
          fechaSincronizacion: new Date().toISOString(),
          id_servicio: servicioId || 2,
          medio_carga: false,
          tipo_carga: false,
          verificada: false,
          id_usuario_session: userIdSession,
        };

        // Actualizar estado local
        actualizarRegistroEnUsuario(
          getRegistroKey(gestionSeleccionada),
          (registro) => {
            const fotosActuales = registro.fotos || [];
            let nuevasFotos;

            if (modoEditor === "agregar") {
              // Agregar nueva foto al inicio (más reciente)
              nuevasFotos = [fotoGuardada, ...fotosActuales];
            } else {
              // Actualizar foto existente - usar idRegistroFoto para encontrar la correcta
              nuevasFotos = fotosActuales.map((f) =>
                f.idRegistroFoto === idRegistroFoto ? fotoGuardada : f,
              );
            }

            return {
              ...registro,
              fotos: nuevasFotos,
            };
          },
        );

        setSnackbarMessage(
          response.data.message || "Foto guardada correctamente",
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setFotoEditando(null);
        setGestionSeleccionada(null);
        setModoEditor(null);
      } else {
        setSnackbarMessage(
          error.response?.data?.message || "Error al guardar la foto",
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("❌ Error al guardar foto:", error);
      console.error("Detalle del error:", error.response?.data);
      setSnackbarMessage(
        error.response?.data?.message ||
          "Error al guardar la foto. Intenta nuevamente.",
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setCargandoGuardado(false);
    }
  };

  // 🔹 FUNCIÓN PARA ELIMINAR FOTO
  const handleConfirmarEliminar = async () => {
    setCargandoGuardado(true);

    try {
      console.log("🗑️ Eliminando foto:", fotoEliminar);

      const response = await deleteFotoRequest({
        place_id: placeId,
        idRegistroFoto: fotoEliminar.idRegistroFoto,
        id_usuario_session: userIdSession,
      });

      if (response.data.success) {
        const registroIdAEliminar =
          fotoEliminar.gestionId ||
          getRegistroKey({
            cuenta: fotoEliminar.cuenta,
            fecha: fotoEliminar.fecha || fotoEliminar.fechaCaptura,
          });

        // 🔹 ACTUALIZAR EL ESTADO LOCAL - ELIMINAR FOTO DEL REGISTRO ESPECÍFICO
        actualizarRegistroEnUsuario(registroIdAEliminar, (registro) => {
          const fotosActuales = registro.fotos || [];
          const nuevasFotos = fotosActuales.filter(
            (f) => f.idRegistroFoto !== fotoEliminar.idRegistroFoto,
          );

          return {
            ...registro,
            fotos: nuevasFotos,
          };
        });

        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setFotoEliminar(null);
        setConfirmDeleteOpen(false);
      } else {
        setSnackbarMessage(
          response.data.message || "Error al eliminar la foto",
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("❌ Error al eliminar foto:", error);
      setSnackbarMessage(
        error.response?.data?.message ||
          "Error al eliminar la foto. Intenta nuevamente.",
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setCargandoGuardado(false);
    }
  };

  /* ======================================================
     DESCARGA A EXCEL
  ====================================================== */
  const handleDownloadExcel = async () => {
    if (!usuario) return;

    const workbook = new ExcelJS.Workbook();

    const resumenSheet = workbook.addWorksheet("Resumen", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const resumenData = [
      ["Gestor", usuario.nombre],
      ["ID", usuario.id],
      ["Días trabajados", usuario.diasTrabajados || 0],
      ["Total gestiones", usuario.total || 0],
      ["Completas", usuario.completas || 0],
      ["Con problemas", usuario.incompletas || 0],
      ["Inválidas", usuario.invalidas || 0],
      ["% Éxito", usuario.porcentajeExito?.toFixed(1) + "%"],
      [
        "Filtro aplicado",
        filtroMotivo === "TODOS" ? "Todos" : formatMotivoGestion(filtroMotivo),
      ],
      ["Gestiones mostradas", gestionesFiltradas.length],
    ];

    resumenData.forEach((row, index) => {
      const excelRow = resumenSheet.addRow(row);
      if (index === 0) {
        excelRow.getCell(1).font = { bold: true };
        excelRow.getCell(2).font = { bold: true };
      }
    });

    resumenSheet.columns.forEach((column) => {
      column.width = 20;
    });

    const gestionesSheet = workbook.addWorksheet("Gestiones", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const headers = [
      "Cuenta",
      "Fecha",
      "Estado",
      "Motivo",
      "GPS",
      "Fachada",
      "Evidencia",
    ];

    const headerRow = gestionesSheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF374151" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });

    gestionesFiltradas.forEach((gestion) => {
      const fecha = new Date(gestion.fecha);
      const fechaFormateada = `${fecha.toLocaleDateString("es-MX")} ${fecha.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`;

      const row = gestionesSheet.addRow([
        gestion.cuenta || "",
        fechaFormateada,
        gestion.estatus_gestion || "",
        gestion.motivo_gestion === "COMPLETA" || !gestion.motivo_gestion
          ? "Completa"
          : formatMotivoGestion(gestion.motivo_gestion),
        gestion.tieneGPS ? "Sí" : "No",
        gestion.fotosFachada || 0,
        gestion.fotosEvidencia || 0,
      ]);

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.font = { color: { argb: "FF1F2937" } };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFF9FAFB" } },
        };
      });

      const estadoCell = row.getCell(3);
      if (gestion.estatus_gestion === "COMPLETA") {
        estadoCell.font = { color: { argb: "FF10B981" } };
      } else if (gestion.estatus_gestion === "INCOMPLETA") {
        estadoCell.font = { color: { argb: "FFF59E0B" } };
      } else if (gestion.estatus_gestion === "INVALIDA") {
        estadoCell.font = { color: { argb: "FFEF4444" } };
      }
    });

    gestionesSheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        maxLength = Math.max(maxLength, length);
      });
      column.width = Math.min(maxLength + 2, 40);
    });

    const motivosSheet = workbook.addWorksheet("Motivos", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const motivosHeaders = ["Motivo", "Cantidad"];
    const motivosHeaderRow = motivosSheet.addRow(motivosHeaders);
    motivosHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF374151" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
    });

    const motivos = usuario.motivos || {};
    Object.entries(motivos).forEach(([motivo, cantidad]) => {
      const row = motivosSheet.addRow([
        motivo === "COMPLETA"
          ? "Completa"
          : motivo.replace(/_/g, " ").toLowerCase(),
        cantidad,
      ]);
      row.eachCell((cell) => {
        cell.font = { color: { argb: "FF1F2937" } };
      });
    });

    motivosSheet.columns.forEach((column) => {
      column.width = 25;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const filtroTexto =
      filtroMotivo === "TODOS"
        ? "todos"
        : filtroMotivo.replace(/_/g, "_").toLowerCase();

    link.download = `reporte_${usuario.nombre.replace(/\s+/g, "_")}_${usuario.id}_${filtroTexto}_${new Date().toISOString().split("T")[0]}.xlsx`;

    link.click();
    URL.revokeObjectURL(link.href);
  };

  // 🔹 Reset al cambiar usuario
  useEffect(() => {
    if (open && usuario && usuario.id !== usuarioAnteriorRef.current) {
      setPaginaGestiones(0);
      setPageSize(10);
      setFiltroMotivo("TODOS");
      setGestionExpandida(null);
      setFotoAmpliada(null);
      setFotoEditando(null);
      setGestionSeleccionada(null);
      setModoEditor(null);
      usuarioAnteriorRef.current = usuario.id;
    }
  }, [open, usuario]);

  if (!usuario) return null;

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
          },
        }}
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
          {/* 🔹 4 CARDS DE RESUMEN */}
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              📊 Distribución por tipo de gestión
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
              {todosMotivosArray.map(([motivo, cantidad]) => {
                const color = getColorMotivo(motivo);
                const estaActivo = filtroMotivo === motivo;

                return (
                  <Chip
                    key={motivo}
                    icon={getIconoMotivo(motivo)}
                    label={`${formatMotivoGestion(motivo)} (${cantidad})`}
                    onClick={() => manejarClicChip(motivo)}
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
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* 🔹 TABLA DE GESTIONES CON EXPANSIÓN */}
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
                📝 Gestiones registradas
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: colors.grey[500],
                    fontWeight: 400,
                    ml: 1,
                  }}
                >
                  (Haz clic en ▶ para expandir)
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.grey[400], fontSize: "0.875rem" }}
              >
                {filtroMotivo === "TODOS" ? (
                  <>Mostrando {gestionesFiltradas.length} registros</>
                ) : (
                  <>
                    Filtrado:{" "}
                    <strong>{formatMotivoGestion(filtroMotivo)}</strong> •
                    {gestionesFiltradas.length} de {usuario.total || 0}{" "}
                    registros
                  </>
                )}
              </Typography>
            </Box>

            {paginatedGestiones.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  backgroundColor: colors.primary[900],
                  borderRadius: "8px",
                  border: `1px solid ${COLOR_BORDE}`,
                }}
              >
                <AssignmentOutlined
                  sx={{ fontSize: 48, color: colors.grey[600], mb: 2 }}
                />
                <Typography variant="h6" sx={{ color: COLOR_TEXTO, mb: 1 }}>
                  No hay gestiones para mostrar
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                  {filtroMotivo !== "TODOS"
                    ? `No hay gestiones con el filtro "${formatMotivoGestion(filtroMotivo)}"`
                    : "Este usuario no tiene gestiones registradas"}
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: 50,
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                      ></TableCell>
                      <TableCell
                        sx={{
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                      >
                        Cuenta
                      </TableCell>
                      <TableCell
                        sx={{
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                      >
                        Fecha
                      </TableCell>
                      <TableCell
                        sx={{
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                      >
                        Estado
                      </TableCell>
                      <TableCell
                        sx={{
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                      >
                        Motivo
                      </TableCell>
                      <TableCell
                        sx={{
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                        align="center"
                      >
                        GPS
                      </TableCell>
                      <TableCell
                        sx={{
                          color: COLOR_TEXTO,
                          fontWeight: 600,
                          borderBottom: `1px solid ${COLOR_BORDE}`,
                        }}
                        align="center"
                      >
                        Fotos
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedGestiones.map((gestion) => {
                      const fotos = getFotosDeGestion(gestion);
                      const isExpanded = gestionExpandida === gestion.cuenta;
                      const fotosFachada = fotos.filter(
                        (f) => f.tipo === "FACHADA",
                      ).length;
                      const fotosEvidencia = fotos.filter(
                        (f) => f.tipo === "EVIDENCIA",
                      ).length;

                      return (
                        <React.Fragment key={gestion.cuenta || gestion.id}>
                          {/* Fila principal */}
                          <TableRow
                            sx={{
                              "&:hover": {
                                backgroundColor: colors.bgContainerSecondary,
                              },
                              borderBottom: isExpanded
                                ? "none"
                                : `1px solid ${colors.primary[700]}`,
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setGestionExpandida(
                                    isExpanded ? null : gestion.cuenta,
                                  );
                                }}
                                sx={{
                                  color: colors.grey[300],
                                  transform: isExpanded
                                    ? "rotate(180deg)"
                                    : "none",
                                  transition: "transform 0.2s ease",
                                  "&:hover": {
                                    color: COLOR_TEXTO,
                                    backgroundColor: colors.primary[400] + "20",
                                  },
                                }}
                              >
                                <ExpandMore />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, color: COLOR_TEXTO }}
                              >
                                {gestion.cuenta}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: colors.grey[300] }}
                              >
                                {new Date(gestion.fecha).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={gestion.estatus_gestion}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    getColorEstado(gestion.estatus_gestion) +
                                    "20",
                                  color: getColorEstado(
                                    gestion.estatus_gestion,
                                  ),
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  minWidth: 90,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getColorMotivo(gestion.motivo_gestion),
                                  fontStyle:
                                    gestion.motivo_gestion === "COMPLETA" ||
                                    !gestion.motivo_gestion
                                      ? "normal"
                                      : "italic",
                                }}
                              >
                                {formatMotivoGestion(gestion.motivo_gestion)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {gestion.tieneGPS ? (
                                <CheckCircle
                                  sx={{ color: COLOR_EFICIENTE, fontSize: 20 }}
                                />
                              ) : (
                                <Error
                                  sx={{ color: COLOR_ATENCION, fontSize: 20 }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <Chip
                                  label={fotosFachada}
                                  size="small"
                                  icon={<HouseIcon sx={{ fontSize: 12 }} />}
                                  sx={{
                                    backgroundColor:
                                      fotosFachada > 0
                                        ? COLOR_EFICIENTE + "20"
                                        : COLOR_REGULAR + "20",
                                    color:
                                      fotosFachada > 0
                                        ? COLOR_EFICIENTE
                                        : COLOR_REGULAR,
                                    fontSize: "0.7rem",
                                    minWidth: 40,
                                    height: 22,
                                    "& .MuiChip-icon": {
                                      fontSize: "0.8rem",
                                      marginLeft: "4px",
                                      marginRight: "2px",
                                      color:
                                        fotosFachada > 0
                                          ? COLOR_EFICIENTE
                                          : COLOR_REGULAR,
                                    },
                                    "& .MuiChip-label": {
                                      px: 0.5,
                                    },
                                  }}
                                />
                                <Chip
                                  label={fotosEvidencia}
                                  size="small"
                                  icon={
                                    <DescriptionIcon sx={{ fontSize: 12 }} />
                                  }
                                  sx={{
                                    backgroundColor:
                                      fotosEvidencia > 0
                                        ? COLOR_EFICIENTE + "20"
                                        : COLOR_REGULAR + "20",
                                    color:
                                      fotosEvidencia > 0
                                        ? COLOR_EFICIENTE
                                        : COLOR_REGULAR,
                                    fontSize: "0.7rem",
                                    minWidth: 40,
                                    height: 22,
                                    "& .MuiChip-icon": {
                                      fontSize: "0.8rem",
                                      marginLeft: "4px",
                                      marginRight: "2px",
                                      color:
                                        fotosEvidencia > 0
                                          ? COLOR_EFICIENTE
                                          : COLOR_REGULAR,
                                    },
                                    "& .MuiChip-label": {
                                      px: 0.5,
                                    },
                                  }}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>

                          {/* Fila expandida con galería - SIEMPRE EXPANDIBLE */}
                          {isExpanded && (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                sx={{
                                  p: 0,
                                  borderBottom: `1px solid ${colors.primary[700]}`,
                                  backgroundColor: "transparent",
                                }}
                              >
                                <Collapse in={isExpanded} timeout="auto">
                                  <Box
                                    sx={{
                                      p: 3,
                                      backgroundColor: colors.bgContainer,
                                      borderTop: `1px solid ${COLOR_BORDE}`,
                                      borderBottom: `1px solid ${COLOR_BORDE}`,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <PhotoLibrary
                                          sx={{
                                            color: colors.blueAccent[400],
                                            fontSize: 20,
                                          }}
                                        />
                                        <Typography
                                          variant="subtitle2"
                                          sx={{
                                            color: colors.grey[300],
                                            fontWeight: 600,
                                            fontSize: "0.8rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.3px",
                                          }}
                                        >
                                          Galería de fotos
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{ color: colors.grey[400] }}
                                        >
                                          {fotos.length} foto
                                          {fotos.length !== 1 ? "s" : ""}
                                        </Typography>

                                        {fotos.length > 0 && (
                                          <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => {
                                              if (fotos.length > 0) {
                                                setFotoAmpliadaIndex(0);
                                                setFotoAmpliada(fotos[0]);
                                              }
                                            }}
                                            sx={{
                                              color: colors.blueAccent[400],
                                              fontSize: "0.7rem",
                                              textTransform: "none",
                                              "&:hover": {
                                                backgroundColor:
                                                  colors.blueAccent[400] + "20",
                                              },
                                            }}
                                          >
                                            Ver todas
                                          </Button>
                                        )}
                                      </Box>
                                    </Box>

                                    <MiniGaleria
                                      fotos={fotos}
                                      cuenta={gestion.cuenta}
                                      onImageClick={(index) => {
                                        const foto = fotos[index];
                                        if (foto) {
                                          const globalIndex =
                                            findFotoGlobalIndex(foto, gestion);
                                          setFotoAmpliadaIndex(globalIndex);
                                          setFotoAmpliada(foto);
                                        }
                                      }}
                                      onEditFoto={handleEditarFoto}
                                      onDeleteFoto={handleEliminarFoto}
                                      onAgregarFoto={() =>
                                        handleAgregarFoto(gestion)
                                      }
                                      COLOR_EFICIENTE={COLOR_EFICIENTE}
                                      COLOR_REGULAR={COLOR_REGULAR}
                                    />

                                    {gestion.coordenadas && (
                                      <Box
                                        sx={{
                                          mt: 2,
                                          display: "flex",
                                          gap: 2,
                                          alignItems: "center",
                                          p: 1.5,
                                          backgroundColor:
                                            colors.bgContainerSecondary,
                                          borderRadius: "8px",
                                          border: `1px solid ${COLOR_BORDE}`,
                                        }}
                                      >
                                        <GpsIcon
                                          sx={{
                                            color: colors.grey[400],
                                            fontSize: 16,
                                          }}
                                        />
                                        <Typography
                                          variant="caption"
                                          sx={{ color: colors.grey[400] }}
                                        >
                                          GPS:{" "}
                                          {gestion.coordenadas.latitud?.toFixed(
                                            6,
                                          )}
                                          ,{" "}
                                          {gestion.coordenadas.longitud?.toFixed(
                                            6,
                                          )}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={gestionesFiltradas.length}
                  page={paginaGestiones}
                  onPageChange={(event, newPage) => setPaginaGestiones(newPage)}
                  rowsPerPage={pageSize}
                  onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 10));
                    setPaginaGestiones(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    color: COLOR_TEXTO,
                    borderTop: `1px solid ${COLOR_BORDE}`,
                    "& .MuiTablePagination-selectIcon": {
                      color: COLOR_TEXTO,
                    },
                  }}
                />
              </TableContainer>
            )}
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
          <Button onClick={onClose} sx={{ color: colors.grey[400] }}>
            Cerrar
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <ChipContadorFoto
              tipo="FACHADA"
              cantidad={
                fotosFiltradas.filter((f) => f.tipo === "FACHADA").length
              }
              COLOR_EFICIENTE={COLOR_EFICIENTE}
              COLOR_REGULAR={COLOR_REGULAR}
              icono={<HouseIcon sx={{ fontSize: 12 }} />}
              tooltipTitle={`${fotosFiltradas.filter((f) => f.tipo === "FACHADA").length} fachada${fotosFiltradas.filter((f) => f.tipo === "FACHADA").length !== 1 ? "s" : ""} en gestiones filtradas`}
            />

            <ChipContadorFoto
              tipo="EVIDENCIA"
              cantidad={
                fotosFiltradas.filter((f) => f.tipo === "EVIDENCIA").length
              }
              COLOR_EFICIENTE={COLOR_EFICIENTE}
              COLOR_REGULAR={COLOR_REGULAR}
              icono={<DescriptionIcon sx={{ fontSize: 12 }} />}
              tooltipTitle={`${fotosFiltradas.filter((f) => f.tipo === "EVIDENCIA").length} evidencia${fotosFiltradas.filter((f) => f.tipo === "EVIDENCIA").length !== 1 ? "s" : ""} en gestiones filtradas`}
            />

            <Tooltip title={`Total de fotos en gestiones filtradas`}>
              <Chip
                label={`📸 ${fotosFiltradas.length}`}
                size="small"
                sx={{
                  backgroundColor: colors.primary[800],
                  color: colors.grey[300],
                  fontSize: "0.7rem",
                  minWidth: 50,
                  height: 22,
                  "& .MuiChip-label": {
                    px: 0.5,
                  },
                }}
              />
            </Tooltip>
          </Box>

          <Button
            variant="text"
            startIcon={<Download />}
            onClick={handleDownloadExcel}
            sx={{
              color: colors.grey[400],
              textTransform: "none",
              fontWeight: 400,
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: colors.primary[400] + "20",
                color: COLOR_TEXTO,
              },
            }}
          >
            Descargar reporte
          </Button>
        </DialogActions>
      </Dialog>

      <FotoAmpliadaDialog
        open={Boolean(fotoAmpliada)}
        foto={fotoAmpliada}
        onClose={() => setFotoAmpliada(null)}
        onDownload={descargarFoto}
        onNext={handleNextFoto}
        onPrev={handlePrevFoto}
        onEdit={handleEditarFoto}
        onDelete={handleEliminarFoto}
        totalFotos={fotosFiltradas.length}
        index={fotoAmpliadaIndex}
      />

      <FotoEditorDialog
        open={Boolean(modoEditor)}
        onClose={() => {
          setFotoEditando(null);
          setGestionSeleccionada(null);
          setModoEditor(null);
        }}
        onSave={handleGuardarFoto}
        foto={fotoEditando}
        modo={modoEditor}
        cuenta={gestionSeleccionada?.cuenta}
        fechaRegistro={gestionSeleccionada?.fecha}
        existingFechasCaptura={fechasCapturaExistentes} // ← Nueva prop
        colors={colors}
        COLOR_TEXTO={COLOR_TEXTO}
        COLOR_FONDO={COLOR_FONDO}
        COLOR_BORDE={COLOR_BORDE}
      />

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={() => {
          setFotoEliminar(null);
          setConfirmDeleteOpen(false);
        }}
        onConfirm={handleConfirmarEliminar}
        foto={fotoEliminar}
        colors={colors}
        COLOR_FONDO={COLOR_FONDO}
        COLOR_BORDE={COLOR_BORDE}
      />

      {/* 🔹 SNACKBAR PARA NOTIFICACIONES */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success"
                ? colors.greenAccent[200]
                : snackbarSeverity === "error"
                  ? colors.redAccent[200]
                  : colors.blueAccent[200],
            color: colors.grey[100],
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "& .MuiAlert-icon": {
              color: colors.grey[100],
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GestorDetallesDialog;
