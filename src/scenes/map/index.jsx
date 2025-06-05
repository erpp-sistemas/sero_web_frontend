import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlaceById } from '../../services/place.service'

// REDUX
import { useDispatch, useSelector } from 'react-redux'
import { setDraw } from '../../redux/featuresSlice'
import { setPlazaMapa } from '../../redux/plazaMapa.Slice'
import { setMapa } from '../../redux/mapaSlice'
import { setFeatures, setCoordinates, setPuntosInPoligono, setPolygonsCreated } from '../../redux/featuresSlice'

// COMPONENTS
import ModalinfoPolygonPdf from '../../components/map/ModalinfoPolygonPdf';
import ModalQuestion from '../../components/modals/ModalQuestion';
import ModalInfoPolygon from '../../components/map/ModalInfoPolygon'
import ModalInfoPolygons from '../../components/map/ModalInfoPolygons'
import ModalSaveProject from '../../components/map/ModalSaveProject';
import { getIcon } from '../../data/Icons'
import Tools from '../../components/map/Tools'

// LIBRERIES MAP
import { Map } from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import * as turf from '@turf/turf'

// MATERIAL UI
import Tooltip from '@mui/material/Tooltip';


const stylesMap = {
    height: 'calc(100vh - 64px)',
    width: '100vw',
    position: 'fixed',
    top: '64px',
    left: 0,
}

