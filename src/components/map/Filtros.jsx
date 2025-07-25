import { useState } from 'react';
import { getIcon } from '../../data/Icons';
import { useSelector, useDispatch } from 'react-redux';
import { setFiltrosActivos } from '../../redux/featuresSlice';
import Spinner from './Spinner';

const Filtros = ({ data }) => {

    const {
        filtersSelected, setFiltersSelected, dataFiltered, setDataFiltered,
        setShowTools
    } = data;

    const dispatch = useDispatch();
    const features = useSelector((state) => state.features);
    const filtrosActivos = useSelector(state => state.features.filtrosActivos);
    const mapa_activo = useSelector((state) => state.mapa)
    const { layers_activos } = features;

    const [idLayerSelected, setIdLayerSelected] = useState('0');
    const [layerSelected, setLayerSelected] = useState({});
    const [urlGeoserver, setUrlGeoserver] = useState('');
    const [sourceId, setSourceId] = useState('');
    const [fields, setFields] = useState({});
    const [fieldsSelected, setFieldsSelected] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [originalFeatures, setOriginalFeatures] = useState({});

    const handleLayerSelected = (e) => {
        if (e.target.value !== '0') {

            const value = e.target.value;
            setIdLayerSelected(value)

            const is_visible = isVisibleLayer(value.toString());
            if (!is_visible) return alert("El layer no esta visible en el mapa!!!!");

            setShowSpinner(true)
            setSourceId(getSourceLayer(value));
            const layer_selected = layers_activos.filter(layer => layer.layer_id == value)[0];
            setLayerSelected(layer_selected);
            getFieldsLayer(layer_selected.url_geoserver);

        }
    }

    const isVisibleLayer = (layer_id) => {
        const visibility = mapa_activo.mapa.getLayoutProperty(layer_id, 'visibility');
        return visibility === 'visible';
    }

    const getSourceLayer = (layer_id) => {
        const layer = mapa_activo.mapa.getLayer(layer_id);
        if (layer) {
            return layer.source;
        } else {
            console.error("Layer no encontrado");
            return null;
        }
    }

    const getFieldsLayer = async (layer_url) => {
        setUrlGeoserver(layer_url)
        const response = await fetch(`${layer_url}&maxFeatures=1`);
        const data = await response.json();
        let properties = Object.keys(data.features[0].properties);
        properties = properties.filter(prop => prop !== 'fecha_filter');

        const data_json = properties.find(prop => prop === 'data_json');
        if (data_json) {
            const data_json_properties = Object.keys(JSON.parse(data.features[0].properties.data_json));
            properties = properties.filter(prop => prop !== 'data_json');
            properties = [...properties, ...data_json_properties];
        }
        setFields(properties);
        setShowSpinner(false);
    }


    const handleField = (field) => {
        if (fieldsSelected.length === 0) {
            setFieldsSelected([field]);
            changeColor(field, '#4CCEAC')
            return;
        }

        if (fieldsSelected.length > 0) {
            const find = fieldsSelected.find(f => f === field);
            if (!find) {
                setFieldsSelected([...fieldsSelected, field]);
                changeColor(field, '#4CCEAC');
                return;
            }
            if (find) {
                setFieldsSelected(fieldsSelected.filter(f => f !== field))
                changeColor(field, '#D1D5DB');
                return;
            }
        }
    }

    const changeColor = (field, color) => {
        document.getElementById(field).style.background = color
    }

    const handleAcceptFilters = async () => {
        setShowSpinner(true);
        setShowFilters(true)
        const arr = [];
        for (let field of fieldsSelected) {
            const list = getValueUniqueByFieldBySource(field);
            arr.push({ [field]: list.sort() })
        }
        setFilters(arr)
        setShowSpinner(false);
    }

    const handleCleanSelection = () => {
        fields.forEach(field => changeColor(field, '#D1D5DB'))
        setFilters([]);
        setShowFilters(false);
        setFieldsSelected([]);
    }


    const getValueUniqueByFieldByUrl = async (campo) => {
        const url = `${urlGeoserver}&propertyName=${campo}`;
        const response = await fetch(url);
        const data = await response.json();
        const valoresUnicos = Array.from(new Set(data.features.map(feature => feature.properties[campo])));
        return valoresUnicos;
    };

    const getValueUniqueByFieldBySource = (campo) => {
        const source = mapa_activo.mapa.getSource(sourceId);
        if (!source) {
            console.error("Fuente no encontrada");
            return [];
        }
        const features = source._data.features;
        const valoresUnicos = Array.from(new Set(
            features.map(feature => {
                // Primero intenta obtener el campo directo
                if (feature.properties.hasOwnProperty(campo)) {
                    return feature.properties[campo];
                }
                // Si no, intenta obtenerlo desde data_json
                if (feature.properties.data_json) {
                    try {
                        const dataJson = typeof feature.properties.data_json === "string"
                            ? JSON.parse(feature.properties.data_json)
                            : feature.properties.data_json;
                        return dataJson[campo];
                    } catch (e) {
                        return undefined;
                    }
                }
                return undefined;
            }).filter(v => v !== undefined)
        ));
        return valoresUnicos;
    }

    const handleChangeFilterValue = (e, field) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFiltersSelected({
            ...filtersSelected,
            [field]: selectedOptions
        });
    };

    const handleApplyFilters = () => {
        const source = mapa_activo.mapa.getSource(sourceId);
        if (!source) {
            console.error("Fuente no encontrada");
            return;
        }

        // Obtiene los datos actuales
        const currentData = source._data || source._options?.data;
        if (!currentData) {
            console.error("No hay datos en la fuente");
            return;
        }

        let features = currentData.features || [];

        // Guarda los features originales si aún no están guardados
        if (!originalFeatures[sourceId]) {
            setOriginalFeatures(prev => ({
                ...prev,
                [sourceId]: features
            }));
        }

        // Aplica los filtros seleccionados
        const filteredFeatures = features.filter(feature => {
            return Object.entries(filtersSelected).every(([campo, valores]) => {
                let propValue = feature.properties[campo];

                if (propValue === undefined && feature.properties.data_json) {
                    try {
                        const dataJson = typeof feature.properties.data_json === "string"
                            ? JSON.parse(feature.properties.data_json)
                            : feature.properties.data_json;

                        propValue = dataJson[campo];
                    } catch (e) {
                        propValue = undefined;
                    }
                }

                if (!valores || valores.length === 0) return true;

                return valores.includes(String(propValue));
            });
        });

        // Aplica los datos filtrados a la capa
        source.setData({
            ...currentData,
            features: filteredFeatures
        });

        // Guarda los filtros aplicados en Redux
        dispatch(setFiltrosActivos({
            layerId: sourceId,
            featuresFiltrados: filteredFeatures,
            filtros: filtersSelected,
            totalOriginal: features.length
        }));

        // Guarda para el historial visual
        setDataFiltered(prev => [...prev, {
            layerSelected,
            data: filtersSelected
        }]);

        // Limpieza visual
        clean();
        setShowTools(false);
    };

    const handleDeleteFilter = (layer) => {
        const layerId = layer.name_layer;
        const source = mapa_activo.mapa.getSource(layerId);

        if (source && originalFeatures[layerId]) {
            const currentData = source._data || source._options?.data;
            source.setData({
                ...currentData,
                features: originalFeatures[layerId]
            });
        }

        // Limpia cualquier filtro Mapbox (aunque ya no se use setFilter por propiedad)
        mapa_activo.mapa.setFilter(layer.layer_id.toString(), null);

        // Limpia el estado local de filtros aplicados
        // const nuevosFiltros = filtrosActivos.filter(f => f.layerId !== layerId);
        // dispatch(setFiltrosActivos(nuevosFiltros));

        // Limpia el historial visual
        const new_data = dataFiltered.filter(data => data.layerSelected.layer_id !== layer.layer_id);
        setDataFiltered(new_data);

        clean();
        setShowTools(false);
    };

    const clean = () => {
        setIdLayerSelected('0');
        setLayerSelected({});
        setUrlGeoserver('');
        setFields({});
        setFieldsSelected([]);
        setShowFilters(false);
        setFilters([]);
        setFiltersSelected({});
        setSourceId('');
    }


    return (
        <div className='font-mono'>
            <div className="w-full mx-auto flex justify-center items-center flex-col mb-4">

                <div className='w-10/12 mb-4'>

                    <div className='flex justify-center items-center gap-2 mb-2'>
                        {(getIcon('LayersIcon', { color: 'green', fontSize: '26px' }))}
                        <p className="text-gray-900 text-base text-center font-semibold">Seleccione el layer</p>
                    </div>

                    <select value={idLayerSelected} className="w-full py-1 rounded-md text-gray-900 px-2 mb-2" onChange={handleLayerSelected}>
                        <option value={'0'} > -------- </option>
                        {layers_activos.length > 0 && layers_activos.map(layer => (
                            <option key={layer.layer_id} value={layer.layer_id}> {layer.etiqueta} </option>
                        ))}
                    </select>

                    {showSpinner && <Spinner />}

                    {fields.length > 0 && (
                        <>
                            <h1 className="text-base text-gray-900 text-center mt-2">Campos disponibles del layer</h1>
                            <h3 className="text-gray-900 text-center mb-2">Selecciona los campos que necesitas para filtrar</h3>
                        </>
                    )}

                    <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                        {fields.length > 0 && fields.sort().map((field, index) => (
                            <button key={index} disabled={showFilters} style={{ background: '#D1D5DB' }} id={field}
                                onClick={() => handleField(field)} className='w-5/12 px-4 text-gray-900 py-1 mb-1 rounded-md'>
                                {field.replaceAll('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {fieldsSelected.length > 0 && (
                        <div className='w-full mt-3 flex justify-center gap-4'>
                            {showFilters ? (
                                <button onClick={handleCleanSelection} className='bg-red-600 w-1/3 py-1 px-2 rounded-md hover:bg-red-500'>
                                    Limpiar selección
                                </button>
                            ) : (
                                <button onClick={handleAcceptFilters} className='bg-green-600 w-1/3 py-1 px-2 rounded-md hover:bg-green-500'>
                                    Aceptar
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {showFilters && filters.length === 0 && showSpinner && <Spinner />}

                {showFilters && (
                    <div className='w-9/12'>
                        {filters.length > 0 && filters.map((filter, index) => (
                            <div key={index} className="mb-2 w-full">
                                <p className="text-gray-900 ml-2">
                                    {Object.keys(filter)[0].replaceAll('_', ' ').toUpperCase()}
                                    <span className='text-emerald-600 text-sm ml-2'>
                                        ( Puedes seleccionar varios valores utilizando Ctrl + click )
                                    </span>
                                </p>
                                <select
                                    multiple
                                    className="text-gray-900 w-full h-32 px-2 py-1 rounded-md"
                                    value={filtersSelected[Object.keys(filter)[0]] || []}
                                    onChange={e => handleChangeFilterValue(e, Object.keys(filter)[0])}
                                >
                                    <option value="0">-------</option>
                                    {filter[Object.keys(filter)].length > 0 && filter[Object.keys(filter)].map(value => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>

                            </div>
                        ))}
                        {filters.length > 0 && (
                            <div className='w-6/12 mt-4 flex justify-center items-center'>
                                <button onClick={handleApplyFilters} className="py-1 px-4 bg-green-600">
                                    Aplicar filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* SI LOS FILTROS ESTAN APLICADOS MOSTRAMOS EL RESUMEN */}
                {dataFiltered.length > 0 && dataFiltered.map(data => (
                    <div className='text-gray-900'>
                        <h1 className="text-center mb-3 text-base font-semibold">Filtros aplicados</h1>
                        <h1 className="text-green-600 font-semibold"> LAYER: <span className='text-gray-900'> {data.layerSelected.etiqueta} </span></h1>
                        {Object.entries(data.data).map(value => (
                            <h1 className="text-green-600 font-semibold">{value[0].replaceAll('_', ' ').toUpperCase()} :
                                {value[1].length > 0 && value[1].map((val, index) => (
                                    <span key={index} className="text-gray-900"> {val} {index !== value[1].length - 1 ? ' - ' : ''} </span>
                                ))}
                                {value[1].length === 0 && <span className="text-gray-900"> {value[1]} </span>}
                            </h1>
                        ))}
                        <div className="mt-3 w-full flex justify-center">
                            <button onClick={() => handleDeleteFilter(data.layerSelected)} className="text-gray-100 bg-red-600 hover:bg-red-500 px-4 py-1 rounded-md">
                                Quitar Filtro
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Filtros