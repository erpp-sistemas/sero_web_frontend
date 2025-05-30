import { useState } from 'react';
import { Modal } from '@mui/material';
import { sendDataProject } from '../../services/map.service';
import Spinner from './Spinner'
import { getIcon } from '../../data/Icons';

const ModalSaveProject = ({ setShowModal, dataProject, setDataProject }) => {

    const [open, setOpen] = useState(true);
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [descripcionProyecto, setDescripcionProyecto] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };

    const handleSaveProject = () => {

        if(!nombreProyecto || nombreProyecto.trim() === '') return alert('Por favor, ingrese un nombre para el proyecto.');
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
        handleSaveWorkspace({
            nombre: nombreProyecto,
            descripcion: descripcionProyecto,
            ...dataProject
        });
    }

    const handleUpdateProject = async () => {
        await handleSaveWorkspace(dataProject);
    }

    const handleSaveWorkspace = async (data) => {
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
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Guardar Proyecto</h2>
                            <div className='mt-4'>
                                <p className="my-2"> Ingrese los siguientes datos </p>
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
                                <button
                                    className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 mt-2"
                                    onClick={handleShareProject}
                                >
                                    {getIcon('BlurLinearIcon', { marginRight: '5px' })}
                                    Exportar
                                </button>
                                <button
                                    className="w-full bg-red-400 text-gray-900 p-2 rounded-md hover:bg-red-500 mt-2"
                                    onClick={handleClose}
                                >
                                    {getIcon('CloseIcon', { marginRight: '5px' })}
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                    {dataProject.nombre && !isLoading && (
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Proyecto Guardado</h2>
                            {/* datos del proyecto */}
                            <p className="mb-2"><strong>Nombre:</strong> {dataProject.nombre} </p>
                            <p className="mb-2"><strong>Descripción:</strong> {dataProject.descripcion} </p>
                            <p className="mb-2"><strong>Número de poligonos:</strong> {dataProject.polygons.length} </p>
                            <button
                                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                                onClick={handleUpdateProject}
                            >
                                {getIcon('EditIcon', { marginRight: '5px' })}
                                Actualizar Proyecto
                            </button>
                            <button
                                className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 mt-2"
                                onClick={handleShareProject}
                            >
                                {getIcon('ShareIcon', { marginRight: '5px' })}
                                Compartir Proyecto
                            </button>
                            <button
                                className="w-full bg-red-400 text-gray-900 p-2 rounded-md hover:bg-red-500 mt-2"
                                onClick={handleClose}
                            >
                                {getIcon('CloseIcon', { marginRight: '5px' })}
                                Cerrar
                            </button>
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