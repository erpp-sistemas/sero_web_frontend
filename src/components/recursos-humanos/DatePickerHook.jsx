import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import React, { useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'


const DatePickerHook = ({ fecha, setFecha,label }) => {
    const [stateFecha, setStateFecha] = useState(fecha ? dayjs(fecha) : null);
  
    useEffect(() => {
      if (fecha) {
        setStateFecha(dayjs(fecha));
      } else {
        setStateFecha(null);
      }
    }, [fecha]);
  
    useEffect(() => {
      if (stateFecha) {
        setFecha(stateFecha.format('YYYY-MM-DD'));
      } else {
        setFecha('');
      }
    }, [stateFecha, setFecha]);
  
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DemoItem label={label||""} sx={{backgroundColor:"green"}}>
            <DatePicker 
              value={stateFecha}
              views={['year', 'month', 'day']}
              onChange={(date) => {
                if (date) {
                  setStateFecha(dayjs(date));
                } else {
                  setStateFecha(null);
                }
              }}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    );
  };
  
  export default DatePickerHook;
  
