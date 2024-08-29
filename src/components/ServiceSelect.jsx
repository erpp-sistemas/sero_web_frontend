import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { getPlaceServiceByUserId } from '../services/service.service';

function ServiceSelect({ selectedPlace, selectedService, handleServiceChange }) {

  const user = useSelector((state) => state.user);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (selectedPlace) {
      async function loadServices() {
        const res = await getPlaceServiceByUserId(user.user_id, selectedPlace);
        setServices(res);        
      }

      loadServices();
    }
  }, [user, selectedPlace]);

  return (
    <TextField
      id="filled-select-service"
      select
      label="Servicio"
      variant="filled"
      sx={{ width: '100%' }}
      value={selectedService}
      onChange={handleServiceChange}
    >
      {services.map((service) => (
        <MenuItem key={service.service_id} value={service.service_id}>
          {service.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default ServiceSelect;