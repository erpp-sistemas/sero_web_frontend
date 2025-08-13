import React, { useRef, useState } from "react";
import { Button, IconButton, Snackbar, Alert, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { NoPhotographyOutlined, UploadFile } from "@mui/icons-material";

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

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: reader.result,
          file,
          base64: reader.result,
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
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          marginBottom: 1.5, // 12px aprox
          color: colors.accentGreen[100],
        }}
      >
        Fotografías para subir
      </Typography>

      {/* Botón agregar foto */}
      <div className="mb-5">
        <Button
          variant="contained"
          color="info"
          onClick={handleAddPhotoClick}
          endIcon={<UploadFile />}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            borderColor: colors.grey[300],
            color: colors.grey[800],
            fontWeight: 500,
            fontSize: "0.875rem",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: colors.grey[100],
              borderColor: colors.primary[300],
              boxShadow: "none",
            },
          }}
        >
          Agregar foto
        </Button>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputFileRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Cuadrícula de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-full aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={photo.url}
              alt="Foto"
              className="w-full h-full object-cover"
            />

            <IconButton
              size="small"
              onClick={() => handleDeletePhoto(photo.id)}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "rgba(255,255,255,0.85)",
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
              <DeleteIcon sx={{ fontSize: 18, color: colors.grey[700] }} />
            </IconButton>
          </div>
        ))}

        {/* Mensaje si no hay fotos */}
        {photos.length === 0 && (
          <div className="col-span-full flex flex-col justify-center items-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-lg">
            <NoPhotographyOutlined
              sx={{ fontSize: 40, color: colors.grey[500], mb: 1 }}
            />
            No hay fotos disponibles
          </div>
        )}
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
