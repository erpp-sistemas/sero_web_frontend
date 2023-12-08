import React, { useEffect, useState } from "react";

function PdfViewer({ pdfBlob }) {
  // const [pdfBlob, setPdfBlob] = useState(null);
  useEffect(() => {
    // Aquí generas o obtienes el Blob del PDF, por ejemplo, usando una librería como pdf-lib.
    // En este ejemplo, simplemente creamos un Blob vacío para demostrar el concepto.
    // const emptyBlob = new Blob([""], { type: "application/pdf" });
    // setPdfBlob(emptyBlob);
  }, []);

/*   if (!pdfBlob) return; */
  return (
    <>
      {/* <h1>Visor de PDF</h1> */}
      {pdfBlob && (
        <iframe
          title="Visor de PDF"
          width="100%"
          height="100%"
          style={{ overflowX: "scroll" }}
          src={URL.createObjectURL(pdfBlob)}
        >
          El navegador no admite la visualización de PDF.
        </iframe>
      )}
    </>
  );
}

export default PdfViewer;
