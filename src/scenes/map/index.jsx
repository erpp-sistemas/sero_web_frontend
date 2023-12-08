import React, { useRef, useEffect, useState } from 'react'
import { Map } from "mapbox-gl";
import { useParams } from 'react-router-dom'
import { getPlaceById } from '../../services/place.service';

import { useDispatch } from 'react-redux'
import { setDraw } from '../../redux/featuresSlice'
import { setPlazaMapa } from '../../redux/plazaMapa.Slice'
import { setMapa } from '../../redux/mapaSlice'
import { setFeatures, setCoordinates, setPuntosInPoligono } from '../../redux/featuresSlice'

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import ModalNamePolygon from '../../components/ModalNamePolygon'
import ModalInfoPolygon from '../../components/ModalInfoPolygons'
import { Button } from '@mui/material'

import * as turf from '@turf/turf'

const stylesMap = {
    height: '88vh',
    width: '100vw',
    position: 'fixed',
    top: '12%',
    left: 0,
}



const Mapa = () => {

    const dispatch = useDispatch()


    const mapDiv = useRef(null)

    const { place_id } = useParams();

    const [plaza, setPlaza] = useState([])
    const [poligonosDibujados, setPoligonosDibujados] = useState('');
    const [poligonoSeleccionado, setPoligonoSeleccionado] = useState(null)
    const [puntosInPoligonoSeleccionado, setPuntosInPoligonoSeleccionado] = useState(0)
    const [showModalFeaturePolygon, setShowModalFeaturePolygon] = useState(false)
    const [nombrePoligonoSeleccionado, setNombrePoligonoSeleccionado] = useState('')
    const [poligonoSelected, setPoligonoSelected] = useState(false)
    const [showModalInfoPolygon, setShowModalInfoPolygon] = useState(false)

    const [seleccionPoligonoPuntos, setSeleccionPoligonoPuntos] = useState([]);
    const [ultimoPoligonoCreado, setUltimoPoligonoCreado] = useState('');

    useEffect(() => {
        getPlazaById()
    }, [])

    useEffect(() => {
        if (Object.keys(plaza).length > 0) {
            generarMapa()
        }
    }, [plaza])



    const getPlazaById = async () => {

        const res = await getPlaceById(place_id)
        dispatch(setPlazaMapa(res[0]))
        setPlaza(res[0])

    }

    const generarMapa = () => {
        const mapa = new Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v12?optimize=true',
            center: [Number(plaza.longitud), Number(plaza.latitud)],
            zoom: 12
        })

        dispatch(setMapa(mapa))


        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: false,
                trash: false
            },
        })

        mapa.addControl(draw)

        dispatch(setDraw(draw))


        mapa.on('draw.create', (e) => {
            setSeleccionPoligonoPuntos([]);

            // if (data.features.length > 0) {
            //     addNamePolygon(draw)
            // } else {
            //     if (e.type !== 'draw.delete')
            //         alert('Click the map to draw a polygon.');
            // }
        })

        mapa.on('draw.delete', (e) => {
            setSeleccionPoligonoPuntos([]);
            const data = draw.getAll();
            dispatch(setPuntosInPoligono([]))
            if (data.features.length > 0) {
                // let idPoligono = data.features[0].id
                // setUltimoPoligonoCreado(idPoligono);
                // setPoligonosDibujados([...poligonosDibujados, idPoligono]);
            } else {
                if (e.type !== 'draw.delete')
                    alert('Click the map to draw a polygon.');
            }
        })

        mapa.on('click', e => {

            setPoligonoSelected(false)

            setSeleccionPoligonoPuntos([]);

            var bbox = [
                [e.point.x - 1, e.point.y - 1],
                [e.point.x + 1, e.point.y + 1]
            ];


            var features = mapa.queryRenderedFeatures(bbox)

            if (features.length > 0) {

                if (features[0].layer.type === 'fill' || features[0].layer.type === 'circle') {

                    var draw_polygon = turf.bbox(features[0]);

                    var southWest = [draw_polygon[0], draw_polygon[1]];
                    var northEast = [draw_polygon[2], draw_polygon[3]];

                    var northEastPointPixel = mapa.project(southWest);
                    var southWestPointPixel = mapa.project(northEast);

                    var featuresB = mapa.queryRenderedFeatures([southWestPointPixel, northEastPointPixel])
                    console.log(featuresB)

                    let poligono_info = featuresB.filter(f => f.source === 'mapbox-gl-draw-cold')
                   
                    if (poligono_info.length > 0) {
                        setPoligonoSelected(true)
                    }

                    setPoligonoSeleccionado(poligono_info[0])

                    let puntos = featuresB.filter((f) => f.layer.type === 'circle')

                    puntos = quitarDuplicados(puntos);
                    setPuntosInPoligonoSeleccionado(puntos)

                    dispatch(setPuntosInPoligono(puntos))
                    dispatch(setFeatures(features[0].properties))

                    if (features[0].geometry.type === 'Polygon') {
                        let coordenadasArray = [];
                        let latitud = features[0].properties.latitud;
                        let longitud = features[0].properties.longitud;
                        coordenadasArray.push(longitud);
                        coordenadasArray.push(latitud);
                        dispatch(setCoordinates(coordenadasArray))
                        //setInformacionBuscada([]);
                    } else if (features[0].geometry.type === 'Point') {
                        let coordenadas = features[0].geometry.coordinates;
                        dispatch(setCoordinates(coordenadas))
                        // setInformacionBuscada([]);
                    }

                } else {

                    setCoordinates([]);
                    setFeatures([]);
                    // setInformacionBuscada([]);
                }

            }

        })

    }


    const quitarDuplicados = (array) => {
        //console.log(array)
        var hash = {};
        let arrayTemp = array.filter(function (current) {
            var exists = !hash[current.properties.cuenta];
            hash[current.properties.id_cuenta] = true;
            return exists;
        });
        return arrayTemp;
    }

    const mostrarIdsPoligonos = () => {
        setShowModalInfoPolygon(true)
        alert(poligonosDibujados)
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

            {showModalInfoPolygon && <ModalInfoPolygon 
            setShowModal={setShowModalInfoPolygon} poligonosDibujados={poligonosDibujados} />}

            {poligonoSelected && (
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

            {poligonosDibujados && poligonosDibujados.length > 0 && (
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
            )}

        </div>
    )
}

export default Mapa