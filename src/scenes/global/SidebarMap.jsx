import { useEffect, useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, useTheme, Alert } from "@mui/material"
import "react-pro-sidebar/dist/css/styles.css"
import { getServicesMapByIdPlaza, getLayersMapByIdPlaza } from '../../services/map.service'
import { tokens } from "../../theme"
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setDialog } from '../../redux/dialogSlice'
import { setLayersActivos, setCargarLayer } from '../../redux/featuresSlice'
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import SeroClaro from '../../assets/ser0_space_fondooscuro.png'
import SeroOscuro from '../../assets/ser0_space_fondoclaro.png'
import { Marker } from "mapbox-gl";

import ModalDate from '../../components/modals/ModalDate';


// COMPONENTS
import InformacionSidebar from '../../components/map/InformacionSidebar';

const SidebarMap = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const mapa_seleccionado = useSelector((state) => state.plaza_mapa);
    const messages = useSelector((state) => state.webSocket.messages);
    const mapa_activo = useSelector((state) => state.mapa)
    const dialog_mapa = useSelector((state) => state.dialog);
    const features = useSelector((state) => state.features);
    const filtrosActivos = useSelector(state => state.features.filtrosActivos);


    const [isCollapsed, setIsCollapsed] = useState(false);
    const [serviciosMapa, setServiciosMapa] = useState([]);
    const [layersMapa, setLayersMapa] = useState([]);
    const [nombreServicioActivo, setNombreServicioActivo] = useState('');
    const [idServicioActivo, setIdServicioActivo] = useState(0);
    const [marker, setMarker] = useState(null);

    const [showModalDate, setShowModalDate] = useState(false);
    const [layerSelected, setLayerSelected] = useState({});


    const fillCartografia = (servicio) => {
        const id = document.getElementById(servicio.service_id.toString());
        if (id) {
            id.style.color = colors.greenAccent[600]
            setNombreServicioActivo(servicio.etiqueta)
            putLayersByIdServicio(servicio.service_id)
        }
    }

    let reloadTimeout = null;
    useEffect(() => {
        if (messages.length === 0) return;
        if (reloadTimeout) clearTimeout(reloadTimeout);

        reloadTimeout = setTimeout(async () => {
            for (const layer of features.layers_activos) {
                const source = mapa_activo.mapa.getSource(layer.name_layer);
                if (!source) continue;

                let nuevaData = null;

                if (layer.is_large && layer.filtro_fecha) {
                    const hoy = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
                    const { periodoInicial, periodoFinal } = layer.filtro_fecha;

                    if (hoy >= periodoInicial && hoy <= periodoFinal) {
                        nuevaData = await cargarFeaturesLayer(layer.url_geoserver, {
                            periodoInicial: hoy,
                            periodoFinal: hoy
                        });
                    }
                } else if (!layer.is_large) {
                    nuevaData = await cargarFeaturesLayer(layer.url_geoserver);
                }

                if (nuevaData) {
                    // Guarda los datos originales si no están guardados aún
                    if (!originalFeatures[layer.name_layer]) {
                        originalFeatures[layer.name_layer] = nuevaData.features;
                    }

                    // Verifica si hay filtros activos para este layer
                    const filtroLayer = filtrosActivos.find(f => f.layerId === layer.name_layer);

                    if (filtroLayer) {
                        // Filtra las features nuevamente
                        const filtros = filtroLayer.filters;
                        const filtradas = nuevaData.features.filter(feature => {
                            return Object.entries(filtros).every(([campo, valores]) => {
                                let propValue = feature.properties[campo];

                                if (propValue === undefined && feature.properties.data_json) {
                                    try {
                                        const dataJson = typeof feature.properties.data_json === "string"
                                            ? JSON.parse(feature.properties.data_json)
                                            : feature.properties.data_json;
                                        propValue = dataJson[campo];
                                    } catch (e) {
                                        propValue = undefined;
                                    }
                                }

                                if (!valores || valores.length === 0) return true;
                                return valores.includes(String(propValue));
                            });
                        });

                        // Aplica el filtro al source
                        source.setData({
                            ...nuevaData,
                            features: filtradas
                        });
                    } else {
                        // No hay filtros, aplica la data completa
                        source.setData(nuevaData);
                    }
                }
            }
        }, 2000);

        return () => clearTimeout(reloadTimeout);
    }, [messages]);


    useEffect(() => {
        screen.width <= 450 ? setIsCollapsed(true) : setIsCollapsed(false)
        loadData();
    }, [mapa_seleccionado]);

    useEffect(() => {
        if (serviciosMapa.length > 0) {
            serviciosMapa.forEach(servicio => {
                if (servicio.service_id === 7) fillCartografia(servicio);
            })
        }
    }, [serviciosMapa]);

    useEffect(() => {
        if (features.coordinates && features.coordinates.length > 0 && features.coordinates[0] !== undefined) {

            if (marker !== null) marker.remove()

            setMarker(new Marker({
                color: colors.greenAccent[400],
            }).setLngLat(features.coordinates).addTo(mapa_activo.mapa));
        } else {
            if (marker !== null) marker.remove()
        }
    }, [features.coordinates])


    const loadData = async () => {
        const servicios_mapa = getServicesMapByIdPlaza(mapa_seleccionado.place_id)
        const layers_mapa = getLayersMapByIdPlaza(mapa_seleccionado.place_id)
        const promise = await Promise.all([servicios_mapa, layers_mapa]);
        setServiciosMapa(promise[0])
        setLayersMapa(promise[1])
    }

    const putLayersByIdServicio = (id_servicio) => {
        const layers_a = layersMapa.filter(layer => id_servicio === layer.servicio_id)
        dispatch(setLayersActivos(layers_a))
        layers_a.forEach(layer => document.getElementById(layer.name_layer).style.display = 'block')
        layersMapa.filter(layer => id_servicio !== layer.servicio_id).forEach(l => {
            document.getElementById(l.name_layer).style.display = 'none'
        })
    }

    const handleServicioIcon = (servicio) => {
        putLayersByIdServicio(servicio.service_id)
        setNombreServicioActivo(servicio.etiqueta)
        setIdServicioActivo(servicio.service_id)
        changeColorServicioIcon(servicio.service_id)
    }

    const changeColorServicioIcon = (id_servicio) => {
        const id = document.getElementById(id_servicio.toString())
        id.style.color = colors.greenAccent[600]
        serviciosMapa.forEach(servicio => {
            if (servicio.service_id !== id_servicio) {
                document.getElementById(servicio.service_id.toString()).style.color = colors.grey[100]
            }
        })
    }

    const handleLayer = async (layer) => {
        const existsLayerInMap = isLayerInMap(layer);
        if (!existsLayerInMap) {
            setLayerSelected(layer);
            if (!layer.is_large) {
                putDispatchDialog();
                await processLoadLayerMap(layer);
                return;
            }
            if (layer.is_large) return setShowModalDate(true);
        }
        if (existsLayerInMap) {
            if (mapa_activo.mapa.getLayoutProperty(layer.layer_id, 'visibility') === 'visible' || mapa_activo.mapa.getLayoutProperty(layer.layer_id, 'visibility') === undefined) {
                mapa_activo.mapa.setLayoutProperty(layer.layer_id, 'visibility', 'none')
                mapa_activo.mapa.setFilter(layer.layer_id, null)
                changeColorLayer(layer.name_layer, colors.grey[100])
            } else {
                const find_cluster = handleCheckClusterInMap(layer);
                if (find_cluster) return alert("Desactiva el mapa de calor para apagar este layer");

                mapa_activo.mapa.setLayoutProperty(layer.layer_id, 'visibility', 'visible')
                changeColorLayer(layer.name_layer, colors.greenAccent[600])
            }
        }
    }

    const handleCheckClusterInMap = (layer) => {
        const sources = mapa_activo.mapa.getStyle().sources;
        const name_cluster = `cluster-${layer.name_layer}`;
        const find_cluster = Object.keys(sources).find(sourceID => sourceID === name_cluster);
        return find_cluster;
    }

    const handleRespModalQuestion = async (res) => {

        if (!res) return setShowModalDate(false);
        if (res) {
            if ("periodoInicial" in res) {
                const { periodoInicial, periodoFinal } = res;
                console.log(layerSelected);
                const new_layer = {
                    ...layerSelected,
                    filtro_fecha: { periodoInicial, periodoFinal },
                    layer_id: `${layerSelected.layer_id}-${periodoInicial}_${periodoFinal}`,
                    etiqueta: `${layerSelected.etiqueta} de ${periodoInicial} al ${periodoFinal}`,
                    name_layer: `${layerSelected.name_layer}-${periodoInicial}_${periodoFinal}`,
                    is_large: 0
                };
                dispatch(setLayersActivos([...features.layers_activos, new_layer]));
                setLayersMapa([...layersMapa, new_layer])
                putDispatchDialog();
                await processLoadLayerMap(new_layer, { periodoInicial, periodoFinal });
                setShowModalDate(false);
                return;
            }
            if ("withoutFilter" in res) {
                setShowModalDate(false);
                putDispatchDialog();
                await processLoadLayerMap(layerSelected);
                return;
            }
        }

    }

    const putDispatchDialog = () => {
        dispatch(setDialog({ title: 'Cargando capa...', status: true }))
        dispatch(setCargarLayer(cargarLayerMap));
    }

    const processLoadLayerMap = async (layer, dates_filter = null) => {
        await cargarLayerMap(layer, dates_filter);
        dispatch(setDialog({ title: '', status: false }));
        changeColorLayer(layer.name_layer, colors.greenAccent[600]);
    }

    const isLayerInMap = (layer) => {
        return !!mapa_activo.mapa.getLayer(layer.layer_id);
    }

    const cargarLayerMap = async (layer, dates_filter = null) => {
        try {
            if (layer.url_geoserver !== '') {
                if (layer.tipo === 'punto') {
                    await cargaPunto(layer, dates_filter)
                } else if (layer.tipo === 'poligono') {
                    await cargarPoligono(layer, dates_filter)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }


    const changeColorLayer = (nombre_layer, color) => {
        const id = document.getElementById(nombre_layer)
        id.style.backgroundColor = color
    }


    const cargaPunto = async (layer, dates_filter = null) => {
        const data = await cargarFeaturesLayer(layer.url_geoserver, dates_filter);
        mapa_activo.mapa.addSource(layer.name_layer, { type: 'geojson', data: data })
        mapa_activo.mapa.addLayer({
            "id": layer.layer_id.toString(),
            "type": "circle",
            "source": layer.name_layer,
            "layout": {},
            "minzoom": 10,
            "maxzoom": 24,
            "paint": { 'circle-radius': ['/', 7.142857142857142, 2], 'circle-color': layer.color, 'circle-opacity': layer.opacidad, 'circle-stroke-width': 1, 'circle-stroke-color': '#232323' },
        })
        mapa_activo.mapa.setLayoutProperty(layer.layer_id.toString(), 'visibility', 'visible')
    }

    const cargarPoligono = async (layer, dates_filter = null) => {
        const data = await cargarFeaturesLayer(layer.url_geoserver, dates_filter)
        mapa_activo.mapa.addSource(layer.name_layer, { type: 'geojson', data: data })
        mapa_activo.mapa.addLayer({
            id: layer.layer_id.toString(),
            type: "fill",
            source: layer.name_layer,
            layout: {},
            minzoom: 6,
            maxzoom: 18,
            paint: {
                'fill-color': layer.color,
                'fill-outline-color': 'rgb(0,0,0)',
                'fill-opacity': layer.opacidad,
            },

        })
    }


    const cargarFeaturesLayer = async (url, dates_filter = null) => {
        let cqlFilter = null;
        let url_request = null;
        let response = null;
        if (dates_filter) {
            const { periodoInicial, periodoFinal } = dates_filter;
            cqlFilter = `fecha_filter BETWEEN '${periodoInicial}' AND '${periodoFinal}'`;
            url_request = `${url}&cql_filter=${encodeURIComponent(cqlFilter)}`;
            response = await fetch(url_request);
        }
        if (!dates_filter) response = await fetch(url);

        const data = await response.json();
        return data;
    }

    const handleToggleMenu = () => {
        const service_carto = serviciosMapa.filter(servicio => servicio.service_id === idServicioActivo)[0];
        setIsCollapsed(!isCollapsed);
        setTimeout(() => {
            fillCartografia(service_carto);
        }, 200)
    }


    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#a4a9fc !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6EBE71 !important",
                },
                "height": "100%"
            }}
        >
            {showModalDate && (<ModalDate handleRespuesta={handleRespModalQuestion} title={'El layer que desea mostrar contiene mucha información, se recomienda que utilice un rango de fechas para filtrar los datos'} />)}
            <ProSidebar collapsed={isCollapsed} >
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={handleToggleMenu} icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{ margin: "10px 0 20px 0", color: colors.grey[100], }} >
                        {!isCollapsed && (
                            <div className="flex justify-between items-center">
                                <img src={theme.palette.mode === "dark" ? SeroClaro : SeroOscuro} style={{ width: '169px' }} alt="" />
                                <IconButton onClick={handleToggleMenu}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </div>
                        )}
                    </MenuItem>

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>

                        {!isCollapsed && (
                            <div className="font-mono">
                                {/* SERVICIOS */}
                                <div className="w-[90%] mb-4" >
                                    <div className="h-8 flex items-center px-3" style={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : colors.grey[700], color: theme.palette.mode === "dark" ? colors.grey[100] : 'white' }} >
                                        <h1 className="text-base">Servicios</h1>
                                    </div>
                                    <div style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400], padding: '10px 0' }} >
                                        <div className="flex justify-evenly w-full rounded-md flex-wrap p-2" >
                                            {serviciosMapa.length > 0 && serviciosMapa.map((servicio) => (
                                                <IconButton sx={{ width: '25%' }} key={servicio.service_id} aria-label="delete" size="large" onClick={() => handleServicioIcon(servicio)}>
                                                    <i id={servicio.service_id.toString()} style={{ color: colors.grey[100] }} className={servicio.icono}></i>
                                                </IconButton>
                                            ))}
                                        </div>
                                        <Alert severity="success" variant="outline" sx={{
                                            height: '30px', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '90%', margin: '5px auto',
                                            backgroundColor: colors.greenAccent[400], color: '#000000', fontWeight: 'bold'
                                        }}>
                                            {nombreServicioActivo}
                                        </Alert>
                                        {dialog_mapa.status && (
                                            <Alert sx={{ marginTop: '5px' }} severity="warning">Cargando capa...</Alert>
                                        )}
                                    </div>
                                </div>
                                {/* LAYERS */}
                                <div className="w-[90%] max-h-[200px] overflow-y-scroll mb-4 :-webkit-scrollbar" >
                                    <div className="h-8 flex items-center px-3" style={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : colors.grey[700], color: theme.palette.mode === "dark" ? colors.grey[100] : 'white' }} >
                                        <h1 className="text-base">Layers</h1>
                                    </div>
                                    <div className="flex justify-center flex-wrap p-2" style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400] }} >
                                        {layersMapa.length > 0 && layersMapa.map((layer, index) => (
                                            <button className="w-full bg-gray-300 my-1 py-1 rounded-md text-gray-900 text-sm px-1" id={layer.name_layer} key={index} onClick={() => handleLayer(layer)}>
                                                {layer.etiqueta}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* INFORMACION */}
                                <InformacionSidebar />

                            </div>
                        )}

                    </Box>


                </Menu>
            </ProSidebar>
        </Box>
    )
}

export default SidebarMap