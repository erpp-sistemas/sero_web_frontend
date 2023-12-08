import { useState, useffect, forwardRef } from 'react';
import { useSelector } from 'react-redux'
import { Box, Typography, useTheme, FormControl, InputLabel, NativeSelect } from "@mui/material";

import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Badge from '@mui/material/Badge'

import { tokens } from "../../theme";

import Modal from './Modal'

import PlumbingIcon from '@mui/icons-material/Plumbing';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PolylineIcon from '@mui/icons-material/Polyline';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import ContactPageIcon from '@mui/icons-material/ContactPage';

import { CSVLink } from 'react-csv';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const colors_palette = [
    '#0000ff', '#5f9ea0', '#d2691e', '#008b8b', '#006400', '#8b008b', '#8b0000', '#483d8b', '#2f4f4f', '#ffd600', '#ff69b4', '#f08080', '#add8e6', '#20b2aa', '#32cd32', '#ff00ff', '#800000', '#9370db', '#7b68ee', '#ffdead', '#ffa500', '#afeeee', '#800080', '#4169e1', '#fa8072', '#4682b4', '#40e0d0', '#f5f5f5', '#ffff00', '#9acd32', '#ff0000', '#00fffb', '#ff00d4', '#bf00ff', '#00ffa6'
];



export default function AlertDialogSlide() {


    const mapa_activo = useSelector((state) => state.mapa)
    const features = useSelector((state) => state.features)
    
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const [open, setOpen] = useState(false);
    const [showButtonsHerramientas, setShowButtonsHerramientas] = useState(true)
    const [nombreHerramientaSeleccionada, setNombreHerramientaSeleccionada] = useState('')
    const [idLayerSeleccionado, setIdLayerSeleccionado] = useState(0)
    const [nombreLayerSeleccionado, setNombreLayerSeleccionado] = useState();
    const [showModalCluster, setShowModalCluster] = useState(false)
    const [mapaCalorCreado, setMapaCalorCreado] = useState(false)



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setShowButtonsHerramientas(true)
        setNombreHerramientaSeleccionada('')
    };

    const handleButtonHerramienta = (herramienta) => {
        if (herramienta === 'Dibujar poligono') {
            if (features) {
                features.draw.changeMode('draw_polygon');
                setOpen(false);
                return
            }
        }

        setShowButtonsHerramientas(false)
        setNombreHerramientaSeleccionada(herramienta)
    }

    const handleChangeColor = (color) => {
        mapa_activo.mapa.setPaintProperty(idLayerSeleccionado, 'circle-color', color)
    }

    const generateCSV = () => {
        const data = features.puntos_in_poligono.map(f => f.properties)
        return data
    }

    const handleActivaCluster = async () => {

        const layerArr = features.layers_activos.filter(l => l.id_layer == idLayerSeleccionado)
        const layer = layerArr[0]
        setNombreLayerSeleccionado(layer.etiqueta)
        if (mapa_activo.mapa.getLayer(layer.id_layer.toString())) {
            if (mapa_activo.mapa.getLayoutProperty(layer.id_layer.toString(), 'visibility') === 'visible') {
                setOpen(false)
                setShowModalCluster(true)
                await addCluster(layer)
                setShowButtonsHerramientas(true)
                setShowModalCluster(false)
                setMapaCalorCreado(true)
            } else {
                alert("El layer debe de estar prendido")
            }
        } else {
            alert("El layer no esta cargado")
        }
    }

    const addCluster = async (layer) => {
        if (mapa_activo.mapa.getLayer(layer.id_layer.toString())) {
            mapa_activo.mapa.removeLayer(layer.id_layer.toString())
            mapa_activo.mapa.removeSource(layer.nombre_layer)
        }

        const data = await cargarFeaturesLayer(layer.url_geoserver)
        mapa_activo.mapa.addSource(layer.nombre_layer, {
            type: 'geojson',
            data: data,
            cluster: true,
            clusterMaxZoom: 16,
            clusterRadius: 30,
            // clusterProperties: {
            //     "sum": ["+", ["get", nombre_adeudo]]
            // }
        })

        configuraCluster(layer);
    }

    const configuraCluster = (layer) => {
        mapa_activo.mapa.addLayer({
            id: `clusters_${layer.id_layer.toString()}`,
            type: 'circle',
            source: layer.nombre_layer,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    200,
                    '#75f183',
                    750,
                    '#dde25c'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    200,
                    30,
                    750,
                    40
                ]
            }
        })

        mapa_activo.mapa.addLayer({
            id: `cluster-total_${layer.id_layer.toString()}`,
            type: 'symbol',
            source: layer.nombre_layer,
            filter: ['has', 'point_count'],
            'layout': {
                'text-field': [
                    'concat',
                    ['format', ['get', 'point_count_abbreviated'], { 'font-scale': 0.4 }, '\n', {}],
                ],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
            }
        })

        mapa_activo.mapa.addLayer({
            id: layer.id_layer.toString(),
            type: "circle",
            source: layer.nombre_layer,
            layout: {},
            filter: ['!', ['has', 'point_count']],
            minzoom: 10,
            maxzoom: 24,
            paint: { 'circle-radius': ['/', 7.142857142857142, 2], 'circle-color': layer.color, 'circle-opacity': layer.opacidad, 'circle-stroke-width': 1, 'circle-stroke-color': '#232323' }
        });



    }

    const handleDesactivaCluster = () => {
        const layerArr = features.layers_activos.filter(l => l.id_layer == idLayerSeleccionado)
        const layer = layerArr[0]
        if (mapa_activo.mapa.getSource(layer.nombre_layer)) {
            if (mapa_activo.mapa.getLayer(layer.id_layer.toString())) {
                setOpen(false)
                mapa_activo.mapa.removeLayer(`clusters_${layer.id_layer.toString()}`);
                mapa_activo.mapa.removeLayer(`cluster-total_${layer.id_layer.toString()}`);
                mapa_activo.mapa.removeLayer(layer.id_layer.toString());
                setNombreLayerSeleccionado('')
                setIdLayerSeleccionado(0)
                setMapaCalorCreado(false)
            }
            mapa_activo.mapa.removeSource(layer.nombre_layer)
            features.cargar_layer(layer)
            setShowButtonsHerramientas(true)
        }
    }

    const cargarFeaturesLayer = async (url) => {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    return (
        <>
            {showModalCluster && (<Modal title={'Generando mapa de calor'.toUpperCase()} />)}
            <Badge badgeContent={0} color="secondary">
                <IconButton onClick={handleClickOpen}>
                    <PlumbingIcon color="action" />
                </IconButton>
            </Badge>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{showButtonsHerramientas ? "HERRAMIENTAS DEL MAPA" : nombreHerramientaSeleccionada.toUpperCase()}</DialogTitle>
                <DialogContent sx={{ width: '100%' }}>

                    {showButtonsHerramientas && (
                        <>
                            <Box sx={{ marginBottom: '10px' }}>
                                <Button sx={{
                                    backgroundColor: colors.greenAccent[600], width: '300px',
                                    ":hover": {
                                        bgcolor: colors.greenAccent[300],
                                        color: "white"
                                    }
                                }} variant="outlined" startIcon={<ColorLensIcon />}
                                    onClick={() => handleButtonHerramienta('Cambio de color')}
                                >
                                    Cambio de color
                                </Button>
                            </Box>

                            <Box sx={{ marginBottom: '10px' }}>
                                <Button sx={{
                                    backgroundColor: colors.greenAccent[600], width: '300px',
                                    ":hover": {
                                        bgcolor: colors.greenAccent[300],
                                        color: "white"
                                    }
                                }} variant="outlined" startIcon={<PolylineIcon />}
                                    onClick={() => handleButtonHerramienta('Dibujar poligono')}
                                >
                                    Poligono de selección
                                </Button>
                            </Box>
                            {features.puntos_in_poligono.length > 0 && (
                                <Box sx={{ marginBottom: '10px' }}>
                                    <Button sx={{
                                        backgroundColor: colors.greenAccent[600], width: '300px',
                                        ":hover": {
                                            bgcolor: colors.greenAccent[300],
                                            color: "white"
                                        }
                                    }} variant="outlined" startIcon={<ContactPageIcon />}
                                        onClick={() => handleButtonHerramienta('ver información')}
                                    >
                                        Ver información
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ marginBottom: '10px' }}>
                                <Button sx={{
                                    backgroundColor: colors.greenAccent[600], width: '300px',
                                    ":hover": {
                                        bgcolor: colors.greenAccent[300],
                                        color: "white"
                                    }
                                }} variant="outlined" startIcon=
                                    {<FiberSmartRecordIcon />}
                                    onClick={() => handleButtonHerramienta('Mapa de calor')}
                                >
                                    Mapa de calor
                                </Button>
                            </Box>

                            <Box sx={{ marginBottom: '10px' }}>
                                <Button sx={{
                                    backgroundColor: colors.greenAccent[600], width: '300px',
                                    ":hover": {
                                        bgcolor: colors.greenAccent[300],
                                        color: "white"
                                    }
                                }} variant="outlined" startIcon={<GpsFixedIcon />}>
                                    Tracking a operadores
                                </Button>
                            </Box>

                            <Box sx={{ marginBottom: '10px' }}>
                                <Button sx={{
                                    backgroundColor: colors.greenAccent[600], width: '300px',
                                    ":hover": {
                                        bgcolor: colors.greenAccent[300],
                                        color: "white"
                                    }
                                }} variant="outlined" startIcon={<GpsFixedIcon />}>
                                    Asignación
                                </Button>
                            </Box>

                            <Box sx={{ marginBottom: '10px' }}>
                                <Button sx={{
                                    backgroundColor: colors.greenAccent[600], width: '300px',
                                    ":hover": {
                                        bgcolor: colors.greenAccent[300],
                                        color: "white"
                                    }
                                }} variant="outlined" startIcon={<FilterAltIcon />}>
                                    Filtros
                                </Button>
                            </Box>
                        </>
                    )}

                    {nombreHerramientaSeleccionada === 'Cambio de color' && (
                        <Box sx={{ width: '300px' }}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Selecciona el layer
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={0}
                                    inputProps={{
                                        name: 'age',
                                        id: 'selecciona-layer',
                                    }}
                                    onChange={e => setIdLayerSeleccionado(e.target.value)}
                                >
                                    <option value={0}> Selecciona </option>
                                    {features.layers_activos && features.layers_activos.length > 0 && features.layers_activos.map(layer => (
                                        <option key={layer.id_layer} value={layer.id_layer}> {layer.nombre_layer} </option>
                                    ))}

                                </NativeSelect>

                                <Box display='flex' justifyContent='space-evenly' flexWrap='wrap' gap='10px' sx={{ marginTop: '20px' }}>
                                    {colors_palette.map(color => (
                                        <Button onClick={() => handleChangeColor(color)} key={color} sx={{ backgroundColor: color, width: '20%', height: '20px' }}></Button>
                                    ))}
                                </Box>

                            </FormControl>


                        </Box>
                    )}

                    {nombreHerramientaSeleccionada === 'Mapa de calor' && showButtonsHerramientas === false && (
                        <Box sx={{ width: '300px' }}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Selecciona el layer
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={0}
                                    inputProps={{
                                        name: 'age',
                                        id: 'selecciona-layer',
                                    }}
                                    disabled={mapaCalorCreado ? true : false}
                                    onChange={e => setIdLayerSeleccionado(e.target.value)}
                                >
                                    <option value={0}> Selecciona </option>
                                    {features.layers_activos && features.layers_activos.length > 0 && features.layers_activos.map(layer => (
                                        <option key={layer.id_layer} value={layer.id_layer}> {layer.nombre_layer} </option>
                                    ))}

                                </NativeSelect>

                                {mapaCalorCreado && showButtonsHerramientas === false && (<Typography sx={{ margin: '10px', textAlign: 'center', display: 'inline-block' }}>
                                    Capa creada: <Typography sx={{ display: 'inline-block', color: colors.greenAccent[600], marginLeft: '5px' }}> {nombreLayerSeleccionado} </Typography>
                                </Typography>)}

                                {mapaCalorCreado === false && showButtonsHerramientas === false && (
                                    <Button sx={{ backgroundColor: colors.greenAccent[600], marginTop: '10px' }}
                                        onClick={handleActivaCluster}
                                    >
                                        Generar
                                    </Button>
                                )}

                                {mapaCalorCreado === true && showButtonsHerramientas === false && (
                                    <Button sx={{ backgroundColor: colors.redAccent[400], marginTop: '10px' }}
                                        onClick={handleDesactivaCluster}
                                    >
                                        Quitar
                                    </Button>
                                )}


                            </FormControl>


                        </Box>
                    )}

                    {nombreHerramientaSeleccionada === 'ver información' && (
                        <Box sx={{ width: '300px' }}>
                            <>
                                {console.log(features.puntos_in_poligono)}
                            </>
                            <Typography sx={{ display: 'inline-block' }}>
                                Número de registros: <Typography sx={{ display: 'inline-block', color: colors.greenAccent[600], marginLeft: '7px' }}> {features.puntos_in_poligono.length}  </Typography>
                            </Typography>
                            <CSVLink data={generateCSV()}
                                style={{
                                    display: 'block', width: '200px', color: 'black', backgroundColor: colors.greenAccent[600],
                                    padding: '5px', borderRadius: '5px', marginTop: '10px', paddingLeft: '10px'
                                }}
                                filename="registros_seleccionados" >Descargar datos</CSVLink>
                        </Box>
                    )}

                </DialogContent>

            </Dialog>
        </>
    );
}