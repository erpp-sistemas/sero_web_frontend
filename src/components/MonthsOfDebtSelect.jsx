import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { MonthsOfDebtRequest } from '../api/debt'

function MonthsOfDebtSelect({ selectedPlace, selectedService, selectedMonth, handleMonthsChange }) {
  
  const [months, setMonths] = useState([])

  useEffect(() => {
    if (selectedPlace || selectedService) {
      async function loadMonths() {
        const res = await MonthsOfDebtRequest(selectedPlace, selectedService);

        const monthNamesMap = {
            "January": "Enero",
            "February": "Febrero",
            "March": "Marzo",
            "April": "Abril",
            "May": "Mayo",
            "June": "Junio",
            "July": "Julio",
            "August": "Agosto",
            "September": "Septiembre",
            "October": "Octubre",
            "November": "Noviembre",
            "December": "Diciembre"
          };
  
          const formattedMonths = res.data.map(item => ({
            ...item,
            month: item.month.split('-').map(part => monthNamesMap[part] || part).join('-')
          }));
  
          setMonths(formattedMonths);
          console.log(formattedMonths)
        
      }

      if (selectedService) {
        loadMonths();        
      } else {
        setMonths([]);
      }
    }
  }, [selectedPlace, selectedService]);

  return (
    <>
        <TextField
      id="filled-select-service"
      select
      label="Mes de Adeudo"
      variant="filled"
      sx={{ width: '100%' }}
      value={selectedMonth}
      onChange={handleMonthsChange}
    >
        
      {months.map((month) => (
        <MenuItem key={month.id} value={month.date}>
          {month.month}
        </MenuItem>
      ))}
    </TextField>
    </>
  );
}

export default MonthsOfDebtSelect;