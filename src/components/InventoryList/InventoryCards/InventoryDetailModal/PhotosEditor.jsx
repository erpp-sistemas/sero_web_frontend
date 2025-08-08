import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import { tokens } from "../../../../theme";

const PhotosEditor = ({ photos = [], onCancel, onSave }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado local para manejo de fotos
  const [currentPhotos, setCurrentPhotos] = useState(photos); // Fotos visibles
  const [deletedPhotos, setDeletedPhotos] = useState([]); // Fotos marcadas para eliminar (pueden tener id)
  const [newPhotos, setNewPhotos] = useState([]); // Nuevas fotos para subir (File objects)

  // Estado para confirmación de eliminación
  const [photoToDelete, setPhotoToDelete] = useState(null);

  // Abre diálogo confirmación para borrar
  const handleDeleteClick = (foto) => {
    setPhotoToDelete(foto);
  };

  // Confirmar eliminar foto
  const confirmDelete = () => {
    if (photoToDelete) {
      // Si la foto tiene un id (o identificador), agregar a eliminados
      if (photoToDelete.id) {
        setDeletedPhotos((prev) => [...prev, photoToDelete]);
      }
      // Remover de currentPhotos
      setCurrentPhotos((prev) =>
        prev.filter((f) => f !== photoToDelete)
      );

      // Si la foto es nueva (File), remover de newPhotos
      setNewPhotos((prev) =>
        prev.filter((f) => f !== photoToDelete)
      );
    }
    setPhotoToDelete(null);
  };

  const cancelDelete = () => {
    setPhotoToDelete(null);
  };

  // Maneja subida de nuevas fotos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Añadir las nuevas fotos a newPhotos y currentPhotos (como objeto con url preview)
    const filesWithPreview = files.map((file) => {
      // Creamos objeto con url para preview
      const preview = URL.createObjectURL(file);
      return { file, url_imagen: preview, isNew: true };
    });

    setNewPhotos((prev) => [...prev, ...filesWithPreview]);
    setCurrentPhotos((prev) => [...prev, ...filesWithPreview]);

    // Resetear input para poder seleccionar mismas fotos nuevamente si se quiere
    e.target.value = null;
  };

  // Guardar cambios y notificar al padre
  const handleSave = () => {
    // Aquí enviamos las fotos eliminadas y las nuevas fotos al padre
    onSave && onSave({ deletedPhotos, newPhotos });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Editar Fotos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {currentPhotos.length > 0 ? (
          currentPhotos.map((foto, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Box
                sx={{
                  position: "relative",
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
                  src={foto.url_imagen}
                  alt={`Foto ${idx + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Tooltip title="Eliminar foto">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(foto)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: colors.primary[700],
                      color: "white",
                      "&:hover": {
                        bgcolor: colors.primary[900],
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))
        ) : (
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
      </Grid>

      {/* Input para agregar fotos */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<AddPhotoAlternateIcon />}
        sx={{ mb: 2 }}
      >
        Agregar fotos
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </Button>

      {/* Botones acción */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>

      {/* Dialogo confirmacion para borrar */}
      <Dialog open={Boolean(photoToDelete)} onClose={cancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar esta foto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhotosEditor;
