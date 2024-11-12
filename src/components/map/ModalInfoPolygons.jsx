import { useState, useRef, useEffect } from 'react'

// ICONS
import { getIcon } from '../../data/Icons';

// LIBRERIES
import * as turf from '@turf/turf'
import { Modal } from '@mui/material';
import { Marker } from "mapbox-gl";

// REDUX
import { useSelector } from 'react-redux';
import instance from '../../api/axios';


// COMPONENTS
import TablePolygons from './TablePolygons';
import GridRegisterPolygon from './GridRegisterPolygon';


const ModalInfoPolygons = ({ setShowModal, polygons, draw, map, disablePoints, enabledPoints, setPolygonsCreated, setLastPolygonCreated, setFunction, setShowModalPdf, setDataPdf }) => {

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
    const [titles, setTitles] = useState([]);



    const csvLinkRef = useRef();

    useEffect(() => {
        getUsers();
        setFunction.current = childFunction;
    }, [])


    const getUsers = async () => {
        const response = await instance.get('/usuarios');
        const users_active = response.data;
        //const users_active = data.filter(user => user.activo === true);
        const users_in_polygo = polygons.map(poly => poly.user)
        validateUsers(users_active, users_in_polygo)
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
        polygonAddData(polygon, { disabled_points: true })
    }

    const assigmentUser = (polygon) => {
        if (!idUserSeleccionado) return alert("Elige un usuario de la lista")
        const user = users.filter(user => user.id_usuario === Number(idUserSeleccionado))[0]
        const marker = addImageInPolygon(polygon.id, user.foto)
        polygonAddData(polygon, { user, marker, disabled_points: true });
        disablePoints(map_active.mapa, polygon.id);
        zoomToPolygon(polygon.id);
    }

    const addImageInPolygon = (polygon_id, image_url) => {
        const poly = draw.get(polygon_id);
        const centroid = turf.centroid(poly);
        const coordinates = centroid.geometry.coordinates;

        const marker = new Marker({
            element: createElementImage(image_url),
        });

        marker
            .setLngLat(coordinates)
            .addTo(map_active.mapa);

        return marker;
    }

    const createElementImage = (imageUrl) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.borderRadius = '50%';
        return img;
    }


    const polygonAddData = (polygon, dataObj) => {
        const polygons_not_selected = polygons.filter(poly => poly.id !== polygon.id);
        const polygon_new = {
            ...polygon,
            ...dataObj
        }
        setPolygonsCreated([...polygons_not_selected, polygon_new])
        setLastPolygonCreated(polygon_new)
    }

    const polygonDeleteData = (polygon, fieldName) => delete polygon[fieldName];

    const deleteAssigmentUser = (poly) => {
        if (poly.marker) {
            poly.marker.remove();
            zoomToPolygon(poly.id);
            delete poly.user;
            delete poly.marker;
        }
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

    const getRoute = (polygon) => {
        const points_arr = polygon.points;
        const coordinates = points_arr.map(point => point.geometry.coordinates)

        const orderedPoints = nearestNeighborRoute(coordinates);

        const route = turf.lineString(orderedPoints);
        const routeLength = turf.length(route, { units: 'kilometers' });

        map_active.mapa.addLayer({
            id: `route-${polygon.id}`,
            type: 'line',
            source: {
                type: 'geojson',
                data: route
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#0F53FF', // Color de la línea
                'line-width': 4,          // Ancho de la línea
                'line-dasharray': [0.5, 4],  // Puntos (0.1px línea, 4px espacio)

            }
        });
        zoomToPolygon(polygon.id);
        polygonAddData(polygon, { distancia: routeLength });
    }

    const distance = (point1, point2) => {
        return turf.distance(turf.point(point1), turf.point(point2));
    }

    // 2. Implementación del algoritmo Nearest Neighbor
    const nearestNeighborRoute = (points) => {
        const visited = [points[0]];
        const remaining = points.slice(1);

        while (remaining.length) {
            let nearestIndex = 0;
            let nearestDistance = distance(visited[visited.length - 1], remaining[0]);

            for (let i = 1; i < remaining.length; i++) {
                const d = distance(visited[visited.length - 1], remaining[i]);
                if (d < nearestDistance) {
                    nearestDistance = d;
                    nearestIndex = i;
                }
            }

            visited.push(remaining.splice(nearestIndex, 1)[0]);
        }

        return visited;
    }

    const deleteRoute = (polygon) => {
        if (map_active.mapa.getLayer(`route-${polygon.id}`)) {
            map_active.mapa.removeLayer(`route-${polygon.id}`);
            map_active.mapa.removeSource(`route-${polygon.id}`);
            zoomToPolygon(polygon.id);
            polygonDeleteData(polygon, 'distancia');
        }
    }

    const enablePointsBefore = (polygon) => {
        enabledPoints(map_active.mapa, polygon.id);
        polygonDeleteData(polygon, 'disabled_points')
        zoomToPolygon(polygon.id)
    }

    function childFunction(polygon) {
        deleteRoute(polygon);
        deleteAssigmentUser(polygon);
    }

    const getInfoPolygon = (polygon) => {
        console.log(polygon)
        setDataPdf(polygon);
        setShowModalPdf(true);
        setShowModal(false);
    }


    const functions = {
        zoomToPolygon, downloadPropertiesCsv, generateGrid, disabledPointsSelected, assigmentUser, deleteAssigmentUser, getRoute, deleteRoute, enablePointsBefore, getInfoPolygon
    }


    return (
        <div className='z-[1000]'>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                {polygons && polygons.length > 0 && (
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
                            <TablePolygons polygons={polygons} setidUserSeleccionado={setidUserSeleccionado} users={users} functions={functions}
                                data={data} nameFile={nameFile} csvLinkRef={csvLinkRef}
                            />
                        )}

                        {dataGrid.length > 0 && colDefs.length > 0 && (
                            <GridRegisterPolygon dataGrid={dataGrid} colDefs={colDefs} titles={titles} />
                        )}
                    </div>
                )}
            </Modal >
        </div >
    )
}

export default ModalInfoPolygons