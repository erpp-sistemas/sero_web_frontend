import { useState, useRef, useEffect } from 'react'

// ICONS
import { getIcon } from '../../data/Icons';

// LIBRERIES
import { CSVLink } from 'react-csv';
import * as turf from '@turf/turf'
import { Modal } from '@mui/material';
import { Marker } from "mapbox-gl"

// REDUX
import { useSelector } from 'react-redux';
import instance from '../../api/axios';


const ModalInfoPolygons = ({ setShowModal, polygons, draw, map, disablePoints, setPolygonsCreated, setLastPolygonCreated }) => {

    console.log(polygons);
    const map_active = useSelector((state) => state.mapa);


    const [open, setOpen] = useState(true);
    const [data, setData] = useState([]);
    const [nameFile, setNameFile] = useState('');
    const [users, setUsers] = useState([]);
    const [idUserSeleccionado, setidUserSeleccionado] = useState(null);
    const [shouldDownload, setShouldDownload] = useState(false);
    const csvLinkRef = useRef();


    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await instance.get('/usuarios');
        const data = response.data;
        const users_active = data.filter(user => user.activo === true);
        setUsers(users_active.sort());
    }

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
        setNameFile(polygon.name ? polygon.name : 'Sin nombre')
        const points = polygon.points;
        const properties = points.map(p => p.properties);
        setData(properties);
        setShouldDownload(true);

    }

    const disabledPointsSelected = (polygon) => {
        disablePoints(map_active.mapa, polygon.id);
        zoomToPolygon(polygon.id);
    }

    const assigmentUser = (polygon) => {
        const user = users.filter(user => user.id_usuario === Number(idUserSeleccionado))[0]
        addImageInPolygon(polygon.id, user.foto)
        userPolygonUpdate(polygon, user);
        zoomToPolygon(polygon.id);
    }

    const addImageInPolygon = (polygon_id, image_url) => {
        const poly = draw.get(polygon_id);
        const centroid = turf.centroid(poly);
        const coordinates = centroid.geometry.coordinates;

        new Marker({
            element: createElementImage(`https://www.ser0.mx/ser0/image/usuario/${image_url}`),
        }).setLngLat(coordinates)
            .addTo(map_active.mapa)
    }

    const createElementImage = (imageUrl) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '50px'; // Ajusta el tamaño según sea necesario
        img.style.height = '50px';
        img.style.borderRadius = '50%';
        return img;
    }

    const userPolygonUpdate = (polygon, user) => {
        const polygons_not_selected = polygons.filter(poly => poly.id !== polygon.id)
        const polygon_new = {
            ...polygon,
            user: user
        }
        setPolygonsCreated([...polygons_not_selected, polygon_new])
        setLastPolygonCreated(polygon_new)
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
                    <div className='w-[90%] h-[90%] p-4 bg-blue-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg shadow-slate-700'>
                        <div className='flex justify-between px-3'>
                            <h1 className='text-center text-base font-bold text-gray-900'>Lista de poligonos creados</h1>
                            <button onClick={() => handleClose(true)}>
                                {getIcon('MemoryIcon', { fontSize: '26px', color: 'red' })}
                            </button>
                        </div>
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
                                        {poly.user ? (
                                            <p className="text-center font-bold">{poly.user.nombre} {poly.user.apellido_paterno} {poly.user.apellido_materno} </p>
                                        ) : (
                                            <select name="usuario" id="usuario" className="w-2/3 text-gray-900 py-1 rounded px-1 mr-1"
                                                onChange={e => setidUserSeleccionado(e.target.value)}
                                            >
                                                <option value="1">Selecciona un usuario</option>
                                                {users.length > 0 && users.map(user => (
                                                    <option value={user.id_usuario}>
                                                        {user.nombre}  {user.apellido_paterno} {user.apellido_materno}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
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
                                        {!poly.user ? (
                                            <button onClick={() => assigmentUser(poly)}>
                                                {getIcon('FaceIcon', { fontSize: '26px' })}
                                            </button>
                                        ) : (
                                            <button onClick={() => assigmentUser(poly)}>
                                                {getIcon('FaceIcon', { fontSize: '26px', color: 'red' })}
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                )
                }

            </Modal >
        </div >
    )
}

export default ModalInfoPolygons