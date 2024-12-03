import { useState, useEffect } from 'react'

// COMPONENTS
import SelectLayer from './SelectLayer';
import { getIcon } from '../../data/Icons';
import ModalQuestion from '../../components/modals/ModalQuestion';

// LIBRERIES
import { useSelector } from 'react-redux';

// SERVICES
import { getAllTasks } from '../../api/task';
import { getAllProcesses } from '../../api/process';


const Asignacion = ({ data }) => {

    const features = useSelector((state) => state.features);
    const { layers_activos } = features;
    const mapa_activo = useSelector((state) => state.mapa);
    const { mapa } = mapa_activo;

    const [idLayerSeleccionado, setIdLayerSeleccionado] = useState();
    const [layerSeleccionado, setLayerSeleccionado] = useState({});
    const [processes, setProcesses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [tasksProcess, setTasksProcess] = useState([]);

    const [nameProject, setNameProject] = useState('');
    const [processSelected, setProcessSelected] = useState(0);
    const [taskSelected, setTaskSelected] = useState({});


    const [showModalQuestion, setModalQuestion] = useState(false);


    useEffect(() => {
        const selectedLayer = layers_activos.filter(layer => layer.layer_id === Number(idLayerSeleccionado))[0];
        setLayerSeleccionado(selectedLayer || {});
        getProcessAndTask();
    }, [idLayerSeleccionado, layers_activos]);

    useEffect(() => {
        if (processSelected > 0) validateTasksByProcess();
    }, [processSelected]);

    const getProcessAndTask = async () => {
        const processes_db = getAllProcesses();
        const tasks_db = getAllTasks();
        const promise = await Promise.all([processes_db, tasks_db]);
        setProcesses(promise[0].filter( pr => pr.activo));
        setTasks(promise[1].filter(pr => pr.activo));
    }

    const validateTasksByProcess = () => {
        const task_by_process = tasks.filter(task => task.id_proceso === processSelected);
        setTasksProcess(task_by_process)
    }

    const handleTaskSelected = (e) => {
        const task_selected = tasks.filter(task => task.id_tarea === Number(e.target.value))[0];
        setTaskSelected(task_selected);
    }

    const handleAcetp = () => {
        // todo mandar mensaje comentado si estan conrrectos los parametros
        const layer = mapa.getLayer(layerSeleccionado.layer_id.toString());
        if (!layer) return alert("El layer no esta cargado en el mapa");
        if (mapa.getLayoutProperty(layerSeleccionado.layer_id.toString(), 'visibility') === 'none') return alert("El layer debe de estar prendido");
    }

    const handleRespModalQuestion = (res) => {
        console.log(res);
    }


    return (
        <div className="py-2 px-10 flex flex-col items-center">

            {showModalQuestion && <ModalQuestion title={''} handleRespuesta={handleRespModalQuestion} />}

            <div className='w-10/12'>
                <div className='flex w-full items-center mb-2'>
                    {getIcon('LayersIcon', { fontSize: '30px', color: 'green' })}
                    <h1 className="text-base text-gray-900 font-semibold px-2"> Layer para la asignación </h1>
                </div>
                <SelectLayer features={features} setIdLayerSeleccionado={setIdLayerSeleccionado} />
            </div>

            {/* {Object.keys(layerSeleccionado).length > 0 && <h3 className="text-gray-900 mt-4 text-base font-semibold"> {layerSeleccionado.etiqueta} </h3>} */}

            {Object.keys(layerSeleccionado).length > 0 && (
                <div className='mt-4 w-10/12'>

                    <div className='flex w-full items-center mb-2'>
                        {getIcon('ArticleIcon', { fontSize: '30px', color: 'green' })}
                        <h1 className="text-base text-gray-900 font-semibold px-2"> Nombre del proyecto </h1>
                    </div>
                    <input className="py-2 px-4 w-full mb-4 rounded-md text-gray-900" type="text" placeholder="Proyecto asignación 1era carta"
                        onChange={e => setNameProject(e.target.value)} />

                    <div className='flex w-full items-center mb-2'>
                        {getIcon('LineWeightIcon', { fontSize: '30px', color: 'green' })}
                        <h1 className="text-base text-gray-900 font-semibold px-2"> Proceso </h1>
                    </div>
                    <select name="proceso" id="proceso" className="w-full py-2 rounded-md mb-4 text-gray-900 px-4"
                        onChange={e => setProcessSelected(Number(e.target.value))}
                    >
                        <option value="0">Selecciona el proceso</option>
                        {processes.length > 0 && processes.map(process => (
                            <option value={process.id_proceso}> {process.nombre} </option>
                        ))}
                    </select>

                    <div className='flex w-full items-center mb-2'>
                        {getIcon('BackupTableIcon', { fontSize: '30px', color: 'green' })}
                        <h1 className="text-base text-gray-900 font-semibold px-2"> Tarea para la asignación </h1>
                    </div>

                    <select name="" id="" className="w-full py-2 rounded-md text-gray-900 px-4"
                        onChange={handleTaskSelected}
                    >
                        <option value="">Selecciona la tarea</option>
                        {tasksProcess.length > 0 && tasksProcess.map(task => (
                            <option value={task.id_tarea}> {task.nombre} </option>
                        ))}
                    </select>

                    <button className='w-1/3 py-2 bg-emerald-600 mt-4 rounded-md flex justify-center items-center gap-2
                hover:bg-emerald-500' onClick={handleAcetp}>
                        {getIcon('CheckCircleIcon', {})}
                        Validar
                    </button>
                </div>
            )}



        </div>
    )
}

export default Asignacion