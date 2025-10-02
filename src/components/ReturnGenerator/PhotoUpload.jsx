import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {  
  DeleteOutline,  
  PhotoCameraOutlined,
  
} from "@mui/icons-material";
import { tokens } from "../../theme";

const PhotoUpload = ({ onPhotosChange, maxPhotos = 5 }) => {
  const [photos, setPhotos] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.slice(0, maxPhotos - photos.length);

    const base64Photos = await Promise.all(
      newFiles.map(async (file) => {
        const base64 = await fileToBase64(file);
        return { base64 };
      })
    );

    const updatedPhotos = [...photos, ...base64Photos];
    setPhotos(updatedPhotos);

    if (typeof onPhotosChange === "function") {
      onPhotosChange(updatedPhotos); // devuelve [{ base64 }]
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);

    if (typeof onPhotosChange === "function") {
      onPhotosChange(updatedPhotos);
    }
  };

  return (
    <Box mb={3}>
      <Typography
        variant="body1"
        color={colors.grey[100]}
        mb={1}
        sx={{ fontWeight: 500 }}
      >
        Evidencia Fotográfica ({photos.length}/{maxPhotos})
      </Typography>

      <Button
        variant="contained"
        component="label"
        endIcon={
          <PhotoCameraOutlined
            sx={{ fontSize: 18, color: colors.textAccent }}
          />
        }
        disabled={photos.length >= maxPhotos}
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
          transition: "background-color 0.3s ease, box-shadow 0.2s ease",
          boxShadow: "none", // minimalismo: sin sombra por defecto
          "&:hover, &:active": {
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
          },
        }}
      >
        Agregar Fotos
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </Button>

      <Grid container spacing={2} mt={1}>
        {photos.map((photo, index) => (
          <Grid item xs={4} key={index}>
            <Box
              position="relative"
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <img
                src={photo.base64}
                alt={`Evidencia ${index + 1}`}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  textTransform: "none", // minimalista, sin mayúsculas forzadas
                  borderRadius: "10px", // bordes redondeados suaves
                  fontWeight: 500,
                  fontSize: "0.875rem", // tamaño legible, consistente
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px", // espacio limpio entre texto e icono
                  backgroundColor: colors.accentGreenSecondary[100], // color normal
                  color: colors.textAccentSecondary, // contraste legible
                  border: "none",
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor: colors.accentGreenSecondary[200], // hover sutil
                  },
                  "&:active": {
                    backgroundColor: colors.accentGreenSecondary[300], // feedback presionado
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
                onClick={() => removePhoto(index)}
              >
                <DeleteOutline
                  sx={{ fontSize: 18, color: colors.textAccentSecondary }}
                />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoUpload;
