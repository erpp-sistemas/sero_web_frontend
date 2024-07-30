import { useEffect, useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, useTheme, Alert, Button } from "@mui/material"
import "react-pro-sidebar/dist/css/styles.css"
import { getServicesMapByIdPlaza, getLayersMapByIdPlaza } from '../../services/map.service'
import { tokens } from "../../theme"
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setDialog } from '../../redux/dialogSlice'
import { setLayersActivos, setCargarLayer } from '../../redux/featuresSlice'
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import SeroClaro from '../../assets/sero_claro.png'
import SeroOscuro from '../../assets/sero-logo.png'
import { Marker } from "mapbox-gl"

const SidebarMap = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const mapa_seleccionado = useSelector((state) => state.plaza_mapa);
    const mapa_activo = useSelector((state) => state.mapa)
    const dialog_mapa = useSelector((state) => state.dialog);
    const features = useSelector((state) => state.features);


    const [isCollapsed, setIsCollapsed] = useState(false);
    const [serviciosMapa, setServiciosMapa] = useState([]);
    const [layersMapa, setLayersMapa] = useState([]);
    const [nombreServicioActivo, setNombreServicioActivo] = useState('');
    const [marker, setMarker] = useState(null);


    const fillCartografia = (servicio) => {
        const id = document.getElementById(servicio.service_id.toString());
        id.style.color = colors.greenAccent[600]
        setNombreServicioActivo(servicio.etiqueta)
        setLayersByIdServicio(servicio.service_id)
    }

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
        //console.log(features.coordinates)
        if (features.coordinates && features.coordinates.length > 0 && features.coordinates[0] !== undefined) {

            if (marker !== null) marker.remove()

            setMarker(new Marker({
                color: colors.greenAccent[500],
            }).setLngLat(features.coordinates).addTo(mapa_activo.mapa));
        } else {
            if (marker !== null) marker.remove()
        }
    }, [features.coordinates])


    const loadData = async () => {
        const servicios_mapa = getServicesMapByIdPlaza(mapa_seleccionado.place_id)
        const layers_mapa = getLayersMapByIdPlaza(mapa_seleccionado.place_id)
        const promise = await Promise.all([servicios_mapa, layers_mapa])
        setServiciosMapa(promise[0])
        setLayersMapa(promise[1])
    }

    const setLayersByIdServicio = (id_servicio) => {
        const layers_a = layersMapa.filter(layer => id_servicio === layer.servicio_id)
        dispatch(setLayersActivos(layers_a))
        layers_a.forEach(layer => document.getElementById(layer.name_layer).style.display = 'block')
        layersMapa.filter(layer => id_servicio !== layer.servicio_id).forEach(l => {
            document.getElementById(l.name_layer).style.display = 'none'
        })
    }

    const handleServicioIcon = (servicio) => {
        setLayersByIdServicio(servicio.service_id)
        setNombreServicioActivo(servicio.etiqueta)
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

    const handleLayer = (layer) => {
        validateLayerInMap(layer)
    }

    const cargarLayerMap = async (layer) => {
        try {
            if (layer.url_geoserver !== '') {
                if (layer.tipo === 'punto') {
                    await cargaPunto(layer)
                } else if (layer.tipo === 'poligono') {
                    await cargarPoligono(layer)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const validateLayerInMap = (layer) => {
        if (!mapa_activo.mapa.getLayer(layer.layer_id)) {
            dispatch(setDialog({ title: 'Cargando capa...', status: true }))
            dispatch(setCargarLayer(cargarLayerMap))
            cargarLayerMap(layer).then(() => {
                dispatch(setDialog({
                    title: '',
                    status: false
                }))
                changeColorLayer(layer.name_layer, colors.greenAccent[600])
            }).catch(error => {
                console.error(error)
            })
            return
        }

        if (mapa_activo.mapa.getLayoutProperty(layer.layer_id, 'visibility') === 'visible' || mapa_activo.mapa.getLayoutProperty(layer.layer_id, 'visibility') === undefined) {
            mapa_activo.mapa.setLayoutProperty(layer.layer_id, 'visibility', 'none')
            mapa_activo.mapa.setFilter(layer.layer_id, null)
            changeColorLayer(layer.name_layer, colors.grey[100])
        } else {
            mapa_activo.mapa.setLayoutProperty(layer.layer_id, 'visibility', 'visible')
            changeColorLayer(layer.name_layer, colors.greenAccent[600])
        }

    }


    const changeColorLayer = (nombre_layer, color) => {
        const id = document.getElementById(nombre_layer)
        id.style.backgroundColor = color
    }


    const cargaPunto = async (layer) => {

        const data = await cargarFeaturesLayer(layer.url_geoserver)
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

    const cargarPoligono = async (layer) => {
        const data = await cargarFeaturesLayer(layer.url_geoserver)
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


    const cargarFeaturesLayer = async (url) => {
        let response = await fetch(url)
        let data = await response.json()
        return data
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
            <ProSidebar collapsed={isCollapsed} >
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{ margin: "10px 0 20px 0", color: colors.grey[100], }} >
                        {!isCollapsed && (
                            <div className="flex justify-between items-center ml-[15px]">
                                <img src={theme.palette.mode === "dark" ? SeroClaro : SeroOscuro} style={{ width: '150px' }} alt="" />
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </div>
                        )}
                    </MenuItem>

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>

                        {!isCollapsed && (
                            <div>
                                {/* SERVICIOS */}
                                <div className="w-[90%] mb-4" >
                                    <div className="h-8 flex items-center px-3" style={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : colors.grey[700], color: theme.palette.mode === "dark" ? colors.grey[100] : 'white' }} >
                                        <h1 className="text-base">Servicios</h1>
                                    </div>
                                    <div style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400] }} >
                                        <div className="flex justify-evenly w-full rounded-md flex-wrap" >
                                            {serviciosMapa.length > 0 && serviciosMapa.map((servicio) => (
                                                <IconButton sx={{ width: '30%' }} key={servicio.service_id} aria-label="delete" size="large" onClick={() => handleServicioIcon(servicio)}>
                                                    <i id={servicio.service_id.toString()} style={{ color: colors.grey[100] }} className={servicio.icono}></i>
                                                </IconButton>
                                            ))}
                                        </div>
                                        <Alert severity="success" variant="outline" sx={{
                                            height: '36px', marginTop: '5px', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
                                            backgroundColor: colors.greenAccent[600], color: '#000000', fontWeight: 'bold'
                                        }}>
                                            {nombreServicioActivo}
                                        </Alert>
                                        {dialog_mapa.status && (
                                            <Alert sx={{ marginTop: '5px' }} severity="warning">Cargando capa...</Alert>
                                        )}
                                    </div>
                                </div>
                                {/* LAYERS */}
                                <div className="scroll w-[90%] max-h-[200px] mb-4 overflow-scroll" >
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
                                <div className="w-[90%]">
                                    <div className="h-8 flex items-center px-3" style={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : colors.grey[700], color: theme.palette.mode === "dark" ? colors.grey[100] : 'white' }} >
                                        <h1 className="text-base">Información</h1>
                                    </div>
                                    <div style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400] }} >
                                        {Object.keys(features.features_layer).length > 0 && (features.features_layer.cuenta || features.features_layer.municipio || features.features_layer.ide) ? Object.keys(features.features_layer).map((f, index) => ( // Añadir paréntesis aquí
                                            <Button key={index} sx={{ width: '100%', backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400], color: colors.grey[100] }}>
                                                {`${f.replaceAll('_', ' ')} : ${features.features_layer[f]}`}
                                            </Button>
                                        )) : null}
                                    </div>
                                </div>

                            </div>
                        )}

                    </Box>


                </Menu>
            </ProSidebar>
        </Box>
    )
}

export default SidebarMap