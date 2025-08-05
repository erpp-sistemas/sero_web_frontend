import React from "react";
import { Button, useTheme } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import dayjs from "dayjs";
import { tokens } from "../../../theme";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const CM_TO_PT = 28.3464567; // cm a pt

const formatValue = (key, value) => {
  if (key === "precio_articulo") return `$${parseFloat(value).toFixed(2)}`;
  if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
  if (key.includes("fecha") && value) return dayjs(value).format("DD/MM/YYYY");
  return value ?? "";
};

const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const ExportPDFButton = ({ data = [], loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const buildTableBody = (obj) =>
    Object.entries(obj)
      .filter(([key, value]) => {
        const lowerKey = key.toLowerCase();
        return (
          !(lowerKey === "id" || lowerKey.startsWith("id_")) &&
          !lowerKey.includes("imagen") &&
          !lowerKey.includes("foto") &&
          value !== null &&
          value !== ""
        );
      })
      .map(([key, value]) => [
        {
          text: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          bold: true,
          fontSize: 10,
          margin: [0, 4, 0, 4],
          color: "#222",
        },
        {
          text: formatValue(key, value),
          fontSize: 10,
          margin: [0, 4, 0, 4],
          color: "#333",
        },
      ]);

  const handleExportPDF = async () => {
    if (!data.length) return;

    const logoBase64 = await getBase64FromUrl("/ERPP.png");
    const rightImageBase64 = await getBase64FromUrl("/HeaderRight2025.png");
    const worldIconBase64 = await getBase64FromUrl("/world-icon.png");
    const markerIconBase64 = await getBase64FromUrl("/marker-icon.png"); // nuevo icono

    const headerHeight = 70;
    const footerHeight = 50;
    const pageMargins = [40, headerHeight + 10, 40, footerHeight + 10];

    const docDefinition = {
      pageSize: "LETTER",
      pageMargins,

      header: (currentPage, pageCount, pageSize) => {
        const usableWidth = pageSize.width - pageMargins[0] - pageMargins[2];
        const greenWidth = Math.min(2 * CM_TO_PT, usableWidth);
        const greyWidth = Math.max(usableWidth - greenWidth, 0);

        return {
          margin: [pageMargins[0], 12, pageMargins[2], 6],
          stack: [
            {
              columns: [
                {
                  image: logoBase64,
                  width: 100,
                  alignment: "left",
                  margin: [0, 0, 0, 6],
                },
                { text: "", width: "*", margin: [0, 0, 0, 0] },
              ],
            },
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: 0,
                  w: greenWidth,
                  h: 6,
                  color: "#4CAF50",
                },
                {
                  type: "rect",
                  x: greenWidth,
                  y: 0,
                  w: greyWidth,
                  h: 6,
                  color: "#E0E0E0",
                },
              ],
            },
          ],
        };
      },

      footer: (currentPage, pageCount, pageSize) => {
        const usableWidth = pageSize.width - pageMargins[0] - pageMargins[2];
        const greenWidth = Math.min(2 * CM_TO_PT, usableWidth);
        const greyWidth = Math.max(usableWidth - greenWidth, 0);

        return {
          margin: [pageMargins[0], 0, pageMargins[2], 20],
          stack: [
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: 0,
                  w: greenWidth,
                  h: 6,
                  color: "#4CAF50",
                },
                {
                  type: "rect",
                  x: greenWidth,
                  y: 0,
                  w: greyWidth,
                  h: 6,
                  color: "#E0E0E0",
                },
              ],
            },
            {
              columns: [
                {
                  width: "auto",
                  columns: [
                    {
                      image: worldIconBase64,
                      width: 12,
                      height: 12,
                      margin: [0, 6, 6, 0],
                    },
                    {
                      text: "www.erpp.mx",
                      fontSize: 9,
                      color: "#666",
                      margin: [0, 6, 0, 0],
                    },
                  ],
                },
                {
                  width: "*",
                  text: `Página ${currentPage} de ${pageCount}`,
                  alignment: "center",
                  fontSize: 9,
                  color: "#666",
                  margin: [0, 6, 0, 0],
                },
                {
                  width: "auto",
                  columns: [
                    {
                      image: markerIconBase64,
                      width: 12,
                      height: 12,
                      margin: [0, 6, 6, 0],
                    },
                    {
                      stack: [
                        {
                          text: "Jaime Balmes no.11 Torre A, Piso 1 int.B",
                          fontSize: 9,
                          color: "#666",
                        },
                        {
                          text: "Polanco I Sección Miguel Hgo., CDMX",
                          fontSize: 9,
                          color: "#666",
                        },
                        {
                          text: "C.P. 11510",
                          fontSize: 9,
                          color: "#666",
                        },
                      ],
                      margin: [0, 4, 0, 0],
                    },
                  ],
                },
              ],
              margin: [0, 4, 0, 0],
            },
          ],
        };
      },

      background: (currentPage, pageSize) => {
        const width = 9 * CM_TO_PT;
        const height = 7.5 * CM_TO_PT;
        return {
          image: rightImageBase64,
          width,
          height,
          absolutePosition: {
            x: pageSize.width - pageMargins[2] - width,
            y: 12,
          },
          opacity: 0.9,
        };
      },

      content: [],
      defaultStyle: {
        fontSize: 10,
        color: "#333",
      },
      styles: {
        headerTitle: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 15],
          color: "#222",
          alignment: "center",
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: "#444",
          fillColor: "#f5f5f5",
          margin: [0, 6, 0, 6],
        },
      },
    };

    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const { fotos = [], ...rest } = item;
      const nombreArticulo = item.nombre_articulo || `Artículo ${index + 1}`;

      if (index > 0) {
        docDefinition.content.push({ text: "", pageBreak: "before" });
      }

      docDefinition.content.push({
        text: nombreArticulo,
        style: "headerTitle",
      });

      docDefinition.content.push({
        table: {
          widths: [160, "*"],
          body: [
            [
              { text: "Campo", style: "tableHeader" },
              { text: "Valor", style: "tableHeader" },
            ],
            ...buildTableBody(rest),
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#f5f5f5" : null),
          hLineWidth: () => 0.4,
          vLineWidth: () => 0.4,
          hLineColor: () => "#ccc",
          vLineColor: () => "#ccc",
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
      });

      if (fotos.length) {
        docDefinition.content.push({
          text: `Fotos: ${nombreArticulo}`,
          margin: [0, 10, 0, 6],
          bold: true,
          fontSize: 12,
          color: "#222",
        });

        const imagesPerRow = 4;
        const usablePageWidth = 612 - pageMargins[0] - pageMargins[2];
        const gap = 8;
        const imageSize = Math.floor(
          (usablePageWidth - gap * (imagesPerRow - 1)) / imagesPerRow
        );

        let rows = [];
        let row = [];

        fotos.forEach((foto, i) => {
          if (foto.imagen64) {
            row.push({
              stack: [
                {
                  image: foto.imagen64,
                  width: imageSize,
                  height: imageSize,
                },
              ],
              alignment: "center",
              margin: [0, 0, 0, 0],
            });

            if ((i + 1) % imagesPerRow === 0) {
              rows.push(row);
              row = [];
            }
          }
        });

        if (row.length) {
          while (row.length < imagesPerRow) row.push({ text: "" });
          rows.push(row);
        }

        docDefinition.content.push({
          table: {
            widths: Array(imagesPerRow).fill("*"),
            body: rows,
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
          margin: [0, 0, 0, 20],
        });
      }
    }

    pdfMake
      .createPdf(docDefinition)
      .download(`inventario_${dayjs().format("YYYY-MM-DD")}.pdf`);
  };

  return (
    <Button
      variant="contained"
      color="info"
      fullWidth
      endIcon={<PictureAsPdfIcon />}
      onClick={handleExportPDF}
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
      Exportar PDF
    </Button>
  );
};

export default ExportPDFButton;
