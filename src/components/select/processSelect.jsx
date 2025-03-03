import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProcessSelect = ({ selectedPlace, selectedService, selectedProcess, handleProcessChange, setSelectedProcess }) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process;
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    if (selectedPlace && selectedService) {
      const selectedPlaceData = placeServiceProcess.find(plaza => plaza.id_plaza === selectedPlace);
      if (selectedPlaceData) {
        const selectedServiceData = selectedPlaceData.servicios.find(servicio => servicio.id_servicio === selectedService);
        if (selectedServiceData) {
          setProcesses(selectedServiceData.procesos);
          if (selectedServiceData.procesos.length > 0 && !selectedProcess) {
            setSelectedProcess(selectedServiceData.procesos[0].id_proceso);
          }
        } else {
          setProcesses([]);
        }
      } else {
        setProcesses([]);
      }
    }
  }, [selectedPlace, selectedService, placeServiceProcess, selectedProcess, setSelectedProcess]);

  return (
    <FormControl fullWidth>
      <InputLabel id="process-select-label">Selecciona Proceso</InputLabel>
      <Select
        labelId="process-select-label"
        id="process-select"
        value={selectedProcess}
        onChange={handleProcessChange}
        label="Selecciona Proceso"
      >
        {processes.map((proceso) => (
          <MenuItem key={proceso.id_proceso} value={proceso.id_proceso}>
            {proceso.nombre_proceso}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProcessSelect;