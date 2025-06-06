import { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import { sendDataProject } from '../../services/map.service';
import Spinner from './Spinner'
import { getIcon } from '../../data/Icons';

const ModalSaveProject = ({ setShowModal, dataProject, setDataProject, statusProject }) => {

    const [open, setOpen] = useState(true);
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [descripcionProyecto, setDescripcionProyecto] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [polygonsProject, setPolygonsProject] = useState([]);
    const [polygonsNotProject, setPolygonsNotProject] = useState([]);
    const [projectNameCurrent, setProjectNameCurrent] = useState('');
    const [uniqueProjects, setUniqueProjects] = useState([]);


    useEffect(() => {
        console.log('statusProject', statusProject);
        console.log("dataProject", dataProject);
        if (dataProject.polygons && dataProject.polygons.length > 0) {

            const projects = dataProject.polygons.map(p => p.proyecto).filter(id => id)
            console.log('projects', projects);
            setPolygonsProject(projects);
            setProjectNameCurrent(projects[0] || 'Se eliminaron todos los poligonos del proyecto (Se recomienda crear un nuevo proyecto)');

            const uniqueProjects = getUniqueProjects(projects);
            console.log('uniqueProjects', uniqueProjects);
            setUniqueProjects(uniqueProjects);

            const polygonsNotProject = dataProject.polygons.filter(p => !p.proyecto);
            console.log('polygonsNotProject', polygonsNotProject);
            setPolygonsNotProject(polygonsNotProject);

        }
    }, [statusProject])

    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };

    const getUniqueProjects = (projects) => {
        const uniqueProjects = [];
        const projectNames = new Set();
        projects.forEach(project => {
            if (!projectNames.has(project)) {
                uniqueProjects.push(project);
                projectNames.add(project);
            }
        });
        return uniqueProjects;
    }


    const handleSaveProject = () => {

        if (!nombreProyecto || nombreProyecto.trim() === '') return alert('Por favor, ingrese un nombre para el proyecto.');
        console.log({
            nombre: nombreProyecto,
            descripcion: descripcionProyecto,
            ...dataProject
        })

        setIsLoading(true);
        setDataProject({
            nombre: nombreProyecto,
            descripcion: descripcionProyecto,
            ...dataProject
        })
        saveWorkspace({
            nombre: nombreProyecto,
            descripcion: descripcionProyecto,
            ...dataProject
        });
    }


    const handleUpdateProjectV2 = () => {
        setIsLoading(true);
        console.log(dataProject);
        const projectIdHistory = dataProject.polygons.map(p => {
            if (p.draw_id) return p.project_id
        }).filter(id => id)[0];
        console.log(projectIdHistory);
        if (!projectIdHistory) return alert('No se ha encontrado un proyecto para actualizar.');
        const data = {
            nombre: nombreProyecto === '' ? projectNameCurrent : nombreProyecto,
            ...dataProject,
            project_id: projectIdHistory
        }
        console.log('data', data);
        saveWorkspace(data);
    }

    const handleUpdateProject = async () => {
        setIsLoading(true);
        await saveWorkspace(dataProject);
    }

    const saveWorkspace = async (data) => {
        sendDataProject(data)
            .then(result => {
                console.log(result)
                setIsLoading(false);
                handleClose();
            })
            .catch(error => {
                console.error('Error al guardar el proyecto:', error);
                setIsLoading(false);
                alert('Error al guardar el proyecto. Por favor, inténtelo de nuevo más tarde.');
                handleClose();
            });
    }

    const handleShareProject = () => {

    }


    return (
        <div className='z-[1000]'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <div className='flex items-center justify-center h-screen text-gray-900'>
                    {!dataProject.nombre && !isLoading && (
                        <div className="bg-white p-6 rounded-lg shadow-lg w-4/12">
                            <h2 className="text-xl font-semibold mb-4">Guardar Proyecto</h2>

                            {statusProject.status && statusProject.status === 2 && (
                                <div className='bg-yellow-100 p-3 rounded-md mb-4'>
                                    <p className='text-justify'> Cuentas con polígonos pertenecientes a un proyecto, selecciona actualizar para sobreescribir el proyecto o guardar para crear uno nuevo.</p>
                                    <p className='font-semibold mt-2'> Proyecto: <span className="font-normal"> {projectNameCurrent} </span> </p>
                                    <p className='font-semibold'> Número poligonos:  <span className="font-normal">  {polygonsProject.length || 0} </span> </p>
                                    <p className='font-semibold'> Número poligonos nuevos:  <span className="font-normal">  {polygonsNotProject.length || 0} </span> </p>
                                </div>
                            )}

                            {statusProject.status && statusProject.status === 3 && (
                                <div className='bg-yellow-100 p-3 rounded-md mb-4'>
                                    <p className='text-justify'> Hay poligonos de varios proyectos, asi que solo podras crear uno nuevo.</p>
                                    <p className='font-semibold mt-2'> Número de proyectos: <span className="font-normal"> {uniqueProjects.length} </span> </p>
                                    {uniqueProjects.length > 0 && uniqueProjects.map((project, index) => (
                                        <p key={index} className='font-semibold text-gray-500'> {index + 1}: <span className="font-normal"> {project} </span> </p>
                                    ))}
                                    <p className='font-semibold mt-2'> Número poligonos nuevos:  <span className="font-normal">  {polygonsNotProject.length || 0} </span> </p>
                                </div>
                            )}

                            <div className='mt-4'>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                    placeholder="*Ingresa el nombre del proyecto"
                                    value={nombreProyecto}
                                    onChange={(e) => setNombreProyecto(e.target.value)}
                                />
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                    rows="4"
                                    placeholder="Descripción del proyecto (opcional)"
                                    value={descripcionProyecto}
                                    onChange={(e) => setDescripcionProyecto(e.target.value)}
                                ></textarea>
                                <button
                                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                                    onClick={handleSaveProject}
                                >
                                    {getIcon('SaveIcon', { marginRight: '5px' })}
                                    Guardar
                                </button>

                                {statusProject.status && statusProject.status !== 3 && statusProject.status !== 4 && (
                                    <button className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 mt-2"
                                        onClick={handleUpdateProjectV2}
                                    >
                                        {getIcon('SaveIcon', { marginRight: '5px' })}
                                        Actualizar
                                    </button>
                                )}

                                <button className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-2"
                                    onClick={handleClose}
                                >
                                    {getIcon('CloseIcon', { marginRight: '5px' })}
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}


                    {statusProject.status && (statusProject.status === 4 || statusProject.status === 1) && dataProject.nombre && !isLoading && (
                        <div className="bg-white p-6 rounded-lg shadow-lg w-4/12">
                            <h2 className="text-xl font-semibold mb-4">Proyecto Guardado</h2>
                            <div className='bg-yellow-100 p-3 rounded-md mb-4'>
                                <p className='text-justify'> El proyecto ya ha sido guardado, actualiza para sobreescribir los cambios</p>
                            </div>
                            <p className="mb-2"><strong>Nombre:</strong> {dataProject.nombre} </p>
                            <p className="mb-2"><strong>Descripción:</strong> {dataProject.descripcion} </p>
                            <p className="mb-2"><strong>Número de poligonos:</strong> {dataProject.polygons.length} </p>
                            <div className='flex flex-col items-center'>
                                <button className="w-9/12 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                                    onClick={handleUpdateProject}
                                >
                                    {getIcon('EditIcon', { marginRight: '5px' })}
                                    Actualizar
                                </button>
                                <button className="w-9/12 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-2"
                                    onClick={handleClose}
                                >
                                    {getIcon('CloseIcon', { marginRight: '5px' })}
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex items-center justify-center">
                            <Spinner />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default ModalSaveProject