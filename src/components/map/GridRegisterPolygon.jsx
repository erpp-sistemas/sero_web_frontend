import { useState, useRef } from 'react'

// COMPONENTS
import ModalFieldChart from './ModalFieldChart';
import FloatingWindow from './FloatingWindow';

// LIBRERIES
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

// ICONS
import { getIcon } from '../../data/Icons';

const GridRegisterPolygon = ({ titles, colDefs, dataGrid }) => {

    const [showModalFieldChart, setShowModalFieldChart] = useState(false);
    const [windows, setWindows] = useState([]);
    const [type, setType] = useState('');

    const gridRef = useRef();


    const askField = (type) => {
        setShowModalFieldChart(true);
        setType(type)
    }

    const responseField = (res, field, option, fieldPlus) => {
        if (res) generateGraphic(field, option, fieldPlus);
        setShowModalFieldChart(false);
    }

    const generateGraphic = (field, option, fieldPlus) => {
        // const selectedRows = gridRef.current.api.getSelectedRows(); con esto agarramos solo la seleccion
        // console.log(selectedRows)
        const selectedRows = dataGrid;
        if (selectedRows.length > 0) {
            let data;
            if (option === '2') {
                data = groupDataSum(selectedRows, field, fieldPlus)
                if (!data) return alert("El segundo campo no es un número");
            } else {
                const countsObj = groupDataCount(selectedRows, field)
                data = Object.keys(countsObj).map(o => {
                    return {
                        name: o,
                        value: countsObj[o]
                    }
                })
            }

            const newWindow = {
                id: Date.now(),
                chartData: data,
                type: type,
                title: `Gráfico ${field.replace('_', ' ')} - ${option === '1' ? 'Conteo' : 'Suma'}`
            };

            setWindows([...windows, newWindow]);
        }
    };

    const groupDataCount = (arr, field) => {
        const countsObj = arr.reduce((acc, obj) => {
            const response = obj[field];
            if (acc[response]) {
                acc[response]++;
            } else {
                acc[response] = 1;
            }
            return acc;
        }, {});
        return countsObj
    }

    const groupDataSum = (data, field, fieldPlus) => {
        const rowFirst = data[0];
        if (isNaN(rowFirst[fieldPlus])) return undefined;
        const groupedData = data.reduce((acc, current) => {
            const response = current[field];
            const response2 = current[fieldPlus]
            // Si el tipo de usuario ya existe en el acumulador, sumamos el adeudo
            if (acc[response]) {
                acc[response] += response2;
            } else {
                // Si no existe, lo agregamos con el adeudo actual
                acc[response] = response2;
            }
            return acc;
        }, {});

        return Object.keys(groupedData).map(t => ({
            name: t,
            value: groupedData[t]
        }));

    }

    const closeWindow = (id) => setWindows(windows.filter((window) => window.id !== id));


    return (
        <div className='overflow-scroll'>
            {showModalFieldChart && (<ModalFieldChart fields={titles} setShowModal={setShowModalFieldChart} responseField={responseField} />)}
            <div
                className="ag-theme-quartz"
                style={{ height: 400, }}
            >
                <AgGridReact
                    ref={gridRef}
                    columnDefs={colDefs}
                    rowData={dataGrid}
                    rowSelection="multiple"
                />
            </div>
            <div className="flex justify-end">
                <div className="w-1/3 mt-4">
                    <div className="flex justify-center gap-3">
                        <button className='bg-blue-600 p-1 rounded w-36 hover:bg-blue-500' onClick={() => askField('bar')}>
                            {getIcon('BarChartIcon', { marginRight: '5px' })}
                            Bar
                        </button>
                        <button className='bg-blue-600 p-1 rounded w-36 hover:bg-blue-500' onClick={() => askField('pie')}>
                            {getIcon('PieChartIcon', { marginRight: '5px' })}
                            Pie
                        </button>
                    </div>
                    {windows.map((window) => (
                        <FloatingWindow
                            key={window.id}
                            chartData={window.chartData}
                            onClose={() => closeWindow(window.id)}
                            title={window.title}
                            type={window.type}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default GridRegisterPolygon