import React, { useState } from "react";
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect';
import ServiceSelect from '../../components/ServiceSelect';
import { Box, useTheme, Button, Grid, Chip, TextField, Avatar, Typography } from "@mui/material";
import LoadingModal from '../../components/LoadingModal.jsx';
import CustomAlert from '../../components/CustomAlert.jsx';
import { ManageSearch } from "@mui/icons-material";
import { photoManagementRequest } from '../../api/management.js';

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedFinishDate, setSelectedFinishDate] = useState('');
  const [result, setResult] = useState([]);
  const [selectedChips, setSelectedChips] = useState(new Set()); // Usa un Set para chips seleccionados
  const [selectedChipNames, setSelectedChipNames] = useState([]); // Array para nombres de chips seleccionados
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
    setSelectedService('');
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setSelectedStartDate(event.target.value);
  };

  const handleFinishDateChange = (event) => {
    setSelectedFinishDate(event.target.value);
  };

  const handleGetPhotoManagement = async () => {
    try {
      if (!selectedPlace || !selectedService || !selectedStartDate || !selectedFinishDate) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Todos los campos son obligatorios");
        return;
      }

      setIsLoading(true);

      const response = await photoManagementRequest(selectedPlace, selectedService, selectedStartDate, selectedFinishDate);
      setResult(response.data);
      setIsLoading(false);
      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("¡Felicidades! Se generó el proceso correctamente");
    } catch (error) {
      setIsLoading(false);
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage(error.response?.status === 400 ? "¡Atención! No se encontraron pagos" : "¡Error inesperado!");
      setResult([]);
    }
  };

  const uniqueEntries = Array.from(
    new Map(result.map(item => [item.nombre, { ...item, id: `${item.nombre}-${Math.random()}` }])).values()
  );

  const handleChipClick = (id) => {
    setSelectedChips(prevSelectedChips => {
      const newChips = new Set(prevSelectedChips);
      if (newChips.has(id)) {
        newChips.delete(id); // Deselecciona el chip
      } else {
        newChips.add(id); // Selecciona el chip
      }

      // Obtener nombres de chips seleccionados
      const newNames = Array.from(newChips).map(chipId => {
        const entry = uniqueEntries.find(entry => entry.id === chipId);
        return entry ? entry.nombre : null; // Evita el acceso a propiedades de undefined
      }).filter(name => name !== null); // Filtra valores nulos

      setSelectedChipNames(newNames);
      console.log("Chips seleccionados:", newNames); // Muestra los nombres seleccionados
      return newChips;
    });
  };

  const filteredData = result.filter(item =>
    selectedChips.size === 0 || selectedChips.has(uniqueEntries.find(e => e.nombre === item.nombre)?.id)
  );

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
        <LoadingModal open={isLoading} />
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertOpen(false)}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <PlaceSelect                
              selectedPlace={selectedPlace}
              handlePlaceChange={handlePlaceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ServiceSelect
              selectedPlace={selectedPlace}
              selectedService={selectedService}
              handleServiceChange={handleServiceChange}
            />
          </Grid>              
        </Grid>
        <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
          <Grid item xs={4}>
            <TextField
              id="start-date"
              label="Fecha de inicio"
              type="date"
              sx={{ width: '100%' }}
              value={selectedStartDate}
              onChange={handleStartDateChange}                  
              InputLabelProps={{ shrink: true }}                  
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="finish-date"
              label="Fecha final"
              type="date"
              sx={{ width: '100%' }}
              value={selectedFinishDate}
              onChange={handleFinishDateChange}                  
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>                
            <Button 
              variant="contained"                   
              style={{ width: '100%', height: '100%' }}
              onClick={handleGetPhotoManagement}                  
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              startIcon={<ManageSearch />} 
            >                      
              Buscar                      
            </Button>
          </Grid>
        </Grid>

        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {uniqueEntries.map((entry) => (
            <Chip
              key={entry.id}
              avatar={
                <Avatar
                  src={entry.foto}
                  sx={{ width: 80, height: 80, mr: 1 }}
                />
              }
              label={<Typography variant="body2">{entry.nombre}</Typography>}
              clickable
              color={selectedChips.has(entry.id) ? "secondary" : "default"}
              onClick={() => handleChipClick(entry.id)}
              sx={{
                cursor: 'pointer',
                bgcolor: selectedChips.has(entry.id) ? 'secondary.main' : 'background.default',
                '&:hover': { bgcolor: 'secondary.light' },
                color: selectedChips.has(entry.id) ? 'white' : 'inherit',
              }}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Index;
