import { useRef, useState } from "react";
import { Avatar, IconButton, FormControl, FormHelperText, Tooltip, Box, Snackbar, Alert } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // Imagen por defecto

export default function PhotoUpload({ photoUrl, onPhotoChange }) {
  const fileInputRef = useRef();
  const [animationKey, setAnimationKey] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(file.type)) {
        setError("Formato no permitido. Solo JPG o PNG.");
        event.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result);
        setAnimationKey(prev => prev + 1); // activa animación
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhoto = () => {
    onPhotoChange(""); // Quitar foto
    setAnimationKey(prev => prev + 1);
  };

  const handleCloseError = () => {
    setError("");
  };

  return (
    <FormControl fullWidth>
      <Box display="flex" justifyContent="center">
        <Box display="flex" alignItems="center" gap={2}>
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar
              src={photoUrl}
              sx={{ width: 64, height: 64 }}
            />
          </motion.div>

          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={photoUrl ? "Cambiar Foto" : "Subir Foto"}>
              <IconButton
                color="info"
                onClick={handleButtonClick}
                size="small"
              >
                <PhotoCamera />
              </IconButton>
            </Tooltip>

            <AnimatePresence>
              {photoUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tooltip title="Eliminar Foto">
                    <IconButton
                      color="error"
                      onClick={handleRemovePhoto}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      <FormHelperText sx={{ textAlign: "center", width: "100%", mt: 1 }}>
        JPG o PNG
      </FormHelperText>

      <input
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Snackbar para errores */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </FormControl>
  );
}
