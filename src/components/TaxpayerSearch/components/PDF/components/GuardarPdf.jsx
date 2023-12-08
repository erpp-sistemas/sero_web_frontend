import React from 'react';
import { Button } from '@mui/material';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { renderToStaticMarkup } from 'react-dom/server';

const ComponentToPdf = () => {
  const captureComponent = async () => {
    // Renderiza el componente React a una cadena HTML
    const componentHtml = renderToStaticMarkup(<YourComponent />);

    // Crea un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // Convierte la cadena HTML en un Uint8Array
    const htmlBytes = new TextEncoder().encode(componentHtml);

    // Crea una fuente y un tamaño para el contenido HTML
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    // Muestra el contenido HTML en el documento PDF
    page.drawText(componentHtml, {
      x: 50,
      y: page.getHeight() - 50,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Genera el archivo PDF
    const pdfBytes = await pdfDoc.save();

    // Crea un Blob con los bytes del PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Crea una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Crea un enlace para descargar el PDF y simula un clic
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi_componente.pdf';
    a.click();

    // Limpia la URL creada
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={captureComponent}>Descargar PDF</Button>
    </div>
  );
};

export default ComponentToPdf;
