import { useState, useEffect } from 'react';

// COMPONENTS
import { getIcon } from '../../data/Icons';
import ModalQuestion from '../../components/modals/ModalQuestion';

// API
import { getLastPositionUsers } from '../../api/user'

// LIBRERIES
import mapboxgl from 'mapbox-gl';

// CSS
import './css/styles.css'

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import { cleanMessages } from '../../redux/socketSlice'

const TrackingGestor = ({ data }) => {

    const {
        startTracking, setStartTracking, positionsUser, setPositionsUser, markers, setMarkers, showMarkers, setShowMarkers, setShowTools
    } = data;

    const map_active = useSelector((state) => state.mapa);
    const plaza = useSelector((state) => state.plaza_mapa);
    const messages = useSelector((state) => state.webSocket.messages);
    const dispatch = useDispatch()

    const [showModalQuestion, setShowModalQuestion] = useState(false);
    

    useEffect(() => {
        if (!showMarkers || messages.length === 0) return;

        if (messages.length === 0) return;
        const data = messages[0];

        if (data.type === "on-recorrido-gestor-changed") {
            dispatch(cleanMessages())
            const { latitud, longitud, id_usuario, fecha } = data.payload.data;

            if (markers[id_usuario]) {
                markers[id_usuario].setLngLat([longitud, latitud]);
                // actualiza la fecha en el popup
                markers[id_usuario].getPopup().setDOMContent(createPopupContent(id_usuario, fecha));
            } else {
                // Si el marcador no existe, crear uno nuevo
                const newUserPosition = {
                    id_usuario,
                    latitud,
                    longitud,
                    fecha,
                    // Datos adicionales de usuario si es necesario
                };
                if (startTracking) {
                    const newMarker = createDivFoto(newUserPosition, [longitud, latitud], fecha);
                    setMarkers((prev) => ({ ...prev, [id_usuario]: newMarker }));
                    //console.log(markers)
                }
            }
        }
    }, [messages, markers, showMarkers]);


    // Función para obtener las posiciones iniciales y crear los marcadores
    const getLastPositionGestor = async () => {
        let users_with_position = await getLastPositionUsers(plaza.place_id);
        users_with_position = getUniqueUsers(users_with_position);
        setPositionsUser(users_with_position);
        const newMarkers = { ...markers }; // Copiamos los marcadores existentes
        for (let user of users_with_position) {
            const marker = createDivFoto(user, [user.longitud, user.latitud], user.fecha);
            newMarkers[user.id_usuario] = marker; // Guardamos el marcador en el estado
        }
        setMarkers(newMarkers); // Actualizamos el estado con todos los marcadores
    };

    const getUniqueUsers = (users) => {
        const uniqueUsers = {}; // Objeto para almacenar usuarios únicos
        for (let user of users) {
            uniqueUsers[user.id_usuario] = user; // Sobrescribe duplicados con el mismo id_usuario
        }
        return Object.values(uniqueUsers); // Devuelve solo los valores únicos
    };

    const createDivFoto = (gestor, coordinates, fecha) => {

        const el = document.createElement('div');
        el.setAttribute('id', gestor.id_usuario);
        el.classList.add('foto-gestor-mapa');
        el.innerHTML = `<img src=${gestor.foto} alt="foto del usuario" />`;

        const divElement = document.createElement('div');
        const innerHtmlContent = `<div class="popup"><p>${gestor.nombre} ${gestor.apellido_paterno} ${gestor.apellido_materno}</p><p>${fecha}</p></div>`;
        divElement.innerHTML = innerHtmlContent;

        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(divElement);

        let marker = new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map_active.mapa);

        el.addEventListener('click', () => {
            marker.togglePopup();
        });

        return marker;
    };


    const createPopupContent = (id_usuario, fecha) => {
        const user = positionsUser.find((u) => u.id_usuario === id_usuario);
        if (!user) return document.createElement('div'); // Verificación de seguridad
        const divElement = document.createElement('div');
        divElement.innerHTML = `<div class="popup"><p>${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}</p><p>${fecha}</p></div>`;
        return divElement;
    };


    const handleRespuesta = (res) => {
        setShowModalQuestion(false);
        if (res) startTrackingAll();
    }

    const startTrackingAll = () => {
        setStartTracking(true);
        setShowTools(false);
        getLastPositionGestor();
    }

    const removeAllMarkers = () => {
        for (let id in markers) {
            markers[id].remove();
        }
        setMarkers({});
        setPositionsUser([]);
        setShowMarkers(false);
    };

    
    return (
        <div>

            {showModalQuestion && <ModalQuestion title={'¿Seguir a todos los gestores?'} handleRespuesta={handleRespuesta} />}

            <div className="w-2/3 mx-auto flex justify-center items-center flex-col mb-4">

                {Object.values(markers).length === 0 ? (
                    <>
                        <button className="bg-green-700 px-2 py-2 flex items-center justify-center rounded-md w-2/3" onClick={() => setShowModalQuestion(true)}>
                            {getIcon('NotStartedIcon', { marginRight: '5px' })}
                            Iniciar Seguimiento
                        </button>
                        <h3 className="italic text-xs mt-1 text-gray-600">Iniciara el seguimiento a todos los gestores</h3>
                    </>
                ) : (
                    <>
                        <button className="bg-red-700 px-2 py-2 flex items-center justify-center rounded-md w-2/3" onClick={removeAllMarkers}>
                            {getIcon('NotStartedIcon', { marginRight: '5px' })}
                            Detener seguimiento
                        </button>
                        <h3 className="italic text-xs mt-1 text-gray-600">Detendra el seguimiento a todos los gestores</h3>
                    </>
                )}

            </div>

           
        </div>
    )

}

export default TrackingGestor