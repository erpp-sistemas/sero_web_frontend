import React from "react";
import Button from "@mui/material/Button";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Download } from "@mui/icons-material";
import ERPPImage from "../../../../public/ERPP-LOGO-2.png";

const IndividualAttendanceReportButton = ({
  data,
  selectedStartDate,
  selectedEndDate,
}) => {
  console.log(data);
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

      // Fusionar las celdas C1:H5 (expandir hasta la columna H)
      sheet.mergeCells("C1:H5");

      // Asignar el texto y darle formato
      const cell = sheet.getCell("C1");
      cell.value = "Reporte de Asistencia";
      cell.font = { bold: true, size: 20 };
      cell.alignment = { horizontal: "center", vertical: "middle" };

      // Definir el color azul marino (hex: #003366)
      const darkBlue = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "254061" },
      };

      // Aplicar el color a las celdas A6:H6 (expandir hasta la columna H)
      ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6"].forEach((cell) => {
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

      // Obtener los valores de id_buk, puesto, área y horario del primer registro del usuario
      const { id_buk, puesto, area, horario } = userRecords[0] || {};

      // Concatenar las fechas seleccionadas
      const fechaPeriodo = `Del ${selectedStartDate} al ${selectedEndDate}`;

      // Asignar valores a las celdas de títulos
      sheet.getCell("A7").value = "No. de empleado";
      sheet.getCell("B7").value = id_buk || ""; // Mostrar id_buk
      sheet.mergeCells("B7:C7"); // Espacio vacío junto a "No. de empleado"
      sheet.getCell("B7").alignment = {
        horizontal: "center",
        vertical: "middle",
      }; // Centrar

      sheet.getCell("A8").value = "Nombre";
      sheet.mergeCells("B8:C8");
      sheet.getCell("B8").value = userName; // Mostrar el nombre del usuario
      sheet.getCell("B8").alignment = {
        horizontal: "center",
        vertical: "middle",
      }; // Centrar

      sheet.getCell("A9").value = "Horario laboral";
      sheet.getCell("B9").value = horario || ""; // Mostrar horario
      sheet.mergeCells("B9:C9"); // Espacio vacío junto a "Horario laboral"
      sheet.getCell("B9").alignment = {
        horizontal: "center",
        vertical: "middle",
      }; // Centrar

      sheet.getCell("D7").value = "Puesto";
      sheet.getCell("E7").value = puesto || ""; // Mostrar puesto
      sheet.mergeCells("E7:F7"); // Espacio vacío junto a "Puesto"
      sheet.getCell("E7").alignment = {
        horizontal: "center",
        vertical: "middle",
      }; // Centrar

      sheet.getCell("D8").value = "Área";
      sheet.getCell("E8").value = area || ""; // Mostrar área
      sheet.mergeCells("E8:F8"); // Espacio vacío junto a "Área"
      sheet.getCell("E8").alignment = {
        horizontal: "center",
        vertical: "middle",
      }; // Centrar

      sheet.getCell("D9").value = "Fecha del período";
      sheet.getCell("E9").value = fechaPeriodo; // Mostrar el rango de fechas
      sheet.mergeCells("E9:F9"); // Espacio vacío junto a "Fecha del período"
      sheet.getCell("E9").alignment = {
        horizontal: "center",
        vertical: "middle",
      }; // Centrar

      // Fusionar celdas en blanco horizontalmente (expandir hasta la columna H)
      sheet.mergeCells("G7:H7"); // Espacio vacío adicional
      sheet.mergeCells("G8:H8"); // Espacio vacío adicional
      sheet.mergeCells("G9:H9"); // Espacio vacío adicional

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
        "G7",
        "H7",
        "A8",
        "B8",
        "C8",
        "D8",
        "E8",
        "F8",
        "G8",
        "H8",
        "A9",
        "B9",
        "C9",
        "D9",
        "E9",
        "F9",
        "G9",
        "H9",
      ];

      tableCells.forEach((cell) => {
        sheet.getCell(cell).border = {
          top: borderStyle,
          left: borderStyle,
          bottom: borderStyle,
          right: borderStyle,
        };
      });

      // Fusionar las celdas de A10:H13 (expandir hasta la columna H)
      sheet.mergeCells("A10:H13");

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

      // Aplicar el color a las celdas A14:H14 (expandir hasta la columna H)
      ["A14", "B14", "C14", "D14", "E14", "F14", "G14", "H14"].forEach(
        (cell) => {
          sheet.getCell(cell).fill = darkBlue;
        }
      );

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
        "Estatus Punto Entrada",
        "Estatus Punto Salida",
      ];

      // Crear fila de encabezado
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

      // Definir bordes exteriores e interiores
      const borderStyleT = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

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

        const estatusPuntoEntrada = recordForDate?.estatus_punto_entrada || "";
        const estatusPuntoSalida = recordForDate?.estatus_punto_salida || "";

        const row = [
          date,
          horaEntrada,
          horaSalida,
          retardo,
          falta,
          "",
          estatusPuntoEntrada,
          estatusPuntoSalida,
        ];
        const excelRow = sheet.addRow(row);

        // Aplicar bordes a cada celda de la fila
        excelRow.eachCell((cell) => {
          cell.border = borderStyleT;
        });

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

        // Resaltar en amarillo cuando estatus_salida es 'Registro incompleto' o 'Dia incompleto'
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

      const totalDescuentos = Math.floor(totalRetardos / 3) + totalFaltas; // Cada 3 retardos es 1 descuento

      // Agregar las filas del resumen con totales
      const row1 = sheet.addRow([
        "Total de Retardos",
        "",
        "",
        totalRetardos,
        "",
        "Detalle de descuentos",
      ]);
      const row2 = sheet.addRow([
        "Total de Faltas",
        "",
        "",
        totalFaltas,
        "",
        "",
      ]);
      const row3 = sheet.addRow([
        "Total de Descuentos",
        "",
        "",
        totalDescuentos,
        "",
        "",
      ]);

      // Fusionar celdas según el requerimiento
      sheet.mergeCells(`A${row1.number}:C${row1.number}`);
      sheet.mergeCells(`D${row1.number}:E${row1.number}`);

      sheet.mergeCells(`A${row2.number}:C${row2.number}`);
      sheet.mergeCells(`D${row2.number}:E${row2.number}`);

      sheet.mergeCells(`A${row3.number}:C${row3.number}`);
      sheet.mergeCells(`D${row3.number}:E${row3.number}`);

      // Fusionar celdas en la columna F para las filas 2 y 3 (verticalmente) y agregar "N/A"
      sheet.mergeCells(`F${row2.number}:F${row3.number}`);
      sheet.getCell(`F${row2.number}`).value = "N/A"; // Se pone "N/A" en la celda superior fusionada

      // Aplicar alineación centrada y negrita en las celdas fusionadas
      [row1, row2, row3].forEach((row) => {
        ["A", "D", "F"].forEach((col) => {
          const cell = sheet.getCell(`${col}${row.number}`);
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.font = { bold: true };
        });
      });

      // Alineación centrada para las celdas en columna F (ahora fusionada)
      const mergedCell = sheet.getCell(`F${row2.number}`);
      mergedCell.alignment = { horizontal: "center", vertical: "middle" };

      // Definir el estilo de bordes
      const borderStyles = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Aplicar bordes a todas las celdas de la tabla
      [row1, row2, row3].forEach((row) => {
        ["A", "B", "C", "D", "E", "F"].forEach((col) => {
          const cell = sheet.getCell(`${col}${row.number}`);
          cell.border = borderStyles;
        });
      });

      // Aplicar color gris claro a las celdas en la columna A, B y C
      [row1, row2, row3].forEach((row) => {
        ["A", "B", "C"].forEach((col) => {
          const cell = sheet.getCell(`${col}${row.number}`);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9D9D9" }, // Color gris claro
          };
        });
      });

      // Agregar las filas de firmas debajo de la tabla de resumen
      const row6 = sheet.addRow([]);
      const row7 = sheet.addRow([
        "",
        "______________________",
        "",
        "",
        "______________________",
        "",
      ]);
      const row4 = sheet.addRow([
        "Firma del colaborador",
        "",
        "",
        "",
        "",
        "Firma de RRHH",
      ]);

      // Fusionar las celdas de la columna A, B y C para la firma del colaborador
      sheet.mergeCells(`A${row4.number}:C${row4.number}`);
      // Fusionar las celdas de la columna D, E y F para la firma de RRHH
      sheet.mergeCells(`D${row4.number}:F${row4.number}`);

      // Alineación centrada para las celdas de firma
      [row4].forEach((row) => {
        ["A", "B", "C", "D", "E", "F"].forEach((col) => {
          const cell = sheet.getCell(`${col}${row.number}`);
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // Asegurarse de que la leyenda "Firma de RRHH" se vea correctamente
      const firmaRRHHCell = sheet.getCell(`D${row4.number}`);
      firmaRRHHCell.value = "Firma de RRHH"; // Asignar texto a la celda fusionada
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
