import React, { useState } from "react";
import { Button, useTheme } from "@mui/material";
import { GridOn, GridOnOutlined } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { tokens } from "../../../theme";

const ExportToExcelButton = ({ data, filename = "inventario", loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventario");

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
      const filteredKeys = allKeys.filter((key) =>
        data.some((item) => item[key] !== null && item[key] !== "")
      );

      worksheet.columns = filteredKeys.map((key) => ({
        header: key.replace(/_/g, " ").toUpperCase(),
        key,
        width: 20,
      }));

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

      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      const fullFilename = `${filename}_${dateString}.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fullFilename);
    } catch (error) {
      console.error("Error generando Excel:", error);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleExport = () => {
    if (!data || data.length === 0) return;

    setLoadingGenerate(true);

    // Espera un pequeño delay para mostrar el estado de "Generando..."
    setTimeout(() => {
      exportToExcel();
    }, 1000);
  };

  return (
    <Button
      onClick={handleExport}
      variant="contained"
      fullWidth
      endIcon={
        <GridOnOutlined sx={{ fontSize: 18, color: colors.textAccent }} />
      }
      sx={{
        textTransform: "none", // minimalista, sin mayúsculas forzadas
        borderRadius: "10px", // bordes redondeados suaves
        fontWeight: 500,
        fontSize: "0.875rem", // tamaño legible, consistente
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px", // espacio limpio entre texto e icono
        backgroundColor: colors.accentGreen[100], // color normal
        color: colors.textAccent, // contraste legible
        border: "none",
        cursor: "pointer",

        "&:hover": {
          backgroundColor: colors.accentGreen[200], // hover sutil
        },
        "&:active": {
          backgroundColor: colors.accentGreen[300], // feedback presionado
        },
        "& .MuiButton-endIcon": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        transition: "background-color 0.3s ease, box-shadow 0.2s ease",
        boxShadow: "none", // minimalismo: sin sombra por defecto
        "&:hover, &:active": {
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
        },
      }}
      disabled={loading || loadingGenerate}
    >
      {loadingGenerate ? (
        <div className="flex items-center">
          <span
            className="w-2 h-2 bg-current rounded-full animate-ping"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="w-2 h-2 bg-current rounded-full animate-ping"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-2 h-2 bg-current rounded-full animate-ping"
            style={{ animationDelay: "0.4s" }}
          ></span>
          <span style={{ marginLeft: "12px" }}>Generando...</span>
        </div>
      ) : (
        "Exportar a Excel"
      )}
    </Button>
  );
};

export default ExportToExcelButton;
