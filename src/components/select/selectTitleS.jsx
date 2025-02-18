import React, { useState, useEffect, memo } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/loading-8.json';

function SelectTitleS({ 
  data , 
  label = 'Selecciona una opción', 
  selectedValue, 
  onChange, 
  isLoading = false 
}) {
  // ✅ Filtrar solo valores válidos
  const isValidValue = (value) => data.some((item) => item.id === value);

  // ✅ Establecer el valor inicial solo si es válido, de lo contrario, usar el primer valor disponible
  const getInitialValue = () => {
    if (isValidValue(selectedValue)) return selectedValue;
    return data.length > 0 ? data[0].id : '';
  };

  const [localValue, setLocalValue] = useState(getInitialValue);

  // ✅ Si `selectedValue` cambia y es válido, actualizar el estado local
  useEffect(() => {
    if (isValidValue(selectedValue)) {
      setLocalValue(selectedValue);
    }
  }, [selectedValue, data]);

  // ✅ Si `data` cambia y `selectedValue` es inválido, asignar el primer valor válido
  useEffect(() => {
    if (!isValidValue(localValue)) {
      const newValue = data.length > 0 ? data[0].id : '';
      setLocalValue(newValue);
      onChange({ target: { value: newValue } });
    }
  }, [data]);

  const handleChange = (event) => {
    setLocalValue(event.target.value);
    onChange(event);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        select
        label={label}
        variant="outlined"
        sx={{ width: '100%' }}
        value={localValue}
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
          <Typography variant="body2" sx={{ mr: 1, color: 'gray' }}>
            Cargando...
          </Typography>
          <Lottie animationData={loadingAnimation} style={{ width: 60, height: 60 }} />
        </Box>
      )}
    </Box>
  );
}

export default memo(SelectTitleS);
