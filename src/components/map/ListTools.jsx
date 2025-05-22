
// COMPONENTS
import { getIcon } from '../../data/Icons';



const listTools = [
    {
        title: 'Cambio de color',
        icon: 'ColorLensIcon'
    },
    {
        title: 'Dibujar poligono',
        icon: 'PolylineIcon'
    },
    {
        title: 'Mapa de calor',
        icon: 'FiberSmartRecordIcon'
    },
    {
        title: 'Seguimiento gestores',
        icon: 'GpsFixedIcon'
    },
    {
        title: 'Ruta gestor',
        icon: 'PlaceIcon'
    },
    {
        title: 'Notificación',
        icon: 'NotificationsOutlinedIcon'
    },
    {
        title: 'Filtros',
        icon: 'FilterAltIcon'
    },
    // {
    //     title: 'Actualización',
    //     icon: 'RepeatIcon'
    // },
    // {
    //     title: 'Asignación',
    //     icon: 'DiscountIcon'
    // }
]


const ListTools = ({ handleCheckTool }) => {


    return (
        <>
            <div className="w-11/12 mx-auto bg-gray-900 h-1 rounded-md mb-4 opacity-50"></div>

            <div className="flex flex-wrap gap-6 justify-center font-mono">

                {listTools.length > 0 && listTools.map((tool, index) => (
                    <button key={index} className="bg-neutral-50 text-gray-900 border-r-2 border-cyan-600 px-4 py-1 rounded-md flex gap-2 flex-col items-center justify-center w-1/4 shadow-lg hover:bg-slate-300 duration-300"
                        onClick={() => handleCheckTool(tool.title)}
                    >
                        {getIcon(tool.icon, { fontSize: '30px', color: 'blue' })}
                        {tool.title}
                    </button>
                ))}

            </div>
        </>
    )
}

export default ListTools