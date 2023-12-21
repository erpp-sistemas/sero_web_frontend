import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { getPlacesByUserId } from '../services/place.service.js';


function PlaceSelect({ selectedPlace, handlePlaceChange }) {
  const user = useSelector((state) => state.user);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    async function loadPlaces() {
      const res = await getPlacesByUserId(user.user_id);
      setPlaces(res);
    }

    loadPlaces();
  }, [user]);

  return (
    <TextField
      id="filled-select-places"
      select
      label="Plazas"
      variant="filled"
      sx={{ width: '100%' }}
      value={selectedPlace}
      onChange={handlePlaceChange}
    >
      {places.map((place) => (
        <MenuItem key={place.place_id} value={place.place_id}>
          {place.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default PlaceSelect;