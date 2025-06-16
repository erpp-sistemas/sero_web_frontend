import React, { useState, useEffect } from 'react';
import { placeByUserIdRequest } from '../../api/place.js';
import { placeServiceByUserIdRequest } from '../../api/service.js';
import { placeServiceProcessByUserIdRequest } from '../../api/process.js';
import { Typography, Divider, Box, useTheme, IconButton, Checkbox } from '@mui/material';
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    };

    useEffect(() => {        
        getPlaces(user.user_id);
    }, []);

    // Helpers para saber si hay procesos asignados a una plaza/servicio
    const hasAssignedProcesses = (place_id) => {
        if (!selectedProcesses[place_id]) return false;
        return Object.values(selectedProcesses[place_id]).some(arr => arr.length > 0);
    };
    const hasAssignedProcessesService = (place_id, service_id) => {
        return selectedProcesses[place_id]?.[service_id]?.length > 0;
    };

    // Limpiar todos los procesos y servicios de una plaza
    const handleClearPlace = (place_id) => {
        const updated = { ...selectedProcesses };
        delete updated[place_id];
        setSelectedProcesses(updated);
        // Si la plaza activa es la que se limpia, resetea selección
        if (selectedPlace === place_id) {
            setSelectedPlace(null);
            setSelectedService(null);
            setServices([]);
            setProcesses([]);
        }
    };

    // Limpiar todos los procesos de un servicio
    const handleClearService = (place_id, service_id) => {
        const updated = { ...selectedProcesses };
        if (updated[place_id]) {
            delete updated[place_id][service_id];
            if (Object.keys(updated[place_id]).length === 0) {
                delete updated[place_id];
            }
        }
        setSelectedProcesses(updated);
        if (selectedService === service_id) {
            setSelectedService(null);
            setProcesses([]);
        }
    };

    // Seleccionar plaza (mostrar servicios)
    const handleSelectPlace = (place_id) => {
        setSelectedPlace(place_id);
        setSelectedService(null);
        setProcesses([]);
        placeServiceByUserIdRequest(user.user_id, place_id)
            .then(response => setServices(response.data))
            .catch(() => setServices([]));
    };

    // Seleccionar servicio (mostrar procesos)
    const handleSelectService = (service_id) => {
        setSelectedService(service_id);
        placeServiceProcessByUserIdRequest(user.user_id, selectedPlace, service_id)
            .then(response => setProcesses(response.data))
            .catch(() => setProcesses([]));
    };

    // Seleccionar proceso (checkbox)
    const handleProcessCheckbox = (process_id) => {
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
            // Limpia si no hay procesos seleccionados
            if (updatedSelectedProcesses[selectedPlace][selectedService].length === 0) {
                delete updatedSelectedProcesses[selectedPlace][selectedService];
                if (Object.keys(updatedSelectedProcesses[selectedPlace]).length === 0) {
                    delete updatedSelectedProcesses[selectedPlace];
                }
            }
            setSelectedProcesses(updatedSelectedProcesses);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const transformedData = transformData(selectedProcesses);
        if (transformedData.length === 0) {
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar al menos un proceso.")
            return;
        }
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

    // Helpers para saber si está seleccionado
    const isProcessActive = (place_id, service_id, process_id) => {
        return selectedProcesses[place_id]?.[service_id]?.includes(process_id) || false;
    };

    return (
        <form onSubmit={handleSubmit}>
            <LoadingModal open={isLoading}/>
            <CustomAlert
                alertOpen={alertOpen}
                type={alertType}
                message={alertMessage}
                onClose={setAlertOpen}
            />
            <div className="flex flex-row gap-4 w-full">
                {/* Tabla de Plazas */}
                <div className="flex-1">
                    <Typography variant="h6" gutterBottom>Plazas</Typography>
                    <Divider sx={{ backgroundColor: '#5EBFFF' }} />
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 text-left">Plaza</th>
                                    <th className="px-2 py-2 text-left">Acción</th>
                                    <th className="px-2 py-2 text-left">Selección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places.map(place => {
                                    const active = selectedPlace === place.place_id;
                                    const assigned = hasAssignedProcesses(place.place_id);
                                    return (
                                        <tr
                                            key={place.place_id}
                                            className={active ? "bg-blue-400" : ""}
                                            // Si usas MUI v5+, puedes usar sx en lugar de className para más control
                                        >
                                            {/* Plaza + icono */}
                                            <td className="px-2 py-2 flex items-center gap-2">
                                                {place.name}
                                                {assigned ? (
                                                    <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />
                                                ) : (
                                                    <CancelIcon sx={{ color: 'red', fontSize: 20 }} />
                                                )}
                                            </td>
                                            {/* Acción */}
                                            <td className="px-2 py-2">
                                                {assigned && (
                                                    <IconButton color="error" onClick={() => handleClearPlace(place.place_id)}>
                                                        <BlockIcon />
                                                    </IconButton>
                                                )}
                                            </td>
                                            {/* Selección */}
                                            <td className="px-2 py-2">
                                                <IconButton color={active ? "primary" : "default"} onClick={() => handleSelectPlace(place.place_id)}>
                                                    <SkipNextIcon />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Tabla de Servicios */}
                <div className="flex-1">
                    <Typography variant="h6" gutterBottom>Servicios</Typography>
                    <Divider sx={{ backgroundColor: '#5EBFFF' }} />
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 text-left">Servicio</th>
                                    <th className="px-2 py-2 text-left">Acción</th>
                                    <th className="px-2 py-2 text-left">Selección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => {
                                    const active = selectedService === service.service_id;
                                    const assigned = hasAssignedProcessesService(selectedPlace, service.service_id);
                                    return (
                                        <tr
                                            key={service.service_id}
                                            className={active ? "bg-blue-400" : ""}
                                        >
                                            {/* Servicio + icono */}
                                            <td className="px-2 py-2 flex items-center gap-2">
                                                {service.name}
                                                {assigned ? (
                                                    <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />
                                                ) : (
                                                    <CancelIcon sx={{ color: 'red', fontSize: 20 }} />
                                                )}
                                            </td>
                                            {/* Acción */}
                                            <td className="px-2 py-2">
                                                {assigned && (
                                                    <IconButton color="error" onClick={() => handleClearService(selectedPlace, service.service_id)}>
                                                        <BlockIcon />
                                                    </IconButton>
                                                )}
                                            </td>
                                            {/* Selección */}
                                            <td className="px-2 py-2">
                                                <IconButton color={active ? "primary" : "default"} onClick={() => handleSelectService(service.service_id)} disabled={!selectedPlace}>
                                                    <SkipNextIcon />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Tabla de Procesos */}
                <div className="flex-1">
                    <Typography variant="h6" gutterBottom>Procesos</Typography>
                    <Divider sx={{ backgroundColor: '#5EBFFF' }} />
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 text-left">Proceso</th>
                                    <th className="px-2 py-2 text-left">Selección</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processes.map(process => {
                                    const checked = isProcessActive(selectedPlace, selectedService, process.process_id);
                                    return (
                                        <tr key={process.process_id} className={checked ? "bg-blue-400" : ""}>
                                            {/* Proceso + icono */}
                                            <td className="px-2 py-2 flex items-center gap-2">
                                                {process.name}
                                                {checked ? (
                                                    <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />
                                                ) : (
                                                    <CancelIcon sx={{ color: 'red', fontSize: 20 }} />
                                                )}
                                            </td>
                                            {/* Selección */}
                                            <td className="px-2 py-2">
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={() => handleProcessCheckbox(process.process_id)}
                                                    color="primary"
                                                    disabled={!selectedService}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Box mt={2}>
                <Button type="submit" sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }} variant="contained" color="secondary" endIcon={<KeyboardTabIcon />}>
                    Siguiente
                </Button>
            </Box>
        </form>
    );
}

export default StepTwo;
