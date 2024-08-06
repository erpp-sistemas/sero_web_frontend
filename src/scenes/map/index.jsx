import { useRef, useEffect, useState } from 'react'
import { Map } from "mapbox-gl"
import { useParams } from 'react-router-dom'
import { getPlaceById } from '../../services/place.service'
import { useDispatch } from 'react-redux'
import { setDraw } from '../../redux/featuresSlice'
import { setPlazaMapa } from '../../redux/plazaMapa.Slice'
import { setMapa } from '../../redux/mapaSlice'
import { setFeatures, setCoordinates, setPuntosInPoligono } from '../../redux/featuresSlice'
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import ModalNamePolygon from '../../components/ModalNamePolygon'
import ModalInfoPolygon from '../../components/ModalInfoPolygons'
import { Button } from '@mui/material'
import * as turf from '@turf/turf'
import { useSelector } from 'react-redux'

const stylesMap = {
    height: 'calc(100vh - 64px)',
    width: '100vw',
    position: 'fixed',
    top: '64px',
    left: 0,
}

const Mapa = () => {

    const dispatch = useDispatch();
    const mapDiv = useRef(null);
    const { place_id } = useParams();

    const [plaza, setPlaza] = useState(null);
    const [polygonsCreated, setPolygonsCreated] = useState([]);
    const [lastPolygonCreated, setLastPolygonCreated] = useState(null);
    const polygonsStorage = useRef(null);


    const [poligonosDibujados, setPoligonosDibujados] = useState('')
    const [poligonoSeleccionado, setPoligonoSeleccionado] = useState()
    const [puntosInPoligonoSeleccionado, setPuntosInPoligonoSeleccionado] = useState(0)
    const [showModalFeaturePolygon, setShowModalFeaturePolygon] = useState(false)
    const [nombrePoligonoSeleccionado, setNombrePoligonoSeleccionado] = useState('')
    const [poligonoSelected, setPoligonoSelected] = useState(false)
    const [showModalInfoPolygon, setShowModalInfoPolygon] = useState(false)

    const [seleccionPoligonoPuntos, setSeleccionPoligonoPuntos] = useState([]);
    const [ultimoPoligonoCreado, setUltimoPoligonoCreado] = useState('');


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
            setShowModalInfoPolygon(true);
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
                }
            }
        });

        map.on('draw.create', (e) => {
            const polygon = e.features[0]; //? obtengo el poligono dibujado
            if (polygon) {
                const res_layers_in_map = getLayersVisiblesInMap(map);
                if (res_layers_in_map.status === 2) {
                    alert("Hay mas de un layer en el mapa")
                    deletePolygonStorage(polygon);
                }
                createPolygon(map, polygon);
            }
        });

        map.on('click', 'gl-draw-polygon-fill-inactive.cold', function (e) {
            const features = map.queryRenderedFeatures(e.point, { layers: ['gl-draw-polygon-fill-inactive.cold'] });
            if (features.length) {
                const clickedPolygon = features[0];
                const id_polygon_selected = clickedPolygon.properties.id;
                const polygon_selected = polygonsStorage.current.filter(poly => poly.id === id_polygon_selected)[0];
                createPolygon(map, polygon_selected)
            }
        });

        map.on('draw.update', (e) => {
            const polygon = draw.getAll().features[0];
            if (polygon) {
                const pointsInPolygon = points.features.filter(point => {
                    return turf.booleanPointInPolygon(point, polygon);
                });

                console.log(`Number of points inside the polygon: ${pointsInPolygon.length}`);
            }
        });
        map.on('draw.delete', () => console.log('Polygon deleted'));
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

    const createPolygon = (map, polygon) => {
        if (!polygon.area) {
            const layers_in_map = getLayersVisiblesInMap(map);
            const features_layer = map.getSource(layers_in_map.layers_visibles[0].source)._data.features;
            const area = turf.area(polygon);
            const pointsInPolygon = features_layer.filter(point => turf.booleanPointInPolygon(point, polygon));
            const data_polygon = {
                id: polygon.id, number_points: pointsInPolygon.length, points: pointsInPolygon,
                area: `${((area / 1000)).toFixed(2)} km2`, coordenadas: polygon.geometry.coordinates
            }
            setLastPolygonCreated(data_polygon);
            return;
        }
        setLastPolygonCreated(polygon);
        setShowModalInfoPolygon(true);
    }


    const addPolygonStorage = (polygon) => {
        if (polygonsCreated.length === 0) {
            setPolygonsCreated([polygon])
            polygonsStorage.current = [polygon];
        } else {
            const have_id_polygon = polygonsCreated.find(poly => poly.id === polygon.id);
            if (!have_id_polygon) {
                setPolygonsCreated([...polygonsCreated, polygon])
                polygonsStorage.current = [...polygonsCreated, polygon]
            }
        }
    }

    const deletePolygonStorage = (polygon_id) => {
        //todo borrar poligono del state y del mapa
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

    const mostrarIdsPoligonos = () => {
        setShowModalInfoPolygon(true)
        console.log(polygonsCreated)
    }


    const addNamePolygonSelected = () => {
        setPoligonosDibujados([...poligonosDibujados, {
            name_polygon: nombrePoligonoSeleccionado,
            cuentas: puntosInPoligonoSeleccionado,
            id: poligonoSeleccionado.properties.id
        }])
        setShowModalFeaturePolygon(false)
    }

    return (

        <div ref={mapDiv} style={stylesMap}>

            {showModalFeaturePolygon && <ModalNamePolygon
                setShowModal={setShowModalFeaturePolygon}
                setNombrePoligono={setNombrePoligonoSeleccionado}
                aceptName={addNamePolygonSelected}
            />}

            {showModalInfoPolygon && <ModalInfoPolygon setShowModal={setShowModalInfoPolygon} polygon={lastPolygonCreated} setLastPolygonCreated={setLastPolygonCreated}
                setPolygonsCreated={setPolygonsCreated} polygonsCreated={polygonsCreated} polygonsStorage={polygonsStorage} />}

            {/* {poligonoSelected && (
                <Button variant="contained"
                    onClick={() => setShowModalFeaturePolygon(true)}
                    sx={{
                        zIndex: '100',
                        position: 'absolute',
                        left: '300px',
                        bottom: '70px',
                        width: '250px',
                    }}
                >Agregar feature</Button>
            )}

            {polygonsCreated && polygonsCreated.length > 0 && (
                <Button variant="contained"
                    onClick={mostrarIdsPoligonos}
                    sx={{
                        zIndex: '100',
                        position: 'absolute',
                        left: '300px',
                        bottom: '30px',
                        width: '250px'
                    }}
                >Mostrar información poligonos</Button>
            )} */}

        </div>

    )

}

export default Mapa