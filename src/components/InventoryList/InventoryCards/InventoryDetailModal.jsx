// ...importaciones previas
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  Avatar,
  Divider,
  Button,
  useTheme,
  Grow,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { updateArticlePhotos, updateArticle } from "../../../api/inventory";
import { tokens } from "../../../theme";
import {
  CheckCircleOutline,
  DeleteOutline,
  WarningAmberOutlined,
} from "@mui/icons-material";

const InventoryDetailModal = ({ open, onClose, item, onSave }) => {
  console.log("Item recibido:", item);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [showContent, setShowContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [itemCopy, setItemCopy] = useState(null);
  const [originalItem, setOriginalItem] = useState(null);
  const [initialFields, setInitialFields] = useState([]);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    index: null,
  });
  const [confirmSaveDialog, setConfirmSaveDialog] = useState(false);
  const [confirmSaveInfoDialog, setConfirmSaveInfoDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveInfoSuccess, setSaveInfoSuccess] = useState(false);

  useEffect(() => {
    if (open && item) {
      const copy = JSON.parse(JSON.stringify(item));
      setItemCopy(copy);
      setOriginalItem(JSON.parse(JSON.stringify(item)));

      // Determinar qué campos inicialmente tienen valores (para mantenerlos siempre visibles)
      const excludedKeys = [
        "id",
        "imagen_usuario",
        "usuario",
        "datos_usuario_asignado",
        "estado",
        "fotos",
        "fotos_eliminadas", // Excluir arrays y objetos
      ];

      const fieldsWithValues = Object.entries(copy).filter(([key, value]) => {
        // Siempre excluir estas keys
        if (
          excludedKeys.some((excluded) =>
            key.toLowerCase().includes(excluded.toLowerCase())
          )
        ) {
          return false;
        }

        // Excluir objetos y arrays
        if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof Date)
        ) {
          console.log(`Excluyendo campo ${key} porque es un objeto:`, value);
          return false;
        }

        // Excluir arrays
        if (Array.isArray(value)) {
          console.log(`Excluyendo campo ${key} porque es un array:`, value);
          return false;
        }

        // Incluir solo campos que tienen valores primitivos
        return value !== null && value !== undefined && value !== "";
      });

      console.log("Campos iniciales con valores:", fieldsWithValues);
      setInitialFields(fieldsWithValues);
      setShowContent(true);
      setPhotosToDelete([]);
      setNewPhotos([]);
      setIsEditing(false);
      setIsEditingInfo(false);
      setSaveSuccess(false);
      setSaveInfoSuccess(false);
    } else {
      const timeout = setTimeout(() => {
        setShowContent(false);
        setItemCopy(null);
        setOriginalItem(null);
        setInitialFields([]);
        setIsEditing(false);
        setIsEditingInfo(false);
        setPhotosToDelete([]);
        setNewPhotos([]);
        setSaveSuccess(false);
        setSaveInfoSuccess(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, item]);

  if (!itemCopy && !showContent) return null;

  const { usuario, imagen_usuario, fotos = [], id_articulo } = itemCopy || {};

  // Función para obtener campos a mostrar
  const getFieldsToShow = () => {
    return initialFields;
  };

  const fieldsToShow = getFieldsToShow();

  const formatCurrency = (value) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  // Función para detectar campos modificados
  const getModifiedFields = () => {
    if (!originalItem || !itemCopy) return {};

    const modifiedFields = {};

    Object.keys(itemCopy).forEach((key) => {
      // Excluir campos que no son primitivos
      if (
        key === "fotos" ||
        key === "usuario" ||
        key === "imagen_usuario" ||
        key === "datos_usuario_asignado" ||
        typeof itemCopy[key] === "object" ||
        Array.isArray(itemCopy[key])
      ) {
        return;
      }

      const originalValue = originalItem[key];
      const currentValue = itemCopy[key];

      const isModified =
        originalValue === null ||
        originalValue === undefined ||
        originalValue === ""
          ? currentValue !== null &&
            currentValue !== undefined &&
            currentValue !== ""
          : currentValue !== originalValue;

      if (isModified) {
        modifiedFields[key] = currentValue;
      }
    });

    return modifiedFields;
  };

  // Funciones para edición de información
  const handleInfoChange = (field, value) => {
    setItemCopy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveInfoChanges = () => {
    setConfirmSaveInfoDialog(true);
  };

  const confirmAndSaveInfo = async () => {
    setConfirmSaveInfoDialog(false);
    setSavingInfo(true);

    try {
      const modifiedFields = getModifiedFields();

      if (Object.keys(modifiedFields).length === 0) {
        console.log("No hay campos modificados para enviar");
        setIsEditingInfo(false);
        setSavingInfo(false);
        return;
      }

      const payload = {
        id_articulo,
        updates: modifiedFields,
      };

      console.log(
        "📝 Enviando cambios de información (solo campos modificados):",
        payload
      );
      const response = await updateArticle(payload);
      console.log("✅ Respuesta del servidor:", response);

      // ACTUALIZAR EL ESTADO LOCAL PRIMERO
      const updatedItem = {
        ...itemCopy,
        ...modifiedFields,
      };

      setItemCopy(updatedItem);
      setOriginalItem(updatedItem);

      // LLAMAR AL PADRE CON LOS DATOS ACTUALIZADOS
      if (onSave) {
        onSave(id_articulo, {
          updatedItem: updatedItem, // Pasar el artículo completo actualizado
          modifiedFields: modifiedFields,
          type: "info", // Para identificar el tipo de actualización
        });
      }

      setIsEditingInfo(false);
      setSaveInfoSuccess(true);
    } catch (error) {
      console.error("Error al guardar información:", error);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleCancelInfoEdit = () => {
    setItemCopy(originalItem);
    setIsEditingInfo(false);
  };

  // Función para detectar el tipo de campo basado en el nombre
  const detectFieldType = (fieldName, value) => {
    const fieldNameLower = fieldName.toLowerCase();

    if (fieldNameLower.includes("fecha") || fieldNameLower.includes("date")) {
      return "date";
    }

    if (
      fieldNameLower.includes("precio") ||
      fieldNameLower.includes("costo") ||
      (fieldNameLower.includes("numero") &&
        !fieldNameLower.includes("serie")) ||
      fieldNameLower.includes("cantidad") ||
      fieldNameLower.includes("total") ||
      fieldNameLower.includes("importe")
    ) {
      return "number";
    }

    if (
      fieldNameLower.includes("activo") ||
      fieldNameLower.includes("disponible")
    ) {
      return "boolean";
    }

    if (
      fieldNameLower.includes("descripcion") ||
      fieldNameLower.includes("observacion") ||
      fieldNameLower.includes("comentario")
    ) {
      return "textarea";
    }

    return "text";
  };

  // Función para formatear valor para display
  const formatValueForDisplay = (key, value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    // Si el valor es un objeto o array, mostrar un mensaje indicativo
    if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      return "[Objeto]";
    }

    if (Array.isArray(value)) {
      return `[Array - ${value.length} elementos]`;
    }

    if (key === "activo") {
      return value ? "Activo" : "Inactivo";
    }

    if (key === "precio_articulo") {
      return formatCurrency(value);
    }

    return value.toString();
  };

  // Función para obtener placeholder según el tipo de campo
  const getPlaceholder = (fieldType) => {
    switch (fieldType) {
      case "number":
        return "0";
      case "date":
        return "YYYY-MM-DD";
      case "textarea":
        return "Escribe aquí...";
      default:
        return "Escribe aquí...";
    }
  };

  // Función para renderizar campo editable
  const renderEditableField = (key, value) => {
    if (!isEditingInfo) {
      return (
        <Typography variant="body1" fontWeight={400}>
          {formatValueForDisplay(key, value)}
        </Typography>
      );
    }

    const fieldType = detectFieldType(key, value);
    const displayValue = value === null || value === undefined ? "" : value;
    const placeholder = getPlaceholder(fieldType);

    switch (fieldType) {
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleInfoChange(key, e.target.checked)}
                color="success"
              />
            }
            label={value ? "Activo" : "Inactivo"}
            sx={{ margin: 0 }}
          />
        );

      case "number":
        return (
          <TextField
            value={displayValue}
            onChange={(e) =>
              handleInfoChange(
                key,
                e.target.value === "" ? "" : parseFloat(e.target.value) || 0
              )
            }
            type="number"
            size="small"
            fullWidth
            placeholder={placeholder}
            InputProps={{
              startAdornment: key.includes("precio") ? (
                <Typography mr={1}>$</Typography>
              ) : null,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "0.875rem",
                backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.borderContainer,
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[100], // hover sutil
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[200],
                  boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
                },

                "& input::placeholder": {
                  color: colors.grey[400],
                  opacity: 1,
                },
              },

              "& .MuiInputAdornment-root": {
                marginRight: "8px",
              },

              "& .MuiFormHelperText-root": {
                marginLeft: 1,
                fontSize: "0.75rem",
                color: theme.palette.error.main,
              },
            }}
          />
        );

      case "date":
        const dateValue = value
          ? new Date(value).toISOString().split("T")[0]
          : "";
        return (
          <TextField
            value={dateValue}
            onChange={(e) => handleInfoChange(key, e.target.value)}
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              width: "100%",
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                  colors.accentGreen[100]
                )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                cursor: "pointer",
                width: "20px",
                height: "20px",
              },
              borderRadius: "10px",
              fontSize: "0.875rem",
              backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.borderContainer,
              },

              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.accentGreen[100], // hover sutil
              },

              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.accentGreen[200],
                boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
              },

              "& input::placeholder": {
                color: colors.grey[400],
                opacity: 1,
              },
              "& .MuiInputAdornment-root": {
                marginRight: "8px",
              },

              "& .MuiFormHelperText-root": {
                marginLeft: 1,
                fontSize: "0.75rem",
                color: theme.palette.error.main,
              },
            }}
          />
        );

      case "textarea":
        return (
          <TextField
            value={displayValue}
            onChange={(e) => handleInfoChange(key, e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={3}
            placeholder={placeholder}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "0.875rem",
                backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.borderContainer,
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[100], // hover sutil
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[200],
                  boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
                },

                "& input::placeholder": {
                  color: colors.grey[400],
                  opacity: 1,
                },
              },

              "& .MuiInputAdornment-root": {
                marginRight: "8px",
              },

              "& .MuiFormHelperText-root": {
                marginLeft: 1,
                fontSize: "0.75rem",
                color: theme.palette.error.main,
              },
            }}
          />
        );

      default:
        return (
          <TextField
            value={displayValue}
            onChange={(e) => handleInfoChange(key, e.target.value)}
            size="small"
            fullWidth
            placeholder={placeholder}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "0.875rem",
                backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.borderContainer,
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[100], // hover sutil
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[200],
                  boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
                },

                "& input::placeholder": {
                  color: colors.grey[400],
                  opacity: 1,
                },
              },

              "& .MuiInputAdornment-root": {
                marginRight: "8px",
              },

              "& .MuiFormHelperText-root": {
                marginLeft: 1,
                fontSize: "0.75rem",
                color: theme.palette.error.main,
              },
            }}
          />
        );
    }
  };

  // Funciones existentes para fotos (MANTENIDAS INTACTAS)
  const openConfirmDeleteDialog = (index) => {
    setConfirmDialog({ open: true, index });
  };

  const handleDeletePhoto = (index) => {
    const photoToDelete = fotos[index];
    if (
      photosToDelete.some(
        (p) => p.id_foto_articulo === photoToDelete.id_foto_articulo
      )
    ) {
      setConfirmDialog({ open: false, index: null });
      return;
    }
    setPhotosToDelete([...photosToDelete, photoToDelete]);
    setConfirmDialog({ open: false, index: null });
  };

  const handleUndoDelete = (id_foto_articulo) => {
    setPhotosToDelete(
      photosToDelete.filter((p) => p.id_foto_articulo !== id_foto_articulo)
    );
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const previews = await Promise.all(
      files.map(async (file) => {
        const base64 = await toBase64(file);
        return {
          file,
          preview: URL.createObjectURL(file),
          base64,
        };
      })
    );
    setNewPhotos((prev) => [...prev, ...previews]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSaveChanges = () => {
    if (newPhotos.length === 0 && photosToDelete.length === 0) return;
    setConfirmSaveDialog(true);
  };

  const confirmAndSave = async () => {
    setConfirmSaveDialog(false);
    setSaving(true);

    try {
      const deletedPhotoIds = photosToDelete.map(
        (photo) => photo.id_foto_articulo
      );

      const newPhotosFormatted = newPhotos.map((p) => ({
        id_foto_articulo: `temp-${Date.now()}-${Math.random()}`,
        url_imagen: p.preview,
        imagen64: p.base64,
        folio: itemCopy?.folio || null,
      }));

      const payload = {
        id_articulo,
        deletedPhotoIds,
        newPhotos: newPhotosFormatted,
      };

      console.log(payload);

      const response = await updateArticlePhotos(payload);

      console.log(response);

      // ACTUALIZAR EL ESTADO LOCAL PRIMERO
      const updatedFotos = itemCopy.fotos.filter(
        (foto) => !deletedPhotoIds.includes(foto.id_foto_articulo)
      );

      const fotosConNuevas = [
        ...updatedFotos,
        ...response.newPhotos.map(({ id_foto_articulo, url_imagen }) => ({
          id_foto_articulo,
          url_imagen,
        })),
      ];

      const updatedItem = {
        ...itemCopy,
        fotos: fotosConNuevas,
      };

      setItemCopy(updatedItem);
      setOriginalItem(updatedItem);

      // LLAMAR AL PADRE CON LOS DATOS ACTUALIZADOS
      if (onSave) {
        onSave(id_articulo, {
          updatedItem: updatedItem, // Pasar el artículo completo actualizado
          deletedPhotoIds,
          newPhotos: response.newPhotos,
          type: "photos", // Para identificar el tipo de actualización
        });
      }

      setPhotosToDelete([]);
      setNewPhotos([]);
      setIsEditing(false);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error al guardar fotos:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setItemCopy(originalItem);
    setPhotosToDelete([]);
    setNewPhotos([]);
    setConfirmDialog({ open: false, index: null });
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSaveSuccess(false);
  };

  const handleCloseInfoSnackbar = () => {
    setSaveInfoSuccess(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Grow in={open} timeout={300}>
        <Box
          sx={{
            bgcolor: colors.primary[400],
            color: colors.grey[100],
            width: "95%",
            maxWidth: 800,
            maxHeight: "90vh",
            overflowY: "auto",
            p: 3,
            borderRadius: 3,
            boxShadow: 24,
            mx: "auto",
            my: "5vh",
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 12, right: 12 }}
            disabled={saving || savingInfo}
          >
            <CloseIcon sx={{ color: colors.grey[100] }} />
          </IconButton>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            {itemCopy?.nombre_articulo || "Detalles del artículo"}
          </Typography>

          {/* SECCIÓN DE FOTOS - COMPLETA */}
          <Card
            sx={{
              mb: 3,
              backgroundColor: colors.primary[500],
              border: `1px solid ${colors.primary[600]}`,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Fotos del Artículo
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  color={isEditing ? "error" : "info"}
                  sx={{
                    textTransform: "none",
                    borderRadius: "10px",
                    borderColor: colors.grey[300],
                    color: colors.grey[800],
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: colors.grey[100],
                      borderColor: colors.primary[300],
                    },
                  }}
                  startIcon={
                    isEditing ? <CancelOutlinedIcon /> : <EditOutlinedIcon />
                  }
                  onClick={() => {
                    if (isEditing) {
                      handleCancelEdit();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={saving || savingInfo || isEditingInfo}
                >
                  {isEditing ? "Cancelar edición" : "Editar fotos"}
                </Button>
              </Box>

              {isEditing && (
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <input
                    accept="image/*"
                    id="upload-photo-input"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    disabled={saving}
                  />
                  <label htmlFor="upload-photo-input">
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      component="span"
                      startIcon={<UploadFileIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        borderColor: colors.grey[300],
                        color: colors.grey[800],
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: colors.grey[100],
                          borderColor: colors.primary[300],
                        },
                      }}
                      disabled={saving}
                    >
                      Agregar imágenes
                    </Button>
                  </label>

                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    sx={{
                      textTransform: "none",
                      borderRadius: "10px",
                      borderColor: colors.grey[300],
                      color: colors.grey[800],
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      "&:hover": {
                        backgroundColor: colors.grey[100],
                        borderColor: colors.primary[300],
                      },
                    }}
                    startIcon={<SaveIcon />}
                    onClick={handleSaveChanges}
                    disabled={
                      saving ||
                      (newPhotos.length === 0 && photosToDelete.length === 0)
                    }
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </Box>
              )}

              <Grid container spacing={2} sx={{ mb: 2 }}>
                {fotos.map((foto, idx) => {
                  const isMarkedForDeletion = photosToDelete.some(
                    (p) => p.id_foto_articulo === foto.id_foto_articulo
                  );

                  return (
                    <Grid item xs={6} sm={4} md={3} key={idx}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1",
                          backgroundColor: "#f6f6f6",
                          borderRadius: 2,
                          overflow: "hidden",
                          border: isMarkedForDeletion
                            ? `3px solid ${colors.redAccent[500]}`
                            : "1px solid #eee",
                          filter: isMarkedForDeletion
                            ? "grayscale(100%) opacity(0.5)"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={foto.url_imagen}
                          alt={`Foto ${idx + 1}`}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: isMarkedForDeletion
                              ? "none"
                              : "auto",
                          }}
                        />
                        {isEditing && !isMarkedForDeletion && (
                          <Tooltip title="Eliminar imagen" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openConfirmDeleteDialog(idx)}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor: "rgba(255,255,255,0.8)",
                                border: "1px solid",
                                borderColor: colors.grey[300],
                                borderRadius: "6px",
                                padding: "4px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: colors.grey[100],
                                  borderColor: colors.primary[300],
                                },
                              }}
                            >
                              <DeleteIcon
                                sx={{ fontSize: 18, color: colors.grey[700] }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                        {isEditing && isMarkedForDeletion && (
                          <Tooltip title="Deshacer borrado" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUndoDelete(foto.id_foto_articulo)
                              }
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor: "rgba(255,255,255,0.85)",
                                border: "1px solid",
                                borderColor: colors.grey[300],
                                borderRadius: "6px",
                                padding: "4px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: colors.grey[100],
                                  borderColor: colors.greenAccent[300],
                                  "& .MuiSvgIcon-root": {
                                    color: colors.greenAccent[500],
                                  },
                                },
                              }}
                            >
                              <CancelOutlinedIcon
                                sx={{ fontSize: 18, color: colors.grey[700] }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {!fotos.length && !isEditing && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    border: `1px dashed ${colors.grey[700]}`,
                    borderRadius: 2,
                    height: 150,
                  }}
                >
                  <NoPhotographyOutlinedIcon
                    sx={{ fontSize: 40, color: colors.grey[500], mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color={colors.grey[400]}
                    fontWeight={400}
                    textAlign="center"
                  >
                    No hay fotos disponibles
                  </Typography>
                </Box>
              )}

              {isEditing && (
                <Box mb={2}>
                  <Typography variant="body2" fontWeight={500} mb={1}>
                    Nuevas fotos agregadas:
                  </Typography>
                  <Grid container spacing={2} mt={1}>
                    {newPhotos.map((photo, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Box
                          sx={{
                            width: "100%",
                            aspectRatio: "1",
                            backgroundColor: "#f6f6f6",
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={photo.preview}
                            alt={`Nueva Foto ${idx + 1}`}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* SECCIÓN DE INFORMACIÓN - CORREGIDA */}
          <Card
            sx={{
              backgroundColor: colors.primary[500],
              border: `1px solid ${colors.primary[600]}`,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Información del Artículo
                </Typography>

                {!isEditingInfo ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{
                      textTransform: "none", // minimalista, sin mayúsculas forzadas
                      borderRadius: "10px", // bordes redondeados suaves
                      fontWeight: 500,
                      fontSize: "0.875rem", // tamaño legible, consistente
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px", // espacio limpio entre texto e icono
                      backgroundColor: colors.accentGreen[100], // color normal
                      color: colors.textAccent, // contraste legible
                      border: "none",
                      cursor: "pointer",

                      "&:hover": {
                        backgroundColor: colors.accentGreen[200], // hover sutil
                      },
                      "&:active": {
                        backgroundColor: colors.accentGreen[300], // feedback presionado
                      },
                      "& .MuiButton-endIcon": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                      transition:
                        "background-color 0.3s ease, box-shadow 0.2s ease",
                      boxShadow: "none", // minimalismo: sin sombra por defecto
                      "&:hover, &:active": {
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                      },
                    }}
                    endIcon={<EditNoteIcon />}
                    onClick={() => setIsEditingInfo(true)}
                    disabled={savingInfo || saving || isEditing}
                  >
                    Editar Información
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        color: colors.grey[800],
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: colors.grey[100],
                        },
                      }}
                      startIcon={<CancelOutlinedIcon />}
                      onClick={handleCancelInfoEdit}
                      disabled={savingInfo}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        color: colors.grey[800],
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: colors.grey[100],
                        },
                      }}
                      startIcon={<SaveIcon />}
                      onClick={handleSaveInfoChanges}
                      disabled={savingInfo}
                    >
                      {savingInfo ? "Guardando..." : "Guardar"}
                    </Button>
                  </Box>
                )}
              </Box>

              {usuario && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={imagen_usuario}
                    alt={usuario}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      color={colors.grey[300]}
                      fontWeight={500}
                    >
                      Usuario asignado:
                    </Typography>
                    <Typography variant="body1" fontWeight={400}>
                      {usuario}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Grid container spacing={2}>
                {fieldsToShow.map(([key, initialValue]) => {
                  const currentValue = itemCopy ? itemCopy[key] : initialValue;

                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography
                        variant="body2"
                        color={colors.grey[300]}
                        fontWeight={500}
                        sx={{ mb: 1 }}
                      >
                        {key.replace(/_/g, " ")}:
                      </Typography>
                      {renderEditableField(key, currentValue)}
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>

          {/* Diálogos existentes */}
          <Dialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, index: null })}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
                minWidth: 320,
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1rem",
                fontWeight: 500,
                color: colors.grey[100],
                pb: 1,
              }}
            >
              <WarningAmberOutlined
                sx={{ color: colors.yellowAccent[500], fontSize: 22 }}
              />
              ¿Deseas eliminar esta foto?
            </DialogTitle>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => setConfirmDialog({ open: false, index: null })}
                disabled={saving}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: colors.grey[700],
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1px solid",
                  borderColor: colors.grey[300],
                  "&:hover": { backgroundColor: colors.grey[100] },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDeletePhoto(confirmDialog.index)}
                disabled={saving}
                startIcon={
                  <DeleteOutline
                    sx={{ fontSize: 18, color: colors.grey[700] }}
                  />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: colors.grey[700],
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1px solid",
                  borderColor: colors.grey[300],
                  "&:hover": {
                    backgroundColor: colors.redAccent[300],
                    borderColor: colors.redAccent[500],
                    color: colors.grey[100],
                    "& .MuiSvgIcon-root": { color: colors.redAccent[500] },
                  },
                }}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={confirmSaveDialog}
            onClose={() => setConfirmSaveDialog(false)}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
                minWidth: 320,
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1rem",
                fontWeight: 500,
                color: colors.grey[100],
                pb: 1,
              }}
            >
              <CheckCircleOutline
                sx={{ color: colors.greenAccent[500], fontSize: 22 }}
              />
              ¿Deseas guardar los cambios?
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setConfirmSaveDialog(false)}
                disabled={saving}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: colors.grey[700],
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1px solid",
                  borderColor: colors.grey[300],
                  "&:hover": { backgroundColor: colors.grey[100] },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAndSave}
                disabled={saving}
                startIcon={
                  <CheckCircleOutline
                    sx={{ fontSize: 18, color: colors.grey[700] }}
                  />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: colors.grey[700],
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1px solid",
                  borderColor: colors.grey[300],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[100],
                    borderColor: colors.greenAccent[300],
                    color: colors.grey[100],
                    "& .MuiSvgIcon-root": { color: colors.greenAccent[500] },
                  },
                }}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={confirmSaveInfoDialog}
            onClose={() => setConfirmSaveInfoDialog(false)}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
                minWidth: 320,
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1rem",
                fontWeight: 500,
                color: colors.grey[100],
                pb: 1,
              }}
            >
              <CheckCircleOutline
                sx={{ color: colors.greenAccent[500], fontSize: 22 }}
              />
              ¿Deseas guardar los cambios de información?
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setConfirmSaveInfoDialog(false)}
                disabled={savingInfo}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: colors.grey[700],
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1px solid",
                  borderColor: colors.grey[300],
                  "&:hover": { backgroundColor: colors.grey[100] },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAndSaveInfo}
                disabled={savingInfo}
                startIcon={
                  <CheckCircleOutline
                    sx={{ fontSize: 18, color: colors.grey[700] }}
                  />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: colors.grey[700],
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1px solid",
                  borderColor: colors.grey[300],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[100],
                    borderColor: colors.greenAccent[300],
                    color: colors.grey[100],
                    "& .MuiSvgIcon-root": { color: colors.greenAccent[500] },
                  },
                }}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbars */}
          <Snackbar
            open={saveSuccess}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Fotos actualizadas exitosamente
            </Alert>
          </Snackbar>

          <Snackbar
            open={saveInfoSuccess}
            autoHideDuration={3000}
            onClose={handleCloseInfoSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseInfoSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Información actualizada exitosamente
            </Alert>
          </Snackbar>
        </Box>
      </Grow>
    </Modal>
  );
};

export default InventoryDetailModal;
