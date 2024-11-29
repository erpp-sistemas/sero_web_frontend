import React from 'react'

const SelectLayer = ( { features, setIdLayerSeleccionado } ) => {

    const { layers_activos } = features;

    return (
        <select className="w-full p-2 rounded-md text-gray-900" placeholder='Selecciona el layer' name="selec_layer" id="select_layer_color"
            onChange={(e) => setIdLayerSeleccionado(e.target.value)}
        >
            <option value="0">Selecciona el layer</option>
            {layers_activos && layers_activos.length > 0 && layers_activos.map(layer => (
                <option className='text-gray-900' key={layer.id_layer} value={layer.layer_id}> {layer.etiqueta} </option>
            ))}
        </select>
    )
}

export default SelectLayer