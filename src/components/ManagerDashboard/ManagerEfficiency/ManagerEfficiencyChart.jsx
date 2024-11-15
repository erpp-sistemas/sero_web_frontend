import React, { useState, useEffect } from "react";
import { Box, Button, useTheme } from "@mui/material";
import * as ExcelJS from "exceljs";
import ResponsiveLineChart from "../../../components/Charts/NivoCharts/ResponsiveLineChart.jsx";
import { tokens } from "../../../theme.js";
import { GetApp } from "@mui/icons-material";

function ManagerEfficiency({ data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) {
    return null;
  } 
  
  const [chartData, setChartData] = useState([]);

  const convertMinutesToHours = (minutes) => {
    if (minutes < 60) {
      // Si los minutos son menores a 60, devolver solo los minutos como un valor decimal
      return `0.${minutes.toString().padStart(2, "0")}`;
    }
  
    const horas = Math.floor(minutes / 60); // Obtener las horas completas
    const minutosRestantes = minutes % 60; // Obtener los minutos restantes
  
    // Asegurarnos de que los minutos restantes se muestren correctamente como un número entero de dos dígitos
    const minutosFraccion = minutosRestantes.toString().padStart(2, "0");
  
    return `${horas}.${minutosFraccion}`; // Devuelve el valor en formato hh.mm
  };  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString();
    return `${datePart} ${timePart}`;
  };

  // useEffect para procesar los datos y preparar la información para la gráfica
  useEffect(() => {
    if (data) {
      // Agrupar datos y calcular tiempo muerto por gestor
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.gestor]) {
          acc[item.gestor] = { tiempoMuerto: 0, fechas: new Set() };
        }

        acc[item.gestor].tiempoMuerto += item.tiempo_muerto; // Acumular tiempo muerto

        // Extraer solo la fecha en formato "YYYY-MM-DD" (sin hora)
        const soloFecha = item.fecha_captura.split("T")[0]; // Considera que la fecha podría estar en formato ISO
        acc[item.gestor].fechas.add(soloFecha); // Agregar solo la fecha al conjunto

        return acc;
      }, {});

      // Crear las series de datos para la gráfica
      let tiempoMuertoData = [];
      let horasEsperadasData = [];

      Object.entries(groupedData).forEach(
        ([gestor, { tiempoMuerto, fechas }]) => {
          const diasTrabajados = fechas.size; // Número de días únicos
          const horasEsperadas = diasTrabajados * 8; // Calcular horas esperadas

          const tiempoMuertoFormateado = convertMinutesToHours(tiempoMuerto);          
          tiempoMuertoData.push({ x: gestor, y: tiempoMuertoFormateado }); // Convertir minutos a horas
          horasEsperadasData.push({ x: gestor, y: horasEsperadas });
        }
      );

      // Ordenar tiempoMuertoData de mayor a menor basado en el valor 'y'
      tiempoMuertoData.sort((a, b) => b.y - a.y);

      // Ordenar horasEsperadasData de acuerdo al mismo orden de tiempoMuertoData
      horasEsperadasData.sort((a, b) => {
        const gestorA = a.x;
        const gestorB = b.x;
        const indexA = tiempoMuertoData.findIndex((item) => item.x === gestorA);
        const indexB = tiempoMuertoData.findIndex((item) => item.x === gestorB);
        return indexA - indexB; // Asegura que ambos arrays estén sincronizados
      });

      // Configurar los datos de la gráfica con ambas series
      setChartData([
        {
          id: "Tiempo Muerto",
          color: colors.greenAccent[500],
          data: tiempoMuertoData,
        },
        {
          id: "Horas Esperadas",
          color: colors.blueAccent[500],
          data: horasEsperadasData,
        },
      ]);
    }
  }, [data]);

  // Función para exportar a Excel con datos originales y datos de la gráfica
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
  
    // Crear la primera hoja: Datos originales
    const worksheetOriginal = workbook.addWorksheet("Datos Originales");
    worksheetOriginal.columns = [
      { header: "Gestor", key: "gestor", width: 30 },
      { header: "Cuenta", key: "cuenta", width: 15 },
      { header: "ID Tarea", key: "id_tarea", width: 10 },
      { header: "Fecha Captura", key: "fecha_captura", width: 20 },
      { header: "Fecha Anterior", key: "fecha_anterior", width: 20 },
      { header: "Diferencia Minutos", key: "diferencia_minutos", width: 20 },
      { header: "Tiempo Muerto", key: "tiempo_muerto", width: 15 },
    ];
  
    // Dar color azul a los nombres de las columnas
    worksheetOriginal.getRow(1).eachCell((cell) => {
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true }; // Color del texto blanco y negrita
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000FF" }, // Fondo azul
      };
    });
  
    // Ordenar los datos por 'gestor' y luego por 'fecha_captura' de manera descendente
    const sortedData = data.sort((a, b) => {
      if (a.gestor < b.gestor) return -1;
      if (a.gestor > b.gestor) return 1;
      return new Date(a.fecha_captura) - new Date(b.fecha_captura); // Orden descendente por fecha_captura
    });
  
    // Añadir los datos ordenados a la hoja
    sortedData.forEach((item) => {
      worksheetOriginal.addRow({
        gestor: item.gestor,
        cuenta: item.cuenta,
        id_tarea: item.id_tarea,
        fecha_captura: formatDate(item.fecha_captura),
        fecha_anterior: formatDate(item.fecha_anterior),
        diferencia_minutos: item.diferencia_minutos,
        tiempo_muerto: item.tiempo_muerto,
      });
    });
  
    // Crear la segunda hoja: Datos de la gráfica
    const worksheetGrafica = workbook.addWorksheet("Datos de la Gráfica");
    worksheetGrafica.columns = [
      { header: "Gestor", key: "gestor", width: 30 },
      { header: "Tiempo Muerto (Horas)", key: "tiempo_muerto", width: 20 },
      { header: "Horas Estimadas", key: "horas_estimadas", width: 20 },
    ];
  
    // Dar color azul a los nombres de las columnas
    worksheetGrafica.getRow(1).eachCell((cell) => {
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true }; // Color del texto blanco y negrita
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000FF" }, // Fondo azul
      };
    });
  
    // Añadir los datos de la gráfica a la segunda hoja
    chartData[0]?.data.forEach((item, index) => {
      worksheetGrafica.addRow({
        gestor: item.x,
        tiempo_muerto: item.y,
        horas_estimadas: chartData[1]?.data[index]?.y,
      });
    });
  
    // Generar el archivo Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EficienciaGestores.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "400px",
        p: 2,
        borderRadius: "10px",
      }}
    >
      <Box
        mt={2}
        mb={2}
        display="flex"
        justifyContent="flex-start" // Alinea el contenido a la izquierda
        width="100%" // Asegura que el contenedor ocupe todo el ancho
      >
        <Button
          variant="outlined"
          color="warning"
          onClick={exportToExcel}
          style={{ marginLeft: "16px" }}
          startIcon={<GetApp />}
        >
          Exportar en Excel
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(128, 128, 128, 0.1)",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {chartData.length > 0 && (
          <ResponsiveLineChart
            data={chartData}
            lineColor={colors.greenAccent[500]}
            showLegend={true}
            tooltipFormat={"#,.2f"}
            margin={{ top: 30, right: 120, bottom: 150, left: 100 }}
            axisBottomLegend=""
            axisLeftLegend={"Horas"}
            axisLeftLegendOffset={-85}
            backgroundColor="paper"
            enableArea={true}
            areaOpacity={0.3}
            areaBaselineValue={0}
            tickRotation={45}
            axisLeftFormat={""}
          />
        )}
      </Box>
    </Box>
  );
}

export default ManagerEfficiency;