const Mapa = () => {

    const user = useSelector(state => state.user);
    const polygonsCreated = useSelector(state => state.features.polygonsCreated);
    const dispatch = useDispatch();
    const mapDiv = useRef(null);
    const { place_id } = useParams();

    const [plaza, setPlaza] = useState(null);
    //const [polygonsCreated, setPolygonsCreated] = useState([]);
    const [lastPolygonCreated, setLastPolygonCreated] = useState(null);
    const [drawMap, setDrawMap] = useState(null);

    const [showModalInfoPolygon, setShowModalInfoPolygon] = useState(false);
    const [showModalInfoPolygons, setShowModalInfoPolygons] = useState(false);
    const [showModalPdf, setShowModalPdf] = useState(false);
    const [showModalQuestion, setShowModalQuestion] = useState(false);
    const [dataPdf, setDataPdf] = useState([]);

    const [showModalSaveProject, setShowModalSaveProject] = useState(false);
    const [idProject, setIdProject] = useState(Math.random().toString(36).substring(2, 15));
    const [dataProject, setDataProject] = useState(null);
    const [showModalCleanPolygons, setShowModalCleanPolygons] = useState(false);


    const polygonsStorage = useRef(null);
    const mapRef = useRef(null);
    const functionDelete = useRef(null)


    useEffect(() => {
        const getPlazaById = async () => {
            const res = await getPlaceById(place_id);
            dispatch(setPlazaMapa(res[0]))
            setPlaza(res[0])
        }
        getPlazaById()
    }, [])


    useEffect(() => {
        if (plaza) generateMap();
    }, [plaza])

    useEffect(() => {
        if (lastPolygonCreated) {
            addPolygonStorage(lastPolygonCreated);
        }
    }, [lastPolygonCreated])

    const generateMap = () => {
        const map = new Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
            center: [plaza.longitud, plaza.latitud],
            zoom: 12
        });

        dispatch(setMapa(map));
        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
        });

        mapRef.current = map;
        setDrawMap(draw);

        map.addControl(draw)
        dispatch(setDraw(draw))

        map.on('click', function (e) {
            let features = map.queryRenderedFeatures(e.point, { layers: map.getStyle().layers.map(layer => layer.id) });
            if (features.length) {
                features = quitarDuplicados(features);
                if (features[0].id === undefined && !features[0].source.includes('mapbox') && !features[0].source.includes('road') && !features[0].source.includes('composite')) {
                    dispatch(setPuntosInPoligono(features[0].properties))
                    dispatch(setFeatures(features[0].properties))
                    if (features[0].geometry.type === 'Polygon') {
                        let coordenadasArray = [];
                        let latitud = features[0].properties.latitud;
                        let longitud = features[0].properties.longitud;
                        coordenadasArray.push(longitud);
                        coordenadasArray.push(latitud);
                        dispatch(setCoordinates(coordenadasArray))
                    } else if (features[0].geometry.type === 'Point') {
                        let coordenadas = features[0].geometry.coordinates;
                        dispatch(setCoordinates(coordenadas))
                    }
                } else {
                    dispatch(setFeatures([]))
                    dispatch(setCoordinates({}))
                }
            }
        });

        map.on('draw.create', (e) => beforeCreatePolygon(e, map));
        map.on('draw.update', (e) => beforeCreatePolygon(e, map));

        map.on('click', 'gl-draw-polygon-fill-inactive.cold', function (e) {
            const features = map.queryRenderedFeatures(e.point, { layers: ['gl-draw-polygon-fill-inactive.cold'] });
            if (features.length) {
                const clickedPolygon = features[0];
                const id_polygon_selected = clickedPolygon.properties.id;
                const polygon_selected = polygonsStorage.current.filter(poly => {
                    if (poly.draw_id) return poly.draw_id === id_polygon_selected;
                    else return poly.id === id_polygon_selected;
                })[0];

                createPolygon(map, polygon_selected)
            }
        });

        map.on('draw.delete', (e) => {
            const polygon = e.features[0]; //? obtengo el poligono eliminado
            enabledPoints(map, polygon.id);
            deleteUserAndRoute(polygon.id);
            deletePolygonStorage(polygon, map);
        });

    }

    const getLayersVisiblesInMap = (map) => {
        const loaded_layers_in_map = map.getStyle().layers.filter(layer => layer.type === 'circle' && !layer.id.includes('gl-draw'));
        if (loaded_layers_in_map.length === 0) {
            return { status: 0, message: 'No hay layers cargados en el mapa', layers_visibles: [] }
        }
        const layers_visibles = loaded_layers_in_map.filter(layer => layer.layout.visibility === 'visible');
        if (layers_visibles.length > 1) {
            return { status: 2, message: 'Hay mas de un layer visible en el mapa', layers_visibles: layers_visibles }
        }
        return {
            status: 1, message: 'Un layer en el mapa', layers_visibles: layers_visibles
        }
    }

    const beforeCreatePolygon = (e, map) => {
        const polygon = e.features[0]; //? obtengo el poligono dibujado
        if (polygon) {
            const res_layers_in_map = getLayersVisiblesInMap(map);
            if (res_layers_in_map.status === 2) {
                alert("Hay mas de un layer en el mapa")
                deletePolygonStorage(polygon);
            }
            createPolygon(map, polygon);
        }
    }


    const createPolygon = (map, polygon) => {
        if (!polygon) return;
        setShowModalInfoPolygon(true);
        if (!polygon.area) {
            const layers_in_map = getLayersVisiblesInMap(map);
            if (layers_in_map.status === 0) {
                alert("No hay ningun layer prendido")
                return;
            }
            const features_layer = map.getSource(layers_in_map.layers_visibles[0].source)._data.features;
            const area = turf.area(polygon);
            const pointsInPolygon = features_layer.filter(point => turf.booleanPointInPolygon(point, polygon));

            const data_polygon = {
                id: polygon.id, number_points: pointsInPolygon.length, points: pointsInPolygon,
                area: `${((area / 1000000)).toFixed(2)} km2`, coordenadas: polygon.geometry.coordinates
            }
            setLastPolygonCreated(data_polygon);
            return;
        }
        setLastPolygonCreated(polygon);
    }


    const addPolygonStorage = (polygon) => {
        let have_draw_id = polygon.draw_id ? true : false;
        if (polygonsCreated.length === 0) {
            dispatch(setPolygonsCreated([polygon]));
            polygonsStorage.current = [polygon];
        } else {
            let have_id_polygon = null;
            if (have_draw_id) have_id_polygon = polygonsCreated.find(poly => poly.draw_id === polygon.draw_id);
            if (!have_draw_id) have_id_polygon = polygonsCreated.find(poly => poly.id === polygon.id);
            if (!have_id_polygon) {
                dispatch(setPolygonsCreated([...polygonsCreated, polygon]));
                polygonsStorage.current = [...polygonsCreated, polygon];
                return;
            }

            let polygons_not_selected;
            if (have_draw_id) polygons_not_selected = polygonsCreated.filter(poly => poly.draw_id !== polygon.draw_id);
            if (!have_draw_id) polygons_not_selected = polygonsCreated.filter(poly => poly.id !== polygon.id);
            // Crea un nuevo objeto, para no modificar el original
            const newPolygon = {
                ...polygon,
                name: have_id_polygon.name || polygon.name,
                user: have_id_polygon.user || polygon.user
            };
            dispatch(setPolygonsCreated([...polygons_not_selected, newPolygon]));
            polygonsStorage.current = [...polygons_not_selected, newPolygon];
        }
    }

    const deletePolygonStorage = (polygon) => {
        const new_polygons = polygonsStorage.current.filter(poly => {
            if (poly.draw_id) return poly.draw_id !== polygon.id;
            return poly.id !== polygon.id;
        });
        polygonsStorage.current = new_polygons;
        dispatch(setPolygonsCreated(new_polygons));
    }

    const disabledPoints = (map, polygon_id) => {
        const polygon = drawMap.get(polygon_id);
        const layers_in_map = getLayersVisiblesInMap(map);
        const source = layers_in_map.layers_visibles[0].source;
        const layer = layers_in_map.layers_visibles[0].id;
        const color = layers_in_map.layers_visibles[0].paint['circle-color'];

        const points = mapRef.current.getSource(source)._data.features;

        // Crea un nuevo array de features con las propiedades modificadas
        const newPoints = points.map(point => {
            if (turf.booleanPointInPolygon(point, polygon)) {
                return {
                    ...point,
                    properties: {
                        ...point.properties,
                        disabled: true,
                        pid: polygon.id
                    }
                };
            }
            return point;
        });

        // Actualizar la fuente de datos para reflejar los cambios
        mapRef.current.getSource(source).setData({
            type: 'FeatureCollection',
            features: newPoints,
        });

        // Cambiar el estilo de los puntos deshabilitados
        mapRef.current.setPaintProperty(layer, 'circle-color', [
            'case',
            ['boolean', ['get', 'disabled'], false],
            '#B0B0B0', // Color gris para puntos deshabilitados
            color  // Color original para puntos activos
        ]);
    }
    const enabledPoints = (map, polygon_id) => {
        const layers_in_map = getLayersVisiblesInMap(map);
        const source = layers_in_map.layers_visibles[0].source;
        const layer = layers_in_map.layers_visibles[0].id;
        const color_circle = layers_in_map.layers_visibles[0].paint['circle-color'];
        let color;
        if (color_circle[0] === 'case') {
            color = color_circle[3];
        } else {
            color = color_circle
        }

        const points = mapRef.current.getSource(source)._data.features;
        points.forEach((point) => {
            if (point.properties.pid && point.properties.pid === polygon_id) {
                point.properties.disabled = false;  // Marcar el punto como habilitado
                delete point.properties.pid;
            }
        });

        mapRef.current.getSource(source).setData({ type: 'FeatureCollection', features: points, });

        mapRef.current.setPaintProperty(layer, 'circle-color', [
            'case',
            ['==', ['get', 'pid'], polygon_id],
            color,
            color
        ]);
    }

    const quitarDuplicados = (array) => {
        var hash = {}
        let arrayTemp = array.filter(function (current) {
            var exists = !hash[current.properties.cuenta]
            hash[current.properties.id_cuenta] = true
            return exists
        })
        return arrayTemp
    }

    const deleteUserAndRoute = (polygon_id) => {
        const polygon = polygonsStorage.current.filter(poly => {
            if (poly.draw_id) return poly.draw_id === polygon_id;
            return poly.id === polygon_id
        })[0];
        if (typeof functionDelete.current === 'function') {
            functionDelete.current(polygon);
        }
    }

    const handleSaveWorkSpace = (resp) => {
        if (polygonsCreated.length === 0) return alert("No hay poligonos creados");
        setShowModalQuestion(false);

        if (resp) {
            const fecha = new Date();
            const { name, user_id, username, profile_id } = user;
            const layers_in_map = getLayersVisiblesInMap(mapRef.current);
            if (layers_in_map.status === 0) return alert("No hay ningun layer activo en el mapa");
            if (layers_in_map.status === 2) return alert("Hay mas de un layer activo en el mapa")
            const layer = layers_in_map.layers_visibles[0].source;
            const data = {
                project_id: idProject,
                polygons: polygonsCreated,
                layer: layer,
                plaza: plaza,
                user: { name, user_id, username, profile_id },
                fecha: `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}`,
            }
            if (dataProject && dataProject.nombre) {
                const { nombre, descripcion } = dataProject;
                setDataProject({ ...data, nombre, descripcion });
            } else setDataProject(data);

            setShowModalSaveProject(true);
        }

    }


    const cleanAllPolygons = () => {
        polygonsStorage.current.forEach(polygon => {
            if (polygon.marker) polygon.marker.remove();
            const id = polygon.draw_id ? polygon.draw_id : polygon.id;
            if (polygon.distancia && polygon.distancia !== '' && polygon.distancia !== undefined) {
                if (mapRef.current.getLayer(`route-${id}`)) {
                    mapRef.current.removeLayer(`route-${id}`);
                    mapRef.current.removeSource(`route-${id}`);
                }
            }
        })
        dispatch(setPolygonsCreated([]));
        polygonsStorage.current = [];
        setLastPolygonCreated(null);
        drawMap.deleteAll();
        dispatch(setFeatures([]));
        dispatch(setCoordinates({}));
    }

    const handleCleanAllPolygons = (resp) => {
        if (polygonsCreated.length === 0) return alert("No hay poligonos creados");
        setShowModalCleanPolygons(false);
        if (resp) cleanAllPolygons();
    }


    return (

        <div ref={mapDiv} style={stylesMap}>

            {showModalQuestion && <ModalQuestion
                title="¿Deseas guardar el proyecto?"
                handleRespuesta={handleSaveWorkSpace}
            />}

            {showModalCleanPolygons && <ModalQuestion
                title={"¿Estás seguro de que deseas eliminar todos los polígonos, esta acción no se puede deshacer?"}
                handleRespuesta={handleCleanAllPolygons}
            />}

            {showModalPdf && <ModalinfoPolygonPdf
                setShowModal={setShowModalPdf}
                polygon={dataPdf}
            />}

            {showModalSaveProject && <ModalSaveProject
                setShowModal={setShowModalSaveProject}
                dataProject={dataProject}
                setDataProject={setDataProject}
            />}

            {showModalInfoPolygon && <ModalInfoPolygon
                setShowModal={setShowModalInfoPolygon} polygon={lastPolygonCreated}
                setLastPolygonCreated={setLastPolygonCreated}
                polygonsStorage={polygonsStorage}
                disabledPoints={disabledPoints} />}

            {showModalInfoPolygons && <ModalInfoPolygons setShowModal={setShowModalInfoPolygons} draw={drawMap} map={mapRef}
                disablePoints={disabledPoints} enabledPoints={enabledPoints} setLastPolygonCreated={setLastPolygonCreated}
                setFunction={functionDelete} setShowModalPdf={setShowModalPdf} setDataPdf={setDataPdf}
            />}

            {polygonsCreated && polygonsCreated.length > 0 && (
                <div className="z-[100] absolute right-[20px] top-3 p-2 flex flex-col justify-center gap-2 bg-gray-600 shadow-xl shadow-slate-600 rounded-md">
                    <Tooltip placement="left-start" title="Mostrar poligonos">
                        <button className="py-2 px-2 rounded bg-cyan-600 hover:bg-cyan-500"
                            onClick={() => setShowModalInfoPolygons(true)} >
                            {getIcon('TimelineIcon', {})}
                        </button>
                    </Tooltip>
                    <Tooltip placement="left-start" title="Guardar proyecto">
                        <button className="py-2 px-2 rounded bg-cyan-600 hover:bg-cyan-500"
                            onClick={() => setShowModalQuestion(true)} >
                            {getIcon('SaveIcon', {})}
                        </button>
                    </Tooltip>
                    <Tooltip placement="left-start" title="Borrar poligonos">
                        <button className="py-2 px-2 rounded bg-cyan-600 hover:bg-cyan-500"
                            onClick={() => setShowModalCleanPolygons(true)} >
                            {getIcon('DeleteIcon', {})}
                        </button>
                    </Tooltip>


                </div>
            )}

            <div className="z-[100] absolute left-[300px] bottom-4 bg-neutral-700 rounded-md">
                <Tools data={{ polygonsStorage, setShowModalInfoPolygons }} />
            </div>


        </div>

    )

}

export default Mapa