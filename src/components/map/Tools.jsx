import { useState, forwardRef } from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from "@mui/material";

import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { tokens } from "../../theme";
import Modal from '../MaterialUI/Modal'
import PlumbingIcon from '@mui/icons-material/Plumbing';
//import { CSVLink } from 'react-csv';
import { getIcon } from '../../data/Icons';
import SelectLayer from './SelectLayer';
import TrackingGestor from './TrackingGestor';
import RouteGestor from './RouteGestor';
import Notification from './Notification';
import Filtros from './Filtros';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const colors_palette = [
    '#0000ff', '#5f9ea0', '#d2691e', '#008b8b', '#006400', '#8b008b', '#8b0000', '#483d8b', '#2f4f4f', '#ffd600', '#ff69b4', '#f08080', '#add8e6', '#20b2aa', '#32cd32', '#ff00ff', '#800000', '#9370db', '#7b68ee', '#ffdead', '#ffa500', '#afeeee', '#800080', '#4169e1', '#fa8072', '#4682b4', '#40e0d0', '#f5f5f5', '#ffff00', '#9acd32', '#ff0000', '#00fffb',];



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

    //* TRACKING
    const [startTracking, setStartTracking] = useState(false);
    const [positionsUser, setPositionsUser] = useState([]);
    const [markers, setMarkers] = useState({});
    const [showMarkers, setShowMarkers] = useState(true);

    //* ROUTE
    const [rutaDibujada, setRutaDibujada] = useState(false);
    const [markersRoute, setMarkersRoute] = useState([]);
    const [gestorSeleccionado, setGestorSeleccionado] = useState({});
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');


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

    // const generateCSV = () => {
    //     const data = features.puntos_in_poligono.map(f => f.properties)
    //     return data
    // }

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

    const handleBackTools = () => {
        setShowButtonsHerramientas(true);
        setNombreHerramientaSeleccionada('');
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
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle sx={{ backgroundColor: '#F4F3F2', color: 'black', textAlign: 'center', borderTop: '1px solid black' }}>
                    {showButtonsHerramientas && <div>HERRAMIENTAS DEL MAPA</div>}
                    {!showButtonsHerramientas && (
                        <>
                            <div className="flex items-center gap-10">
                                <button onClick={handleBackTools}>
                                    {getIcon('ArrowBackIcon', {})}
                                </button>
                                <h1 className="font-semibold">{nombreHerramientaSeleccionada.toUpperCase()}</h1>
                            </div>
                            <div className="w-11/12 mx-auto bg-gray-900 h-1 rounded-md mt-4 opacity-50"></div>
                        </>
                    )}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#F4F3F2', borderBottom: '2px solid black', padding: '40px 0' }}>
                    {showButtonsHerramientas && (
                        <>
                            <div className="w-11/12 mx-auto bg-gray-900 h-1 rounded-md mb-4 opacity-50"></div>

                            <div className="flex flex-wrap gap-6 justify-center font-mono">
                                <button className="bg-neutral-50 text-gray-900 border-r-2 border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg "
                                    onClick={() => handleButtonHerramienta('Cambio de color')}
                                >
                                    {getIcon('ColorLensIcon', { fontSize: '30px', color: 'black' })}
                                    Cambio de color
                                </button>
                                <button className="bg-neutral-50 text-gray-900 border-r-2 border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg"
                                    onClick={() => handleButtonHerramienta('Dibujar poligono')}
                                >
                                    {getIcon('PolylineIcon', { fontSize: '30px', color: 'black' })}
                                    Dibujar Poligono
                                </button>
                                <button className="bg-neutral-50 text-gray-900 border-r-2 border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg"
                                    onClick={() => handleButtonHerramienta('Mapa de calor')}
                                >
                                    {getIcon('FiberSmartRecordIcon', { fontSize: '30px', color: 'black' })}
                                    Mapa de calor
                                </button>
                                <button className="bg-neutral-50 text-gray-900 border-r-2 border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg"
                                    onClick={() => handleButtonHerramienta('Seguimiento gestores')}
                                >
                                    {getIcon('GpsFixedIcon', { fontSize: '30px', color: 'black' })}
                                    Seguimiento
                                </button>
                                <button className="bg-neutral-50 text-gray-900 border-r-2  border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg"
                                    onClick={() => handleButtonHerramienta('Ruta gestor')}
                                >
                                    {getIcon('PlaceIcon', { fontSize: '30px', color: 'black' })}
                                    Ruta
                                </button>

                                <button className="bg-neutral-50 text-gray-900 border-r-2  border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg"
                                    onClick={() => handleButtonHerramienta('Notificación')}
                                >
                                    {getIcon('NotificationsOutlinedIcon', { fontSize: '30px', color: 'black' })}
                                    Notificaciones
                                </button>
                                <button className="bg-neutral-50 text-gray-900 border-r-2  border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg"
                                    onClick={() => handleButtonHerramienta('Filtros')}
                                >
                                    {getIcon('FilterAltIcon', { fontSize: '30px', color: 'black' })}
                                    Filtros
                                </button>

                            </div>
                        </>
                    )}

                    {nombreHerramientaSeleccionada === 'Cambio de color' && (
                        <div className='px-2'>
                            <SelectLayer features={features} setIdLayerSeleccionado={setIdLayerSeleccionado} />
                            <div className="flex justify-evenly flex-wrap gap-3 mt-5">
                                {colors_palette.map(color => (
                                    <button onClick={() => handleChangeColor(color)} key={color} className="w-[20%] h-5" style={{ backgroundColor: color }}></button>
                                ))}
                            </div>
                        </div>
                    )}

                    {nombreHerramientaSeleccionada === 'Mapa de calor' && !showButtonsHerramientas && (
                        <div className="px-10">
                            {!mapaCalorCreado && <SelectLayer features={features} setIdLayerSeleccionado={setIdLayerSeleccionado} />}

                            {mapaCalorCreado && showButtonsHerramientas === false && (
                                <p className='m-3 text-center inline-block text-gray-900'>
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

                    {nombreHerramientaSeleccionada === 'Seguimiento gestores' && showButtonsHerramientas === false && (
                        <TrackingGestor data={{
                            startTracking, setStartTracking, positionsUser, setPositionsUser,
                            markers, setMarkers, showMarkers, setShowMarkers,
                            setShowTools: setOpen
                        }} />
                    )}

                    {nombreHerramientaSeleccionada === 'Ruta gestor' && showButtonsHerramientas === false && (
                        <RouteGestor data={{
                            rutaDibujada, setRutaDibujada, markersRoute, setMarkersRoute,
                            gestorSeleccionado, setGestorSeleccionado, fechaSeleccionada, setFechaSeleccionada,
                            setShowTools: setOpen
                        }} />
                    )}

                    {nombreHerramientaSeleccionada === 'Notificación' && showButtonsHerramientas === false && (
                        <Notification data={{
                            setShowModal: setShowButtonsHerramientas,
                            setShowTools: setOpen
                        }} />
                    )}

                    {nombreHerramientaSeleccionada === 'Filtros' && showButtonsHerramientas === false && (
                       <Filtros />
                    )}


                </DialogContent>

            </Dialog>
        </>
    );
}

