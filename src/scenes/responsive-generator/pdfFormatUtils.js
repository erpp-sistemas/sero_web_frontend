import dayjs from "dayjs";

export const cmToPt = (cm) => cm * 28.35;

export const formatDate = (value) => {
  if (!value) return "";
  const d = dayjs(value);
  return d.isValid() ? d.format("DD/MM/YYYY") : value;
};

// Header
export const drawHeader = (doc, pageWidth, images) => {
  const marginLeft = 40;
  const marginRight = 40;
  const headerTop = 15;

  if (images?.base64ERPP) {
    doc.addImage(images.base64ERPP, "PNG", marginLeft, headerTop, cmToPt(3), cmToPt(2));
  }

  if (images?.base64HeaderRight) {
    const rightImgWidth = cmToPt(9);
    const rightImgHeight = cmToPt(7.5);
    const rightX = pageWidth - marginRight - rightImgWidth;
    doc.addImage(images.base64HeaderRight, "PNG", rightX, headerTop, rightImgWidth, rightImgHeight);
  }

  const greenWidth = cmToPt(2);
  const lineY = headerTop + cmToPt(2) + 5;
  doc.setFillColor("#4caf50");
  doc.rect(marginLeft, lineY, greenWidth, 3, "F");
  doc.setFillColor("#999999");
  doc.rect(marginLeft + greenWidth, lineY, pageWidth - marginLeft * 2 - greenWidth, 3, "F");
};

// Footer
export const drawFooter = (doc, pageWidth, pageHeight, pageNum, totalPages, images) => {
  const marginLeft = 40;
  const marginRight = 40;
  const footerHeight = 50;

  const footerY = pageHeight - footerHeight + 10;
  const greenWidth = cmToPt(2);

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

  // Página
  doc.setFontSize(10);
  doc.setTextColor("#444");
  doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - footerHeight / 2 + 5, { align: "center" });

  // Iconos y textos
  const iconSize = 12;
  const iconTextGap = 5;
  const leftX = marginLeft;
  const leftY = pageHeight - footerHeight / 2 - iconSize / 2 + 5;
  if (images?.base64WorldIcon) {
    doc.addImage(images.base64WorldIcon, "PNG", leftX, leftY, iconSize, iconSize);
  }
  doc.setFontSize(10);
  doc.setTextColor("#333");
  doc.text("www.erpp.mx", leftX + iconSize + iconTextGap, leftY + iconSize * 0.75);

  const rightIconSize = 12;
  const iconTextGapRight = 5;
  const maxTextWidth = 150;
  const rightBlockWidth = rightIconSize + iconTextGapRight + maxTextWidth;
  const rightX = pageWidth - marginRight - rightBlockWidth;
  const totalTextHeight = 3 * 10;
  const rightY = pageHeight - footerHeight / 2 - totalTextHeight / 2;

  if (images?.base64MarkerIcon) {
    doc.addImage(images.base64MarkerIcon, "PNG", rightX - 12, rightY + 2 + (totalTextHeight - rightIconSize) / 2, rightIconSize, rightIconSize);
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

// Función de justificado con paginación
export const textJustifyAutoPaging = (doc, text, x, y, width, lineHeight, marginBottom = 20) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const lines = doc.splitTextToSize(text, width);
  const fontSize = doc.getFontSize();
  const charWidth = (doc.getStringUnitWidth(" ") * fontSize) / doc.internal.scaleFactor;

  lines.forEach((line, idx) => {
    if (y + lineHeight > pageHeight - marginBottom) {
      doc.addPage();
      y = 30;
      drawHeader(doc, doc.internal.pageSize.getWidth(), {}); // header vacío opcional
      drawFooter(doc, doc.internal.pageSize.getWidth(), pageHeight, doc.internal.getCurrentPageInfo().pageNumber, "{totalPages}", {});
    }

    const words = line.trim().split(" ");
    if (words.length === 1 || idx === lines.length - 1) {
      doc.text(line, x, y);
    } else {
      const lineWidth = doc.getTextWidth(line);
      const spaceCount = words.length - 1;
      const extraSpace = (width - lineWidth) / spaceCount;

      let currentX = x;
      words.forEach((word, i) => {
        doc.text(word, currentX, y);
        if (i < words.length - 1) currentX += doc.getTextWidth(word) + charWidth + extraSpace;
      });
    }

    y += lineHeight;
  });

  return y;
};
