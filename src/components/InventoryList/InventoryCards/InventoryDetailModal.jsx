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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { updateArticlePhotos } from "../../../api/inventory";
import { tokens } from "../../../theme";

const InventoryDetailModal = ({ open, onClose, item, onSave }) => {
  console.log(item);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [showContent, setShowContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [itemCopy, setItemCopy] = useState(null);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    index: null,
  });
  const [confirmSaveDialog, setConfirmSaveDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (open && item) {
      const copy = JSON.parse(JSON.stringify(item));
      setItemCopy(copy);
      setShowContent(true);
      setPhotosToDelete([]);
      setNewPhotos([]);
      setIsEditing(false);
      setSaveSuccess(false);
    } else {
      const timeout = setTimeout(() => {
        setShowContent(false);
        setItemCopy(null);
        setIsEditing(false);
        setPhotosToDelete([]);
        setNewPhotos([]);
        setSaveSuccess(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, item]);

  if (!itemCopy && !showContent) return null;

  const {
    usuario,
    imagen_usuario,
    fotos = [],
    id_articulo,
    ...rest
  } = itemCopy || {};

  const filteredEntries = Object.entries(rest || {}).filter(
    ([key, value]) =>
      !key.toLowerCase().includes("id") &&
      key !== "imagen_usuario" &&
      key !== "usuario" &&
      value !== null &&
      value !== undefined &&
      value !== ""
  );

  const formatCurrency = (value) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

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
        id_foto_articulo: `temp-${Date.now()}-${Math.random()}`, // id temporal UI
        url_imagen: p.preview,
        // file: p.file,
        imagen64: p.base64,
        folio: itemCopy?.folio || null,
      }));

      // Log para enviar datos al backend
      // console.log("📸 Guardando cambios de fotos:", {
      //   id_articulo,
      //   deletedPhotoIds,
      //   newPhotosFormatted,
      // });

      const payload = {
        id_articulo,
        deletedPhotoIds,
        newPhotos: newPhotosFormatted,
      };

      console.log(payload);

      const response = await updateArticlePhotos(payload);

      console.log(response);

      if (onSave) {
        onSave(id_articulo, {
          deletedPhotoIds,
          newPhotos: response.newPhotos,
        });
      }

      setItemCopy((prev) => {
        if (!prev) return prev;

        const fotosActualizadas = prev.fotos.filter(
          (foto) => !deletedPhotoIds.includes(foto.id_foto_articulo)
        );

        const fotosConNuevas = [
          ...fotosActualizadas,
          ...response.newPhotos.map(({ id_foto_articulo, url_imagen }) => ({
            id_foto_articulo,
            url_imagen,
          })),
        ];

        return {
          ...prev,
          fotos: fotosConNuevas,
        };
      });

      setPhotosToDelete([]);
      setNewPhotos([]);
      setIsEditing(false);
      // setSaving(false);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error al guardar fotos:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setItemCopy(item);
    setPhotosToDelete([]);
    setNewPhotos([]);
    setConfirmDialog({ open: false, index: null });
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSaveSuccess(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Grow in={open} timeout={300}>
        <Box
          sx={{
            bgcolor: colors.primary[400],
            color: colors.grey[100],
            width: "90%",
            maxWidth: 700,
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
            disabled={saving}
          >
            <CloseIcon sx={{ color: colors.grey[100] }} />
          </IconButton>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            {itemCopy?.nombre_articulo || "Detalles del artículo"}
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            flexWrap="wrap"
            gap={1}
          >
            <Button
              variant="contained"
              size="small"
              color={isEditing ? "error" : "info"}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                color: colors.grey[800],
                fontWeight: 500,
                fontSize: "0.875rem",
                display: "flex",
                gap: "8px",
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
              disabled={saving}
            >
              {isEditing ? "Cancelar edición" : "Editar fotos"}
            </Button>

            {/* Botón subir imagenes estilizado */}
            {isEditing && (
              <>
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
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: colors.grey[100],
                      minWidth: "150px",
                    }}
                    disabled={saving}
                  >
                    Agregar imágenes
                  </Button>
                </label>
              </>
            )}

            {isEditing && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  sx={{
                    textTransform: "none",
                    borderRadius: "10px",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    display: "flex",
                    gap: "8px",
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
              </>
            )}
          </Box>

          {/* Fotos existentes */}
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
                        pointerEvents: isMarkedForDeletion ? "none" : "auto",
                      }}
                    />
                    {isEditing && !isMarkedForDeletion && (
                      <IconButton
                        size="small"
                        onClick={() => openConfirmDeleteDialog(idx)}
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: colors.grey[200],
                          "&:hover": {
                            backgroundColor: colors.redAccent[500],
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    {isEditing && isMarkedForDeletion && (
                      <IconButton
                        size="small"
                        onClick={() => handleUndoDelete(foto.id_foto_articulo)}
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: colors.grey[200],
                          "&:hover": {
                            backgroundColor: colors.greenAccent[400],
                          },
                        }}
                      >
                        <CancelOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* No hay fotos */}
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
                mb: 3,
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

          {/* Nuevas fotos */}
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

          {/* Usuario */}
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

          <Divider sx={{ mb: 2, bgcolor: colors.grey[700] }} />

          {/* Detalles */}
          <Grid container spacing={2}>
            {filteredEntries.map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  fontWeight={500}
                >
                  {key.replace(/_/g, " ")}:
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  {key === "activo"
                    ? value
                      ? "Activo"
                      : "Inactivo"
                    : key === "precio_articulo"
                    ? formatCurrency(value)
                    : value || "N/A"}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Diálogo de eliminación */}
          <Dialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, index: null })}
          >
            <DialogTitle>¿Deseas eliminar esta foto?</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setConfirmDialog({ open: false, index: null })}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDeletePhoto(confirmDialog.index)}
                color="error"
                disabled={saving}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Diálogo de guardar cambios */}
          <Dialog
            open={confirmSaveDialog}
            onClose={() => setConfirmSaveDialog(false)}
          >
            <DialogTitle>¿Deseas guardar los cambios?</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setConfirmSaveDialog(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAndSave}
                color="success"
                disabled={saving}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar de éxito */}
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
              Cambios guardados exitosamente
            </Alert>
          </Snackbar>
        </Box>
      </Grow>
    </Modal>
  );
};

export default InventoryDetailModal;
