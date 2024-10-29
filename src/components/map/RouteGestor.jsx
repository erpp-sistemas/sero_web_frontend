import { useState, useEffect } from 'react'

// API
import { getGestores, getPositionsGestorByFecha, getPositionsGestionesGestorByFecha } from '../../api/user'

// LIBRERIES
import mapboxgl from 'mapbox-gl';

// REDUX
import { useSelector, useDispatch } from 'react-redux';

// COMPONENTS
import { getIcon } from '../../data/Icons';


const RouteGestor = ({ data }) => {

    const { rutaDibujada, setRutaDibujada, markersRoute: markers, setMarkersRoute: setMarkers,
        gestorSeleccionado, setGestorSeleccionado, fechaSeleccionada, setFechaSeleccionada, setShowTools
    } = data;

    const map_active = useSelector((state) => state.mapa);

    const [gestores, setGestores] = useState([]);
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        getInitGestores();
    }, [])

    const getInitGestores = async () => {
        const data = await getGestores();
        setGestores(data)
    }

    const handleChangeGestor = (e) => {
        const value = e.target.value;
        if (value === '0') {
            alert("Seleccione un gestor de la lista")
        }
        const gestor = gestores.filter(gestor => gestor.id_usuario === Number(e.target.value))
        setGestorSeleccionado(gestor[0]);
    }

    const handleSearchRoute = async () => {

        if (fechaSeleccionada === '' || Object.values(gestorSeleccionado).length === 0) {
            alert("Ingresa los dos valores para buscar la ruta");
            return;
        }

        setIsLoading(true);

        const pos = getPositionsGestorByFecha(gestorSeleccionado.id_usuario, fechaSeleccionada);
        const pos_ges = getPositionsGestionesGestorByFecha(2, gestorSeleccionado.id_usuario, fechaSeleccionada);

        const promise = await Promise.all([pos, pos_ges])

        if(promise[0].length === 0 || promise[1].length === 0) {
            alert("Este gestor no tiene posiciones en la fecha seleccionada");
            setIsLoading(false);
            return;
        }
        const posiciones = promise[0];
        const posicionesGestiones = promise[1]

        createGeojsonLine(posiciones);
        createMarker(posicionesGestiones);
        setIsLoading(false);
        setShowTools(false);
    }

    const createGeojsonLine = (posiciones) => {

        let coordinates = [];
        posiciones.forEach((p) => {
            let longitud = p.longitud;
            let latitud = p.latitud;
            let arrTemp = [longitud, latitud]
            coordinates.push(arrTemp);
        })
        const geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'properties': {},
                        'coordinates': coordinates
                    }
                }
            ]
        }
        addSourceMapLine(geojson);
    }

    const addSourceMapLine = (geojson) => {
        map_active.mapa.addSource('LineString', {
            'type': 'geojson',
            data: geojson
        });
        map_active.mapa.addLayer({
            'id': 'LineString',
            'type': 'line',
            'source': 'LineString',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#0F53FF', // Color de la línea
                'line-width': 4,          // Ancho de la línea
                'line-dasharray': [0.5, 4],  // Puntos (0.1px línea, 4px espacio)
            }
        });
        const coordinates = geojson.features[0].geometry.coordinates;
        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
        );
        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
            bounds.extend(coord);
        }
        map_active.mapa.fitBounds(bounds, {
            padding: 20
        });
        setRutaDibujada(true);
    }

    const createMarker = (posicionesGestiones) => {
        let markersArr = []
        if (posicionesGestiones.length === 0) {
            alert("Este gestor no tiene gestiones en la fecha seleccionada");
            return;
        }
        posicionesGestiones.forEach((p) => {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style='text-align: center;'> <p style='color: black'> <span style='color: black ; font-weight: 700;'> Cuenta: </span> ${p.cuenta}</p> <p style='color: black'> <span style='color: black; font-weight: 700;'> Fecha: </span> ${p.fecha} </p> </div>`);
            const marker = new mapboxgl.Marker()
            const element = marker.getElement();
            element.addEventListener('mouseenter', () => popup.addTo(map_active.mapa));
            element.addEventListener('mouseleave', () => popup.remove());
            marker.setLngLat([p.longitud, p.latitud])
                .setPopup(popup)
                .addTo(map_active.mapa)
            markersArr.push(marker);
        });
        setMarkers(markersArr);
    }

    const handlerBorrarRuta = () => {
        setIsLoading(true)
        if (map_active.mapa.getSource('LineString')) {
            map_active.mapa.removeLayer('LineString');
            map_active.mapa.removeSource('LineString');
        }
        setRutaDibujada(false);
        setGestorSeleccionado({})
        removeMarkers();
        setFechaSeleccionada('');
        setIsLoading(false);
        setShowTools(false);
    }

    const removeMarkers = () => {
        if (markers.length > 0) {
            markers.forEach(m => {
                m.remove();
            })
        }
        setMarkers([]);
    }

    return (
        <div className="p-2 flex flex-col items-center">
            {!rutaDibujada && (
                <>
                    <div className='w-1/2 mb-4'>
                        <p className="text-gray-900 text-base text-center font-semibold">Seleccione un gestor:</p>
                        <select className='w-full rounded-md py-1 text-gray-900 px-4' onChange={handleChangeGestor}>
                            <option value="0">------------------</option>
                            {gestores.length > 0 && gestores.map(gestor => (
                                <option key={gestor.id_usuario} value={gestor.id_usuario}>
                                    {gestor.nombre} {gestor.apellido_paterno} {gestor.apellido_materno}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='w-1/2'>
                        <p className="text-gray-900 text-base text-center font-semibold">Seleccione la fecha:</p>
                        <input className="w-full rounded-md text-gray-950 px-4" type="date" onChange={e => setFechaSeleccionada(e.target.value)} placeholder='Ingrese una fecha' />
                    </div>

                </>
            )}

            {!rutaDibujada ? (
                <button className="font-serif bg-green-700 py-1 rounded-md px-6 mt-4 flex items-center hover:bg-green-500" onClick={handleSearchRoute}>
                    {getIcon('LineWeightIcon', {})}
                    BUSCAR RUTA
                </button>
            ) : (
                <>
                    <img className="w-2/4" src={gestorSeleccionado.foto} alt="" />
                    <h3 className="text-gray-900 font-semibold"> Ruta de {gestorSeleccionado.nombre} {gestorSeleccionado.apellido_paterno} {gestorSeleccionado.apellido_materno}  </h3>
                    <h3 className="text-gray-900 font-semibold"> en la fecha: {fechaSeleccionada} </h3>

                    <button className="font-serif bg-red-700 flex items-center py-1 rounded-md px-6 mt-4 hover:bg-red-500" onClick={handlerBorrarRuta}>
                        {getIcon('DeleteIcon', {})}
                        QUITAR RUTA
                    </button>
                </>
            )}

            {isLoading && (
                <h3 className='text-gray-900 mt-4 text-base font-serif px-4 bg-neutral-300 opacity-90 rounded-md py-1 italic'>Cargado ruta...</h3>
            )}

        </div>

    )
}

export default RouteGestor