// src/components/PaymentValidation/ResumenGeneral.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Grow,
  IconButton,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../theme";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import * as ExcelJS from "exceljs";

const ResumenGeneral = ({ pagosValidos = [], pagosFormateados = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Función para filtrar campos de fotos
  const filtrarCamposFotos = (campos) => {
    const camposExcluidos = [     
      'fotos'      
    ];
    
    return campos.filter(campo => 
      !camposExcluidos.some(excluido => 
        campo.toLowerCase().includes(excluido.toLowerCase())
      )
    );
  };

  // 🔹 Función para crear Excel con diseño minimalista mejorado
  const crearExcelConEstilo = (datos, nombreHoja, nombreArchivo) => {
    if (!datos.length) {
      alert("No hay datos para descargar");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(nombreHoja);

      // Obtener todas las claves únicas y filtrar campos de fotos
      const allKeys = new Set();
      datos.forEach((item) => {
        Object.keys(item).forEach((key) => allKeys.add(key));
      });

      // Filtrar campos de fotos
      const camposFiltrados = filtrarCamposFotos(Array.from(allKeys));

      // Definir columnas solo con campos filtrados
      const columnas = camposFiltrados.map((key) => ({
        header: key,
        key: key,
        width: 15, // Ancho base
      }));

      worksheet.columns = columnas;

      // Agregar datos solo con campos filtrados
      datos.forEach((item) => {
        const rowData = {};
        camposFiltrados.forEach((key) => {
          rowData[key] = item[key] !== undefined ? item[key] : "";
        });
        worksheet.addRow(rowData);
      });

      // 🔹 ESTILO MINIMALISTA MEJORADO

      // 1. Headers con estilo sutil en gris
      worksheet.getRow(1).font = {
        bold: true,
        size: 11,
        color: { argb: "FF333333" }, // Texto gris oscuro
      };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF5F5F5" }, // Gris muy claro y sutil
      };
      worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      worksheet.getRow(1).height = 25; // Altura cómoda para headers

      // 2. Ajustar automáticamente el ancho de columnas al contenido
      worksheet.columns.forEach((column, index) => {
        let maxLength = 0;
        const columnIndex = index + 1;

        // Encontrar la longitud máxima del contenido en la columna
        worksheet
          .getColumn(columnIndex)
          .eachCell({ includeEmpty: true }, (cell) => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            maxLength = Math.max(maxLength, cellLength);
          });

        // Ajustar ancho considerando el header también
        const headerLength = column.header.length;
        const finalWidth = Math.max(
          8,
          Math.min(35, Math.max(maxLength, headerLength) + 2)
        );
        column.width = finalWidth;
      });

      // 3. Estilo para las filas de datos
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // No aplicar a los headers
          // Alternar colores de fondo para mejor legibilidad
          if (rowNumber % 2 === 0) {
            row.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFBFBFB" }, // Gris casi blanco
            };
          }

          // Alineación para mejor presentación
          row.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };

          // Fuente legible y tamaño consistente
          row.font = {
            size: 10,
            name: "Arial",
          };

          // Altura de fila consistente
          row.height = 20;
        }
      });

      // 4. Congelar la primera fila (headers) para navegación
      worksheet.views = [
        { state: "frozen", xSplit: 0, ySplit: 1, activeCell: "A2" },
      ];

      // 5. Bordes muy sutiles para estructura visual
      const lastRow = worksheet.rowCount;
      const lastCol = worksheet.columnCount;

      for (let i = 1; i <= lastRow; i++) {
        for (let j = 1; j <= lastCol; j++) {
          const cell = worksheet.getCell(i, j);
          cell.border = {
            top: { style: "thin", color: { argb: "FFEEEEEE" } },
            left: { style: "thin", color: { argb: "FFEEEEEE" } },
            bottom: { style: "thin", color: { argb: "FFEEEEEE" } },
            right: { style: "thin", color: { argb: "FFEEEEEE" } },
          };
        }
      }

      // Generar y descargar archivo
      return workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${nombreArchivo}-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error al generar Excel:", error);
      alert("Error al descargar el archivo Excel");
    }
  };

  // 🔹 Función para descargar pagos validos (evaluados)
  const descargarPagosValidos = () => {
    crearExcelConEstilo(pagosValidos, "Pagos Evaluados", "pagos-evaluados");
  };

  // 🔹 Función para descargar pagos formateados (formato personalizado)
  const descargarPagosFormateados = () => {
    crearExcelConEstilo(
      pagosFormateados,
      "Pagos Formato Personalizado",
      "pagos-formato-personalizado"
    );
  };

  // 🔹 Calculo de valores
  const resumen = useMemo(() => {
    if (!Array.isArray(pagosValidos) || pagosValidos.length === 0)
      return {
        total_registros: 0,
        cuentas_unicas: 0,
        monto_total: 0,
        fecha_min: "-",
        fecha_max: "-",
      };

    const cuentas = new Set();
    let monto_total = 0;
    let fecha_min = null;
    let fecha_max = null;

    const extractFecha = (p) => p["fecha de pago"] || p.fecha_pago || null;

    const parseToDate = (val) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    pagosValidos.forEach((p) => {
      if (p.cuenta) cuentas.add(p.cuenta);
      monto_total += parseFloat(p.total_pagado || 0);

      const fechaObj = parseToDate(extractFecha(p));
      if (fechaObj) {
        if (!fecha_min || fechaObj < fecha_min) fecha_min = fechaObj;
        if (!fecha_max || fechaObj > fecha_max) fecha_max = fechaObj;
      }
    });

    const formatoFecha = (f) => (f ? f.toISOString().split("T")[0] : "-");

    return {
      total_registros: pagosValidos.length,
      cuentas_unicas: cuentas.size,
      monto_total,
      fecha_min: formatoFecha(fecha_min),
      fecha_max: formatoFecha(fecha_max),
    };
  }, [pagosValidos]);

  // 🔹 Definimos las cards
  const cards = [
    {
      label: "Registros encontrados",
      value: resumen.total_registros,
      icon: <DescriptionOutlinedIcon />,
      delay: 0,
      showDownload: true,
      downloads: [
        {
          action: descargarPagosValidos,
          tooltip: "Descargar pagos evaluados completos",
          icon: <DownloadOutlinedIcon fontSize="small" />,
          hoverColor: colors.blueAccent[400],
        },
        {
          action: descargarPagosFormateados,
          tooltip: "Descargar formato personalizado",
          icon: <TableChartOutlinedIcon fontSize="small" />,
          hoverColor: colors.greenAccent[400],
        },
      ],
    },
    {
      label: "Cuentas únicas",
      value: resumen.cuentas_unicas,
      icon: <AccountCircleOutlinedIcon />,
      delay: 100,
    },
    {
      label: "Monto ingresado",
      value: `$${resumen.monto_total.toLocaleString("es-MX")}`,
      icon: <AttachMoneyOutlinedIcon />,
      delay: 200,
    },
    {
      label: "Rango de pago",
      value: `${resumen.fecha_min} → ${resumen.fecha_max}`,
      icon: <DateRangeOutlinedIcon />,
      delay: 300,
    },
  ];

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map((card, index) => (
        <Grow
          key={index}
          in={true}
          style={{ transformOrigin: "0 0 0" }}
          timeout={800}
          {...{ timeout: 500 + card.delay }}
        >
          <Box
            className="p-4 rounded-xl shadow-sm"
            sx={{
              backgroundColor: colors.bgContainer,
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              position: "relative",
            }}
          >
            <Box sx={{ color: colors.grey[500], fontSize: 28 }}>
              {card.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {typeof card.value === "number"
                  ? card.value.toLocaleString("es-MX")
                  : card.value}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {card.label}
              </Typography>
            </Box>

            {/* Botones de descarga con fondo sutil para mejor diferenciación */}
            {card.showDownload && card.downloads && (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {card.downloads.map((download, downloadIndex) => (
                  <Tooltip key={downloadIndex} title={download.tooltip} arrow>
                    <IconButton
                      size="small"
                      onClick={download.action}
                      sx={{
                        color: colors.textAccentSecondary,
                        backgroundColor: colors.bgContainerSecondary, // ✅ Fondo sutil gris
                        "&:hover": {
                          color: colors.textAccentSecondary,
                          backgroundColor: colors.bgContainer, // ✅ Fondo más oscuro al hover
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease",
                        padding: "6px",
                        // border: `1px solid ${colors.grey[300]}`, // ✅ Borde sutil
                      }}
                    >
                      {download.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            )}
          </Box>
        </Grow>
      ))}
    </Box>
  );
};

export default ResumenGeneral;