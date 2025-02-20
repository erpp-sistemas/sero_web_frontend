import React, { useState, useEffect, memo } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { getPlaceServiceByUserId } from '../services/service.service';
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/loading-8.json';

function ServiceSelectLektor({ selectedPlace, selectedService, handleServiceChange }) {
  const user = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      if (selectedPlace) {
        setLoading(true);
        try {
          const res = await getPlaceServiceByUserId(user.user_id, selectedPlace);
          setServices(res);

          // Seleccionar automáticamente la primera opción si no hay valor seleccionado
          if (!selectedService && res.length > 0) {
            handleServiceChange({ target: { value: res[0].service_id } });
          }
        } catch (error) {
          console.error('Error loading services:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setServices([]); // Limpiar servicios si no hay un lugar seleccionado
      }
    };

    loadServices();
  }, [user.user_id, selectedPlace, handleServiceChange]);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        id="filled-select-service"
        select
        label="Servicio"
        variant="outlined"
        sx={{ width: '100%' }}
        value={selectedService || ''}
        onChange={handleServiceChange}
        disabled={loading || !selectedPlace}
      >
        {services.map((service) => (
          <MenuItem key={service.service_id} value={service.service_id}>
            {service.name}
          </MenuItem>
        ))}
      </TextField>

      {loading && (
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

export default memo(ServiceSelectLektor);
