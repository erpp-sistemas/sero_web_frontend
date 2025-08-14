// pdfFormatUtils.js
import { jsPDF } from "jspdf";


export const cmToPt = (cm) => cm * 28.35;

export const formatDate = (value) => {
  if (!value) return "";
  const d = dayjs(value);
  return d.isValid() ? d.format("DD/MM/YYYY") : value;
};

export const drawHeader = (doc, pageWidth, images) => {
  const marginLeft = 40;
  const marginRight = 40;
  const leftImgWidth = cmToPt(3);
  const leftImgHeight = cmToPt(2);
  const headerTop = 15;

  if (images.base64ERPP) {
    doc.addImage(
      images.base64ERPP,
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

  if (images.base64HeaderRight) {
    doc.addImage(
      images.base64HeaderRight,
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

export const drawFooter = (doc, pageWidth, pageHeight, pageNum, totalPages, images) => {
  const footerHeight = 50;
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

  if (images.base64WorldIcon) {
    doc.addImage(images.base64WorldIcon, "PNG", leftX, leftY, iconSize, iconSize);
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

  if (images.base64MarkerIcon) {
    doc.addImage(
      images.base64MarkerIcon,
      "PNG",
      rightX - 12,
      rightY + 2 + (totalTextHeight - rightIconSize) / 2,
      rightIconSize,
      rightIconSize
    );
  }
  doc.setFontSize(8);
  doc.setTextColor("#333");

  const shiftLeft = 15;
  const addressX = rightX + rightIconSize + iconTextGapRight - shiftLeft;

  const addressLines = [
    "Jaime Balmes no.11 Torre A, Piso 1 int.B",
    "Polanco I Sección Miguel Hgo., CDMX.",
    "C.P. 11510",
  ];

  let currentY = rightY + 10;
  const lineHeight = 10;

  addressLines.forEach((line) => {
    doc.text(line, addressX, currentY);
    currentY += lineHeight;
  });
};

export const initializePDF = (images) => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  return { doc, pageHeight, pageWidth };
};

export const applyStandardStyles = (doc) => {
  // Estilos de texto estándar
  doc.setFont("helvetica");
  doc.setTextColor("#333");
};

// pdfFormatUtils.js (añadir estas funciones)
export const initializeResponsivePDF = (images) => {
  const doc = new jsPDF("p", "pt", "letter");
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  return { doc, pageHeight, pageWidth };
};

export const addResponsiveTitle = (doc, pageWidth, title) => {
  doc.setFontSize(16);
  doc.setTextColor("#1A237E");
  doc.setFont(undefined, "bold");
  doc.text(title, pageWidth / 2, 80, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor("#333");
  doc.setFont(undefined, "normal");
  return 90; // Retorna la posición Y después del título
};

export const addBulletList = (doc, items, startX, startY, options = {}) => {
  const { bullet = "•", lineHeight = 20, indent = 10, maxWidth } = options;
  let currentY = startY;
  
  items.forEach((item) => {
    if (item.bold) {
      doc.setFont(undefined, "bold");
      doc.text(`${bullet} ${item.text}`, startX, currentY);
      doc.setFont(undefined, "normal");
    } else {
      doc.text(`${bullet} ${item.text}`, startX, currentY);
    }
    currentY += lineHeight;
  });
  
  return currentY;
};