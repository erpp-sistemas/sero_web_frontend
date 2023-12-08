import { Typography } from "@mui/material";
import "./styles/styles.css";
import classNames from "./styles/classNames";
import InformeTabla from "./InformeTabla";
import Fotografias from "./Fotografias";
import FormularioBuscarContribuyente from "./FormularioBuscarContribuyente";
import PDFNaucalpan from "./PDF/PDFNaucalpan";
import PaginaCartaInvitacion from "./PDF/components/PaginaCartaInvitacion";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";

import { useEffect, useState } from "react";
import PDFFromNodes from "./PDF/components/PDFFromNodes";
import DatosDomicilio from "./DatosDomicilio";
const PageSize = {
  WidthInches: 8.5,
  HeightInches: 11,
  WidthPoints: 612, // 8.5 x 72
  HeightPoints: 792, // 11 x 72
};



const handlePDFDownloadByComponent = async ({
  // idElement,
  options,
  element,
}) => {
  const pdfDoc = await PDFDocument.create();
  const { WidthPoints, HeightPoints } = PageSize;
  const page = pdfDoc.addPage([WidthPoints, HeightPoints]);

  const agregarDesdeJsx = async () => {
    // Capturar el contenido del componente MyPDFComponent
    // const componentContainer = document.getElementById(idElement);
    // ReactDOM.render(<PDFTable />, componentContainer);

    // Capturar el contenido del componente como una imagen
    const scale = 3; // Escala de 2, lo que duplica la resolución
    const componentCanvas = await html2canvas(element, { scale });

    // Convertir la imagen en formato base64
    const componentImage = componentCanvas.toDataURL("image/png");

    // Embed de la imagen en el PDF
    const image = await pdfDoc.embedPng(componentImage);

    // Obtener el ancho y alto de la imagen capturada
    const imgWidth = componentCanvas.width;
    const imgHeight = componentCanvas.height;

    // Dibujar la imagen en el PDF
    page.drawImage(image, { ...options, width: imgWidth, height: imgHeight });
  };
  agregarDesdeJsx();
};



const BusquedaContribuyente = ({
  plaza = "nombre plaza",
  contribuyente,
  domicilio,
  adeudos: adeudo,
  fotos,
  coordenadas,
}) => {
  const [isRenderer, setIsRenderer] = useState(false);
  // const refPDFNaucalpan = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   ControlNodes.storeNode("mapa", () => (
  //     <Ubicacion coordenadas={coordenadas} />
  //   ));
  // }, []);
  useEffect(() => {
    setIsRenderer(true);
    if (!isRenderer) return;

    const nodes = [
      <PDFNaucalpan coordenadas={coordenadas} />,
      <PaginaCartaInvitacion />,
    ];
    console.log("is renderer busqeuda contribuyente");
    PDFFromNodes({ nodes });
  }, [isRenderer]);
  // const handleClickDownload = () => {
  //   if (!refPDFNaucalpan.current) return console.log("Current is null");

  //   // if (1 > 0) return;
  //   try {
  //     handlePDFDownloadByComponent({
  //       // idElement: "PDFNaucalpan",
  //       element: refPDFNaucalpan.current,
  //       options: {
  //         x: 0,
  //         y: 0,
  //         width: PageSize.WidthInches,
  //         height: PageSize.HeightInches,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <div className={classNames.principal}>
      
      <Typography className={classNames.title} variant="h3">
        Plaza: {plaza}
      </Typography>
      {/* <ListaPlaza /> */}

      <FormularioBuscarContribuyente />
      <DatosDomicilio contribuyente={contribuyente} domicilio={domicilio} />
      {/* <DatosContribuyente contribuyente={contribuyente} /> */}

      {/* <Domicilio domicilio={domicilio} /> */}

      {/* <Ubicacion coordenadas={coordenadas} /> */}
      <InformeTabla adeudo={adeudo} />
      <Fotografias fotos={fotos} />
    </div>
  );
};

export default BusquedaContribuyente;
/* 
-Datos del contribuyente
-Domicilio
-Ubicacion geografica
-Pagos
-Adeudo
-Acciones realizadas
-Fotografias capturadas
*/
