import React, { useState  } from "react";
import StatsCards from '../../components/managements/Supervision/statsCards.jsx'
import SupervisionsPerUser from './Supervision/SupervisionsPerUser.jsx'
import SupervisionsPerManager from './Supervision/SupervisionsPerManager.jsx'
import DailyActivitySummary from './Supervision/DailyActivitySummary.jsx'
import FieldSelector from './Supervision/FieldSelector.jsx'

function Supervision({data}) {
  console.log(data)
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  const [selectedFields, setSelectedFields] = useState([]);

  const handleFieldSelectionChange = (fields) => {
    setSelectedFields(fields);
    console.log(fields)
  };
  return (
    <div className="w-full text-white">
       <div className="w-full p-4 rounded-lg shadow-md mb-4">
        <FieldSelector data={data} onSelectionChange={handleFieldSelectionChange} />
      </div>
      {/* Primera Fila: 3 Contenedores de Ancho Completo */}
      <div className="w-full pb-3 rounded-lg shadow-md">
        <StatsCards data={data} selectedFields={selectedFields}/>
      </div>

      <div className="w-full p-6 rounded-lg shadow-md">
        <SupervisionsPerUser data={data}  selectedFields={selectedFields}/>
      </div>

      <div className="w-full p-6 rounded-lg shadow-md">
        <SupervisionsPerManager data={data}  selectedFields={selectedFields}/>
      </div>
    </div>
  );
}

export default Supervision;
