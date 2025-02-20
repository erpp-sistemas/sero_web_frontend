import React, { useState, useEffect, memo } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { getPlacesByUserId } from '../services/place.service.js';
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/loading-8.json';

function PlaceSelectLektor({ selectedPlace, handlePlaceChange }) {
  const user = useSelector((state) => state.user);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      try {
        const res = await getPlacesByUserId(user.user_id);
        
        // Filtrar solo place_id = 5
        const filteredPlaces = res.filter(place => place.place_id === 5);
        setPlaces(filteredPlaces);

        // Seleccionar automáticamente place_id = 5 si no hay valor seleccionado
        if (!selectedPlace && filteredPlaces.length > 0) {
          handlePlaceChange({ target: { value: 5 } });
        }
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      loadPlaces();
    }
  }, [user?.user_id, handlePlaceChange]);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        id="filled-select-places"
        select
        label="Plazas"
        variant="outlined"
        sx={{ width: '100%' }}
        value={selectedPlace || ''}
        onChange={handlePlaceChange}
        disabled={loading}
      >
        {places.map((place) => (
          <MenuItem key={place.place_id} value={place.place_id}>
            {place.name}
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

export default memo(PlaceSelectLektor);
