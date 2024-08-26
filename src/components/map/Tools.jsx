import { useState, useffect, forwardRef } from 'react';
import { useSelector } from 'react-redux'
import { Box, Typography, useTheme, FormControl, InputLabel, NativeSelect } from "@mui/material";

import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { tokens } from "../../theme";
import Modal from '../MaterialUI/Modal'
import PlumbingIcon from '@mui/icons-material/Plumbing';
import { CSVLink } from 'react-csv';

import { getIcon } from '../../data/Icons';
import ButtonUi from './Button';
import SelectLayer from './SelectLayer';


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
        const layer = features.layers_activos.filter(l => l.layer_id == idLayerSeleccionado)[0];
        console.log(layer)
        setNombreLayerSeleccionado(layer.etiqueta)
        if (mapa_activo.mapa.getLayer(layer.layer_id.toString())) {
            if (mapa_activo.mapa.getLayoutProperty(layer.layer_id.toString(), 'visibility') === 'visible') {
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
        if (mapa_activo.mapa.getLayer(layer.layer_id.toString())) {
            mapa_activo.mapa.removeLayer(layer.layer_id.toString())
            mapa_activo.mapa.removeSource(layer.name_layer)
        }

        const data = await cargarFeaturesLayer(layer.url_geoserver)
        mapa_activo.mapa.addSource(layer.name_layer, {
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
            id: `clusters_${layer.layer_id.toString()}`,
            type: 'circle',
            source: layer.name_layer,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 200, '#75f183', 750, '#dde25c'],
                'circle-radius': ['step', ['get', 'point_count'], 20, 200, 30, 750, 40]
            }
        })

        mapa_activo.mapa.addLayer({
            id: `cluster-total_${layer.layer_id.toString()}`,
            type: 'symbol',
            source: layer.name_layer,
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
            id: layer.layer_id.toString(),
            type: "circle",
            source: layer.name_layer,
            layout: {},
            filter: ['!', ['has', 'point_count']],
            minzoom: 10,
            maxzoom: 24,
            paint: { 'circle-radius': ['/', 7.142857142857142, 2], 'circle-color': layer.color, 'circle-opacity': layer.opacidad, 'circle-stroke-width': 1, 'circle-stroke-color': '#232323' }
        });



    }

    const handleDesactivaCluster = () => {
        const layerArr = features.layers_activos.filter(l => l.layer_id == idLayerSeleccionado)
        const layer = layerArr[0]
        if (mapa_activo.mapa.getSource(layer.name_layer)) {
            if (mapa_activo.mapa.getLayer(layer.layer_id.toString())) {
                setOpen(false)
                mapa_activo.mapa.removeLayer(`clusters_${layer.layer_id.toString()}`);
                mapa_activo.mapa.removeLayer(`cluster-total_${layer.layer_id.toString()}`);
                mapa_activo.mapa.removeLayer(layer.layer_id.toString());
                setNombreLayerSeleccionado('')
                setIdLayerSeleccionado(0)
                setMapaCalorCreado(false)
            }
            mapa_activo.mapa.removeSource(layer.name_layer)
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
            <IconButton sx={{ width: '49px' }} onClick={handleClickOpen}>
                <PlumbingIcon color="action" />
            </IconButton>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{ width: '100%' }}
            >
                <DialogTitle>{showButtonsHerramientas ? "HERRAMIENTAS DEL MAPA" : nombreHerramientaSeleccionada.toUpperCase()}</DialogTitle>
                <DialogContent>

                    {showButtonsHerramientas && (
                        <div className="flex flex-col justify-center">
                            <ButtonUi title='Cambio de color' bgColor={colors.blueAccent[400]} width='300px' padding='6px' fontWeight='' bgColorHover={colors.blueAccent[300]} handle={() => handleButtonHerramienta('Cambio de color')} mt='10px' icon={getIcon('ColorLensIcon', {})} />

                            <ButtonUi title='Dibujar poligono' bgColor={colors.blueAccent[400]} width='300px' padding='6px' fontWeight='' bgColorHover={colors.blueAccent[300]} handle={() => handleButtonHerramienta('Dibujar poligono')} mt='10px' icon={getIcon('PolylineIcon', {})} />

                            <ButtonUi title='Mapa de calor' bgColor={colors.blueAccent[400]} width='300px' padding='6px' fontWeight='' bgColorHover={colors.blueAccent[300]} handle={() => handleButtonHerramienta('Mapa de calor')} mt='10px' icon={getIcon('FiberSmartRecordIcon', {})} />

                            <ButtonUi title='Tracking a gestores' bgColor={colors.blueAccent[400]} width='300px' padding='6px' fontWeight='' bgColorHover={colors.blueAccent[300]} handle={() => handleButtonHerramienta('tracking')} mt='10px' icon={getIcon('GpsFixedIcon', {})} />
                        </div>
                    )}



                    {nombreHerramientaSeleccionada === 'Cambio de color' && (
                        <div className='md:w-[400px] px-2'>
                            <SelectLayer features={features} setIdLayerSeleccionado={setIdLayerSeleccionado} />
                            <div className="flex justify-evenly flex-wrap gap-3 mt-5">
                                {colors_palette.map(color => (
                                    <button onClick={() => handleChangeColor(color)} key={color} className="w-[20%] h-5" style={{ backgroundColor: color }}></button>
                                ))}
                            </div>
                        </div>
                    )}

                    {nombreHerramientaSeleccionada === 'Mapa de calor' && !showButtonsHerramientas && (
                        <div className="md:w-[400px]">
                            {!mapaCalorCreado && <SelectLayer features={features} setIdLayerSeleccionado={setIdLayerSeleccionado} />}

                            {mapaCalorCreado && showButtonsHerramientas === false && (
                                <p className='m-3 text-center inline-block'>
                                    Capa creada <span className='inline-block mt-2 ml-1' style={{ color: colors.greenAccent[600] }}> {nombreLayerSeleccionado} </span>
                                </p>
                            )}

                            {mapaCalorCreado === false && showButtonsHerramientas === false && (
                                <button className="bg-green-700 mt-3 py-1 px-3 rounded-md w-2/6 flex items-center gap-1 " onClick={handleActivaCluster} >
                                    {getIcon('BlurLinearIcon', {})}
                                    Generar
                                </button>
                            )}

                            {mapaCalorCreado === true && showButtonsHerramientas === false && (
                                <button className="bg-red-700 mt-3 py-1 px-3 rounded-md w-2/6 flex items-center gap-1 " onClick={handleDesactivaCluster} >
                                    {getIcon('DeleteIcon', {})}
                                    Quitar
                                </button>
                            )}
                        </div>
                    )}

                
                </DialogContent>

            </Dialog>
        </>
    );
}