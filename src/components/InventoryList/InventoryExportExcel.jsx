import React from "react";
import { Button, Stack } from "@mui/material";
import * as ExcelJS from "exceljs";
import { Download } from "@mui/icons-material";

const InventoryExportExcel = ({ filteredInventory }) => {
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventario");

      // Detectar campos excluyendo 'fotos'
      const baseKeys = Array.from(
        new Set(
          filteredInventory.flatMap((item) =>
            Object.entries(item)
              .filter(
                ([key, value]) =>
                  key !== "fotos" &&
                  !key.toLowerCase().includes("id") &&
                  value !== null &&
                  value !== ""
              )
              .map(([key]) => key)
          )
        )
      );

      // Número máximo de fotos
      const maxFotos = Math.max(
        ...filteredInventory.map((item) =>
          Array.isArray(item.fotos) ? item.fotos.length : 0
        )
      );

      const fotoHeaders = Array.from(
        { length: maxFotos },
        (_, i) => `FOTO ${i + 1}`
      );
      const headers = [...baseKeys.map((k) => k.toUpperCase()), ...fotoHeaders];
      worksheet.addRow(headers);

      // Recorrer registros
      for (const item of filteredInventory) {
        const rowData = baseKeys.map((key) => item[key] ?? "");
        const row = worksheet.addRow([
          ...rowData,
          ...new Array(maxFotos).fill(""),
        ]);
        if (Array.isArray(item.fotos) && item.fotos.length > 0) {
          row.height = 90; // Altura para imágenes
        }

        if (Array.isArray(item.fotos)) {
          item.fotos.forEach((foto, index) => {
            if (!foto.imagen64 || index >= maxFotos) return;

            const imageId = workbook.addImage({
              base64: foto.imagen64,
              extension: "jpeg",
            });

            const colIndex = baseKeys.length + index + 1;
            const rowIndex = row.number;

            worksheet.addImage(imageId, {
              tl: { col: colIndex - 1 + 0.1, row: rowIndex - 1 + 0.1 },
              ext: { width: 70, height: 70 },
              editAs: "oneCell",
            });

            worksheet.getColumn(colIndex).width = 15; // Ancho de columna para imagen
          });
        }
      }

      // Estilos cabecera
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E88E5" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      // Ajustar ancho dinámico a contenido (excepto columnas de imágenes)
      baseKeys.forEach((key, index) => {
        const maxLength = Math.max(
          key.length,
          ...filteredInventory.map((item) => String(item[key] ?? "").length)
        );
        worksheet.getColumn(index + 1).width = maxLength + 2;
      });

      // Exportar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Inventario_Con_Imagenes.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exportando a Excel:", error);
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ my: 2 }}>
      <Button
        variant="contained"
        onClick={exportToExcel}
        fullWidth
        color="info"
        startIcon={<Download />}
        sx={{
          borderRadius: "35px",
          color: "black",
          fontWeight: "bold",
        }}
      >
        Exportar a Excel
      </Button>
    </Stack>
  );
};

export default InventoryExportExcel;
