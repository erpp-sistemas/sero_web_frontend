import React, { useState } from 'react'
import { Box, useTheme, Typography, Button, FormControlLabel, FormGroup, Switch } from '@mui/material'

import VerifiedIcon from '@mui/icons-material/Verified';

import { tokens } from '../theme'

import { plazas, procesosByIdPlazaServicio, serviciosByPlaza } from '../data/plazas'

// validar con el useEffect si el usuario logueado es administrador entonces podra asignarle al usuario que se creara todas las plazas
// si el usuario logueado tiene una plaza entonces solo podra asignarle esa plaza al usuario creada

// obtener las plazas por el id_usuario_logueado


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



const SelectPlazaCreateUser = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [idPlazaSeleccionada, setIdPlazaSeleccionada] = useState(0)
    const [showServicios, setShowServicios] = useState(false)
    const [showProcesosAgua, setShowProcesosAgua] = useState(false)
    const [showProcesosPredio, setShowProcesosPredio] = useState(false)

   


    const handleSelectionPlaza = (id_plaza) => {
        console.log(document.getElementById(id_plaza.toString()).style.backgroundColor)
        if (document.getElementById(id_plaza.toString()).style.backgroundColor === 'rgba(46, 124, 103, 0.3)') {
            document.getElementById(id_plaza.toString()).style.backgroundColor = null
            setShowServicios(false)
        } else {
            document.getElementById(id_plaza.toString()).style.backgroundColor = 'rgba(46, 124, 103, 0.3)'
            setShowServicios(true)
        }

        // llamar a los procesos de la plaza seleccionada y mostrarlos
        setIdPlazaSeleccionada(id_plaza)
        getServiciosByIdPlaza(id_plaza)
        
    }

    const getServiciosByIdPlaza = (id_plaza) => {


    }

    const handleSwitch = (e, id_servicio) => {
        let checked = e.target.checked
        if (checked) {
            // llamar a los procesos de la plaza y el servicio seleccionado y mostrarlos
            getProcesosByIdPlazaServicio(idPlazaSeleccionada, id_servicio);
            id_servicio === 1 ? setShowProcesosAgua(true) : setShowProcesosPredio(true)
        } else {
            id_servicio === 1 ? setShowProcesosAgua(false) : setShowProcesosPredio(false)
        }
    }

    const getProcesosByIdPlazaServicio = (id_plaza, id_servicio) => {

    }

    const handleSwitchProceso = (e, id_proceso) => {
        let checked = e.target.checked;
        console.log(checked)
        console.log(id_proceso)
    }

    return (
        <>
            <Box
                m='20px 0'
                sx={{ backgroundColor: colors.primary[400], marginBottom: '20px' }}
                padding='30px 10px'
                borderRadius='7px'
            >
                <Box display='flex' justifyContent='space-evenly' alignItems='center'>

                    {plazas && plazas.map(plaza => (
                        <Box sx={{ padding: '20px', borderRadius: '7px' }} id={plaza.id_plaza.toString()} >
                            <Typography variant="caption" sx={{ display: 'inline-block', fontSize: '14px', color: colors.greenAccent[400] }}>
                                {plaza.nombre}
                            </Typography>
                            <img src={plaza.imagen} alt="logo imagen" style={{ width: '120px', height: '120px', marginBottom: '10px' }} />
                            <Button sx={{ width: '100%', color: colors.grey[200] }} onClick={() => handleSelectionPlaza(plaza.id_plaza)}>
                                <VerifiedIcon sx={{ fontSize: '36px' }} />
                            </Button>
                        </Box>
                    ))}

                </Box>

            </Box>

            {showServicios && (
                <Box
                    m='20px 0'
                    sx={{ backgroundColor: colors.primary[400], textAlign: 'center' }}
                    padding='20px 10px'
                    borderRadius='7px'
                >

                    <Typography variant="caption" sx={{ fontSize: '16px', color: colors.grey[200] }}>
                        Servicios activos de la plaza Cuautitlan Izcalli
                    </Typography>

                    <Box
                        display='flex'
                        justifyContent='center'
                        gap='20px'
                        sx={{ marginTop: '20px' }}
                    >
                        {serviciosByPlaza && serviciosByPlaza.map(servicio => (
                            <FormGroup sx={{ width: '31%' }}>
                                <FormControlLabel control={<Switch color="info" sx={{ width: '70px' }} />}
                                    label={servicio.nombre}
                                    onChange={e => handleSwitch(e, servicio.id_servicio)}
                                />
                            </FormGroup>
                        ))}
                    </Box>
                </Box>
            )}

            {showProcesosAgua && (
                <Box
                    m='20px 0'
                    sx={{ backgroundColor: colors.primary[400], textAlign: 'center' }}
                    padding='20px 10px'
                    borderRadius='7px'
                >

                    <Typography variant="caption" sx={{ fontSize: '16px', color: colors.grey[200] }}>
                        Procesos activos de Regularización de agua la plaza Cuautitlan Izcalli
                    </Typography>

                    <Box
                        display='flex'
                        justifyContent='center'
                        gap='20px'
                        flexWrap='wrap'
                        sx={{ marginTop: '20px' }}
                    >
                        {procesosByIdPlazaServicio && procesosByIdPlazaServicio.map(proceso => (
                            <FormGroup >
                                <FormControlLabel control={<Switch color="success" sx={{ width: '70px' }} />}
                                    label={proceso.nombre}
                                    onChange={e => handleSwitchProceso(e, proceso.id_proceso)}
                                />
                            </FormGroup>
                        ))}
                    </Box>
                </Box>
            )}

            {showProcesosPredio && (
                <Box
                    m='20px 0'
                    sx={{ backgroundColor: colors.primary[400], textAlign: 'center' }}
                    padding='20px 10px'
                    borderRadius='7px'
                >

                    <Typography variant="caption" sx={{ fontSize: '16px', color: colors.grey[200] }}>
                        Procesos activos de Regularización de predio la plaza Cuautitlan Izcalli
                    </Typography>

                    <Box
                        display='flex'
                        justifyContent='center'
                        gap='20px'
                        flexWrap='wrap'
                        sx={{ marginTop: '20px' }}
                    >
                        {procesosByIdPlazaServicio && procesosByIdPlazaServicio.map(proceso => (
                            <FormGroup >
                                <FormControlLabel control={<Switch color="success" sx={{ width: '70px' }} />}
                                    label={proceso.nombre}
                                    onChange={e => handleSwitchProceso(e, proceso.id_proceso)}
                                />
                            </FormGroup>
                        ))}
                    </Box>
                </Box>
            )}

        </>
    )
}

export default SelectPlazaCreateUser