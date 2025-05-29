import { useEffect } from 'react'
import { getIcon } from '../../data/Icons';
import { getProjectsByUserId } from '../../services/map.service';
import { useSelector, useDispatch } from 'react-redux';
import { setPolygonsCreated } from '../../redux/featuresSlice';
import * as turf from '@turf/turf'

const OpenProject = ({ data }) => {

    const {
        setShowTools,
        projects, setProjects,
        allProjects, setAllProjects,
        projectsLoaded, setProjectsLoaded,
        polygonsStorage, setLastPolygonCreated
    } = data;


    const user = useSelector(state => state.user);
    const draw = useSelector(state => state.features.draw);
    const mapa_active = useSelector(state => state.mapa);
    const map = mapa_active.mapa;
    const polygonsCreated = useSelector(state => state.features.polygonsCreated);
    const dispatch = useDispatch();

    useEffect(() => {
        getProjectsByUserId(user.user_id)
            .then(fetchedProjects => {
                setProjects(fetchedProjects);
                setAllProjects(fetchedProjects); // Guarda la lista original
            })
            .catch(error => {
                console.error('Error al obtener los proyectos:', error);
            });
    }, []);

    const handleLoadPolygonsInMap = (projectId) => {
        const name_project = projects.find(project => project.project_id === projectId)?.name || 'Proyecto sin nombre';
        const polygons_find = projects.find(project => project.project_id === projectId)?.polygons || [];
        const polygons = JSON.parse(polygons_find);
        const geojson = transformPolygon(polygons, name_project);

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
                'fill-color': '#088',
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

    const transformPolygon = (polygons, name_project) => {
        return {
            type: 'FeatureCollection',
            features: polygons.map(p => {
                // Calcula el centroide usando turf
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
                        name: p.name,
                        user: p.user ? p.user.nombre + ' ' + p.user.apellido_paterno + ' ' + p.user.apellido_materno : '',
                        area: p.area,
                        distancia: p.distancia ? p.distancia.toFixed(2) + ' km' : '',
                        number_points: p.number_points,
                        latitud,
                        longitud,
                        coordenadas: p.coordenadas,
                    }
                }
            })
        };
    };

    const handleDeletePolygonsInMap = (projectId) => {
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

    const handleEditPolygonsInMap = (projectId) => {

        const name_project = projects.find(project => project.project_id === projectId)?.name || 'Proyecto sin nombre';
        const polygons_find = projects.find(project => project.project_id === projectId)?.polygons || [];
        const polygons = JSON.parse(polygons_find);
        const geojson = transformPolygon(polygons, name_project);
        if (draw && map) {
            geojson.features.forEach(feature => {
                const drawId = draw.add(feature);
                feature.properties.draw_id = drawId[0]; // Guarda el ID del polígono en las propiedades
                feature.properties.points = getPointsFromPolygon(feature); // Obtiene los puntos dentro del polígono
            });
            dispatch(setPolygonsCreated([...polygonsCreated, ...geojson.features.map(f => f.properties)])); // Agrega los polígonos al estado global
            polygonsStorage.current = [...polygonsCreated, ...geojson.features.map(f => f.properties)];
            draw.changeMode('simple_select');
            handleDeletePolygonsInMap(projectId);
        }
        setShowTools(false);
    };

    const getPointsFromPolygon = (polygon) => {
        const layers_in_map = getLayersVisiblesInMap(map);
        if (layers_in_map.status === 0) {
            alert("No hay ningun layer prendido")
            return;
        }
        const features_layer = map.getSource(layers_in_map.layers_visibles[0].source)._data.features;
        const pointsInPolygon = features_layer.filter(point => turf.booleanPointInPolygon(point, polygon));
        return pointsInPolygon;
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


    return (
        <div className="w-full mx-auto flex justify-center items-center flex-col mb-4 font-mono">
            <div className='flex justify-center items-center gap-2 mb-2'>
                {(getIcon('LaptopMacIcon', { color: 'green', fontSize: '26px' }))}
                <p className="text-gray-900 text-base text-center font-semibold">Tus proyectos</p>
            </div>

            {/* BUSQUEDA DE POLIGONO */}
            <div className='w-10/12 mx-auto mb-2'>
                <input
                    type="text"
                    placeholder='Buscar proyecto por nombre'
                    className='w-full px-2 py-1 rounded-md text-gray-900'
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
                <div className='w-full flex justify-center items-center flex-col'>
                    {projects.map((project, index) => (
                        <div key={index} className=' w-10/12 text-gray-900 bg-gray-200 px-4 py-1 rounded-md text-sm'>
                            <p> Nombre: {project.name} </p>
                            <p> Descripción: {project.description} </p>
                            <div className='flex items-center gap-2 my-2'>

                                {!projectsLoaded || !projectsLoaded.includes(project.project_id) ? (
                                    <button className='bg-blue-400 py-1 px-2 hover:bg-blue-500 rounded-md'
                                        onClick={() => handleLoadPolygonsInMap(project.project_id)}
                                    >
                                        {getIcon('LayersIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                        Cargar
                                    </button>
                                ) : null}


                                <button className='bg-emerald-400 py-1 px-2 hover:bg-emerald-500 rounded-md' >
                                    {getIcon('ShareIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                    Compartir
                                </button>

                                {projectsLoaded && projectsLoaded.includes(project.project_id) && (
                                    <>
                                        <button className='bg-red-400 py-1 px-2 hover:bg-red-500 rounded-md'
                                            onClick={() => handleDeletePolygonsInMap(project.project_id)}
                                        >
                                            {getIcon('DeleteIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                            Quitar
                                        </button>
                                        <button className='bg-yellow-400 py-1 px-2 hover:bg-yellow-500 rounded-md'
                                            onClick={() => handleEditPolygonsInMap(project.project_id)}
                                        >
                                            {getIcon('EditIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                            Editar
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(!projects || projects.length === 0) && (
                <div className='w-10/12 text-gray-900 bg-gray-200 px-4 py-1 rounded-md text-sm'>
                    <p>No tienes proyectos guardados.</p>
                </div>
            )}
        </div>
    )
}

export default OpenProject