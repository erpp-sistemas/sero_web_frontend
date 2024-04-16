import React, { useState, useEffect } from 'react';
import { placeByUserIdRequest } from '../../api/place.js';
import { placeServiceByUserIdRequest } from '../../api/service.js';
import { placeServiceProcessByUserIdRequest } from '../../api/process.js';
import { Card, CardContent, Avatar, Typography, Chip, Box, Divider, Stack } from '@mui/material';
import { CardActionArea } from '@mui/material';
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

function StepTwo({ onNextTwo, onFormDataTwo }) {
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [selectedProcesses, setSelectedProcesses] = useState({});
    const user = useSelector(state => state.user)

    const getPlaces = async (user_id) => {
        try {
            const response = await placeByUserIdRequest(user_id);
            setPlaces(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    useEffect(() => {        
        getPlaces(user.user_id);
    }, []);

    const handleCardClick = (place_id) => {
        setSelectedPlace(place_id);
        setSelectedService(null);
        setProcesses([]);
        placeServiceByUserIdRequest(user.user_id, place_id)
            .then(response => {
                console.log(response.data);
                setServices(response.data.map(service => ({
                    ...service,
                    active: service.active
                })));
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
                setProcesses(response.data.map(process => ({
                    ...process,
                    active: false
                })));
            })
            .catch(error => {
                console.error("Error fetching processes:", error);
            });
    };

    const handleProcessChipClick = (process_id) => {
        const updatedSelectedProcesses = { ...selectedProcesses };
        if (selectedPlace && selectedService) {
            if (updatedSelectedProcesses[selectedPlace] === undefined) {
                updatedSelectedProcesses[selectedPlace] = {};
            }
            if (updatedSelectedProcesses[selectedPlace][selectedService] === undefined) {
                updatedSelectedProcesses[selectedPlace][selectedService] = [];
            }
            if (updatedSelectedProcesses[selectedPlace][selectedService].includes(process_id)) {
                updatedSelectedProcesses[selectedPlace][selectedService] = updatedSelectedProcesses[selectedPlace][selectedService].filter(id => id !== process_id);
            } else {
                updatedSelectedProcesses[selectedPlace][selectedService].push(process_id);
            }
            setSelectedProcesses(updatedSelectedProcesses);
            console.log(JSON.stringify(updatedSelectedProcesses, null, 2));
        }
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      onNextTwo(selectedProcesses);
      onFormDataTwo(selectedProcesses)
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
            <Typography variant="h5" gutterBottom>
                Step Two
            </Typography>
            <Box mb={2} >
                <Card variant="outlined">
                    <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h5" component="div">
                                Plazas
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1}} >
                        <Typography gutterBottom variant="body2">
                            Selecciona la plaza
                        </Typography>
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
                                                backgroundColor: selectedPlace === place.place_id ? 'green' : ''
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
            <Box mt={2}>
                <Card variant="outlined">
                    <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h5" component="div">
                                Servicios
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <Typography gutterBottom variant="body2">
                            Selecciona un servicio
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {services.map(service => (
                                    <div key={service.service_id} style={{ margin: '10px' }}>
                                        <Chip
                                            label={service.name}
                                            clickable
                                            color={selectedService === service.service_id ? "success" : "default"}
                                            onClick={() => handleServiceChipClick(service.service_id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Stack>
                    </Box>
                </Card>
            </Box>

            <Box mt={2}>
                <Card variant="outlined">
                    <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h5" component="div">
                                Procesos
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <Typography gutterBottom variant="body2">
                            Procesos relacionados
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {processes.map(process => (
                                    <div key={process.process_id} style={{ margin: '10px' }}>
                                        <Chip
                                            label={process.name}
                                            clickable
                                            color={process.active ? "success" : "default"}
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
                <Typography gutterBottom variant="h5" component="div">
                    Procesos Seleccionados
                </Typography>
                {Object.keys(selectedProcesses).map(placeId => (
                    Object.keys(selectedProcesses[placeId]).map(serviceId => (
                        selectedProcesses[placeId][serviceId].length > 0 && (
                            <div key={`${placeId}-${serviceId}`}>
                                <Typography variant="body1">Plaza: {placeId}, Servicio: {serviceId}, Procesos: {selectedProcesses[placeId][serviceId].join(', ')}</Typography>
                            </div>
                        )
                    ))
                ))}
            </Box>
            <Box mt={2}>
            <Button type="submit" sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }} variant="contained" color="secondary" endIcon={<KeyboardTabIcon/>}>
            Siguiente
          </Button>
        </Box>
        </div>
      </form>
    );
}

export default StepTwo;
