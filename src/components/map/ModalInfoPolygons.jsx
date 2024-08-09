import { useState, useRef, useEffect } from 'react'
import { Modal } from '@mui/material';
import { getIcon } from '../../data/Icons';
import * as turf from '@turf/turf'
import { CSVLink } from 'react-csv';

import { useSelector } from 'react-redux';


const ModalInfoPolygons = ({ setShowModal, polygons, draw, map, disablePoints }) => {

    //console.log(polygons);
    const map_active = useSelector((state) => state.mapa);


    const [open, setOpen] = useState(true);
    const [data, setData] = useState([]);
    const [nameFile, setNameFile] = useState('')
    const [shouldDownload, setShouldDownload] = useState(false);
    const csvLinkRef = useRef();


    useEffect(() => {
        if (shouldDownload && data.length > 0) {
            csvLinkRef.current.link.click();
            setShouldDownload(false); // Resetea la bandera para evitar descargas múltiples
        }
    }, [shouldDownload, data]);


    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };

    const zoomToPolygon = (polygon_id) => {
        const polygon = draw.get(polygon_id);
        if (polygon) {
            const bbox = turf.bbox(polygon);
            map.current.fitBounds(bbox, {
                padding: 10,
            });
        }
        handleClose();
    }

    const downloadPropertiesCsv = async (polygon) => {
        setNameFile( polygon.name ? polygon.name : 'Sin nombre')
        const points = polygon.points;
        const properties = points.map(p => p.properties);
        setData(properties);
        setShouldDownload(true);

    }

    const disabledPointsSelected = (polygon) => {
        disablePoints(map_active.mapa, polygon.id);
        zoomToPolygon(polygon.id);
    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                {polygons.length > 0 && (
                    <div className='w-8/12 h-[84%] p-4 bg-blue-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg shadow-slate-700'>
                        <h1 className='text-center text-base font-bold text-gray-900'>Lista de poligonos creados</h1>
                        <hr className='mt-2 bg-gray-900' />
                        <table className='w-full px-2 text-gray-900 text-center mt-2'>
                            <tr className='bg-gray-700 font-bold text-white'>
                                <th>Nombre</th>
                                <th>Número de puntos</th>
                                <th>Área</th>
                                <th>Usuario</th>
                                <th>Acciones</th>
                            </tr>
                            {polygons.map((poly, index) => (
                                <tr className="rounded-md" style={index % 2 !== 0 ? { backgroundColor: '#dee2ea' } : {}}>
                                    <td className='py-2'> {poly.name ? poly.name : 'Sin nombre'} </td>
                                    <td> {poly.number_points} </td>
                                    <td> {poly.area} </td>
                                    <td>
                                        <select name="usuario" id="usuario" className="w-2/3 text-gray-900 py-1 rounded px-1 mr-1">
                                            <option value="1">Selecciona un usuario</option>
                                            <option value="2">Oscar Alejandro Vazquez Galvan</option>
                                            <option value="3">Antonio Ticante Pérez</option>
                                            <option value="4">David Demetrio Lopez</option>
                                        </select>
                                    </td>
                                    <td className="flex justify-center items-center gap-2 py-1">
                                        <button onClick={() => zoomToPolygon(poly.id)}>
                                            {getIcon('ZoomInMapIcon', { fontSize: '26px' })}
                                        </button>
                                        <button onClick={() => downloadPropertiesCsv(poly)}>
                                            {getIcon('CloudDownloadIcon', { fontSize: '26px' })}
                                        </button>
                                        <CSVLink
                                            data={data}
                                            filename={nameFile}
                                            className="hidden"
                                            ref={csvLinkRef}
                                        />
                                        <button onClick={() => disabledPointsSelected(poly)}>
                                            {getIcon('ArticleIcon', { fontSize: '26px' })}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                )}

            </Modal>
        </div>
    )
}

export default ModalInfoPolygons