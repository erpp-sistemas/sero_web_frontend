import React from "react";
import Button from "@mui/material/Button";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Download } from "@mui/icons-material";
import ERPPImage from "../../../../public/ERPP.jpg";

const IndividualAttendanceReportButton = ({ data }) => {
  dayjs.extend(isSameOrBefore);

  const generateAttendanceReport = async () => {
    const workbook = new ExcelJS.Workbook();

    // Convertir imagen en base64
    const imageResponse = await fetch(ERPPImage);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

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
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, "day");
      }

      return dates;
    };

    // Crear una hoja por cada usuario con sus registros de asistencia
    usuariosMap.forEach((userRecords, userName) => {
      const sheet = workbook.addWorksheet(userName);

      // Agregar la imagen al workbook
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: "png",
      });

      // Posicionar la imagen (3 columnas de ancho, 5 filas de alto)
      sheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Top-left corner
        br: { col: 2, row: 5 }, // Bottom-right corner
      });

      // Fusionar las celdas C1:F4
      sheet.mergeCells("C1:F5");

      // Asignar el texto y darle formato
      const cell = sheet.getCell("C1");
      cell.value = "Reporte de Asistencia";
      cell.font = { bold: true, size: 18 };
      cell.alignment = { horizontal: "center", vertical: "middle" };

      // Definir el color azul marino (hex: #003366)
      const darkBlue = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "254061" },
      };

      // Aplicar el color a las celdas A6:F6
      ["A6", "B6", "C6", "D6", "E6", "F6"].forEach((cell) => {
        sheet.getCell(cell).fill = darkBlue;
      });

      // Definir estilos
      const greenFill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      }; // Fondo verde claro
      const blueFont = {
        name: "Calibri",
        color: { argb: "254061" },
        bold: true,
      }; // Fuente azul + negrita
      const borderStyle = { style: "thin", color: { argb: "000000" } }; // Bordes delgados en negro

      // Asignar valores a las celdas de títulos
      sheet.getCell("A7").value = "No. de empleado";
      sheet.getCell("A8").value = "Nombre";
      sheet.getCell("A9").value = "Horario laboral";
      sheet.getCell("D7").value = "Puesto";
      sheet.getCell("D8").value = "Área";
      sheet.getCell("D9").value = "Fecha del período";

      // Fusionar celdas en blanco horizontalmente
      sheet.mergeCells("B7:C7"); // Espacio vacío junto a "No. de empleado"
      sheet.mergeCells("B9:C9"); // Espacio vacío junto a "Horario laboral"
      sheet.mergeCells("E7:F7"); // Espacio vacío junto a "Puesto"
      sheet.mergeCells("E8:F8"); // Espacio vacío junto a "Área"
      sheet.mergeCells("E9:F9"); // Espacio vacío junto a "Fecha del período"

      // Fusionar B8 y C8 para mostrar userName centrado
      sheet.mergeCells("B8:C8");
      sheet.getCell("B8").value = userName;
      sheet.getCell("B8").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Aplicar fondo verde claro y fuente azul negrita a los títulos
      ["A7", "A8", "A9", "D7", "D8", "D9"].forEach((cell) => {
        sheet.getCell(cell).fill = greenFill; // Fondo verde claro
        sheet.getCell(cell).font = blueFont; // Fuente azul + negrita
      });

      // Aplicar bordes a todas las celdas, incluyendo las fusionadas
      const tableCells = [
        "A7",
        "B7",
        "C7",
        "D7",
        "E7",
        "F7",
        "A8",
        "B8",
        "C8",
        "D8",
        "E8",
        "F8",
        "A9",
        "B9",
        "C9",
        "D9",
        "E9",
        "F9",
      ];

      tableCells.forEach((cell) => {
        sheet.getCell(cell).border = {
          top: borderStyle,
          left: borderStyle,
          bottom: borderStyle,
          right: borderStyle,
        };
      });

      // Fusionar las celdas de A10:F13 en una sola
      sheet.mergeCells("A10:F13");

      // Aplicar el texto centrado
      const objectiveCell = sheet.getCell("A10");
      objectiveCell.value =
        "Objetivo: Por este medio se hace de mi conocimiento el reporte de mis asistencias por parte del área de RRHH, por lo cual acepto los datos establecidos en este documento.";
      objectiveCell.alignment = {
        horizontal: "justify",
        vertical: "middle",
        wrapText: true,
      }; // Centrado y ajuste de texto

      // Aplicar solo color de letra y negrita, sin fondo
      objectiveCell.font = {
        name: "Calibri",
        color: { argb: "254061" },
        bold: true,
      };

      // Agregar bordes a la celda fusionada
      objectiveCell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      // Aplicar el color a las celdas A14:F14
      ["A14", "B14", "C14", "D14", "E14", "F14"].forEach((cell) => {
        sheet.getCell(cell).fill = darkBlue;
      });

      // Ordenar los registros por fecha para asegurar una secuencia adecuada
      userRecords.sort(
        (a, b) => new Date(a.fecha_captura) - new Date(b.fecha_captura)
      );

      // Obtener el rango de fechas desde la fecha más temprana hasta la más tardía
      const startDate = userRecords[0]?.fecha_captura;
      const endDate = userRecords[userRecords.length - 1]?.fecha_captura;
      const fullDateRange = generateDateRange(startDate, endDate);

      // Crear encabezados de columna a partir de la fila 3
      const headers = [
        "Fecha",
        "Entrada",
        "Salida",
        "Retardos",
        "Faltas",
        "Observaciones",
      ];

      //sheet.addRow([]); // Fila vacía para separar el título
      const headerRow = sheet.addRow(headers);

      // Resaltar los títulos de las columnas
      headerRow.font = { bold: true, size: 12 };
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "A9D08E" },
        };
      });

      let totalRetardos = 0;
      let totalFaltas = 0;

      // Generar filas con la secuencia completa de fechas
      fullDateRange.forEach((date) => {
        const recordForDate = userRecords.find(
          (record) => record.fecha_captura === date
        );
        const isSunday = dayjs(date).day() === 0; // 0 indica que es domingo

        const retardo = recordForDate?.estatus_entrada === "Retardo" ? 1 : 0;
        const falta =
          recordForDate?.estatus_entrada === "Falta" ||
          recordForDate?.estatus_salida === "Falta" ||
          recordForDate?.estatus_salida === "Registro incompleto" ||
          recordForDate?.estatus_salida === "Dia incompleto"
            ? 1
            : 0;

        totalRetardos += retardo;
        totalFaltas += falta;

        const horaEntrada = isSunday
          ? "DESCANSO"
          : recordForDate?.hora_entrada || "";
        const horaSalida = isSunday
          ? "DESCANSO"
          : recordForDate?.hora_salida || "";

        // Campo de observaciones
        let observaciones = "";

        // Verificamos las condiciones para estatus_salida
        if (
          recordForDate?.estatus_salida === "Registro incompleto" ||
          recordForDate?.estatus_salida === "Dia incompleto"
        ) {
          observaciones = recordForDate?.estatus_salida.toUpperCase(); // Añadimos el valor en mayúsculas
        }

        // Verificamos las condiciones para estatus_entrada
        if (
          recordForDate?.estatus_entrada === "Retardo" ||
          recordForDate?.estatus_entrada === "Falta"
        ) {
          observaciones = recordForDate?.estatus_entrada.toUpperCase(); // Añadimos el valor en mayúsculas
        }

        

        const row = [
          date,
          horaEntrada,
          horaSalida,
          retardo,
          falta,
          observaciones,
        ];
        const excelRow = sheet.addRow(row);

        // Fusionar las celdas de hora_entrada y hora_salida si es domingo
        if (isSunday) {
          const rowIndex = excelRow.number; // Obtener el índice de la fila actual
          sheet.mergeCells(`B${rowIndex}:C${rowIndex}`);

          // Aplicar el color azul de fondo
          const descansoCell = excelRow.getCell(2); // B
          descansoCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFCCE5FF" }, // Color azul
          };
          descansoCell.alignment = { horizontal: "center", vertical: "middle" };
        }

        // Resaltar en rojo cuando estatus_entrada es 'Falta'
        if (recordForDate?.estatus_entrada === "Falta") {
          excelRow.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFC7CE" }, // Color rojo
          };
          excelRow.getCell(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFC7CE" }, // Color rojo
          };
        }

        // Resaltar en naranja cuando estatus_entrada es 'Retardo'
        if (recordForDate?.estatus_entrada === "Retardo") {
          excelRow.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFA500" }, // Color naranja
          };
          excelRow.getCell(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFA500" }, // Color naranja
          };
        }

        // Resaltar en naranja cuando estatus_salida es 'Registro incompleto' o 'Dia incompleto'
        if (
          recordForDate?.estatus_salida === "Registro incompleto" ||
          recordForDate?.estatus_salida === "Dia incompleto"
        ) {
          excelRow.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDEE817" }, // Color amarillo
          };
          excelRow.getCell(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDEE817" }, // Color amarillo
          };
        }
      });

      // Agregar el resumen de retardos, faltas y descuentos al final de la hoja
      sheet.addRow([]); // Fila vacía antes del resumen
      const resumenHeaderRow = sheet.addRow(["Resumen de Asistencia"]);
      resumenHeaderRow.font = { bold: true, size: 14 };
      resumenHeaderRow.alignment = { horizontal: "center" };
      sheet.mergeCells(
        `A${resumenHeaderRow.number}:E${resumenHeaderRow.number}`
      );

      const totalDescuentos = Math.floor(totalRetardos / 3) + totalFaltas; // Cada 3 retardos es 1 descuento

      // Agregar las filas del resumen con totales
      sheet.addRow(["Total de Retardos", totalRetardos]);
      sheet.addRow(["Total de Faltas", totalFaltas]);
      sheet.addRow(["Total de Descuentos", totalDescuentos]);
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
    const fileName = "reporte_asistencia_individual.xlsx";
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button
      variant="contained"
      color="info"
      startIcon={<Download />}
      onClick={generateAttendanceReport}
      sx={{
        borderRadius: "35px",
        color: "black",
        fontWeight: "bold",
      }}
    >
      Reporte Individual
    </Button>
  );
};

export default IndividualAttendanceReportButton;
