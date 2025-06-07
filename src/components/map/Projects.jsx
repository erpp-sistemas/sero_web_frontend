
import { getIcon } from '../../data/Icons';

const Projects = ({ data }) => {

    const { currentProjects, projectsLoaded, handleLoadPolygonsInMap, handleShareProject,
        handleDeletePolygonsInMap, handleEditPolygonsInMap, currentPage, totalPages, handlePageChange
    } = data;


    return (
        <div className='w-full flex justify-center items-center flex-col'>
            {currentProjects.map((project, index) => (
                <div key={index} className=' w-10/12 text-gray-900 bg-neutral-200 px-4 py-2 rounded-md text-sm my-1'>
                    <p> <span className='font-semibold'> Nombre: </span> {project.name} </p>
                    <p> <span className='font-semibold'> Descripción: </span> {project.description} </p>
                    <p> <span className='font-semibold'> Layer: </span> {project.layer.replaceAll('_', ' ')} </p>
                    <p> <span className='font-semibold'> Fecha: </span> {project.created_at.split('T')[0]} - {project.created_at.split('T')[1].substring(0, 8)} </p>
                    {project.owner === 0 && (
                        <p className="font-semibold text-yellow-700 inline-block rounded-md"> Compartido </p>
                    )}

                    <div className='flex items-center gap-2 my-2'>

                        {!projectsLoaded || !projectsLoaded.includes(project.project_id) ? (
                            <button className='bg-blue-500 py-2 px-2 w-32 hover:bg-blue-600 rounded-md text-neutral-50 border border-slate-700 border-spacing-2'
                                onClick={() => handleLoadPolygonsInMap(project.project_id)}
                            >
                                {getIcon('LayersIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                Cargar
                            </button>
                        ) : null}

                        {project.owner === 1 && (
                            <button className='bg-blue-500 py-2 px-2 w-32 hover:bg-blue-600 text-neutral-50 rounded-md border border-slate-700 border-spacing-2'
                                onClick={() => handleShareProject(project)}
                            >
                                {getIcon('ShareIcon', { color: '#00FF00', fontSize: '20px', marginRight: '5px' })}
                                Compartir
                            </button>
                        )}

                        {projectsLoaded && projectsLoaded.includes(project.project_id) && (
                            <>
                                <button className='bg-blue-500 py-2 px-2 w-32 hover:bg-blue-600 rounded-md text-neutral-50 border border-slate-700 border-spacing-2 '
                                    onClick={() => handleDeletePolygonsInMap(project)}
                                >
                                    {getIcon('DeleteIcon', { color: 'red', fontSize: '20px', marginRight: '5px' })}
                                    Quitar
                                </button>
                                {project.editable === 1 && (
                                    <button className='bg-blue-500 py-2 px-2 border border-slate-700 border-spacing-2 hover:bg-blue-600 rounded-md w-32 text-neutral-50'
                                        onClick={() => handleEditPolygonsInMap(project)}
                                    >
                                        {getIcon('EditIcon', { color: 'yellow', fontSize: '20px', marginRight: '5px' })}
                                        Editar
                                    </button>
                                )}
                            </>
                        )}

                    </div>
                </div>
            ))}
            {/* Controles de paginación */}
            <div className="flex gap-2 mt-2 text-gray-900">
                <button
                    className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="px-2 py-1">{currentPage} / {totalPages}</span>
                <button
                    className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    )
}

export default Projects