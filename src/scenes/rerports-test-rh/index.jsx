import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { getReportsTestRH } from '../../api/rh';
import { getIcon } from '../../data/Icons';

const App = () => {


    const [fechaInicial, setFechaInicial] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');

    const [selectedData, setSelectedData] = useState(null);
    const [open, setOpen] = useState(false);
    const [dataGrid, setDataGrid] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        if ([fechaInicial, fechaFinal].includes('')) return alert('Las fechas son obligatorias')
        setLoading(true);
        getReportsTestRH(fechaInicial, fechaFinal)
            .then(data => {
                setDataGrid(data)
                setLoading(false);
            })
            .catch(error => console.error(error));
    }

    // Columnas del DataGrid
    const columns = [
        { field: "name", headerName: "Nombre", flex: 1 },
        { field: "paternal_surname", headerName: "Apellido Paterno", flex: 1 },
        { field: "maternal_surname", headerName: "Apellido Materno", flex: 1 },
        { field: "curp", headerName: "CURP", flex: 1 },
        { field: "schooling", headerName: "Escolaridad", flex: 1 },
        { field: "birthdate", headerName: "Fecha de Nacimiento", flex: 1 },
        {
            field: "actions",
            headerName: "Acciones",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: '#0000A5', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => handleOpen(params.row)}
                >
                    {getIcon('BarChartIcon', {})}
                    Ver Gráfica
                </Button>
            ),
        },
    ];

    // Manejar apertura del modal
    const handleOpen = (row) => {
        setSelectedData(row);
        setOpen(true);
    };

    // Manejar cierre del modal
    const handleClose = () => {
        setOpen(false);
        setSelectedData(null);
    };

    // Configuración del gráfico
    const chartData = selectedData
        ? [
            { category: "Social", value: selectedData.social },
            { category: "Político", value: selectedData.politico },
            { category: "Económico", value: selectedData.economico },
            { category: "Religioso", value: selectedData.religioso },
            { category: "Moral", value: selectedData.moral },
            { category: "Legalidad", value: selectedData.legalidad },
            { category: "Indiferencia", value: selectedData.indiferencia },
            { category: "Corrupto", value: selectedData.corrupto },
        ]
        : [];

    return (
        <div style={{ height: 400, width: "90%", margin: "0 auto" }}>

            <h1 className="text-lg font-semibold">Usuarios que han realizado el test Zavic</h1>

            <div className="mb-4 flex items-center gap-4">
                <div className='w-3/12 mt-2 '>
                    <h1 className="text-base mt-1 mb-2">* Fecha inicial: </h1>
                    <input type="date" className='w-full p-2 text-black rounded-md shadow-md' onChange={e => setFechaInicial(e.target.value)} />
                </div>

                <div className='w-3/12 mt-2 '>
                    <h1 className="text-base mt-1 mb-2">* Fecha final: </h1>
                    <input type="date" className='w-full p-2 text-black rounded-md shadow-md' onChange={e => setFechaFinal(e.target.value)} />
                </div>
                <button className="bg-green-600 px-10 self-end py-2 rounded-md text-white uppercase hover:bg-green-500 transition-all duration-1000 flex items-center gap-2" onClick={getData}>
                    {getIcon('FilterAltIcon', {})}
                    Buscar
                </button>
                <a className="bg-blue-600 px-10 self-end py-2 rounded-md text-white uppercase hover:bg-blue-500 transition-all duration-1000 flex items-center gap-2 cursor-pointer" href="https://test-rh-d1331.web.app/" target="_blank">
                    {getIcon('CheckCircleIcon', {})}
                    Nuevo
                </a>
            </div>

            {loading && (
                <div className="bg-green-200 py-2 rounded-md">
                    <h1 className="text-lg text-gray-900 px-4">Buscando...</h1>
                </div>
            )}

            {dataGrid.length > 0 && (
                <DataGrid rows={dataGrid} columns={columns} pageSize={5} />
            )}

            {/* Modal para mostrar el gráfico */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 900,
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2>Gráfico de {selectedData?.name}</h2>
                    <div style={{ height: 300 }}>
                        <ResponsiveBar
                            data={chartData}
                            keys={["value"]}
                            indexBy="category"
                            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                            padding={0.3}
                            valueScale={{ type: "linear" }}
                            indexScale={{ type: "band", round: true }}
                            colors={{ scheme: 'accent' }}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Categoría",
                                legendPosition: "middle",
                                legendOffset: 40,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Valor",
                                legendPosition: "middle",
                                legendOffset: -50,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                            animate={true}
                            tooltip={d => {
                                return (
                                    <div style={{ width: '200px', padding: '5px 20px', backgroundColor: '#fffafa', borderRadius: '10px', color: '#000000', textAlign: 'center' }}>
                                        <div style={{ width: '10px', height: '10px', marginRight: '10px', backgroundColor: d.color, display: 'inline-block' }}></div>
                                        <h4 style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                            {d.indexValue.replaceAll('_', ' ')} - {d.formattedValue}
                                        </h4>
                                    </div>
                                )
                            }}
                        />
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default App;
