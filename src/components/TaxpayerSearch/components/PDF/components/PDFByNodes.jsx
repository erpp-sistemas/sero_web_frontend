import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
// interface }

const addPageByComponent = async (
  component,
  pdfDoc
) => {
  const canvas = await html2canvas(component, { scale: 3 });

  // Crea un nuevo documento PDF
  const page = pdfDoc.addPage([canvas.width, canvas.height]);

  // Agrega la imagen capturada al documento PDF
  const pngImage = await pdfDoc.embedPng(canvas.toDataURL("image/png"));
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  });
};

const PDFByNodes = ({ nodes }) => {
  const captureComponent = async () => {
    console.log("Download");

    const pdfDoc = await PDFDocument.create();

    // await addPageByComponent(component, pdfDoc);

    for (const node of nodes) {
      // Captura el componente como una imagen utilizando html2canvas
      await addPageByComponent(node, pdfDoc);
    }

    // Genera el archivo PDF
    const pdfBytes = await pdfDoc.save();

    // Crea un Blob con los bytes del PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Crea una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Crea un enlace para descargar el PDF y simula un clic
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi_componente.pdf";
    a.click();

    // Limpia la URL creada
    URL.revokeObjectURL(url);
  };

  captureComponent();
};

export default PDFByNodes;
