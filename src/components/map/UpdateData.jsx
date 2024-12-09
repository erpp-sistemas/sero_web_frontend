import { useState, useEffect } from 'react';

// COMPONENTS
import SelectLayer from './SelectLayer';
import { getIcon } from '../../data/Icons';

// LIBRERIES
import { useSelector } from 'react-redux';

// SERVICES
import { updateLayerDataByPlazaService } from '../../services/map.service';

const PARAMS_STORED_POSSIBLE = {
    id_plaza: 2,
    id_servicio: 2,
}

const UpdateData = () => {

    const features = useSelector((state) => state.features);
    const { layers_activos } = features;

    const [idLayerSeleccionado, setIdLayerSeleccionado] = useState();
    const [layerSeleccionado, setLayerSeleccionado] = useState({});

    useEffect(() => {
        if (Number(idLayerSeleccionado) > 0) {
            const layer_selected = layers_activos.filter(layer => layer.layer_id === Number(idLayerSeleccionado))[0];
            setLayerSeleccionado(layer_selected);
        }
    }, [idLayerSeleccionado])

    const handleUpdateLayer = () => {
        const { name_store: name_stored, params } = layerSeleccionado;
        console.log(layerSeleccionado)
        let params_stored = [];
        let params_res = [];
        if (params) params_stored = params.split(',');
        params_stored.forEach(param => {
            for (let obj in PARAMS_STORED_POSSIBLE) {
                if (obj === param) {
                    params_res.push(PARAMS_STORED_POSSIBLE[obj])
                }
            }
        })
        //params_res.push(1, 10) // pageNumber y pageSize
        console.log({ name_stored, params: params_res })
        updateLayerDataByPlazaService({ name_stored, params: params_res })
            .then(res => console.log(res));
    }


    return (
        <div className="py-2 px-10 flex flex-col items-center ">
            <div className='w-full'>
                <div className='flex w-full items-center mb-2'>
                    {getIcon('LayersIcon', { fontSize: '30px', color: 'green' })}
                    <h1 className="text-base text-gray-900 font-semibold px-2"> Layer para la asignación </h1>
                </div>
                <SelectLayer features={features} setIdLayerSeleccionado={setIdLayerSeleccionado} />

                <div className="flex justify-center gap-4 mt-4">
                    <button className='bg-amber-600 py-2 rounded-md px-4 hover:bg-amber-500 flex items-center gap-1'>
                        {getIcon('InfoIcon', { color: 'black', fontWeight: 'bold', fontSize: '26px' })}
                        Validar layer
                    </button>
                    <button className='bg-cyan-600 py-2 rounded-md px-4 hover:bg-cyan-500 flex items-center gap-1'>
                        {getIcon('BookmarkAddedIcon', { color: 'black', fontWeight: 'bold', fontSize: '26px' })}
                        Actualizar campos
                    </button>
                    <button className='bg-emerald-600 py-2 rounded-md px-4 hover:bg-emerald-500 flex items-center gap-1'
                        onClick={handleUpdateLayer}
                    >
                        {getIcon('RepeatIcon', { color: 'black', fontWeight: 'bold', fontSize: '26px' })}
                        Actualizar layer
                    </button>
                </div>
            </div>
        </div>
    )

}

export default UpdateData