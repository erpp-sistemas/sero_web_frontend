import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlaceById } from '../../services/place.service'

// REDUX
import { useDispatch, useSelector } from 'react-redux'
import { setDraw } from '../../redux/featuresSlice'
import { setPlazaMapa } from '../../redux/plazaMapa.Slice'
import { setMapa } from '../../redux/mapaSlice'
import { setFeatures, setCoordinates, setPuntosInPoligono } from '../../redux/featuresSlice'

// COMPONENTS
import ModalinfoPolygonPdf from '../../components/map/ModalinfoPolygonPdf';
import ModalQuestion from '../../components/modals/ModalQuestion';
import ModalInfoPolygon from '../../components/map/ModalInfoPolygon'
import ModalInfoPolygons from '../../components/map/ModalInfoPolygons'
import ModalSaveProject from '../../components/map/ModalSaveProject';
import { getIcon } from '../../data/Icons'

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
    const dispatch = useDispatch();
    const mapDiv = useRef(null);
    const { place_id } = useParams();

    const [plaza, setPlaza] = useState(null);
    const [polygonsCreated, setPolygonsCreated] = useState([]);
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
                const polygon_selected = polygonsStorage.current.filter(poly => poly.id === id_polygon_selected)[0];
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
        if (polygonsCreated.length === 0) {
            setPolygonsCreated([polygon])
            polygonsStorage.current = [polygon];
        } else {
            const have_id_polygon = polygonsCreated.find(poly => poly.id === polygon.id);
            if (!have_id_polygon) {
                setPolygonsCreated([...polygonsCreated, polygon]);
                polygonsStorage.current = [...polygonsCreated, polygon];
                return;
            }

            const polygons_not_selected = polygonsCreated.filter(poly => poly.id !== polygon.id);
            if (have_id_polygon.name) polygon.name = have_id_polygon.name;
            if (have_id_polygon.user) polygon.user = have_id_polygon.user;

            setPolygonsCreated([...polygons_not_selected, polygon]);
            polygonsStorage.current = [...polygons_not_selected, polygon];

        }
    }

    const deletePolygonStorage = (polygon) => {
        const new_polygons = polygonsStorage.current.filter(poly => poly.id !== polygon.id);
        polygonsStorage.current = new_polygons;
        setPolygonsCreated(new_polygons)
    }

    const disabledPoints = (map, polygon_id) => {
        const polygon = drawMap.get(polygon_id);
        const layers_in_map = getLayersVisiblesInMap(map);
        const source = layers_in_map.layers_visibles[0].source;
        const layer = layers_in_map.layers_visibles[0].id;
        const color = layers_in_map.layers_visibles[0].paint['circle-color'];

        const points = mapRef.current.getSource(source)._data.features;
        points.forEach((point) => {
            if (turf.booleanPointInPolygon(point, polygon)) {
                point.properties.disabled = true;  // Marcar el punto como deshabilitado
                point.properties.pid = polygon.id // le damos al punto su poligono
            }
        });

        // Actualizar la fuente de datos para reflejar los cambios
        mapRef.current.getSource(source).setData({
            type: 'FeatureCollection',
            features: points,
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
        const polygon = polygonsStorage.current.filter(poly => poly.id === polygon_id)[0];
        if (typeof functionDelete.current === 'function') {
            functionDelete.current(polygon);
        }
    }

    const handleSaveWorkSpace = () => {
        if (polygonsCreated.length === 0) {
            alert("No hay poligonos creados")
            return;
        }
        setShowModalQuestion(true);
    }

    const handleRespModalQuestion = (resp) => {
        setShowModalQuestion(false);
        if (resp) {
            const fecha = new Date();
            const { name, user_id, username, profile_id } = user;
            const data = {
                project_id: idProject,
                polygons: polygonsCreated,
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


    return (

        <div ref={mapDiv} style={stylesMap}>

            {showModalQuestion && <ModalQuestion
                title="¿Deseas guardar el proyecto?"
                handleRespuesta={handleRespModalQuestion}
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
                setLastPolygonCreated={setLastPolygonCreated} setPolygonsCreated={setPolygonsCreated}
                polygonsCreated={polygonsCreated} polygonsStorage={polygonsStorage}
                disabledPoints={disabledPoints} />}

            {showModalInfoPolygons && <ModalInfoPolygons setShowModal={setShowModalInfoPolygons} polygons={polygonsCreated} draw={drawMap} map={mapRef}
                disablePoints={disabledPoints} enabledPoints={enabledPoints} setPolygonsCreated={setPolygonsCreated} setLastPolygonCreated={setLastPolygonCreated}
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
                            onClick={handleSaveWorkSpace} >
                            {getIcon('SaveIcon', {})}
                        </button>
                    </Tooltip>

                </div>
            )}

        </div>

    )

}

export default Mapa