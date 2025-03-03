import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PlaceSelect = ({ selectedPlace, handlePlaceChange, setSelectedPlace }) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process;

  useEffect(() => {
    if (placeServiceProcess.length > 0 && !selectedPlace) {
      setSelectedPlace(placeServiceProcess[0].id_plaza);
    }
  }, [placeServiceProcess, selectedPlace, setSelectedPlace]);

  return (
    <FormControl fullWidth>
      <InputLabel id="place-select-label">Selecciona Plaza</InputLabel>
      <Select
        labelId="place-select-label"
        id="place-select"
        value={selectedPlace}
        onChange={handlePlaceChange}
        label="Selecciona Plaza"
      >
        {placeServiceProcess.map((plaza) => (
          <MenuItem key={plaza.id_plaza} value={plaza.id_plaza}>
            {plaza.nombre_plaza}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlaceSelect;