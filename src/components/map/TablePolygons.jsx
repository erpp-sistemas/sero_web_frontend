
// LIBRERIES
import Tooltip from '@mui/material/Tooltip';
import { CSVLink } from 'react-csv';

// ICONS
import { getIcon } from '../../data/Icons';


const TablePolygons = ({ polygons, setidUserSeleccionado, users, functions, data, nameFile, csvLinkRef }) => {

    console.log(polygons)
    return (
        <table className='w-full px-2 text-gray-900 text-center mt-2'>
            <tr className='bg-gray-700 font-bold text-white'>
                <th className="w-2/12">Nombre</th>
                <th className="w-2/12">Número de puntos</th>
                <th className="w-1/12">Área</th>
                <th className="w-1/12">Distancia</th>
                <th className="w-4/12">Usuario</th>
                <th className="w-2/12">Acciones</th>
            </tr>
            {polygons.map((poly, index) => (
                <tr className="rounded-md" style={index % 2 !== 0 ? { backgroundColor: '#dee2ea' } : {}}>
                    <td className='py-2'> {poly.name ? poly.name : 'Sin nombre'} </td>
                    <td> {poly.number_points} </td>
                    <td> {poly.area} </td>
                    <td> {poly.distancia ? poly.distancia.toFixed(2) + ' km' : <p className="text-red-700 font-bold">No trazada</p>} </td>
                    <td>
                        {poly.user ? (
                            <p className="text-center font-bold">{poly.user.nombre} {poly.user.apellido_paterno} {poly.user.apellido_materno} </p>
                        ) : (
                            <select name="usuario" id="usuario" className="w-2/3 text-gray-900 py-1 rounded px-1 mr-1"
                                onChange={e => setidUserSeleccionado(e.target.value)}
                            >
                                <option value="1">Selecciona un usuario</option>
                                {users.length > 0 && users.map(user => (
                                    <option value={user.id_usuario}>
                                        {user.nombre}  {user.apellido_paterno} {user.apellido_materno}
                                    </option>
                                ))}
                            </select>
                        )}
                    </td>
                    <td className="flex justify-center items-center gap-2 py-1">
                        <Tooltip placement="top" title="Zoom">
                            <button className="bg-cyan-600" onClick={() => functions.zoomToPolygon(poly.id)}>
                                {getIcon('ZoomInMapIcon', { color: 'white', fontSize: '26px' })}
                            </button>
                        </Tooltip>
                        <Tooltip placement="top" title="Descargar registros">
                            <button className="bg-cyan-600" onClick={() => functions.downloadPropertiesCsv(poly)}>
                                {getIcon('CloudDownloadIcon', { color: 'white', fontSize: '26px' })}
                            </button>
                        </Tooltip>
                        <CSVLink
                            data={data}
                            filename={nameFile}
                            className="hidden"
                            ref={csvLinkRef}
                        />
                        <Tooltip placement="top" title="Mostrar tabla">
                            <button className="bg-cyan-600" onClick={() => functions.generateGrid(poly)}>
                                {getIcon('ViewKanbanIcon', { color: 'white', fontSize: '26px' })}
                            </button>
                        </Tooltip>
                        {!poly.disabled_points ? (
                            <Tooltip placement="top" title="Sombrear">
                                <button className="bg-cyan-600" onClick={() => functions.disabledPointsSelected(poly)}>
                                    {getIcon('BrushIcon', { color: 'white', fontSize: '26px' })}
                                </button>
                            </Tooltip>
                        ) : (
                            <Tooltip placement="top" title="Quitar sombreado">
                                <button className="bg-red-600" onClick={() => functions.enablePointsBefore(poly)}>
                                    {getIcon('BrushIcon', { color: 'white', fontSize: '26px' })}
                                </button>
                            </Tooltip>
                        )}

                        {!poly.distancia ? (
                            <Tooltip placement="top" title="Generar ruta">
                                <button className="bg-cyan-600" onClick={() => functions.getRoute(poly)}>
                                    {getIcon('AltRouteIcon', { color: 'white', fontSize: '26px' })}
                                </button>
                            </Tooltip>
                        ) : (
                            <Tooltip placement="top" title="Quitar ruta">
                                <button className="bg-red-600" onClick={() => functions.deleteRoute(poly)}>
                                    {getIcon('AltRouteIcon', { color: 'white', fontSize: '26px' })}
                                </button>
                            </Tooltip>
                        )}
                        {!poly.user ? (
                            <Tooltip placement="top" title="Asignar usuario">
                                <button className="bg-cyan-600" onClick={() => functions.assigmentUser(poly)}>
                                    {getIcon('FaceIcon', { color: 'white', fontSize: '26px' })}
                                </button>
                            </Tooltip>
                        ) : (
                            <Tooltip placement="top" title="Quitar usuario">
                                <button className="bg-red-600" onClick={() => functions.deleteAssigmentUser(poly)}>
                                    {getIcon('FaceIcon', { color: 'white', fontSize: '26px' })}
                                </button>
                            </Tooltip>
                        )}

                    </td>
                </tr>
            ))}
        </table>
    )
}

export default TablePolygons