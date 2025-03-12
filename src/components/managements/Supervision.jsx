import React from "react";
import StatsCards from '../../components/managements/Supervision/statsCards.jsx'
import SupervisionsPerUser from './Supervision/SupervisionsPerUser.jsx'
import DailyActivitySummary from './Supervision/DailyActivitySummary.jsx'

function Supervision({data}) {
  console.log(data)
  return (
    <div className="w-full text-white">
      {/* Primera Fila: 3 Contenedores de Ancho Completo */}
      <div className="w-full pb-3 rounded-lg shadow-md">
        <StatsCards data={data}/>
      </div>

      <div className="w-full p-6 rounded-lg shadow-md">
        <SupervisionsPerUser data={data}/>
      </div>

      <div className="w-full p-6 rounded-lg shadow-md">
        <DailyActivitySummary data={data}/>
      </div>
    </div>
  );
}

export default Supervision;
