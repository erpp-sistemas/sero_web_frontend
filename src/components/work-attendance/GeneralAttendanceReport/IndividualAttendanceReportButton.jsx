import React from 'react';
import Button from '@mui/material/Button';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

const IndividualAttendanceReportButton = ({ data }) => {
  dayjs.extend(isSameOrBefore);

  const generateAttendanceReport = async () => {
    const workbook = new ExcelJS.Workbook();

    // Crear un mapa de usuarios con sus registros
    const usuariosMap = new Map();

    data.forEach((record) => {
      if (!usuariosMap.has(record.usuario)) {
        usuariosMap.set(record.usuario, []);
      }
      usuariosMap.get(record.usuario).push(record);
    });

    // Función para generar un rango de fechas desde una fecha inicial hasta una final
    const generateDateRange = (startDate, endDate) => {
      const dates = [];
      let currentDate = dayjs(startDate);
      const lastDate = dayjs(endDate);

      while (currentDate.isSameOrBefore(lastDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
      }

      return dates;
    };

    // Crear una hoja por cada usuario con sus registros de asistencia
    usuariosMap.forEach((userRecords, userName) => {
      const sheet = workbook.addWorksheet(userName);

      // Agregar el nombre del usuario en la primera celda
      sheet.getCell('A1').value = `Usuario: ${userName}`;
      sheet.getCell('A1').font = { bold: true, size: 14 };

      // Agregar un título grande para el reporte de asistencia
      sheet.getCell('A2').value = 'Reporte de Asistencia';
      sheet.getCell('A2').font = { bold: true, size: 18 };
      sheet.getCell('A2').alignment = { horizontal: 'center' };
      sheet.mergeCells('A2:E2');

      // Ordenar los registros por fecha para asegurar una secuencia adecuada
      userRecords.sort((a, b) => new Date(a.fecha_captura) - new Date(b.fecha_captura));

      // Obtener el rango de fechas desde la fecha más temprana hasta la más tardía
      const startDate = userRecords[0]?.fecha_captura;
      const endDate = userRecords[userRecords.length - 1]?.fecha_captura;
      const fullDateRange = generateDateRange(startDate, endDate);

      // Crear encabezados de columna a partir de la fila 3
      const headers = [
        'Fecha Captura',
        'Hora Entrada',
        'Hora Salida',
        'Retardos',
        'Faltas',
        'Observaciones',
      ];

      sheet.addRow([]); // Fila vacía para separar el título
      const headerRow = sheet.addRow(headers);

      // Resaltar los títulos de las columnas
      headerRow.font = { bold: true, size: 12 };
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFBFEFFF' },
        };
      });

      let totalRetardos = 0;
      let totalFaltas = 0;

      // Generar filas con la secuencia completa de fechas
      fullDateRange.forEach((date) => {
        const recordForDate = userRecords.find((record) => record.fecha_captura === date);
        const isSunday = dayjs(date).day() === 0; // 0 indica que es domingo

        const retardo = recordForDate?.estatus_entrada === 'Retardo' ? 1 : 0;
        const falta = recordForDate?.estatus_entrada === 'Falta' || recordForDate?.estatus_salida === 'Falta' ? 1 : 0;

        totalRetardos += retardo;
        totalFaltas += falta;

        const horaEntrada = isSunday ? 'Descanso' : recordForDate?.hora_entrada || '';
        const horaSalida = isSunday ? 'Descanso' : recordForDate?.hora_salida || '';

        const row = [
          date,
          horaEntrada,
          horaSalida,
          retardo,
          falta,
          '',
        ];

        const excelRow = sheet.addRow(row);

        // Resaltar las celdas de hora_entrada y hora_salida en azul si es domingo
        if (isSunday) {
          excelRow.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCE5FF' }, // Color azul
          };
          excelRow.getCell(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCE5FF' }, // Color azul
          };
        }

        // Resaltar en rojo cuando estatus_entrada es 'Falta'
        if (recordForDate?.estatus_entrada === 'Falta') {
          excelRow.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFC7CE' }, // Color rojo
          };
          excelRow.getCell(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFC7CE' }, // Color rojo
          };
        }

        // Resaltar en naranja cuando estatus_entrada es 'Retardo'
        if (recordForDate?.estatus_entrada === 'Retardo') {
          excelRow.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFE699' }, // Color naranja
          };
          excelRow.getCell(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFE699' }, // Color naranja
          };
        }
      });

      // Agregar el resumen de retardos, faltas y descuentos al final de la hoja
      sheet.addRow([]); // Fila vacía antes del resumen
      const resumenHeaderRow = sheet.addRow(['Resumen de Asistencia']);
      resumenHeaderRow.font = { bold: true, size: 14 };
      resumenHeaderRow.alignment = { horizontal: 'center' };
      sheet.mergeCells(`A${resumenHeaderRow.number}:E${resumenHeaderRow.number}`);

      const totalDescuentos = Math.floor(totalRetardos / 3); // Cada 3 retardos es 1 descuento

      // Agregar las filas del resumen con totales
      sheet.addRow(['Total de Retardos', totalRetardos]);
      sheet.addRow(['Total de Faltas', totalFaltas]);
      sheet.addRow(['Total de Descuentos', totalDescuentos]);
    });

    // Ajustar el ancho de las columnas
    usuariosMap.forEach((_, userName) => {
      const sheet = workbook.getWorksheet(userName);
      if (sheet) {
        sheet.columns.forEach((column) => {
          column.width = 20; // Ajusta el ancho de las columnas aquí
        });
      }
    });

    // Guardar el archivo
    const fileName = 'reporte_asistencia_individual.xlsx';
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button variant="outlined" color="warning" onClick={generateAttendanceReport}>
      Reporte Individual 
    </Button>
  );
};

export default IndividualAttendanceReportButton;
