import { useEffect, useState } from 'react'
import instance from '../../api/axios';
import { getIcon } from '../../data/Icons';
import { sendDataProjectShare } from '../../services/map.service';
import Spinner from './Spinner';
import Message from './Message';

const ShareProject = ({ data }) => {

    const { setActiveShare, project } = data;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editPermission, setEditPermission] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await instance.get('/usuarios');
        const users_active = response.data;
        console.log(users_active)
        setUsers(users_active);
    }

    const handleShareProject = async () => {
        if (!selectedUser) {
            alert("Por favor, selecciona un usuario para compartir el proyecto.");
            return;
        }
        setLoading(true);
        const { project_id } = project;
        const projectData = {
            project_id: project_id,
            shared_with: Number(selectedUser),
            edit_permission: editPermission
        };
        console.log("Datos del proyecto a compartir:", projectData);
        try {
            sendDataProjectShare(projectData)
                .then((response) => {
                    console.log("Proyecto compartido exitosamente:", response);
                    setMessage({ title: 'Mensaje', text: 'Proyecto compartido exitosamente', type: 'success' });
                    setLoading(false);
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Error al compartir el proyecto:", error);
                    alert("Ocurrió un error al intentar compartir el proyecto.");
                });

        } catch (error) {
            console.error("Error al compartir el proyecto:", error);
            alert("Ocurrió un error al intentar compartir el proyecto.");
        }
    }


    return (
        <div className="w-full mx-auto flex justify-center items-center flex-col mb-4 font-mono text-gray-900">

            {message && <Message title={message.title} text={message.text} type={message.type} />}

            <div className="w-10/12 mb-4">
                <h2 className="text-xl font-bold mb-2">Comparte tu proyecto</h2>
                <p className="text-sm mb-4 text-gray-400">Puedes compartir tu proyecto con otros usuarios para que puedan verlo y colaborar contigo.</p>


                {!loading && (
                    <>
                        {/* SELECT CON LA LISTA DE USUARIOS */}
                        <select className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Selecciona un usuario</option>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <option key={user.id_usuario} value={user.id_usuario}>
                                        {user.nombre} {user.apellido_paterno}
                                    </option>
                                ))
                            ) : (
                                <option value="">No hay usuarios disponibles</option>
                            )}
                        </select>

                        {/* CHECK PARA ACTIVAR O DESACTIVAR EL PERMISO DE EDICION */}
                        <div className="flex items-center mb-4">
                            <input type="checkbox" id="editPermission" className="mr-2 w-6"
                                checked={editPermission}
                                onChange={(e) => setEditPermission(e.target.checked)}
                            />
                            <label htmlFor="editPermission" className="text-sm">Permitir edición del proyecto</label>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-7/12"
                                onClick={handleShareProject}
                            >
                                {getIcon('ShareIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                Compartir proyecto
                            </button>

                            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-7/12"
                                onClick={() => setActiveShare(false)}
                            >
                                {getIcon('CloseIcon', { color: 'white', fontSize: '20px', marginRight: '5px' })}
                                Cancelar
                            </button>
                        </div>
                    </>
                )}

                {loading && (
                    <div className="mt-4 text-gray-500">
                        Compartiendo proyecto...
                        <Spinner />
                    </div>
                )}


            </div>


        </div>
    )
}

export default ShareProject