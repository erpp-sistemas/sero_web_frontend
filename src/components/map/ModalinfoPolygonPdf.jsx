import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Modal } from '@mui/material'
import { Map } from "mapbox-gl"


import Logo from '../../assets/ser0_space_fondoclaro.png'
import { getIcon } from '../../data/Icons';
import html2Canvas from 'html2canvas'
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfView from './PdfView';
import TableInfoPdf from './TableInfoPdf';

const stylesMap = {
    width: '90%',
    height: '300px',
    marginTop: '20px'
}

const ModalinfoPolygonPdf = ({ setShowModal, polygon }) => {

    const [open, setOpen] = useState(true);
    const [pdfCreated, setPdfCreated] = useState(false);
    const [imagePdf, setImagePdf] = useState();
    const [data, setData] = useState({})


    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };


    useEffect(() => {
        const properties = polygon.points.map(poly => poly.properties);
        const { resultado, serviciosUnicos, totales, totalGeneral } = transformarDatos(properties);
        setData({ resultado, serviciosUnicos, totales, totalGeneral })
    }, [])


    const transformarDatos = (data) => {
        const resultado = {};
        const serviciosUnicos = new Set();
        const totales = {};

        data.forEach(item => {
            const tipoUsuario = item.tipo_usuario;
            const tipoServicio = item.tipo_servicio;
            const adeudoReal = item.adeudo_real;

            serviciosUnicos.add(tipoServicio);

            if (!resultado[tipoUsuario]) {
                resultado[tipoUsuario] = {
                    totalSum: 0,
                    totalCount: 0,
                    servicios: {}
                };
            }

            if (!resultado[tipoUsuario].servicios[tipoServicio]) {
                resultado[tipoUsuario].servicios[tipoServicio] = {
                    sum: 0,
                    count: 0
                };
            }

            resultado[tipoUsuario].servicios[tipoServicio].sum += adeudoReal;
            resultado[tipoUsuario].servicios[tipoServicio].count += 1;
            resultado[tipoUsuario].totalSum += adeudoReal;
            resultado[tipoUsuario].totalCount += 1;

            // Calcular totales para cada servicio
            if (!totales[tipoServicio]) {
                totales[tipoServicio] = {
                    totalSum: 0,
                    totalCount: 0
                };
            }
            totales[tipoServicio].totalSum += adeudoReal;
            totales[tipoServicio].totalCount += 1;
        });

        const totalGeneral = Object.values(totales).reduce((acc, val) => {
            acc.totalSum += val.totalSum;
            acc.totalCount += val.totalCount;
            return acc;
        }, { totalSum: 0, totalCount: 0 });


        return {
            resultado,
            serviciosUnicos: Array.from(serviciosUnicos),
            totales,
            totalGeneral
        };
    };



    const handleConvertDivImg = async () => {
        const canvas_img = await html2Canvas(document.getElementById('map'))
        setImagePdf(canvas_img.toDataURL('image/png'));
        setPdfCreated(true);
    }


    return (
        <div id="pdf" className='z-[1000]'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                <div className='h-[95%] p-4 bg-blue-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg shadow-slate-700 overflow-scroll'>

                    <div className="mt-2 flex justify-between">
                        <img className='w-1/3' src={Logo} alt="" />

                        {!pdfCreated ? (
                            <button className="py-1 w-[100px]" onClick={handleConvertDivImg}>
                                {getIcon('PictureAsPdfIcon', { fontSize: '36px', color: 'red' })}
                            </button>
                        ) : (
                            <PDFDownloadLink
                                document={<PdfView polygon={polygon} data={data} imageMap={imagePdf} />}
                                fileName='test'
                            >
                                {
                                    ({ url, loading }) => (loading ? (<p>Por favor espere</p>) : (
                                        <>
                                            {url ? (
                                                setPdfCreated(false),
                                                window.open(url)
                                            ) : null}
                                        </>
                                    ))
                                }
                            </PDFDownloadLink>
                        )}

                    </div>

                    <h1 className='text-white text-center mt-7 font-bold uppercase bg-gray-700 py-1'>Información del poligono </h1>

                    <div className='mt-4 bg-slate-200 py-2 px-4 rounded-md text-gray-900 font-bold'>
                        <p>Nombre: <span className='text-blue-600 uppercase'> {polygon.name ? polygon.name : 'Sin nombre'} </span></p>
                        <p>Área: <span className='text-blue-600 uppercase'> {polygon.area} </span></p>
                        <p>Distancia: <span className='text-blue-600 uppercase'> {polygon.distancia ? `${polygon.distancia.toLocaleString('en-US', { minimumFractionDigits: 2 })} km` : 'No trazada'} </span></p>
                        <p>Número de puntos: <span className='text-blue-600 uppercase'>  {polygon.number_points} </span> </p>
                        <p>Usuario asignado: <span className='text-blue-600 uppercase'>  {polygon.user ? `${polygon.user.nombre} ${polygon.user.apellido_paterno} ${polygon.user.apellido_materno}` : 'Sin asignación'} </span> </p>
                    </div>

                    <div className="mt-4 w-full mx-auto">
                        {Object.keys(data).length > 0 && (
                            <>
                                {data.totalGeneral && data.totalGeneral.totalSum ? (
                                    <TableInfoPdf data={data} />
                                ): (
                                    <p className='text-red-700 font-bold text-center'>Este layer no cuenta con información de adeudos para poder mostrar la tabla de resumen.</p>
                                )}
                                <MapPolygon polygon={polygon} />
                            </>
                        )}
                    </div>
                </div>

            </Modal>

        </div>
    )
}

