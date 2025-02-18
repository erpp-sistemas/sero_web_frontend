import React, { useState, useEffect } from "react";
import { TextField, MenuItem, CircularProgress, Box, Typography } from "@mui/material";
import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/loading-8.json';

function SelectTitle({ data, onSelect, messageDefault, isLoading }) {
  const [selectedItem, setSelectedItem] = useState("");

  // Efecto para seleccionar el ítem con el id más pequeño solo al cargar el componente
  useEffect(() => {
    if (data.length > 0 && !selectedItem) {
      const defaultItem = data.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));
      setSelectedItem(defaultItem.id); // Establecer el ítem con el id más pequeño
      if (onSelect) {
        onSelect(defaultItem); // Notificar al padre sobre la selección
      }
    }
  }, [data, selectedItem, onSelect]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedObj = data.find((item) => item.id === selectedId);
    setSelectedItem(selectedId);
    if (onSelect) {
      onSelect(selectedObj);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
    <TextField
      id="filled-select-places"
      select      
      variant="outlined"
      sx={{ width: '100%' }}
      label={isLoading ? "Cargando..." : messageDefault}
      value={isLoading ? "" : selectedItem}
      onChange={handleChange}
      disabled={isLoading}
      
    >
      {data.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
    {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            display: 'flex',
            alignItems: 'center',
            transform: 'translateY(-50%)',
            zIndex: 1,
            pointerEvents: 'none',
            pr: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mr: 1,
              color: 'gray',
            }}
          >
            Cargando...
          </Typography>
          <Lottie animationData={loadingAnimation} style={{ width: 60, height: 60 }} />
        </Box>
      )}
    </Box>
  );
}

export default SelectTitle;
