import { useState, useRef, useEffect } from 'react'

// ICONS
import { getIcon } from '../../data/Icons';

// LIBRERIES
import { CSVLink } from 'react-csv';
import * as turf from '@turf/turf'
import { Modal } from '@mui/material';
import { Marker } from "mapbox-gl";
import Tooltip from '@mui/material/Tooltip';

// REDUX
import { useSelector } from 'react-redux';
import instance from '../../api/axios';

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

// COMPONENTS
import FloatingWindow from './FloatingWindow'
import ModalFieldChart from './ModalFieldChart';


const ModalInfoPolygons = ({ setShowModal, polygons, draw, map, disablePoints, setPolygonsCreated, setLastPolygonCreated }) => {

    //console.log(polygons);
    const map_active = useSelector((state) => state.mapa);

    const [open, setOpen] = useState(true);
    const [data, setData] = useState([]);
    const [nameFile, setNameFile] = useState('');
    const [users, setUsers] = useState([]);
    const [idUserSeleccionado, setidUserSeleccionado] = useState(null);
    const [shouldDownload, setShouldDownload] = useState(false);
    const [dataGrid, setDataGrid] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [windows, setWindows] = useState([]);
    const [titles, setTitles] = useState([]);
    const [type, setType] = useState('');
    const [showModalFieldChart, setShowModalFieldChart] = useState(false);

    const [size, setSize] = useState({ width: 400, height: 400 });


    const csvLinkRef = useRef();
    const gridRef = useRef();


    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await instance.get('/usuarios');
        const data = response.data;
        const users_active = data.filter(user => user.activo === true);
        const users_in_polygo = polygons.map(poly => poly.user)
        validateUsers(users_active, users_in_polygo)
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
        if (!idUserSeleccionado) return alert("Elige un usuario de la lista")
        const user = users.filter(user => user.id_usuario === Number(idUserSeleccionado))[0]
        const marker = addImageInPolygon(polygon.id, user.foto)
        userPolygonUpdate(polygon, user, marker);
        zoomToPolygon(polygon.id);
    }

    const addImageInPolygon = (polygon_id, image_url) => {
        const poly = draw.get(polygon_id);
        const centroid = turf.centroid(poly);
        const coordinates = centroid.geometry.coordinates;

        const marker = new Marker({
            element: createElementImage(`https://www.ser0.mx/ser0/image/usuario/${image_url}`),
        });

        marker
            .setLngLat(coordinates)
            .addTo(map_active.mapa);

        return marker;
    }

    const createElementImage = (imageUrl) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '50px'; // Ajusta el tamaño según sea necesario
        img.style.height = '50px';
        img.style.borderRadius = '50%';
        return img;
    }

    const userPolygonUpdate = (polygon, user, marker) => {
        const polygons_not_selected = polygons.filter(poly => poly.id !== polygon.id)
        const polygon_new = {
            ...polygon,
            user: user,
            marker: marker
        }
        setPolygonsCreated([...polygons_not_selected, polygon_new])
        setLastPolygonCreated(polygon_new)
    }

    const deleteAssigmentUser = (poly) => {
        console.log(polygons);
        poly.marker.remove();
        zoomToPolygon(poly.id);
        delete poly.user;
        delete poly.marker;
    }

    const validateUsers = (users, users_in_polygon) => {
        if (!users_in_polygon[0]) {
            setUsers(users);
            return;
        }
        const result = users.filter(obj1 => {
            return !users_in_polygon.some(obj2 => {
                if (obj2) return obj1.id_usuario === obj2.id_usuario
            })
        });
        setUsers(result);
    }


    const generateGrid = (polygon) => {
        const points_arr = polygon.points;
        const properties = points_arr.map(p => p.properties);
        const titles_object = Object.keys(properties[0]);
        setTitles(titles_object)
        const defs = titles_object.map(t => {
            return {
                field: t, filter: true, editable: true,
            }
        })
        setDataGrid(properties)
        setColDefs(defs)
    }


    const askField = (type) => {
        setShowModalFieldChart(true);
        setType(type)
    }

    const responseField = (res, field, option, fieldPlus) => {
        if (res) generateGraphic(field, option, fieldPlus);
        setShowModalFieldChart(false);
    }

    const generateGraphic = (field, option, fieldPlus) => {
        // const selectedRows = gridRef.current.api.getSelectedRows(); con esto agarramos solo la seleccion
        // console.log(selectedRows)

        const selectedRows = dataGrid;
        if (selectedRows.length > 0) {
            let data;
            if (option === '2') {
                data = groupDataSum(selectedRows, field, fieldPlus)
                if (!data) return alert("El segundo campo no es un número");
            } else {
                const countsObj = groupDataCount(selectedRows, field)
                data = Object.keys(countsObj).map(o => {
                    return {
                        name: o,
                        value: countsObj[o]
                    }
                })
            }

            const newWindow = {
                id: Date.now(),
                chartData: data,
                type: type,
                title: `Gráfico ${field}`
            };

            setWindows([...windows, newWindow]);
        }
    };


    const groupDataCount = (arr, field) => {
        const countsObj = arr.reduce((acc, obj) => {
            const response = obj[field];
            if (acc[response]) {
                acc[response]++;
            } else {
                acc[response] = 1;
            }
            return acc;
        }, {});
        return countsObj
    }

    const groupDataSum = (data, field, fieldPlus) => {
        const rowFirst = data[0];
        if (isNaN(rowFirst[fieldPlus])) return undefined;
        const groupedData = data.reduce((acc, current) => {
            const response = current[field];
            const response2 = current[fieldPlus]
            // Si el tipo de usuario ya existe en el acumulador, sumamos el adeudo
            if (acc[response]) {
                acc[response] += response2;
            } else {
                // Si no existe, lo agregamos con el adeudo actual
                acc[response] = response2;
            }

            return acc;
        }, {});

        console.log(groupedData)

        const result = Object.keys(groupedData).map(t => ({
            name: t,
            value: groupedData[t]
        }));

        return result;
    }

    const closeWindow = (id) => {
        setWindows(windows.filter((window) => window.id !== id));
    };

    const handleResize = () => {
        console.log("handleresize")
    };


    return (
        <div className='z-[1000]'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                {polygons.length > 0 && (
                    <div className='w-[93%] h-[97%] p-4 bg-blue-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg shadow-slate-700'>
                        <div className='flex justify-between px-3'>
                            <h1 className='text-center text-base font-bold text-gray-900'>
                                {dataGrid.length === 0 ? 'Lista de poligonos creados' : 'Información dentro del poligono'}
                            </h1>
                            <button onClick={() => handleClose(true)}>
                                {getIcon('CloseIcon', { fontSize: '26px', color: 'red' })}
                            </button>
                        </div>
                        <hr className='mt-2 bg-gray-900' />

                        {dataGrid.length === 0 && (
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
                                                {getIcon('ColorLensIcon', { fontSize: '26px' })}
                                            </button>
                                            <button onClick={() => generateGrid(poly)}>
                                                {getIcon('ViewKanbanIcon', { fontSize: '26px' })}
                                            </button>
                                            <button onClick={() => disabledPointsSelected(poly)}>
                                                {getIcon('AltRouteIcon', { fontSize: '26px' })}
                                            </button>
                                            {!poly.user ? (
                                                <button onClick={() => assigmentUser(poly)}>
                                                    {getIcon('FaceIcon', { fontSize: '26px' })}
                                                </button>
                                            ) : (
                                                <button onClick={() => deleteAssigmentUser(poly)}>
                                                    {getIcon('FaceIcon', { fontSize: '26px', color: 'red' })}
                                                </button>
                                            )}

                                        </td>
                                    </tr>
                                ))}
                            </table>
                        )}

                        {dataGrid.length > 0 && colDefs.length > 0 && (
                            <div className='overflow-scroll'>
                                {showModalFieldChart && (<ModalFieldChart fields={titles} setShowModal={setShowModalFieldChart} responseField={responseField} />)}
                                <div
                                    className="ag-theme-quartz"
                                    style={{ height: 400, }}
                                >
                                    <AgGridReact
                                        ref={gridRef}
                                        columnDefs={colDefs}
                                        rowData={dataGrid}
                                        rowSelection="multiple"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <div className="w-1/3 mt-4">
                                        <h2 className='text-center text-base text-gray-900'>Gráficar</h2>
                                        <div className="flex justify-center gap-3">
                                            <button className='bg-blue-600 p-1 rounded w-36 hover:bg-blue-500' onClick={() => askField('bar')}>
                                                {getIcon('BarChartIcon', { marginRight: '5px' })}
                                                Bar
                                            </button>
                                            <button className='bg-blue-600 p-1 rounded w-36 hover:bg-blue-500' onClick={() => askField('pie')}>
                                                {getIcon('PieChartIcon', { marginRight: '5px' })}
                                                Pie
                                            </button>
                                        </div>
                                        {windows.map((window) => (
                                            <FloatingWindow
                                                key={window.id}
                                                chartData={window.chartData}
                                                onClose={() => closeWindow(window.id)}
                                                title={window.title}
                                                type={window.type}
                                                onResize={handleResize}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}


                    </div>
                )
                }

            </Modal >
        </div >
    )
}

export default ModalInfoPolygons