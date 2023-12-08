import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
import "./styles/PDFFromNodes.css";
import usePDF from "../../store/usePDF";
// interface }

const addPageByComponent = async ({ component, pdfDoc, width, height }) => {
  const canvas = await html2canvas(component, { scale: 4 });
  const size = {
    width: width || canvas.width,
    height: height || canvas.height,
  };
  // Crea un nuevo documento PDF
  const page = pdfDoc.addPage([size.width, size.height]);

  // Agrega la imagen capturada al documento PDF
  const pngImage = await pdfDoc.embedPng(canvas.toDataURL("image/png"));
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
  });
};
const getBlobByImage = async ({ refs, width, height }) => {
  // console.log("Download");

  const pdfDoc = await PDFDocument.create();

  // await addPageByComponent(component, pdfDoc);
  for (const ref of refs) {
    console.log(ref);
    console.log(ref.current);
    // Captura el componente como una imagen utilizando html2canvas
    if (!ref.current) continue;
    await addPageByComponent({
      component: ref.current,
      pdfDoc: pdfDoc,
      width,
      height,
    });
  }

  // Genera el archivo PDF
  const pdfBytes = await pdfDoc.save();

  // Crea un Blob con los bytes del PDF
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  return blob;
};

const handleGeneratePDF = async ({
  refs,
  callbackBlob,
  autoClick = true,
  width,
  height,
}) => {
  // const elements = refs.filter((ref) => Boolean(ref.current));
  const blob = await getBlobByImage({ refs, width, height });

  const isValidCallbackBlob =
    blob && callbackBlob && typeof callbackBlob === "function";
  if (isValidCallbackBlob) callbackBlob(blob);
  // Crea una URL para el Blob
  const url = URL.createObjectURL(blob);

  // Crea un enlace para descargar el PDF y simula un clic
  const a = document.createElement("a");
  a.href = url;
  a.download = "mi_componente.pdf";
  if (autoClick) a.click();

  // Limpia la URL creada
  URL.revokeObjectURL(url);
};

const PDFFromNodes = ({
  nodes,
  setHandleExport,
  isVisible = false,
  width,
  height,
}) => {
  const refs = nodes.map(() => useRef(null));
  const { setBlob, setGetBlob } = usePDF();
  const [isRenderer, setIsRenderer] = useState(false);
  const handleGetPDF = () =>
    handleGeneratePDF({
      refs,
      callbackBlob: setBlob,
      width,
      height,
    });

  useEffect(() => {
    if (isRenderer) return;
    if (!refs[0].current) return;
    setGetBlob(() => {
      handleGeneratePDF({
        refs: refs,
        callbackBlob: setBlob,
        autoClick: false,
        width,
        height,
      });
    });
  }, []);
  useEffect(() => {
    if (isRenderer) return;
    setIsRenderer(true);
    setHandleExport(() => handleGetPDF);
  }, []);
  // captureComponent();

  return (
    <div className={`PDFFromNodes ${isVisible ? "" : "hided"}`}>
      {nodes.map((node, i) => (
        <div className="width-fit" key={i} ref={refs[i]}>
          {node}
        </div>
      ))}
    </div>
  );
};

export default PDFFromNodes;
