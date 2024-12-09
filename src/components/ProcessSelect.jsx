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


function ProcessSelect({ selectedPlace, selectedService, selectedProcess, handleProcessChange }) {
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

  return (
    <>
        <TextField
      id="filled-select-service"
      select
      label="Proceso"
      variant="outlined"      
      sx={{ width: '100%' }}
      value={selectedProcess}
      onChange={handleProcessChange}
    >
      {process.map((proces) => (
        <MenuItem key={proces.process_id} value={proces.process_id}>
          {proces.name}
        </MenuItem>
      ))}
    </TextField>
    </>
  );
}

export default ProcessSelect;