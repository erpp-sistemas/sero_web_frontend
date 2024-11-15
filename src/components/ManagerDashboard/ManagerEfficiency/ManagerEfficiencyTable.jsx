import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";

// Función para convertir minutos a horas y minutos en formato "hh:mm"
const convertMinutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

// Función para extraer solo la hora de una fecha
const extractTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Función para formatear las fechas a "dd/mm/yyyy, hh:mm:ss a.m./p.m."
const formatDateWithTime = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "p.m." : "a.m.";
  const hour12 = hours % 12 || 12;

  return `${day}/${month}/${year}, ${hour12}:${minutes}:${seconds} ${ampm}`;
};

const ManagerEfficiencyTable = ({ data }) => {
  // Procesar los datos para obtener los gestores únicos y sus estadísticas
  const processedData = useMemo(() => {
    const managerStats = {};

    data.forEach((item) => {
      const { gestor, tiempo_muerto, diferencia_minutos, fecha_captura, fecha_anterior } = item;

      if (!managerStats[gestor]) {
        managerStats[gestor] = {
          gestor,
          tiempoMuertoTotal: 0,
          fechasUnicas: new Set(),
          diferenciaMinutosTotal: 0,
          registros: 0,
          horaMinima: fecha_captura,
          horaMaxima: fecha_captura,
          tiempoMuertoMasGrande: tiempo_muerto,
          fechasMaxTiempoMuerto: `${formatDateWithTime(fecha_anterior)} - ${formatDateWithTime(fecha_captura)}`,
        };
      }

      managerStats[gestor].tiempoMuertoTotal += tiempo_muerto;
      managerStats[gestor].diferenciaMinutosTotal += diferencia_minutos;
      managerStats[gestor].registros += 1;
      managerStats[gestor].fechasUnicas.add(new Date(fecha_captura).toDateString());

      // Actualizar el tiempo muerto más grande y las fechas asociadas
      if (tiempo_muerto > managerStats[gestor].tiempoMuertoMasGrande) {
        managerStats[gestor].tiempoMuertoMasGrande = tiempo_muerto;

        // Aquí hacemos la comparación entre las fechas
        const fecha1 = new Date(fecha_captura);
        const fecha2 = new Date(fecha_anterior);

        // Comparamos las fechas y aseguramos que la más reciente se muestre primero
        if (fecha1 > fecha2) {
          managerStats[gestor].fechasMaxTiempoMuerto = `${formatDateWithTime(fecha_captura)} - ${formatDateWithTime(fecha_anterior)}`;
        } else {
          managerStats[gestor].fechasMaxTiempoMuerto = `${formatDateWithTime(fecha_anterior)} - ${formatDateWithTime(fecha_captura)}`;
        }
      }

      // Actualizamos las horas mínima y máxima
      if (new Date(fecha_captura) < new Date(managerStats[gestor].horaMinima)) {
        managerStats[gestor].horaMinima = fecha_captura;
      }
      if (new Date(fecha_captura) > new Date(managerStats[gestor].horaMaxima)) {
        managerStats[gestor].horaMaxima = fecha_captura;
      }
    });

    return Object.values(managerStats).map((stat, index) => {
      const diasTrabajados = stat.fechasUnicas.size;
      const promedioTiempoMuertoPorDia = stat.tiempoMuertoTotal / diasTrabajados || 0;
      const promedioRegistrosPorDia = stat.registros / diasTrabajados || 0;
      const promedioMinutosPorGestion = stat.diferenciaMinutosTotal / stat.registros || 0; // Promedio de minutos por gestión

      return {
        id: `${stat.gestor}-${index}`,
        gestor: stat.gestor,
        tiempoMuertoMinutos: stat.tiempoMuertoTotal,
        tiempoMuertoHoras: convertMinutesToHours(stat.tiempoMuertoTotal),
        promedioTiempoMuertoPorDia: convertMinutesToHours(promedioTiempoMuertoPorDia),
        promedioRegistrosPorDia: promedioRegistrosPorDia,
        totalRegistros: stat.registros,
        horaMinima: extractTime(stat.horaMinima),
        horaMaxima: extractTime(stat.horaMaxima),
        tiempoMuertoMasGrande: stat.tiempoMuertoMasGrande,
        fechasMaxTiempoMuerto: stat.fechasMaxTiempoMuerto,
        promedioMinutosPorGestion: promedioMinutosPorGestion, // Agregar campo de promedio de minutos por gestión
      };
    })
    .sort((a, b) => b.tiempoMuertoMinutos - a.tiempoMuertoMinutos);
  }, [data]);

  // Columnas para el DataGrid
  const columns = [
    { field: "gestor", headerName: "Gestor", width: 200 },
    { field: "tiempoMuertoMinutos", headerName: "TM (Minutos)", width: 100, type: "number" },
    { field: "tiempoMuertoHoras", headerName: "TM (Horas)", width: 100, type: "number" },
    { field: "promedioTiempoMuertoPorDia", headerName: "Prom. TM/Día", width: 100, type: "number" },
    { field: "tiempoMuertoMasGrande", headerName: "TM Más Grande", width: 100, type: "number" },
    { field: "fechasMaxTiempoMuerto", headerName: "Fechas TM Más Grande", width: 310 },
    { field: "promedioMinutosPorGestion", headerName: "Prom. Minutos x Gestión", width: 150, type: "number" }, // Nueva columna
    { field: "promedioRegistrosPorDia", headerName: "Prom. Registros/Día", width: 130, type: "number" },
    { field: "totalRegistros", headerName: "Total Registros", width: 100, type: "number" },
    { field: "horaMinima", headerName: "Hora Más Pequeña", width: 120 },
    { field: "horaMaxima", headerName: "Hora Más Grande", width: 120 },        
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid        
        getRowId={(row) => row.id}
        rows={processedData}
        columns={columns}
        pageSize={5}
        rowHeight={40}
      />
    </div>
  );
};

export default ManagerEfficiencyTable;
