import "./styles/variables.css";
import "./styles/Navegacion.css";
import "./styles/styles.css";
import React, { useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Container,
  Typography,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import {
  Person as IconPerson,
  Room as IconLocation,
  PictureAsPdf as IconPDF,
  ExpandMore as IconExpand,
  Payment as IconPayment,
  Money as IconMoney,
  Assignment as IconAssignment,
  PhotoCamera as IconPhotoCamera,
  ShowChart as IconShowChart,
  Close,
} from "@mui/icons-material";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PDFNaucalpan from "./PDF/PDFNaucalpan";
import PDFFromNodes from "./PDF/components/PDFFromNodes";
import Ubicacion from "./Ubicacion";
import ContribuyenteSection from "./sections/ContribuyenteSection";
import AdeudosSection from "./sections/AdeudosSection";
import FotografiasSection from "./sections/FotografiasSection";
import PagosSection from "./sections/PagosSection";
import TablaProcesoSection from "./sections/TablaProcesoSection";
import UbicacionSection from "./sections/UbicacionSection";
import awaitms from "./Custom/awaitms";
import adeudo from "./Custom/adeudos";
import DatosFaltantesSection from "./sections/DatosFaltantesSection";
import GraficasSection from "./sections/GraficasSection";
import usePDF from "./store/usePDF";
import PdfViewer from "./generic/PDFViewer";
import BotonVerPdf from "./BotonVerPdf";

const contents = (data) => [
  {
    button: (
      <ContribuyenteSection
        contribuyente={data.contribuyente}
        domicilio={data.domicilio}
      />
    ),
  },
];

const Navegacion = ({
  contribuyente,
  pagos,
  adeudos,
  coordenadas,
  domicilio,
  fotos,
  plaza,
  datosFaltantes,
  acciones,
  rol = "Gestor", //* 'Gestor' || 'Coordinador'
}) => {
  const [value, setValue] = useState(
    "Graficas" /* "FormularioDatosFaltantes" */
  );

  const { blob, getBlob } = usePDF();
  const [urlBlob, setUrlBlob] = useState();
  // console.log({ blob, navegacion: true, getBlob });
  const [handleExportPdf, setHandleExportPdf] = useState(null);
  const [prueba, setPrueba] = useState();
  const [loading, setLoading] = React.useState(false);
  const [visiblePDF, setVisiblePDF] = useState(false);

  async function handleClickInform() {
    setLoading(true);
    handleExportPdf();
    await awaitms(2000);
    setLoading(false);
  }
  async function handleClickInform() {
    setLoading(true);
    handleExportPdf();
    await awaitms(2000);
    setLoading(false);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderContent = (value) => {
    // const name = options[value];
    switch (value) {
     /*  case "FormularioDatosFaltantes":
        return <DatosFaltantesSection {...datosFaltantes} />; */
      case "Contribuyente":
        if (contribuyente && domicilio ) {
          return (
            <ContribuyenteSection
              contribuyente={contribuyente}
              domicilio={domicilio}
              rol={rol}
            />
          );
        }else{
          return null
        }
        
        return <PagosSection pagos={pagos} />;
      case "Graficas":
        return <GraficasSection pagos={pagos} adeudo={adeudo} />;
      case "Pagos":
        return <PagosSection pagos={pagos} />;
      case "Adeudo":
        return <AdeudosSection adeudos={adeudos} />;
      case "Acciones realizadas":
        return <TablaProcesoSection acciones={acciones}/>;
      case "Fotografías capturadas":
        return <FotografiasSection fotos={fotos} />;

      default:
        return null;
    }
  };

  const handleExportToPDF = () => {
    if (handleExportPdf) handleExportPdf();
  };
  const handleShowPDF = async () => {
    if (getBlob) await getBlob();
    // await awaitms(5000);
    setVisiblePDF(true);
  };
  useEffect(() => {
    Ubicacion;
  }, []);

  return (
    <Container className="busqueda-contribuyente" maxWidth={"100%"}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          width: "100%",
          textAlign: "center",
        }}
      >
        {plaza}
      </Typography>

      <BottomNavigation showLabels value={value} onChange={handleChange}>
       {/*  <BottomNavigationAction
          label="Datos Faltantes"
          value="FormularioDatosFaltantes"
          icon={<ListAltOutlinedIcon />}
        /> */}
        <BottomNavigationAction
          label="Contribuyente"
          value="Contribuyente"
          icon={<IconPerson />}
        />
        <BottomNavigationAction
          label="Graficas"
          value="Graficas"
          icon={<IconShowChart />}
        />
        {/* Otras BottomNavigationAction aquí */}
        <BottomNavigationAction
          label="Pagos"
          value="Pagos"
          icon={<IconPayment />}
        />
        <BottomNavigationAction
          label="Adeudo"
          value="Adeudo"
          icon={<IconMoney />}
        />
        <BottomNavigationAction
          label="Acciones realizadas"
          value="Acciones realizadas"
          icon={<IconAssignment />}
        />
        <BottomNavigationAction
          label="Fotografías capturadas"
          value="Fotografías capturadas"
          icon={<IconPhotoCamera />}
        />
      </BottomNavigation>
      <Box mt={2}>{renderContent(value)}</Box>
      <Accordion defaultExpanded>
        <AccordionSummary
          style={{ color: "var(--color-text)" }}
          expandIcon={<IconExpand />}
        >
          <IconLocation />
          <Typography>Ubicación</Typography>
        </AccordionSummary>
        <AccordionDetails defaultValue={0}>
          <UbicacionSection coordenadas={coordenadas} />
        </AccordionDetails>
      </Accordion>

      <PDFFromNodes
        // WidthPoints: 612, // 8.5 x 72
        // HeightPoints: 792, // 11 x 72
        width={612}
        height={792}
        setHandleExport={setHandleExportPdf}
        isVisible={false}
        nodes={[
          <PDFNaucalpan
            {...{
              contribuyente,
              pagos,
              adeudos,
              coordenadas,
              domicilio,
              fotos,
              plaza,
            }}
          />,
        ]}
      />
      <div id={"ITEM###344"}></div>
      <Box
        open={true}
        className={`PDFFromNodes ${!visiblePDF ? "hide" : ""}`}
        onClose={() => setVisiblePDF(false)}
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          width: "100vw",
          zIndex: 100,
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5">Visor de PDF</Typography>
            <Box marginLeft={"auto"}>
              <IconButton color="inherit">
                <Close onClick={() => setVisiblePDF(false)} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <PdfViewer pdfBlob={blob} />
      </Box>
      {/* <PDFViewerByBlob pdfBlob={blob}></PDFViewerByBlob> */}

      <LoadingButton
        color="info"
        style={{
          position: "absolute",
          top: "120px",
          right: "35px",
        }}
        onClick={handleClickInform}
        loading={loading}
        loadingPosition="start"
        startIcon={<IconPDF />}
        variant="contained"
      >
        <span>Informe</span>
      </LoadingButton>
      {/* <LoadingButton
        color="info"
        style={{
          position: "absolute",
          top: "170px",
          right: "40px",
        }}
        onClick={() => {
          if (getBlob) getBlob();
          setVisiblePDF(true);
        }}
        loading={loading}
        loadingPosition="start"
        startIcon={<IconPDF />}
        variant="contained"
      >
        <span>Ver PDF</span>
      </LoadingButton> */}
      <BotonVerPdf onClick={handleShowPDF} />
    </Container>
  );
};

export default Navegacion;
