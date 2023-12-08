import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Typography, Button, FormControl, InputLabel, Paper } from '@mui/material';
import { CloudUpload, PhotoCamera } from '@mui/icons-material';

function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [fotos, setFotos] = useState([]);
  const { handleSubmit, control, reset } = useForm(); // Inicializa RHF y obtén control

  const handleUploadFiles = (acceptedFiles) => {
    // Lógica para cargar archivos
    setFotos([...fotos, ...acceptedFiles]);
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const onSubmit = (data) => {
    // Maneja la subida de archivos utilizando los valores de RHF
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl component="fieldset">
        <InputLabel htmlFor="upload-button">
          Subir imágenes
        </InputLabel>
        <Paper
          elevation={3}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          sx={{
            display: 'flex',

          }}
        >
          <label htmlFor="upload-button">
            <input
              type="file"
              id="upload-button"
              accept="image/*"
              style={{ display: 'none' }}
              multiple
              onChange={(e) => {
                e.persist();
                handleUploadFiles(e.target.files);
                return reset({ upload: e.target.files }); // Actualiza el valor del campo con RHF
              }}
            />
          </label>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={3}
          >
            {isDragging ? (
              <>
                <PhotoCamera fontSize="large" />
                <Typography>¡Suelta para subir las imágenes!</Typography>
              </>
            ) : (
              <>
                <Typography>!Subiendo archivo las imágenes!</Typography>

              </>
            )}
          </Box>
        </Paper>
      </FormControl>
      <Button type="submit">Enviar</Button>
    </form>
  );
}

export default UploadSection;
