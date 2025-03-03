import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ServiceSelect = ({ selectedPlace, selectedService, handleServiceChange, setSelectedService }) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process;
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (selectedPlace) {
      const selectedPlaceData = placeServiceProcess.find(plaza => plaza.id_plaza === selectedPlace);
      if (selectedPlaceData) {
        setServices(selectedPlaceData.servicios);
        if (selectedPlaceData.servicios.length > 0 && !selectedService) {
          setSelectedService(selectedPlaceData.servicios[0].id_servicio);
        }
      } else {
        setServices([]);
      }
    }
  }, [selectedPlace, placeServiceProcess, selectedService, setSelectedService]);

  return (
    <FormControl fullWidth>
      <InputLabel id="service-select-label">Selecciona Servicio</InputLabel>
      <Select
        labelId="service-select-label"
        id="service-select"
        value={selectedService}
        onChange={handleServiceChange}
        label="Selecciona Servicio"
      >
        {services.map((servicio) => (
          <MenuItem key={servicio.id_servicio} value={servicio.id_servicio}>
            {servicio.nombre_servicio}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ServiceSelect;