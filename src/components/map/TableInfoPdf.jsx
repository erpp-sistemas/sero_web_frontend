import React from 'react'

const TableInfoPdf = ({ data }) => {


    return (
        <>
            {data.serviciosUnicos.length > 0 && (
                <table className='text-gray-900 w-full text-center' >
                    <thead>
                        <tr className='bg-gray-600 text-blue-200'>
                            <th className="bg-emerald-500 text-gray-900 px-1"> Uso </th>
                            {data.serviciosUnicos.map(servicio => (
                                <th className="border border-black px-1" key={servicio} colSpan="2">{servicio}</th>
                            ))}
                            <th className='border border-black px-1' colSpan="2">TOTAL</th>
                        </tr>
                        <tr className='bg-gray-400'>
                            <th></th>
                            {data.serviciosUnicos.map(servicio => (
                                <>
                                    <th className='border border-black px-1' key={`${servicio}-count`}>Número</th>
                                    <th className='border border-black px-1' key={`${servicio}-sum`}>Adeudo</th>
                                </>
                            ))}
                            <th className='border border-black px-1'>Número</th>
                            <th className='border border-black px-1'>Adeudo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data.resultado).map(tipoUsuario => (
                            <tr key={tipoUsuario}>
                                <td className="border border-black font-bold">{tipoUsuario}</td>
                                {data.serviciosUnicos.map(servicio => (
                                    <>
                                        <td className='border border-y-black border-l-black border-r-cyan-500 px-1' key={`${tipoUsuario}-${servicio}-count`}>
                                            {data.resultado[tipoUsuario].servicios[servicio]?.count || 0}
                                        </td>
                                        <td className='border border-y-black border-r-black border-l-cyan-500 px-1' key={`${tipoUsuario}-${servicio}-sum`}>
                                            {data.resultado[tipoUsuario].servicios[servicio]?.sum.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0}
                                        </td>
                                    </>
                                ))}
                                <td className='border border-y-black border-l-black border-r-cyan-500 px-1'>{data.resultado[tipoUsuario].totalCount}</td>
                                <td className='border border-y-black border-r-black border-l-cyan-500 px-1'>{data.resultado[tipoUsuario].totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr className='bg-gray-200'>
                            <td></td>
                            {data.serviciosUnicos.map(servicio => (
                                <>
                                    <td className='border border-black' key={`total-${servicio}-count`}><strong>{data.totales[servicio]?.totalCount || 0}</strong></td>
                                    <td className='border border-black' key={`total-${servicio}-sum`}><strong>{data.totales[servicio]?.totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0}</strong></td>
                                </>
                            ))}
                            <td className="border border-black"><strong>{data.totalGeneral.totalCount}</strong></td>
                            <td className="border border-black"><strong>{data.totalGeneral.totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </>
    )
}

export default TableInfoPdf