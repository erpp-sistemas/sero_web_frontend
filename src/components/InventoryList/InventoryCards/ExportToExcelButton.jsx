// components/ExportToExcelButton.jsx
import React from "react";
import { Button, useTheme } from "@mui/material";
import { GridOn } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { tokens } from "../../../theme";

const ExportToExcelButton = ({ data, filename = "inventario", loading }) => {
  console.log(data);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleExport = async () => {
    if (!data || data.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventario");

    // 1. Obtener TODAS las claves únicas válidas
    const allKeysSet = new Set();

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        const lowerKey = key.toLowerCase();
        if (
          !(lowerKey === "id" || lowerKey.startsWith("id_")) &&
          !lowerKey.includes("imagen") &&
          !lowerKey.includes("foto")
        ) {
          allKeysSet.add(key);
        }
      });
    });

    const allKeys = Array.from(allKeysSet);

    // 2. Filtrar claves que NO estén vacías en todos los objetos
    const filteredKeys = allKeys.filter((key) =>
      data.some((item) => item[key] !== null && item[key] !== "")
    );

    // 3. Configurar columnas
    worksheet.columns = filteredKeys.map((key) => ({
      header: key.replace(/_/g, " ").toUpperCase(),
      key,
      width: 20,
    }));

    // 4. Agregar filas
    data.forEach((item) => {
      const row = {};
      filteredKeys.forEach((key) => {
        if (key === "activo") {
          row[key] = item[key] ? "Activo" : "Inactivo";
        } else if (key === "precio_articulo") {
          row[key] =
            typeof item[key] === "number"
              ? new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(item[key])
              : item[key];
        } else {
          row[key] = item[key];
        }
      });
      worksheet.addRow(row);
    });

    // 5. Encabezados con estilo
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F4F4F5" },
      };
      cell.border = {
        bottom: { style: "thin", color: { argb: "CCCCCC" } },
      };
    });

    // 6. Guardar archivo
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const fullFilename = `${filename}_${dateString}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fullFilename);
  };

  return (
    <Button
      onClick={handleExport}
      variant="contained"
      color="info"
      fullWidth
      size="small"
      endIcon={<GridOn />}
      sx={{
        textTransform: "none",
        borderRadius: "10px",
        borderColor: colors.grey[300],
        color: colors.grey[800],
        fontWeight: 500,
        fontSize: "0.875rem",
        "&:hover": {
          backgroundColor: colors.grey[100],
          borderColor: colors.primary[300],
        },
      }}
      disabled={loading}
    >
      Exportar a Excel
    </Button>
  );
};

export default ExportToExcelButton;
