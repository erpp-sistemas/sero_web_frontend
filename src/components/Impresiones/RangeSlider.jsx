import {React,useEffect, useState} from 'react';
import {Box,Typography,Slider} from '@mui/material';


function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider({total}) {
  const [value, setValue] = useState([0, 0]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setValue([0,total])
  }, [total])
  

  return (
<>
<Typography   color={'secondary'} fontSize={'1rem'}>Rango de generación de fichas ( {`${value[0]} , ${value[1]||0}`} ) </Typography>

    <Box sx={{ width: "80%" }}>
      <Slider
        color='secondary'
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        step={total<50?1:10}
        max={total}
        marks
      />
    </Box>

</>
  );
}