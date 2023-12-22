import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';

import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import {getValidPayment} from '../../services/payment.service.js'
import { useSelector } from 'react-redux'// material ui
import { Box, useTheme, Button} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import EventIcon from '@mui/icons-material/Event';
import InputAdornment from '@mui/material/InputAdornment';

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(state => state.user)    
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedValidDays, setSelectedValidDays] = React.useState('');
    const [selectedStartDate, setSelectedStartDate] = React.useState('');
    const [selectedFinishDate, setSelectedFinishDate] = React.useState('');
    const [isLoading, setIsLoading] = useState(false)

      const handlePlaceChange = (event) => {
        setSelectedPlace(event.target.value);  
        setSelectedService('');      
      };

      const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
        setSelectedProcess([])
      };

      const handleProcessChange = (event) => {
        //setSelectedProcess(event.target.value);
        setSelectedProcess(Array.isArray(event.target.value) ? event.target.value : [event.target.value]);
      };      

      const handleValidDaysChange = (event) => {
        setSelectedValidDays(event.target.value);
      };

      const handleStartDateChange = (event) => {
        setSelectedStartDate(event.target.value);
      };

      const handleFinishDateChange = (event) => {
        setSelectedFinishDate(event.target.value);
      };

      const handleGetValidPayment = async () => {
        try {
          setIsLoading(true)

          // Concatenar los valores del array con un separador, por ejemplo, coma (',')
          const concatenatedValues = selectedProcess.join(', ');

          // Utilizar la cadena concatenada como desees
          console.log('proceso concatenado', concatenatedValues);
          const type = 1

          const result = await getValidPayment(selectedPlace, selectedService, selectedProcess,selectedValidDays, selectedStartDate, selectedFinishDate, type);
          console.log(result)

          
        } catch (error) {
          setIsLoading(false)
          console.error("Error:", error);
          //setError("¡Error al convertir Excel a Array!");
        }        
      };


      console.log('place_id', selectedPlace)
      console.log('service_id',selectedService)      
      console.log('process_id', selectedProcess)
      console.log('days', selectedValidDays)
      console.log('start_date', selectedStartDate)
      console.log('finish_date', selectedFinishDate)
      console.log('isLoading', isLoading)



    return (
        <>
          <Box
              m='20px 0'
              display='flex'
              justifyContent='space-evenly'
              flexWrap='wrap'
              gap='20px'
              sx={{ backgroundColor: colors.primary[400], width: '100%' }}
              padding='15px 10px'
              borderRadius='10px'
          >

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />
              </Grid>
              <Grid item xs={4}>
                <ServiceSelect
                  selectedPlace={selectedPlace}                  
                  selectedService={selectedService}
                  handleServiceChange={handleServiceChange}
                />
              </Grid>
              <Grid item xs={4}>
                <ProcessSelect
                  selectedPlace={selectedPlace}
                  selectedService={selectedService}
                  selectedProcess={selectedProcess}
                  handleProcessChange={handleProcessChange}
                />
              </Grid>
            </Grid>
            
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={3}>
                <FormControl variant="filled" sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-standard-label">Numero de dias antes del pago:</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedValidDays}
                    onChange={handleValidDaysChange}
                    label="Days"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={30}>30 dias</MenuItem>
                    <MenuItem value={60}>60 dias</MenuItem>
                    <MenuItem value={90}>90 dias</MenuItem>
                    <MenuItem value={120}>120 dias</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="start-date"
                  label="Fecha de inicio"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedStartDate}
                  onChange={handleStartDateChange}
                  defaultValue="2023-01-01"                 
                  InputLabelProps={{
                    shrink: true,
                  }}
                  IInputProps={{
                    endAdornment: (
                      <InputAdornment position="end"  style={{ color: 'green' }} >
                        <EventIcon/>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="finish-date"
                  label="Fecha final"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedFinishDate}
                  onChange={handleFinishDateChange}
                  defaultValue="2023-01-01"                 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="contained" 
                  color="primary"
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    handleGetValidPayment();                    
                  }}
                  >
                  Generar
                </Button>
              </Grid>
            </Grid>
          </Box>                 

        </>

    );
};
export default Index;