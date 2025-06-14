import React, { useState, useEffect } from 'react';
import { placeByUserIdRequest } from '../../api/place.js';
import { placeServiceByUserIdRequest } from '../../api/service.js';
import { placeServiceProcessByUserIdRequest } from '../../api/process.js';
import { Card, CardContent, Avatar, Typography, Chip, Box, Divider, Stack, useTheme } from '@mui/material';
import { CardActionArea } from '@mui/material';
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { tokens } from "../../theme";
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'

function StepTwo({ onNextTwo, onFormDataTwo }) {
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [selectedProcesses, setSelectedProcesses] = useState({});
    const user = useSelector(state => state.user);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");

    const getPlaces = async (user_id) => {
        try {
            setIsLoading(true)
            const response = await placeByUserIdRequest(user_id);
            setPlaces(response.data);
            console.log(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching places:", error);
            setIsLoading(false)
        }
    };

    useEffect(() => {        
        getPlaces(user.user_id);
    }, []);

    const handleCardClick = (place_id) => {
        setSelectedPlace(place_id);
        setSelectedService(null);

        placeServiceByUserIdRequest(user.user_id, place_id)
            .then(response => {
                console.log(response.data);
                const servicesWithSelection = response.data.map(service => ({
                    ...service,
                    active: selectedProcesses[place_id]?.[service.service_id]?.length > 0 || false
                }));
                setServices(servicesWithSelection);
                setProcesses([]); // Clear processes when selecting a new place
            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    };

    const handleServiceChipClick = (service_id) => {
        setSelectedService(service_id);
        placeServiceProcessByUserIdRequest(user.user_id, selectedPlace, service_id)
            .then(response => {
                console.log(response.data);
                const processesWithSelection = response.data.map(process => ({
                    ...process,
                    active: selectedProcesses[selectedPlace]?.[service_id]?.includes(process.process_id) || false
                }));
                setProcesses(processesWithSelection);
            })
            .catch(error => {
                console.error("Error fetching processes:", error);
            });
    };

    const handleProcessChipClick = (process_id) => {
        const updatedSelectedProcesses = { ...selectedProcesses };
        if (selectedPlace && selectedService) {
            if (!updatedSelectedProcesses[selectedPlace]) {
                updatedSelectedProcesses[selectedPlace] = {};
            }
            if (!updatedSelectedProcesses[selectedPlace][selectedService]) {
                updatedSelectedProcesses[selectedPlace][selectedService] = [];
            }
            if (updatedSelectedProcesses[selectedPlace][selectedService].includes(process_id)) {
                updatedSelectedProcesses[selectedPlace][selectedService] = updatedSelectedProcesses[selectedPlace][selectedService].filter(id => id !== process_id);
            } else {
                updatedSelectedProcesses[selectedPlace][selectedService].push(process_id);
            }

            const processesSelected = updatedSelectedProcesses[selectedPlace][selectedService].length > 0;

            if (!processesSelected) {
                delete updatedSelectedProcesses[selectedPlace][selectedService];
                if (Object.keys(updatedSelectedProcesses[selectedPlace]).length === 0) {
                    delete updatedSelectedProcesses[selectedPlace];
                }
            }

            setSelectedProcesses(updatedSelectedProcesses);

            const updatedProcesses = processes.map(process =>
                process.process_id === process_id
                ? { ...process, active: !process.active }
                : process
            );
            setProcesses(updatedProcesses);

            console.log(JSON.stringify(updatedSelectedProcesses, null, 2));
        }
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const transformedData = transformData(selectedProcesses);

      if (transformedData.length === 0) {
        setAlertOpen(true)
        setAlertType("error")
        setAlertMessage("¡Error! Debes seleccionar al menos un proceso.")
        //console.log('Debes seleccionar al menos un proceso.');
        return;
    }

    console.log("transformedData", transformedData)

      onNextTwo(transformedData);
      onFormDataTwo(transformedData);
    };

    const transformData = (selectedProcesses) => {
        const transformedData = [];
    
        Object.keys(selectedProcesses).forEach(placeId => {
            Object.keys(selectedProcesses[placeId]).forEach(serviceId => {
                selectedProcesses[placeId][serviceId].forEach(processId => {
                    transformedData.push({ placeId: parseInt(placeId), serviceId: parseInt(serviceId), processId: parseInt(processId) });
                });
            });
        });
    
        return transformedData;
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
        <LoadingModal open={isLoading}/>
            <CustomAlert
              alertOpen={alertOpen}
              type={alertType}
              message={alertMessage}
              onClose={setAlertOpen}
            />
            <Typography variant="h5" gutterBottom>
            Selecciona la plaza
            </Typography>
            <Divider sx={{ backgroundColor: '#5EBFFF' }} />
            <Box mb={2} mt={1} >
                <Card variant="outlined" sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>                    
                    <Box sx={{ p: 1}} >                        
                        <Stack direction="row" spacing={1}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {places.map(place => (
                                    <div key={place.place_id} style={{ margin: '5px' }}>
                                        <Card
                                            style={{
                                                width: 100,
                                                height: 150,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                backgroundColor: selectedPlace === place.place_id ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.1)',
                                            }}
                                            onClick={() => handleCardClick(place.place_id)}
                                        >
                                            <CardActionArea style={{ flexGrow: 1 }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Avatar
                                                        alt={place.name}
                                                        src={place.image}
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                            margin: 'auto',
                                                            marginBottom: '10px'
                                                        }}
                                                    />
                                                    <CardContent style={{ textAlign: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {place.name}
                                                        </Typography>
                                                    </CardContent>
                                                </div>
                                            </CardActionArea>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </Stack>
                    </Box>
                </Card>
            </Box>
            <Typography variant="h5" gutterBottom>
            Selecciona un servicio
            </Typography>
            <Divider sx={{ backgroundColor: '#5EBFFF' }} />
            <Box mb={2} mt={1}>
                <Card variant="outlined" sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>                    
                    <Box sx={{ p: 1 }}>                        
                        <Stack direction="row" spacing={1}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {services.map(service => (
                                    <div key={service.service_id} style={{ margin: '10px' }}>
                                        <Chip
                                            label={service.name}
                                            clickable
                                            color={selectedService === service.service_id ? "secondary" : (service.active ? "secondary" : "default")}
                                            onClick={() => handleServiceChipClick(service.service_id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Stack>
                    </Box>
                </Card>
            </Box>
            <Typography variant="h5" gutterBottom>
            selecciona los procesos
            </Typography>
            <Divider sx={{ backgroundColor: '#5EBFFF' }} />
            <Box mt={1}>
                <Card variant="outlined" sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>
                    <Box sx={{ p: 1 }}>                        
                        <Stack direction="row" spacing={1}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {processes.map(process => (
                                    <div key={process.process_id} style={{ margin: '10px' }}>
                                        <Chip
                                            label={process.name}
                                            clickable
                                            color={process.active ? "secondary" : "default"}
                                            onClick={() => handleProcessChipClick(process.process_id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Stack>
                    </Box>
                </Card>
            </Box>
            <Box mt={2}>
                <Button type="submit" sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }} variant="contained" color="secondary" endIcon={<KeyboardTabIcon />}>
                    Siguiente
                </Button>
            </Box>
        </div>
      </form>
    );
}

export default StepTwo;
