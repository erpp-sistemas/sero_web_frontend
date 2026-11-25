// src/components/PaymentValidation/Shared/FotoEditorDialog.jsx
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Close,
  AddPhotoAlternate,
  Edit,
  PhotoCamera,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { TIPOS_FOTO } from "../../../constants/catalogos";
import { fileToBase64 } from "../../../api/photo";
import { fechaNuevaFoto, nombreFoto, esTipoFoto } from "./fotoRules";

/**
 * FotoEditorDialog
 * ------------------------------------------------------------------
 * Dialog para agregar o editar una fotografía.
 *
 * Props:
 *  - open                (bool)     Controla la visibilidad
 *  - onClose             (fn)       Callback al cerrar
 *  - onSave              (fn)       Callback al guardar. Recibe:
 *                                    {
 *                                      nombreFoto: archivo,
 *                                      tipo,               // "FACHADA" | "EVIDENCIA"
 *                                      fechaCaptura,       // ISO string
 *                                      imagenBase64,       // string | null
 *                                      urlImagenExistente, // string | null
 *                                      idRegistroFotoExistente // number | null
 *                                    }
 *  - foto                (obj|null) Foto a editar (null en modo agregar)
 *  - modo                (str)      "agregar" | "editar"
 *  - cuenta              (str)      Cuenta del registro (para nombreFoto)
 *  - fechaRegistro       (str)      Fecha de la gestión (ISO). Se usa como
 *                                    fecha fija al agregar.
 *  - tipoInicial         (str)     Tipo preseleccionado al agregar
 *  - fotosDisponibles    (arr)     Fotos del día de la gestión
 *  - onSeleccionarFoto   (fn)      Selecciona una foto existente para editar
 *  - onEliminarFoto      (fn)      Abre la confirmación de eliminación
 *  - colors              (obj)      Tokens de color (opcional)
 *  - COLOR_TEXTO         (str)      Color de texto (opcional)
 *  - COLOR_FONDO         (str)      Color de fondo (opcional)
 *  - COLOR_BORDE         (str)      Color de borde (opcional)
 */
const FotoEditorDialog = ({
  open,
  onClose,
  onSave,
  foto,
  modo,
  cuenta,
  fechaRegistro,
  tipoInicial,
  fotosDisponibles,
  onSeleccionarFoto,
  onEliminarFoto,
  colors: colorsProp,
  COLOR_TEXTO: COLOR_TEXTO_PROPS,
  COLOR_FONDO: COLOR_FONDO_PROPS,
  COLOR_BORDE: COLOR_BORDE_PROPS,
}) => {
  const theme = useTheme();
  const themeColors = colorsProp || tokens(theme.palette.mode);

  const COLOR_TEXTO = COLOR_TEXTO_PROPS || themeColors.grey[100];
  const COLOR_FONDO = COLOR_FONDO_PROPS || themeColors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || themeColors.primary[500];

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

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------

  useEffect(() => {
    if (!open) return;
    setImagenFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      const fecha = modo === "editar" ? foto.fechaCaptura : fechaNuevaFoto(fechaRegistro, fotosDisponibles);
      setFormData({
        tipo: modo === "editar"
          ? esTipoFoto(foto, "fachada") ? "Fachada predio" : esTipoFoto(foto, "evidencia") ? "Evidencia" : ""
          : tipoInicial === "FACHADA" ? "Fachada predio" : "Evidencia",
        fechaCaptura: fecha.slice(0, 10),
        horaCaptura: fecha.slice(11, 19),
      });
      setImagenPreview(modo === "editar" ? foto.urlImagen || foto.url : null);
    } catch (error) {
      setFormData({ tipo: "", fechaCaptura: "", horaCaptura: "" });
      setErrors({ general: error.message });
    }
  }, [open, foto, modo, cuenta, fechaRegistro, fotosDisponibles, tipoInicial]);

  // ----------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------

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
    if (enviando || cargandoImagen) return;
    const newErrors = {};

    if (!imagenPreview || (!imagenFile && modo === "agregar")) {
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setEnviando(true);

    try {
      const fechaCaptura = modo === "editar" ? foto.fechaCaptura : fechaNuevaFoto(fechaRegistro, fotosDisponibles);
      const archivo = modo === "editar" ? nombreFoto(foto) : `${cuenta}${fechaCaptura}.000Z`;
      let imagenBase64 = null;
      if (imagenFile) {
        imagenBase64 = await fileToBase64(imagenFile);
      }

      const tipoCapitalizado =
        formData.tipo === "Fachada predio" ? "FACHADA" : "EVIDENCIA";

      const datosParaGuardar = {
        nombreFoto: archivo,
        tipo: tipoCapitalizado,
        fechaCaptura,
        imagenBase64,
        urlImagenExistente: modo === "editar" ? foto?.urlImagen || foto?.url : null,
        idRegistroFotoExistente:
          modo === "editar" ? foto?.idRegistroFoto : null,
      };

      const guardado = await onSave(datosParaGuardar);
      if (guardado === false) setErrors((prev) => ({ ...prev, general: "No se guardaron los cambios. Revisa el mensaje de error." }));
    } catch (error) {
      console.error("❌ Error al preparar datos:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setEnviando(false);
    }
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

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
          {errors.general && <Alert severity="error">{errors.general}</Alert>}
          {modo === "editar" && (
            <Box>
              <Typography variant="body2" sx={{ color: COLOR_TEXTO, mb: 1 }}>
                Fotografías de esta gestión: selecciona la que deseas editar
              </Typography>
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                {fotosDisponibles.map((disponible) => (
                  <Box key={disponible.idRegistroFoto} sx={{ minWidth: 130 }}>
                    <Button disabled={enviando || cargandoImagen} onClick={() => onSeleccionarFoto(disponible)}
                      aria-pressed={disponible.idRegistroFoto === foto?.idRegistroFoto}
                      sx={{ display: "flex", flexDirection: "column", width: "100%", color: COLOR_TEXTO,
                        border: `2px solid ${disponible.idRegistroFoto === foto?.idRegistroFoto ? themeColors.blueAccent[400] : COLOR_BORDE}` }}>
                      <Box component="img" src={disponible.urlImagen || disponible.url}
                        alt={disponible.tipo} sx={{ width: 100, height: 70, objectFit: "cover" }} />
                      <Typography variant="caption">{disponible.tipo}</Typography>
                      <Typography variant="caption">{disponible.fechaCaptura?.slice(11, 19)}</Typography>
                    </Button>
                    {onEliminarFoto && (<Button size="small" color="error" disabled={enviando}
                      onClick={() => onEliminarFoto(disponible)}>Eliminar</Button>)}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
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
                  border: `2px dashed ${
                    errors.imagen ? themeColors.redAccent[400] : COLOR_BORDE
                  }`,
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
                    aria-label="Quitar selección para reemplazar la imagen"
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
            {modo === "editar" && !imagenPreview && (
              <Button size="small" onClick={() => setImagenPreview(foto.urlImagen || foto.url)}>
                Conservar imagen original
              </Button>
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

          {/* Tipo de foto */}
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
              {modo === "editar" ? "Fecha de captura conservada" : "Fecha de captura asignada automáticamente"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Fecha */}
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
                  disabled
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: themeColors.grey[400],
                    },
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

              {/* Hora */}
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
                  disabled
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
                    "& .MuiInputLabel-root": {
                      color: themeColors.grey[400],
                    },
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

export default FotoEditorDialog;
