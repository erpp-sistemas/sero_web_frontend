import { useState, useEffect } from 'react';

// API
import { getUsersForNotification } from '../../api/user';

// COMPONENTS
import { getIcon } from '../../data/Icons';
import { sendNotificationService, uploadImageNotificationService, saveNotificationBdService } from '../../services/push-notification.service';

// LIBRERIES
import { useSelector } from 'react-redux';



const Notification = ({ data }) => {

    const user_session = useSelector((state) => state.user);
    
    const { setShowTools, setShowModal } = data;

    const [gestores, setGestores] = useState([]);
    const [typeMessage, setTypeMessage] = useState("1")
    const [gestoresSeleccionados, setGestoresSeleccionados] = useState([]);
    const [headings, setHeadings] = useState('');
    const [contents, setContents] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        getInitGestores();
    }, [])

    const getInitGestores = async () => {
        const data = await getUsersForNotification();
        const users = filterUsers(data);
        setGestores(users);
    }

    const filterUsers = (users) => {
        const users_filter = users.filter(user => {
            return user.activo && user.id_user_push
        })
        return users_filter;
    }

    const handleChangeGestor = (e) => {
        const values = Array.from(event.target.selectedOptions, option => option.value);
        const gestoresFiltrados = gestores.filter(gestor => values.includes(gestor.id_usuario.toString()));
        setGestoresSeleccionados(gestoresFiltrados);
    }

    const handlePhoto = (e) => {
        let image = URL.createObjectURL(e.target.files[0]);
        setImage(image);
        setFile(e.target.files[0]);
    }

    const handleSendNotification = async () => {
        setIsLoading(true);
        if ([headings, contents, category].includes('')) {
            alert("Titulo, categoria y contenido son obligatorios");
            return;
        }
        let image_url = '';
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            image_url = await uploadImageNotificationService(formData)
        }
        const data = {
            category, contents, headings,
            type: typeMessage,
            image_url: image_url.url_image,
            users: typeMessage === "1" ? [] : gestoresSeleccionados,
        }
        sendNotificationService(data)
            .then(async message => {
                const notification_id = message.data.response.id;
                let arr = null;
                if(typeMessage === "1") arr = gestores;
                if(typeMessage === "2") arr = gestoresSeleccionados;
                for (let gestor of arr) {
                    await saveInfoNotificationBd(notification_id, gestor, image_url.url_image);
                }
                //todo quitar el alert y poner otro tipo de mensaje
                alert(message.data.message);
                setIsLoading(false);
                cleanData();
                handleCancel();
            }).catch(error => console.log("No se pudo enviar la notificación ", error))
    }

    const saveInfoNotificationBd = async (notification_id, user, image_url) => {
        const data = {
            id_push_notification: notification_id,
            id_usuario: user.id_usuario,
            id_user_push: user.id_user_push,
            mensaje: contents,
            titulo: headings,
            leido: 0,
            url_img: image_url,
            categoria: category,
            tipo: typeMessage,
            usuario_creo: user_session.user_id
        }
        saveNotificationBdService(data)
            .then(message => {})
            .catch(error => console.error(error))
    }

    const cleanData = () => {
        setTypeMessage("1")
        setGestoresSeleccionados([])
        setHeadings('');
        setContents('');
        setCategory('');
        setImage('');
        setFile(null);
    }

    const handleCancel = () => {
        setShowModal(true);
        setShowTools(false);
    }



    return (
        <div className='font-mono'>
            <div className="w-full mx-auto flex justify-center items-center flex-col mb-4">
                <div className='w-1/2 mb-4'>
                    <div className='flex justify-center items-center gap-2 mb-2'>
                        {(getIcon('BlurLinearIcon', { color: 'green', fontSize: '26px' }))}
                        <p className="text-gray-900 text-base text-center font-semibold">Tipo de mensaje</p>
                    </div>

                    <select className="w-full py-1 rounded-md text-gray-900 px-2 mb-2" onChange={(e) => setTypeMessage(e.target.value)}>
                        <option value="1">Masivo</option>
                        <option value="2">Por usuario(s)</option>
                    </select>

                    {typeMessage === "2" && (
                        <>
                            <p className="text-gray-900 text-base text-center font-semibold">Seleccione uno o varios usuarios:</p>
                            <p className="px-4 text-xs text-center text-gray-500 mb-2">Para seleccionar varios usuarios mantenga la tecla control presionada y seleccione a los usuarios</p>
                            <select multiple className='w-full rounded-md py-2 text-gray-900 px-4' onChange={handleChangeGestor}>

                                {gestores.length > 0 && gestores.map(gestor => (
                                    <option className="mb-1 border-b-2" key={gestor.id_usuario} value={gestor.id_usuario}>
                                        {gestor.nombre} {gestor.apellido_paterno} {gestor.apellido_materno}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className='w-2/3'>
                    <div className='flex justify-center items-center gap-2 mb-2'>
                        {getIcon('ArticleIcon', { color: 'green', fontSize: '26px' })}
                        <h1 className='text-center text-gray-900 font-semibold text-base'>Datos del mensaje</h1>
                    </div>
                    <div className="text-gray-900">
                        <input className="p-1 px-2 rounded-md mb-2 w-full mt-2" type="text" placeholder='titulo del mensaje' onChange={(e) => setHeadings(e.target.value)} />
                        <select className="w-full py-1 px-2 rounded-md mt-2" onChange={(e) => setCategory(e.target.value)}>
                            <option value="0">--- Seleccione la categoria ---</option>
                            <option value={1}>Social</option>
                            <option value={2}>Aviso</option>
                            <option value={3}>Seguimiento</option>
                        </select>

                        <textarea onChange={(e) => setContents(e.target.value)} placeholder='contenido del mensaje' className="mt-2 w-full px-2" rows={5} name="" id=""></textarea>
                        <input className="mt-2 w-full" type="file" onChange={handlePhoto} />
                        {image !== '' && (
                            <div className='foto-preview'>
                                <img src={image} alt="" />
                            </div>

                        )}
                        <div className="w-full flex justify-evenly items-center">
                            <button className="mt-4 w-5/12 text-neutral-200 bg-red-600 py-1 rounded-md mx-auto flex justify-center items-center gap-1 hover:bg-red-500"
                                onClick={handleCancel}
                            >
                                {getIcon('CloseIcon', {})}
                                Cancelar
                            </button>
                            <button className="mt-4 w-5/12 text-neutral-200 bg-green-600 py-1 rounded-md mx-auto flex justify-center items-center gap-1 hover:bg-green-500"
                                onClick={handleSendNotification}
                            >
                                {getIcon('CheckCircleIcon', {})}
                                Enviar
                            </button>
                        </div>
                        {isLoading && <h3 className='text-center mt-2 py-1 bg-gray-300 rounded-md'> Enviando mensaje... </h3>}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Notification