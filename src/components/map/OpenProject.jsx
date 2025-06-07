import { useEffect, useState } from 'react'
import { getIcon } from '../../data/Icons';
import { getProjectsByUserId } from '../../services/map.service';
import { useSelector, useDispatch } from 'react-redux';
import { setPolygonsCreated, setEditingPolygons } from '../../redux/featuresSlice';
import * as turf from '@turf/turf'
import Message from './Message';
import { Marker } from "mapbox-gl";
import Spinner from './Spinner';
import ShareProject from './ShareProject';
import Projects from './Projects';

const OpenProject = ({ data }) => {

    const {
        setShowTools,
        projects, setProjects,
        allProjects, setAllProjects,
        projectsLoaded, setProjectsLoaded,
        polygonsStorage, setShowModalInfoPolygons
    } = data;


    const user = useSelector(state => state.user);
    const draw = useSelector(state => state.features.draw);
    const mapa_active = useSelector(state => state.mapa);
    const map = mapa_active.mapa;
    const polygonsCreated = useSelector(state => state.features.polygonsCreated);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [showMessageError, setShowMessageError] = useState(null);
    const [activeShare, setActiveShare] = useState(false);
    const [project, setProject] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 2;

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects ? projects.slice(indexOfFirstProject, indexOfLastProject) : [];

    const totalPages = projects ? Math.ceil(projects.length / projectsPerPage) : 1;

    const [fade, setFade] = useState(true);
    const handlePageChange = (newPage) => {
        setFade(false);
        setTimeout(() => {
            setCurrentPage(newPage);
            setFade(true);
        }, 150); // Duración de la animación en ms
    };

    useEffect(() => {
        loading && setLoading(true);
        getProjectsByUserId(user.user_id)
            .then(fetchedProjects => {
                setProjects(fetchedProjects);
                setAllProjects(fetchedProjects); // Guarda la lista original
                console.log('Proyectos obtenidos:', fetchedProjects);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los proyectos:', error);
            });
    }, []);

    const handleLoadPolygonsInMap = (projectId) => {
        const name_project = projects.find(project => project.project_id === projectId)?.name || 'Proyecto sin nombre';
        const layer_project = projects.find(project => project.project_id === projectId)?.layer || 'default_layer';
        const polygons_find = projects.find(project => project.project_id === projectId)?.polygons || [];
        const polygons = JSON.parse(polygons_find);
        const geojson = transformPolygon(polygons, name_project, layer_project, projectId);
        map.addSource(projectId, {
            type: 'geojson',
            data: geojson
        });
        map.addLayer({
            'id': `${projectId}-layer`,
            'type': 'fill',
            'source': projectId,
            'layout': {},
            'paint': {
                'fill-color': '#FFA100',
                'fill-opacity': 0.5
            }
        });
        map.addLayer({
            id: `${projectId}-outline`,
            type: 'line',
            source: projectId,
            paint: {
                'line-color': '#000',
                'line-width': 2
            }
        });

        setProjectsLoaded(projectsLoaded ? [...projectsLoaded, projectId] : [projectId]);
        setShowTools(false);
    };


    const transformPolygon = (polygons, name_project, layer_project, projectId) => {
        console.log(polygons)
        return {
            type: 'FeatureCollection',
            features: polygons.map(p => {
                const centroid = turf.centroid({
                    type: 'Polygon',
                    coordinates: p.coordenadas
                });
                const [longitud, latitud] = centroid.geometry.coordinates;
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: p.coordenadas,
                    },
                    properties: {
                        id: p.id,
                        proyecto: name_project,
                        layer: layer_project,
                        name: p.name,
                        user: p.user ? p.user.nombre + ' ' + p.user.apellido_paterno + ' ' + p.user.apellido_materno : '',
                        area: p.area,
                        distancia: !p.distancia ? '' : typeof p.distancia === 'number' ? p.distancia.toFixed(2) + ' km' : p.distancia,
                        number_points: p.number_points,
                        latitud,
                        longitud,
                        coordenadas: p.coordenadas,
                        project_id: projectId,
                    }
                }
            })
        };
    };

    const handleDeletePolygonsInMap = (project) => {
        const projectId = project.project_id;
        if (map.getLayer(`${projectId}-layer`)) {
            map.removeLayer(`${projectId}-layer`);
            map.removeLayer(`${projectId}-outline`);
            map.removeSource(projectId);
            setProjectsLoaded(projectsLoaded.filter(id => id !== projectId));
            setShowTools(false);
        } else {
            console.warn(`No se encontró la capa o fuente para el proyecto ${projectId}.`);
        }
    }

    const handleEditPolygonsInMap = (project) => {

        const { project_id: projectId, name: name_project, layer: layer_project } = getDataBasicProject(project);

        const validate = validateLayesInMap(layer_project);
        if (!validate) return;
        const polygons = getPolygonsFromProyect(projectId);
        const polygons_with_user = polygons.filter(p => p.user)

        const geojson = transformPolygon(polygons, name_project, layer_project, projectId);
        if (draw && map) {
            geojson.features.forEach(feature => {
                const drawId = draw.add(feature);
                feature.properties.draw_id = drawId[0]; // Guarda el ID del polígono en las propiedades
                feature.properties.points = getPointsFromPolygon(feature); // Obtiene los puntos dentro del polígono

                if (feature.properties.distancia && feature.properties.distancia !== '' && feature.properties.distancia !== undefined) {
                    getRoute(feature);
                }

                if (feature.properties.user && feature.properties.user !== '') {
                    const user = polygons_with_user.find(p => p.id === feature.properties.id)?.user || null;
                    const photoUrl = user?.foto || 'https://via.placeholder.com/50'; // URL de la foto del usuario
                    feature.properties.user = user;
                    const marker = addImageInPolygon(feature, photoUrl);
                    feature.properties.marker = marker; // Guarda el marcador en las propiedades del polígono
                }
            });
            dispatch(setPolygonsCreated([...polygonsCreated, ...geojson.features.map(f => f.properties)])); // Agrega los polígonos al estado global
            polygonsStorage.current = [...polygonsCreated, ...geojson.features.map(f => f.properties)];
            draw.changeMode('simple_select');
            handleDeletePolygonsInMap(project);

        }
        setShowTools(false);
        dispatch(setEditingPolygons(true));
        setShowModalInfoPolygons(true);
        setTimeout(() => {
            dispatch(setEditingPolygons(false));
            setShowModalInfoPolygons(false);
        }, 1000)

    };

    const getRoute = (feature) => {
        const polygon = {
            id: feature.properties.draw_id ? feature.properties.draw_id : feature.properties.id,
            number_points: feature.properties.number_points,
            points: feature.properties.points || [],
            area: feature.properties.area,
            coordenadas: feature.properties.coordenadas || [],
            name: feature.properties.name || '',
        }
        const points_arr = polygon.points;
        const coordinates = points_arr.map(point => point.geometry.coordinates)
        const orderedPoints = nearestNeighborRoute(coordinates);
        const route = turf.lineString(orderedPoints);

        map.addLayer({
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
    }


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

    const distance = (point1, point2) => {
        return turf.distance(turf.point(point1), turf.point(point2));
    }

    const getDataBasicProject = (project) => {
        const { name, project_id, layer } = project;
        return { name, project_id, layer }
    }

    const getPolygonsFromProyect = (projectId) => {
        const polygons_find = projects.find(project => project.project_id === projectId)?.polygons || [];
        return JSON.parse(polygons_find);
    }

    const validateLayesInMap = (layer_project) => {
        const layers_in_map = getStatusLayersInMap(map);
        if (!layers_in_map.status) {
            setShowMessageError({ title: 'Error', text: layers_in_map.message, type: 'warning' });
            setTimeout(() => setShowMessageError(null), 4000);
            return false;
        }
        if (layers_in_map.status) {
            const layer = layers_in_map.layers_visibles[0].source;
            if (layer !== layer_project) {
                setShowMessageError({ title: 'Error', text: 'El layer del proyecto no coincide con el layer visible en el mapa.', type: 'warning' });
                setTimeout(() => setShowMessageError(null), 4000);
                return false;
            }
        }
        return true;
    }

    const addImageInPolygon = (feature, image_url) => {
        const { type, properties, geometry } = feature;
        const poly = {
            id: feature.properties.draw_id ? feature.properties.draw_id : feature.properties.id,
            type,
            properties,
            geometry
        }
        const centroid = turf.centroid(poly);
        const coordinates = centroid.geometry.coordinates;
        const marker = new Marker({
            element: createElementImage(image_url),
        });
        marker
            .setLngLat(coordinates)
            .addTo(map);
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


    const getPointsFromPolygon = (polygon) => {
        const layers_in_map = getStatusLayersInMap(map);
        if (!layers_in_map.status) {
            setShowMessageError({ title: 'Error', text: layers_in_map.message, type: 'warning' });
            setTimeout(() => {
                setShowMessageError(null);
            }, 4000);
            return;
        }
        const features_layer = map.getSource(layers_in_map.layers_visibles[0].source)._data.features;
        const pointsInPolygon = features_layer.filter(point => turf.booleanPointInPolygon(point, polygon));
        return pointsInPolygon;
    }

    const getStatusLayersInMap = (map) => {
        const loaded_layers_in_map = map.getStyle().layers.filter(layer => layer.type === 'circle' && !layer.id.includes('gl-draw'));
        if (loaded_layers_in_map.length === 0) {
            return { status: false, message: 'No hay layers cargados en el mapa.', layers_visibles: [] }
        }
        const layers_visibles = loaded_layers_in_map.filter(layer => layer.layout.visibility === 'visible');
        if (layers_visibles.length === 0) {
            return { status: false, message: 'No hay layers visibles en el mapa', layers_visibles: [] }
        }
        if (layers_visibles.length > 1) {
            return { status: false, message: 'Hay mas de un layer visible en el mapa', layers_visibles: layers_visibles }
        }
        return {
            status: true, message: 'Un layer en el mapa', layers_visibles: layers_visibles
        }
    }

    const handleShareProject = (project) => {
        console.log(project)
        setProject(project);
        setActiveShare(true);
    }


    return (
        <div className="w-full min-h-[360px] mx-auto flex justify-center items-center flex-col mb-4 font-mono">

            {showMessageError && <Message text={showMessageError.text} title={showMessageError.title} type={showMessageError.type} />}

            {!activeShare && (
                <>                    

                    <div className='flex justify-center items-center gap-2 mb-2'>
                        {(getIcon('LaptopMacIcon', { color: 'green', fontSize: '26px' }))}
                        <p className="text-gray-900 text-base text-center font-semibold">Tus proyectos</p>
                    </div>

                    {/* BUSQUEDA DE PROJECTO */}
                    <div className='w-10/12 mx-auto mb-2'>
                        <input
                            type="text"
                            placeholder='Buscar proyecto por nombre'
                            className='w-full px-2 py-1 rounded-md text-gray-900 border border-gray-300'
                            onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                if (searchTerm.length === 0) {
                                    setProjects(allProjects); // Restaurar todos si está vacío
                                } else if (searchTerm.length >= 3) {
                                    const filteredProjects = allProjects.filter(project =>
                                        project.name.toLowerCase().includes(searchTerm)
                                    );
                                    setProjects(filteredProjects);
                                }
                                // Si hay menos de 3 letras y no está vacío, no hacer nada (opcional: puedes mostrar todos)
                                else {
                                    setProjects(allProjects);
                                }
                            }}
                        />
                    </div>

                    {projects && projects.length > 0 && (
                        <Projects data={{
                            currentProjects,
                            projectsLoaded,
                            handleLoadPolygonsInMap,
                            handleShareProject,
                            handleDeletePolygonsInMap,
                            handleEditPolygonsInMap,
                            currentPage,
                            totalPages,
                            handlePageChange
                        }}
                        />
                    )}
                </>
            )}


            {loading && (
                <div className='w-10/12 mx-auto text-gray-900 text-center'>
                    <Spinner />
                </div>
            )}

            {!loading && projects && projects.length === 0 && (
                <div className='w-10/12 mx-auto text-gray-900 text-center'>
                    No tienes proyectos creados.
                </div>
            )}

            {activeShare && <ShareProject data={{ setActiveShare, project }} />}

        </div>
    )
}

export default OpenProject