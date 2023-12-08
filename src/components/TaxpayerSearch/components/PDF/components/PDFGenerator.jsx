import { useEffect } from "react";
import html2canvas from "html2canvas";

import {
  PDFDocument,
  rgb,
  StandardFonts, PDFFont
} from "pdf-lib";

import { PDFPage } from "pdf-lib";
import PageCoordinates from "./PageCoordinates";
const PageSize = {
  WidthInches: 8.5,
  HeightInches: 11,
  WidthPoints: 612, // 8.5 x 72
  HeightPoints: 792, // 11 x 72
};



const coordenatesImageByIndex = [
  { x: 0.1, y: 0.9 },
  { x: 0.85, y: 0.9 },
];
const generatePDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const { WidthPoints, HeightPoints } = PageSize;
  const pageCoordinates = new PageCoordinates(WidthPoints, HeightPoints);
  const page = pdfDoc.addPage([WidthPoints, HeightPoints]);

  // Cargar imágenes
  const imageUrls = [
    "https://cdn-icons-png.flaticon.com/512/993/993891.png",
    "https://icones.pro/wp-content/uploads/2021/07/icone-d-affaires-et-d-entrepreneurs-jaune.png",
    // 'https://previews.123rf.com/images/garagestock/garagestock1612/garagestock161200179/66904437-empresa-icono-de-l%C3%ADnea.jpg',
    //  'https://img.freepik.com/vector-premium/icono-linea-concepto-empresa-ilustracion-elemento-simple-diseno-simbolo-esquema-concepto-empresa-puede-utilizar-ui-ux-web-movil_159242-3921.jpg'
  ];
  const imagePromises = imageUrls.map(async (url, index) => {
    const imageBytes = await fetch(url).then((response) =>
      response.arrayBuffer()
    );
    // const isFirtsImage = index === 0;
    const coordenates = coordenatesImageByIndex[index];
    // Ancho de la página
    // Altura de la página
    const { x, y } = pageCoordinates.get(coordenates.x, coordenates.y);
    // const x = PageSize.WidthPoints * coordenates.x;
    // const y = PageSize.HeightPoints * coordenates.y;

    const image = await pdfDoc.embedPng(imageBytes);
    // const { width, height } = image.scale(0.5);
    page.drawImage(image, {
      x: x,
      y: y,
      width: 50,
      height: 50,
    });
  });

  await Promise.all(imagePromises);

  // Agregar texto
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const text = "Texto en centro, centro";
  const textSize = 20;
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textX = page.getWidth() / 2 - textWidth / 2;
  page.drawText(text, {
    x: textX,
    y: 375,
    size: textSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  // Definir el tamaño y la posición de la tabla
  const tableX = 50;
  const tableY = 650;
  const cellMargin = 4;
  const cellWidth = 175; // Ancho de cada celda
  const cellHeight = 20; // Alto de cada celda
  const numRows = 3;
  const numCols = 3;

  // Definir el color del fondo de la tabla (azul)
  const backgroundColor = rgb(0, 0, 1);
  // const backgroundColor = rgb(1, 14, 27);

  // Crear una función para dibujar una celda de la tabla con fondo azul y texto blanco
  const drawTableCell = (
    x,
    y,
    width,
    height,
    text,
    font,
    fontSize,
    pagee
  ) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: backgroundColor,
    });

    page.setFont(font);
    page.setFontSize(fontSize);
    page.drawText(text, {
      x: x + cellMargin,
      y: y - cellMargin + 5,
      size: fontSize,
      lineHeight: 12,

      color: rgb(1, 1, 1), // Texto blanco
    });
  };

  // Ejemplo: Dibujar una tabla de 3x3
  // const helveticaFontT = await pdfDoc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const x = tableX + j * cellWidth;
      const y = tableY - i * cellHeight;
      const cellText = `Celda ${i}-${j}`;
      drawTableCell(
        x,
        y,
        cellWidth,
        cellHeight,
        cellText,
        helveticaFont,
        12,
        page
      );
    }
  }
  const elementToCapture = document.getElementById("logos");

  // Tomar una captura del elemento HTML
  const canvas = await html2canvas(elementToCapture);
  const imgData = canvas.toDataURL("image/png");

  // Agregar la imagen capturada al PDF
  const image = await pdfDoc.embedPng(imgData);

  page.drawImage(image, {
    x: HeightPoints / 2 - (canvas.width - 80),
    y: HeightPoints - canvas.height - 200, // Ajustar la posición según sea necesario
    width: canvas.width - 40,
    height: canvas.height - 20,
  });
  const insertTableFromJsx = async () => {
    // Capturar el contenido del componente MyPDFComponent
    const componentContainer = document.getElementById("myTable");
    // ReactDOM.render(<PDFTable />, componentContainer);

    // Capturar el contenido del componente como una imagen
    const scale = 3; // Escala de 2, lo que duplica la resolución
    const componentCanvas = await html2canvas(componentContainer, { scale });

    // Convertir la imagen en formato base64
    const componentImage = componentCanvas.toDataURL("image/png");

    // Embed de la imagen en el PDF
    const image = await pdfDoc.embedPng(componentImage);

    // Obtener el ancho y alto de la imagen capturada
    const imgWidth = componentCanvas.width;
    const imgHeight = componentCanvas.height;

    // Dibujar la imagen en el PDF
    page.drawImage(image, {
      x: WidthPoints / 2 - imgWidth / 6, // Ajusta la posición según sea necesario
      y: 400 - imgHeight - 50, // Ajusta la posición según sea necesario
      width: imgWidth / 3,
      height: imgHeight / 3,
    });
  };
  await insertTableFromJsx();
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url);
};

const PDFGenerator = () => {
  useEffect(() => {
    generatePDF();
  }, []);

  return (
    <div>
      <p>Generando PDF...</p>
    </div>
  );
};

export default PDFGenerator;
