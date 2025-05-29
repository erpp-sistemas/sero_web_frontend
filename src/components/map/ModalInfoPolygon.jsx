import { useState, useEffect } from 'react'
import { Modal } from '@mui/material';

import { getIcon } from '../../data/Icons';
import { CSVLink } from 'react-csv';
import { useDispatch, useSelector } from 'react-redux'
import { setPolygonsCreated } from '../../redux/featuresSlice';



const ModalInfoPolygon = ({ setShowModal, polygon, setLastPolygonCreated, polygonsStorage }) => {

    //console.log(polygon)
    const dispatch = useDispatch();
    const polygonsCreated = useSelector(state => state.features.polygonsCreated);
    const [open, setOpen] = useState(true);

    const [showFieldName, setShowFieldName] = useState(false);
    const [namePolygon, setNamePolygon] = useState('');
    const [properties, setProperties] = useState([]);


    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };


    useEffect(() => {
        const points = polygon.points;
        if (!points || points.length === 0) return;
        const properties = points.map(p => p.properties);
        // si properties tiene un campo llamado data_json entonces entonces quiero tenerlo como un objeto y anexarlo a properties
        const propertiesWithDataJson = properties.map(p => {
            const data_json = p.data_json;
            if (data_json) {
                const data_json_obj = JSON.parse(data_json);
                let obj_temp = {
                    ...p,
                    ...data_json_obj
                }
                delete obj_temp.data_json;
                return obj_temp;
            }
            return p;
        })
        setProperties(propertiesWithDataJson)
    }, [polygon])



    const setNamePolygonUpdate = (e) => {
        e.preventDefault();
        if (namePolygon === '') return alert('Ingresa un nombre para el poligono');
        const polygons_not_selected = polygonsCreated.filter(poly => poly.id !== polygon.id)
        const polygon_new = {
            ...polygon,
            name: namePolygon
        }
        setLastPolygonCreated(polygon_new);
        polygonsStorage.current = [...polygons_not_selected, polygon_new]
        dispatch(setPolygonsCreated([...polygons_not_selected, polygon_new]));
        setShowFieldName(false);
        setNamePolygon('')
    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                {polygon && (
                    <div className='w-1/5 h-[80%] p-4 bg-blue-50 absolute top-[50%] left-[89%] translate-x-[-50%] translate-y-[-45%] rounded-md shadow-lg shadow-slate-700'>
                        <p className=" text-gray-900 text-base text-center font-bold font-sans"> Poligono </p>
                        <hr className='bg-gray-900 m-2' />
                        <p className=" text-gray-900 text-base mt-6"> Número de puntos: <span className='text-emerald-700 font-bold'> {polygon.number_points} </span> </p>
                        <p className=" text-gray-900 text-base mt-2"> Área: <span className='text-emerald-700 font-bold'> {polygon.area} </span> </p>
                        {polygon.name && polygon.name !== '' && (<p className=" text-gray-900 text-base mt-2"> Nombre: <span className='text-emerald-700 font-bold'> {polygon.name} </span> </p>)}
                        {polygon.user && (
                            <p className="text-gray-900 text-base mt-1">Usuario: <span className="text-emerald-700 font-bold">{polygon.user.nombre} {polygon.user.apellido_paterno}</span> </p>
                        )}
                        {polygon.distancia && (
                            //<p className="text-gray-900 text-base mt-1">Distancia: <span className="text-emerald-700 font-bold">{polygon.distancia.toFixed(2)} km</span> </p>
                            <p className="text-gray-900 text-base mt-1">Distancia: <span className="text-emerald-700 font-bold">{polygon.distancia} km</span> </p>
                        )}
                        <div className='w-full mx-auto mt-3 py-2 flex flex-col justify-center items-center gap-3'>
                            {!showFieldName && (
                                <button className='w-full bg-gray-200 px-2 rounded-md py-1 gap-1 flex justify-center items-center hover:bg-gray-300'
                                    onClick={() => setShowFieldName(true)}
                                >
                                    {getIcon('EditIcon', { fontSize: '20px', color: '#03af6e' })}
                                    <p className='text-gray-900'>
                                        {!polygon.name ? 'Nombrar poligono' : 'Renombrar poligono'}
                                    </p>
                                </button>
                            )}

                            {showFieldName && (
                                <button className='w-full bg-gray-200 px-2 rounded-md py-1 gap-1 flex justify-center items-center hover:bg-gray-300'
                                    onClick={() => setShowFieldName(false)}
                                >
                                    {getIcon('DeleteIcon', { fontSize: '20px', color: '#af0300' })}
                                    <p className='text-gray-900'>Cancelar nombre</p>
                                </button>
                            )}

                            <CSVLink data={properties} filename={(polygon.name && polygon.name !== '') ? polygon.name : 'Registros seleccionados'} style={{ width: '100%', margin: '0 auto' }} >
                                <button className='w-full bg-gray-200 px-2 rounded-md py-1 gap-1 flex justify-center items-center hover:bg-gray-300' >
                                    {getIcon('CloudDownloadIcon', { fontSize: '20px', color: '#03af6e' })}
                                    <p className='text-gray-900'>Descargar información</p>
                                </button>
                            </CSVLink>

                        </div>

                        {showFieldName && (
                            <>
                                <p className='text-gray-900 text-center mt-4 italic text-xs'> --- Asignale un nombre al poligono para identificarlo posteriormente. --- </p>
                                <form className="w-full mx-auto" onSubmit={setNamePolygonUpdate}>
                                    <input autoFocus={true} type="text" className='w-full mt-3 py-1 px-2 rounded-md text-gray-900' placeholder='Nombre del poligono' onChange={e => setNamePolygon(e.target.value)} />
                                    <input type='submit' value="Aceptar" className="w-full bg-emerald-500 text-gray-900 py-1 mt-4 rounded-md font-bold hover:bg-emerald-600" />
                                </form>
                            </>
                        )}

                    </div>
                )}

            </Modal>
        </div>
    )
}

export default ModalInfoPolygon