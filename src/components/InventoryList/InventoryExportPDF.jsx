import React from "react";
import { Button } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download } from "@mui/icons-material";

const InventoryExportPDF = ({ filteredInventory }) => {
  const exportToPdf = async () => {
    const doc = new jsPDF();
    let currentPage = 1;

    filteredInventory.forEach((item, index) => {
      // Solo agregar nueva página si no es el primer artículo
      if (index !== 0) {
        doc.addPage();
        currentPage++;
      }

      const nombreArticulo =
        item.nombre_articulo || item.nombre || `Artículo ${index + 1}`;

      doc.setFontSize(16);
      doc.text(`Artículo: ${nombreArticulo}`, 14, 20);

      const rows = Object.entries(item)
        .filter(
          ([key, value]) =>
            key !== "fotos" &&
            value !== null &&
            value !== "" &&
            typeof value !== "object" &&
            !key.toLowerCase().includes("id")
        )
        .map(([key, value]) => [
          key.replace(/_/g, " ").toUpperCase(),
          String(value),
        ]);

      doc.autoTable({
        startY: 30,
        head: [["CAMPO", "VALOR"]],
        body: rows,
        styles: { fontSize: 10 },
      });

      let currentY = doc.lastAutoTable.finalY + 10;
      const pageHeight = doc.internal.pageSize.height;
      const marginX = 14;
      const imageSize = 40;
      const gapX = 10;
      const gapY = 10;
      const maxPerRow = 4;
      let x = marginX;
      let y = currentY;
      let countInRow = 0;
      let hasPrintedImageTitle = false;

      const validFotos = Array.isArray(item.fotos)
        ? item.fotos.filter((foto) => foto.imagen64)
        : [];

      validFotos.forEach((foto) => {
        if (y + imageSize > pageHeight - 20) {
          doc.addPage();
          currentPage++;
          x = marginX;
          y = 25;
          countInRow = 0;
        }

        if (!hasPrintedImageTitle) {
          doc.setFontSize(12);
          doc.text(`Imágenes: ${nombreArticulo}`, 14, y);
          y += 5;
          hasPrintedImageTitle = true;
        }

        try {
          doc.addImage(foto.imagen64, "JPEG", x, y, imageSize, imageSize);
        } catch (e) {
          console.error("Error al cargar imagen:", e);
        }

        countInRow++;
        if (countInRow >= maxPerRow) {
          x = marginX;
          y += imageSize + gapY;
          countInRow = 0;
        } else {
          x += imageSize + gapX;
        }
      });
    });

    // Agrega número de página en cada hoja
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${totalPages}`,
        doc.internal.pageSize.getWidth() - 40,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save("Inventario.pdf");
  };

  return (
    <Button
      variant="contained"
      onClick={exportToPdf}
      fullWidth
      color="info"
      startIcon={<Download />}
      sx={{
        borderRadius: "35px",
        color: "black",
        fontWeight: "bold",
      }}
    >
      Exportar a PDF
    </Button>
  );
};

export default InventoryExportPDF;