export default ModalinfoPolygonPdf


const MapPolygon = ({ polygon }) => {

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useLayoutEffect(() => {
        if (open && mapContainerRef.current) {
            // Inicializar el mapa
            const center = polygon.points[0].geometry.coordinates;
            mapInstanceRef.current = new Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: center,
                zoom: 12,
                preserveDrawingBuffer: true
            });

            // Agregar el polígono después de que el mapa se haya cargado
            mapInstanceRef.current.on('load', () => {
                // Agregar una fuente para el polígono
                mapInstanceRef.current.addSource('polygon', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: polygon.coordenadas
                        },
                    },
                });

                // Agregar una capa para dibujar el polígono
                mapInstanceRef.current.addLayer({
                    id: 'polygon-layer',
                    type: 'fill',
                    source: 'polygon', // ID de la fuente añadida
                    layout: {},
                    paint: {
                        'fill-color': '#088', // Color del relleno del polígono
                        'fill-opacity': 0.2,  // Opacidad del relleno
                    },
                });

                // Opcional: agregar un borde al polígono
                mapInstanceRef.current.addLayer({
                    id: 'polygon-outline',
                    type: 'line',
                    source: 'polygon',
                    layout: {},
                    paint: {
                        'line-color': '#000', // Color del borde
                        'line-width': 2,      // Ancho del borde
                    },
                });


                mapInstanceRef.current.addSource('points-source', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: polygon.points
                    }
                });

                // Agregar una capa para los puntos
                mapInstanceRef.current.addLayer({
                    id: 'points-layer',
                    type: 'circle', // Tipo de capa para representar puntos
                    source: 'points-source',
                    paint: {
                        'circle-radius': 4, // Tamaño del círculo
                        'circle-color': '#007cbf' // Color del círculo
                    }
                });

            });

        }

        setTimeout(() => {
            // Redimensionar el mapa cuando el modal se abra
            if (mapInstanceRef.current) {
                mapInstanceRef.current.resize();
            }
        }, 2000);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [open, polygon.coordenadas]);


    return (
        <div id="map" ref={mapContainerRef} className='mx-auto' style={stylesMap}>

        </div>
    )
}

