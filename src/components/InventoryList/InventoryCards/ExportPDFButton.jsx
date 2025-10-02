// ExportPDFButton.js
import React, { useState, useEffect } from "react";
import { Button, useTheme } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import { tokens } from "../../../theme";
import dayjs from "dayjs";
import { PictureAsPdfOutlined } from "@mui/icons-material";

const ExportPDFButton = ({ data = [], loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const [base64ERPP, setBase64ERPP] = useState(null);
  const [base64HeaderRight, setBase64HeaderRight] = useState(null);
  const [base64WorldIcon, setBase64WorldIcon] = useState(null);
  const [base64MarkerIcon, setBase64MarkerIcon] = useState(null);

  const cmToPt = (cm) => cm * 28.35;

  const formatDate = (value) => {
    if (!value) return "";
    const d = dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY") : value;
  };

  const convertImageToBase64 = (url) => {
    return fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };

  useEffect(() => {
    convertImageToBase64("/ERPP.png").then(setBase64ERPP);
    convertImageToBase64("/HeaderRight2025.png").then(setBase64HeaderRight);
    convertImageToBase64("/world-icon.png").then(setBase64WorldIcon);
    convertImageToBase64("/marker-icon.png").then(setBase64MarkerIcon);
  }, []);

  const drawHeader = (doc, pageWidth) => {
    const marginLeft = 40;
    const marginRight = 40;
    const leftImgWidth = cmToPt(3);
    const leftImgHeight = cmToPt(2);
    const headerTop = 15;

    if (base64ERPP) {
      doc.addImage(
        base64ERPP,
        "PNG",
        marginLeft,
        headerTop,
        leftImgWidth,
        leftImgHeight
      );
    }

    const rightImgWidth = cmToPt(9);
    const rightImgHeight = cmToPt(7.5);
    const rightX = pageWidth - marginRight - rightImgWidth;

    if (base64HeaderRight) {
      doc.addImage(
        base64HeaderRight,
        "PNG",
        rightX,
        headerTop,
        rightImgWidth,
        rightImgHeight,
        undefined,
        "NONE"
      );
    }

    const greenWidth = cmToPt(2);
    const lineY = headerTop + leftImgHeight + 5;
    doc.setFillColor("#4caf50");
    doc.rect(marginLeft, lineY, greenWidth, 3, "F");
    doc.setFillColor("#999999");
    doc.rect(
      marginLeft + greenWidth,
      lineY,
      pageWidth - marginLeft * 2 - greenWidth,
      3,
      "F"
    );
  };

  const footerHeight = 50;

  const drawFooter = (doc, pageWidth, pageHeight, pageNum, totalPages) => {
    const marginLeft = 40;
    const marginRight = 40;
    const greenWidth = cmToPt(2);
    const footerY = pageHeight - footerHeight + 10;

    doc.setFillColor("#4caf50");
    doc.rect(marginLeft, footerY, greenWidth, 3, "F");

    doc.setFillColor("#999999");
    doc.rect(
      marginLeft + greenWidth,
      footerY,
      pageWidth - marginLeft * 2 - greenWidth,
      3,
      "F"
    );

    const pageText = `Página ${pageNum} de ${totalPages}`;
    doc.setFontSize(10);
    doc.setTextColor("#444");
    doc.text(pageText, pageWidth / 2, pageHeight - footerHeight / 2 + 5, {
      align: "center",
    });

    const iconSize = 12;
    const iconTextGap = 5;
    const leftX = marginLeft;
    const leftY = pageHeight - footerHeight / 2 - iconSize / 2 + 5;

    if (base64WorldIcon) {
      doc.addImage(base64WorldIcon, "PNG", leftX, leftY, iconSize, iconSize);
    }

    doc.setFontSize(10);
    doc.setTextColor("#333");
    doc.text(
      "www.erpp.mx",
      leftX + iconSize + iconTextGap,
      leftY + iconSize * 0.75
    );

    const rightIconSize = 12;
    const iconTextGapRight = 5;
    const maxTextWidth = 150;
    const rightBlockWidth = rightIconSize + iconTextGapRight + maxTextWidth;
    const rightX = pageWidth - marginRight - rightBlockWidth;
    const totalTextHeight = 3 * 10;
    const rightY = pageHeight - footerHeight / 2 - totalTextHeight / 2;

    if (base64MarkerIcon) {
      doc.addImage(
        base64MarkerIcon,
        "PNG",
        rightX - 12,
        rightY + 2 + (totalTextHeight - rightIconSize) / 2,
        rightIconSize,
        rightIconSize
      );
    }
    doc.setFontSize(8);
    doc.setTextColor("#333");

    const shiftLeft = 15; // mueve más a la izquierda
    const addressX = rightX + rightIconSize + iconTextGapRight - shiftLeft;

    const addressLines = [
      "Jaime Balmes no.11 Torre A, Piso 1 int.B",
      "Polanco I Sección Miguel Hgo., CDMX.",
      "C.P. 11510",
    ];

    let currentY = rightY + 10;
    const lineHeight = 10;

    addressLines.forEach((line) => {
      // Aquí forzamos que no se parta la línea, aunque sea más larga que maxTextWidth
      doc.text(line, addressX, currentY);
      currentY += lineHeight;
    });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = { top: 100, left: 40, right: 40 };
      const contentWidth = pageWidth - margin.left - margin.right;
      const lineHeight = 20;
      const labelWidth = 130;
      const boxPadding = 15;
      const imagesPerRow = 4;
      const imageMargin = 12;
      const imageSize =
        (contentWidth - (imagesPerRow - 1) * imageMargin - boxPadding * 2) /
        imagesPerRow;

      let cursorY = margin.top;

      drawHeader(doc, pageWidth);

      const roundedRect = (x, y, w, h, r) => {
        doc.roundedRect(x, y, w, h, r, r);
      };

      data.forEach((item, index) => {
        const entries = Object.entries(item).filter(([key, val]) => {
          const keyLow = key.toLowerCase();
          return (
            keyLow !== "fotos" &&
            !keyLow.includes("_id") &&
            !keyLow.includes("id_") &&
            !keyLow.includes("imagen") &&
            val !== null &&
            val !== ""
          );
        });

        const attrHeight = boxPadding * 2 + 30 + entries.length * lineHeight;

        const photos = Array.isArray(item.fotos) ? item.fotos : [];
        const photoTitleHeight = photos.length > 0 ? 30 : 0;
        const photoRows = Math.ceil(photos.length / imagesPerRow);
        const photosHeight = photoRows * (imageSize + imageMargin);
        const totalHeight = attrHeight + photoTitleHeight + photosHeight;

        if (cursorY + totalHeight > pageHeight - footerHeight) {
          const isFirstPage =
            doc.internal.getNumberOfPages() === 1 && cursorY === margin.top;
          if (!isFirstPage) {
            doc.addPage();
            drawHeader(doc, pageWidth);
            cursorY = margin.top;
          }
        }

        doc.setDrawColor("#BBBBBB");
        doc.setFillColor("#F9F9F9");
        doc.setLineWidth(0.7);
        roundedRect(margin.left, cursorY, contentWidth, attrHeight, 6);
        doc.setFillColor(255);

        const titulo = `${item.folio || ""} - ${
          item.nombre_articulo || "Sin Nombre"
        }`;
        doc.setFontSize(12);
        doc.setTextColor("#1A237E");
        doc.setFont(undefined, "bold");
        doc.text(titulo, margin.left + boxPadding, cursorY + 20);

        let attrY = cursorY + 40;
        doc.setFontSize(10);
        doc.setTextColor("#333");
        doc.setFont(undefined, "normal");

        entries.forEach(([key, val], index) => {
          let value = val;
          if (
            (typeof value === "string" &&
              (value.match(/^\d{4}-\d{2}-\d{2}T/) ||
                value.match(/^\d{4}-\d{2}-\d{2}$/))) ||
            value instanceof Date
          ) {
            value = formatDate(value);
          }
          if (
            typeof value === "number" &&
            key.toLowerCase().includes("precio")
          ) {
            value = `$${value.toLocaleString()}`;
          }
          if (typeof value === "boolean") {
            value = value ? "Sí" : "No";
          }

          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          const valStr = String(value);
          const maxChars = Math.floor(
            (contentWidth - labelWidth - boxPadding * 2 - 20) / 6
          );
          const displayVal =
            valStr.length > maxChars
              ? valStr.slice(0, maxChars - 3) + "..."
              : valStr;

          doc.setFont(undefined, "bold");
          doc.text(label + ":", margin.left + boxPadding, attrY);

          doc.setFont(undefined, "normal");
          doc.text(displayVal, margin.left + boxPadding + labelWidth, attrY);

          if (index < entries.length - 1) {
            doc.setDrawColor("#DDDDDD");
            doc.setLineWidth(0.3);
            doc.line(
              margin.left + boxPadding,
              attrY + 4,
              margin.left + contentWidth - boxPadding,
              attrY + 4
            );
          }

          attrY += lineHeight;
        });

        cursorY += attrHeight + 10;

        // ExportPDFButton.js
        // ...mantén todos los imports que ya tienes sin cambios...

        // Dentro de generatePDF (reemplaza solo la parte de generación de fotos):
        if (photos.length > 0) {
          const renderPhotoTitle = () => {
            doc.setFontSize(10);
            doc.setFont(undefined, "bold");
            doc.setTextColor("#333");
            doc.text("Fotos:", margin.left + boxPadding, cursorY + 10);
            cursorY += 20;
          };

          let photoX = margin.left + boxPadding;
          let photoY = cursorY;

          const maxImageHeightFirstRow = imageSize + footerHeight + 20; // 20 por el título y padding

          // Verificamos si la PRIMERA FILA de fotos cabe con el título
          const needsPageBreak = photoY + maxImageHeightFirstRow > pageHeight;

          if (needsPageBreak) {
            if (doc.internal.getNumberOfPages() > 1 || cursorY > margin.top) {
              doc.addPage();
              drawHeader(doc, pageWidth);
            }
            photoY = margin.top;
            cursorY = margin.top;
          }

          renderPhotoTitle(); // Se dibuja después del salto de página si fue necesario
          photoY = cursorY;

          photos.forEach((photo, i) => {
            if (!photo.imagen64) return;

            // Si es nueva fila
            const isNewRow = i % imagesPerRow === 0 && i !== 0;
            if (isNewRow) {
              photoX = margin.left + boxPadding;
              photoY += imageSize + imageMargin;

              if (photoY + imageSize + footerHeight > pageHeight) {
                doc.addPage();
                drawHeader(doc, pageWidth);
                photoY = margin.top;
                renderPhotoTitle();
                photoX = margin.left + boxPadding;
              }
            }

            // Verificamos si la imagen actual cabe, si no, nueva página
            if (photoY + imageSize + footerHeight > pageHeight) {
              doc.addPage();
              drawHeader(doc, pageWidth);
              photoY = margin.top;
              renderPhotoTitle();
              photoX = margin.left + boxPadding;
            }

            // Render foto con borde
            const borderPadding = 3;
            doc.setDrawColor("#CCCCCC");
            doc.setLineWidth(0.4);
            doc.roundedRect(
              photoX - borderPadding,
              photoY - borderPadding,
              imageSize + borderPadding * 2,
              imageSize + borderPadding * 2,
              8,
              8
            );

            doc.addImage(
              photo.imagen64,
              "JPEG",
              photoX,
              photoY,
              imageSize,
              imageSize,
              undefined,
              "FAST"
            );

            photoX += imageSize + imageMargin;
          });

          cursorY = photoY + imageSize + 20;
        } else {
          cursorY += 20;
        }
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(doc, pageWidth, pageHeight, i, totalPages);
      }

      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      doc.save(`inventario_${dateString}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleExportPDF = () => {
    if (!data.length) return;
    setLoadingGenerate(true);
    setTimeout(() => {
      generatePDF();
    }, 50);
  };

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleExportPDF}
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
      endIcon={
        <PictureAsPdfOutlined sx={{ fontSize: 18, color: colors.textAccent }} />
      }
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
        <div>Exportar a PDF</div>
      )}
    </Button>
  );
};

export default ExportPDFButton;
