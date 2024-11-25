import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { getPlaceServiceProcessByUserId } from '../services/process.service';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';


function ProcessSelectMultipleChip({ selectedPlace, selectedService, selectedProcess, handleProcessChange }) {
  const user = useSelector((state) => state.user);
  const [process, setProcess] = useState([])

  useEffect(() => {
    if (selectedPlace || selectedService) {
      async function loadProcess() {
        const res = await getPlaceServiceProcessByUserId(user.user_id, selectedPlace, selectedService);
        setProcess(res);
      }

      if (selectedService) {
        loadProcess();
      } else {
        setProcess([]);
      }
    }
  }, [user, selectedService]);

  // Mapear los process_ids a sus nombres correspondientes
  const selectedProcessNames = selectedProcess.map((selectedId) =>
    process.find((proces) => proces.process_id === selectedId)?.name || ""
  );

  return (
    <>
      <FormControl variant='outlined' sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-chip-label">Procesos</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedProcess}
          onChange={handleProcessChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={() => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedProcessNames.map((name) => (
                <Chip key={name} label={name} />
              ))}
            </Box>
          )}
        >
          {process.map((proces) => (
            <MenuItem
              key={proces.process_id}
              value={proces.process_id}
            >
              {proces.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default ProcessSelectMultipleChip;