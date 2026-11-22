import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { getPlacesByUserId } from '../../services/place.service';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../../data/Icons';
import { colores } from '../../tema/seroTheme'; // S02-H2.1: tarjetas claras del tema nuevo

const Index = () => {

    const user = useSelector(state => state.user);
    const [plazas, setPlazas] = useState([]);

    const navigation = useNavigate();

    useEffect(() => {
        const getPlazasByUser = async () => {
            const res = await getPlacesByUserId(user.user_id);
            setPlazas(res);
        }
        getPlazasByUser();
    }, [user.user_id])


    return (

        <div className='m-5 py-5 px-3'>

            <Header title="SER0 SPACE" subtitle="Selecciona la plaza para visualizar su mapa" />

            <div className="flex justify-evenly items-center flex-wrap gap-3 mt-5 rounded-md"  >

                {plazas && plazas.map(plaza => (
                    <div
                        key={plaza.place_id.toString()}
                        className='p-4 w-[27%] rounded-md h-[360px] mb-5'
                        style={{ backgroundColor: colores.blanco, border: `1px solid ${colores.linea}`, color: colores.tinta }}
                    >
                        <div className='h-full flex flex-col justify-between gap-4'>
                            <div className='w-10 h-10 rounded-[50%] flex justify-center items-center' style={{ backgroundColor: colores.seleccion, color: colores.marino }} >
                                <p className='font-bold'>{plaza.name.substring(0, 1).toUpperCase()}</p>
                            </div>
                            <img className='w-[120px] mx-auto mb-[10px]' src={plaza.image} alt="" />
                            <h2 className='font-semibold text-center'>{plaza.name}</h2>
                            <button onClick={() => navigation(`/map/${plaza.place_id}`)} className='w-full p-1 rounded-md
                            flex justify-center items-center gap-2 font-semibold'
                            style={{ backgroundColor: colores.verde, color: colores.tinta }}>
                                {getIcon('ZoomInMapIcon', {})}
                                Abrir mapa
                            </button>
                        </div>
                    </div>

                ))}

            </div>

        </div>

    )

}

export default Index