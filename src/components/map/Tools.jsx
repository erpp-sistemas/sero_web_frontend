import { useState, forwardRef } from 'react';

// LIBRERIES
import { useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Modal from '../MaterialUI/Modal'

// ICONS
import PlumbingIcon from '@mui/icons-material/Plumbing';

// COMPONENTS
import { getIcon } from '../../data/Icons';
import SelectLayer from './SelectLayer';
import TrackingGestor from './TrackingGestor';
import RouteGestor from './RouteGestor';
import Notification from './Notification';
import Filtros from './Filtros';
import ListTools from './ListTools';
import UpdateData from './UpdateData';
import Asignacion from './Asignacion';
import OpenProject from './OpenProject';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const colors_palette = [
    '#0000ff', '#5f9ea0', '#d2691e', '#008b8b', '#006400', '#8b008b', '#8b0000', '#483d8b', '#2f4f4f', '#ffd600', '#ff69b4', '#f08080', '#add8e6', '#20b2aa', '#32cd32', '#ff00ff', '#800000', '#9370db', '#7b68ee', '#ffdead', '#ffa500', '#afeeee', '#800080', '#4169e1', '#fa8072', '#4682b4', '#40e0d0', '#f5f5f5', '#ffff00', '#9acd32', '#ff0000', '#00fffb',];



export default function AlertDialogSlide( { data } ) {

    const { polygonsStorage, setLastPolygonCreated } = data; 

    const mapa_activo = useSelector((state) => state.mapa)
    const features = useSelector((state) => state.features)

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

    //* FILTERS
    const [dataFiltered, setDataFiltered] = useState([]);
    const [filtersSelected, setFiltersSelected] = useState({});

    //* OPEN PROJECT
    const [projects, setProjects] = useState(null);
    const [allProjects, setAllProjects] = useState(null);
    const [projectsLoaded, setProjectsLoaded] = useState(null);


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
        setNombreLayerSeleccionado(layer.etiqueta)
        if (mapa_activo.mapa.getLayer(layer.layer_id.toString())) {
            if (mapa_activo.mapa.getLayoutProperty(layer.layer_id.toString(), 'visibility') === 'visible') {
                setOpen(false)
                setShowModalCluster(true)
                await generateClusterMap(layer)
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

    const generateClusterMap = async (layer) => {
        const { mapa: active_map } = mapa_activo;

        if (active_map.getLayer(layer.layer_id.toString())) {
            turnOffLayer(layer.layer_id);

            const data = mapa_activo.mapa.getSource(layer.name_layer)._data;
            const hasTotal = data.features && data.features.some(f => f.properties && f.properties.total !== undefined);

            active_map.addSource(`cluster-${layer.name_layer}`, {
                type: 'geojson',
                data: data,
                cluster: true,
                clusterMaxZoom: 16,
                clusterRadius: 30,
                ...(hasTotal && { clusterProperties: { "sum": ["+", ["get", "total"]] } })
            });

            active_map.addLayer({
                id: `clusters_${layer.layer_id.toString()}`,
                type: 'circle',
                source: `cluster-${layer.name_layer}`,
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 200, '#75f183', 750, '#dde25c'],
                    'circle-radius': ['step', ['get', 'point_count'], 20, 200, 30, 750, 40]
                }
            });

            active_map.addLayer({
                id: `cluster-total_${layer.layer_id.toString()}`,
                type: 'symbol',
                source: `cluster-${layer.name_layer}`,
                filter: ['has', 'point_count'],
                'layout': {
                    'text-field': hasTotal
                        ? [
                            'concat',
                            ['format', ['get', 'point_count_abbreviated'], { 'font-scale': 0.3 }, '\n', {}],
                            ['number-format', ['get', 'sum'], { 'locale': 'en', 'style': 'currency', 'max-fraction-digits': 2 }]
                        ]
                        : ['get', 'point_count_abbreviated'],
                    'text-size': 12,
                }
            });
        }
    }

    const turnOffLayer = (layer_id) => mapa_activo.mapa.setLayoutProperty(layer_id.toString(), 'visibility', 'none');

    const turnOnLayer = (layer_id) => mapa_activo.mapa.setLayoutProperty(layer_id.toString(), 'visibility', 'visible');

    const handleDisableCluster = () => {

        const layer = features.layers_activos.filter(l => l.layer_id == idLayerSeleccionado)[0];
        if (mapa_activo.mapa.getLayer(layer.layer_id.toString())) {
            mapa_activo.mapa.removeLayer(`clusters_${layer.layer_id.toString()}`);
            mapa_activo.mapa.removeLayer(`cluster-total_${layer.layer_id.toString()}`);
        }
        if (mapa_activo.mapa.getSource(`cluster-${layer.name_layer}`)) {
            mapa_activo.mapa.removeSource(`cluster-${layer.name_layer}`)
            setNombreLayerSeleccionado('');
            setIdLayerSeleccionado(0);
            setMapaCalorCreado(false);
        }
        turnOnLayer(layer.layer_id);

    }


    const handleBackTools = () => {
        setShowButtonsHerramientas(true);
        setNombreHerramientaSeleccionada('');
    }

    return (
        <>
            {showModalCluster && (<Modal title={'Generando mapa de calor'.toUpperCase()} />)}
            <IconButton  onClick={handleClickOpen}>
                {/* <PlumbingIcon color="action" /> */}
                {getIcon('AppsIcon', { color: '#FFFFFF', fontSize: '30px' })}
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
                    {showButtonsHerramientas && <ListTools handleCheckTool={handleButtonHerramienta} />}

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
                                <p className='m-3 text-center inline-block text-gray-900 text-base font-semibold'>
                                    Capa creada - <span className='inline-block mt-2 ml-1 font-normal'> {nombreLayerSeleccionado} </span>
                                </p>
                            )}

                            {mapaCalorCreado === false && showButtonsHerramientas === false && (
                                <button
                                    className="bg-emerald-600 mt-3 py-2 px-6 rounded-md flex items-center gap-1 hover:bg-emerald-500"
                                    onClick={handleActivaCluster}
                                >
                                    {getIcon('BlurLinearIcon', {})}
                                    Generar
                                </button>
                            )}

                            {mapaCalorCreado === true && showButtonsHerramientas === false && (
                                <button className="bg-red-700 mt-3 py-2 text-base px-6 rounded-md flex items-center gap-1 hover:bg-red-600" onClick={handleDisableCluster} >
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
                        <Filtros data={{
                            dataFiltered, setDataFiltered, filtersSelected, setFiltersSelected,
                            setShowTools: setOpen
                        }} />
                    )}

                    {nombreHerramientaSeleccionada === 'Proyectos' && showButtonsHerramientas === false && (
                        <OpenProject data={{
                            setShowTools: setOpen,
                            projects, setProjects,
                            allProjects, setAllProjects,
                            projectsLoaded, setProjectsLoaded,
                            polygonsStorage, setLastPolygonCreated
                        }} />
                    )}

                    {nombreHerramientaSeleccionada === 'Actualización' && showButtonsHerramientas === false && (
                        <UpdateData />
                    )}

                    {nombreHerramientaSeleccionada === 'Asignación' && showButtonsHerramientas === false && (
                        <Asignacion data={{}} />
                    )}

                </DialogContent>

            </Dialog>
        </>
    );
}

