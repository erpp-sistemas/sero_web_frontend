import React, { useState, useEffect } from "react";
import { Button, useTheme } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import { tokens } from "../../../theme";
import dayjs from "dayjs";

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
    } else {
      doc.setFillColor("#CCCCCC");
      doc.rect(marginLeft, headerTop, leftImgWidth, leftImgHeight, "F");
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
    } else {
      doc.setFillColor("#EEEEEE");
      doc.rect(rightX, headerTop, rightImgWidth, rightImgHeight, "F");
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

  const footerHeight = 50; // Espacio para footer (línea + texto)

  const drawFooter = (doc, pageWidth, pageHeight, pageNum, totalPages) => {
    const marginLeft = 40;
    const marginRight = 40;
    const greenWidth = cmToPt(2);
    const footerY = pageHeight - footerHeight + 10; // Línea un poco arriba

    // Línea verde
    doc.setFillColor("#4caf50");
    doc.rect(marginLeft, footerY, greenWidth, 3, "F");

    // Línea gris
    doc.setFillColor("#999999");
    doc.rect(
      marginLeft + greenWidth,
      footerY,
      pageWidth - marginLeft * 2 - greenWidth,
      3,
      "F"
    );

    // Número de página centrado
    const pageText = `Página ${pageNum} de ${totalPages}`;
    doc.setFontSize(10);
    doc.setTextColor("#444");
    doc.text(pageText, pageWidth / 2, pageHeight - footerHeight / 2 + 5, {
      align: "center",
    });

    // --- IZQUIERDA: Imagen world-icon + texto www.erpp.mx ---
    const iconSize = 12; // tamaño icono en pt
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

    // --- DERECHA: Imagen marker-icon + 3 líneas texto ---
    const rightIconSize = 12;
    const iconTextGapRight = 5;
    const maxTextWidth = 150; // máximo ancho para texto y espacio de la imagen

    // Para que no salga del margen derecho, el bloque completo debe estar dentro del margen
    const rightBlockWidth = rightIconSize + iconTextGapRight + maxTextWidth;
    const rightX = pageWidth - marginRight - rightBlockWidth;

    // Coordenada vertical para centrar imagen respecto al texto (3 líneas, cada línea 10 pts alto)
    const totalTextHeight = 3 * 10; // 3 líneas de texto * 10 pts c/u
    const rightY = pageHeight - footerHeight / 2 - totalTextHeight / 2;

    // Dibuja imagen centrada verticalmente con el bloque de texto
    if (base64MarkerIcon) {
      doc.addImage(
        base64MarkerIcon,
        "PNG",
        rightX,
        rightY + (totalTextHeight - rightIconSize) / 2,
        rightIconSize,
        rightIconSize
      );
    }

    doc.setFontSize(8);
    doc.setTextColor("#333");
    const addressX = rightX + rightIconSize + iconTextGapRight;
    const addressLines = [
      "Jaime Balmes no.11 Torre A, Piso 1 int.B",
      "Polanco I Sección Miguel Hgo., CDMX.",
      "C.P. 11510",
    ];

    addressLines.forEach((line, i) => {
      doc.text(line, addressX, rightY + 12 + i * 10, {
        maxWidth: maxTextWidth,
      });
    });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const margin = { top: 100, left: 40, right: 40 };
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - margin.left - margin.right;

      let cursorY = margin.top;

      drawHeader(doc, pageWidth);

      const boxPadding = 15;
      const lineHeight = 20;
      const labelWidth = 130;
      const valueMaxWidth = contentWidth - labelWidth - boxPadding * 2 - 20;
      const imagesPerRow = 4;
      const imageMargin = 12;
      const paddingHorizontal = boxPadding * 2;
      const totalMargins = imageMargin * (imagesPerRow - 1);
      const imageSize =
        (contentWidth - totalMargins - paddingHorizontal) / imagesPerRow;

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

        const attrLines = entries.length;
        const photos = Array.isArray(item.fotos) ? item.fotos : [];
        const photoRows = Math.ceil(photos.length / imagesPerRow);

        const boxHeight =
          boxPadding * 2 +
          30 +
          attrLines * lineHeight +
          (photos.length > 0 ? 30 : 0) +
          photoRows * (imageSize + imageMargin) -
          15;

        if (index > 0 || cursorY + boxHeight > pageHeight - footerHeight) {
          doc.addPage();
          drawHeader(doc, pageWidth);
          cursorY = margin.top;
        }

        doc.setDrawColor("#BBBBBB");
        doc.setFillColor("#F9F9F9");
        doc.setLineWidth(0.7);
        roundedRect(margin.left, cursorY, contentWidth, boxHeight, 6);
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
          const maxChars = Math.floor(valueMaxWidth / 6);
          let displayVal =
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

        if (photos.length > 0) {
          const fotosTitleY = attrY;
          doc.setFontSize(10);
          doc.setFont(undefined, "bold");
          doc.setTextColor("#333");
          doc.text("Fotos:", margin.left + boxPadding, fotosTitleY);

          let photoX = margin.left + boxPadding;
          let photoY = fotosTitleY + lineHeight / 2;

          photos.forEach((photo, i) => {
            if (!photo.imagen64) return;

            if (i > 0 && i % imagesPerRow === 0) {
              photoX = margin.left + boxPadding;
              photoY += imageSize + imageMargin;
            }

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
        }

        cursorY += boxHeight + 15;
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(doc, pageWidth, pageHeight, i, totalPages);
      }

      // Guardar PDF
      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      doc.save(`inventario_${dateString.trim()}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleExportPDF = () => {
    if (!data.length) return;

    setLoadingGenerate(true);

    // Espera un pequeño delay para que React actualice el DOM antes de generar el PDF
    setTimeout(() => {
      generatePDF();
    }, 50);
  };

  return (
    <Button
      variant="contained"
      color="info"
      fullWidth
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
      disabled={loading || loadingGenerate}
      endIcon={<PictureAsPdfIcon />}
    >
      {loadingGenerate ? (
        <div className="flex items-center">
          {/* 3 dots with Tailwind animate-ping and delay */}
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
        <div>Exportar PDF</div>
      )}
    </Button>
  );
};

export default ExportPDFButton;
