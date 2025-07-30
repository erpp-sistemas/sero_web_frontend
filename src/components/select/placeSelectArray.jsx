import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PlaceSelectArray = ({ selectedPlace, handlePlaceChange, setSelectedPlace }) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process;

  useEffect(() => {
    if (placeServiceProcess.length > 0 && !selectedPlace) {
      const defaultPlace = {
        id_plaza: placeServiceProcess[0].id_plaza,
        nombre_plaza: placeServiceProcess[0].nombre_plaza
      };
      setSelectedPlace(defaultPlace);
    }
  }, [placeServiceProcess, selectedPlace, setSelectedPlace]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedObj = placeServiceProcess.find(p => p.id_plaza === selectedId);
    if (selectedObj) {
      const placeData = {
        id_plaza: selectedObj.id_plaza,
        nombre_plaza: selectedObj.nombre_plaza
      };
      setSelectedPlace(placeData);
      handlePlaceChange(placeData); // ahora envía un objeto
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="place-select-label">Selecciona Plaza</InputLabel>
      <Select
        labelId="place-select-label"
        id="place-select"
        value={selectedPlace?.id_plaza || ''}
        onChange={handleChange}
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

export default PlaceSelectArray;
