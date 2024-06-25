import { useState, useEffect, useRef } from 'react'
import { Map } from 'mapbox-gl';
import { Box } from "@mui/material";

const MapBoxMap = ({ latitud, longitud, url_capa_geoserver, url_capa_limite_municipal, isFilter = false, fechaInit = '', fechaEnd = '' }) => {

    const mapDiv = useRef(null)

    const [mapState, setMapState] = useState(null)

    useEffect(() => {

        if (mapState === null) {
            const map = new Map({
                container: mapDiv.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [longitud, latitud],
                zoom: 10,
                preserveDrawingBuffer: true
            })
            setMapState(map)
        } else {
            let etiqueta = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0]
            let etiqueta2 = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[1]
            if (etiqueta) {
                etiqueta.style.display = 'none'
            }
            if (etiqueta2) {
                etiqueta2.style.display = 'none'
            }
            cargarLayerMap()
        }

    }, [mapDiv, mapState])


    const cargarLayerMap = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await cargaPunto();
                await cargarPoligono();
                resolve("Layer cargado");
                if (isFilter) {
                    filterMap()
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    const filterMap = () => {
        mapState.setFilter('capa_encuesta', ["all",
            [">=", ['get', 'fecha'], fechaInit],
            ["<=", ['get', 'fecha'], fechaEnd],
        ])
    }

    const cargaPunto = async () => {
        const data = await cargarFeaturesLayer(url_capa_geoserver);
        mapState.addSource('encuesta', { type: 'geojson', data: data });
        mapState.addLayer({
            "id": 'capa_encuesta',
            "type": "circle",
            "source": 'encuesta',
            "layout": {},
            "minzoom": 10,
            "maxzoom": 24,
            "paint": { 'circle-radius': ['/', 7.142857142857142, 2], 'circle-color': '#2b3504', 'circle-opacity': 1, 'circle-stroke-width': 1, 'circle-stroke-color': '#232323' }
        });
    }

    const cargarPoligono = async () => {
        const data = await cargarFeaturesLayer(url_capa_limite_municipal);
        mapState.addSource('limite_municipal', { type: 'geojson', data: data });
        mapState.addLayer({
            id: "capa_limite",
            type: "line",
            source: "limite_municipal",
            layout: {},
            minzoom: 6,
            maxzoom: 18,
            paint: {
                'line-color': '#3da58a',
                'line-width': 4
            }

        });
    }


    const cargarFeaturesLayer = async (url) => {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }


    return (
        <Box ref={mapDiv}
            sx={{ height: '100%', width: '100%' }}
        >
        </Box>
    )

}

export default MapBoxMap