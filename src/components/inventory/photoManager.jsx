import React, { useRef, useState } from "react";
import { Button, IconButton, Snackbar, Alert, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { AddPhotoAlternate, Margin } from "@mui/icons-material";

function PhotosManager({ photos, setPhotos }) {
  const inputFileRef = useRef(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleAddPhotoClick = () => {
    inputFileRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    let hasDuplicate = false;

    const newFiles = files.filter((file) => {
      const duplicate = photos.some(
        (p) =>
          p.file.name === file.name &&
          p.file.size === file.size &&
          p.file.type === file.type
      );
      if (duplicate) hasDuplicate = true;
      return !duplicate;
    });

    if (hasDuplicate) {
      setAlertOpen(true);
    }

    // Leer cada archivo como base64 y actualizar el estado
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: reader.result, // base64 para mostrar la imagen
          file,               // archivo original
          base64: reader.result, // base64 para guardar/enviar
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = null;
  };

  const handleDeletePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full">
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          paddingBottom: 1,
          color: colors.accentGreen[100],
        }}
      >
        Fotografias para subir
      </Typography>

      <Button
        variant="contained"
        color="info"
        onClick={handleAddPhotoClick}
        endIcon={<AddPhotoAlternate />}
        sx={{
          borderRadius: "35px",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Agregar foto
      </Button>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputFileRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative rounded overflow-hidden shadow"
          >
            <img
              src={photo.url}
              alt="Foto"
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded p-1">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeletePhoto(photo.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          No se puede subir la misma foto dos veces.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PhotosManager;
