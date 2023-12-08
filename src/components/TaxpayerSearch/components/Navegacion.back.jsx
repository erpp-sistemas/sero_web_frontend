import React, { useEffect, useState } from "react";
import "./styles/Navegacion.css";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import RoomIcon from "@mui/icons-material/Room";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Fab,
} from "@mui/material";
import {
  Person,
  Home,
  LocationOn,
  Payment,
  Money,
  Assignment,
  PhotoCamera,
  PictureAsPdf,
  Add,
} from "@mui/icons-material";
import { BusquedaContribuyenteParams } from "./types";
import { domicilio } from "./Custom/domicilios";
import DatosDomicilio from "./DatosDomicilio";
import Ubicacion from "./Ubicacion";
import ControlNodes from "./class/ControlNodes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InformeTabla from "./InformeTabla";
import classNames from "./styles/classNames";
import TablaProceso from "./TablaProceso";
import Fotografias from "./Fotografias";
import PDFFromNodes from "./PDF/components/PDFFromNodes";
import PDFNaucalpan from "./PDF/PDFNaucalpan";
import "./styles/variables.css";
import Pagos from "./Pagos";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import Adeudos from "./Adeudos";
const options = [
  "Contribuyente",
  "Domicilio",
  "Ubicación geográfica",
  "Pagos",
  "Adeudo",
  "Acciones realizadas",
  "Fotografías capturadas",
];
/* 
Fecha De Pago
Descripcion
Monto Pagado
{
  FechaDePago: '',
  Descripcion: '',
  MontoPagado: '',
}
*/

const Navegacion = ({
  contribuyente,
  pagos,
  adeudos,
  coordenadas,
  domicilio,
  fotos,
  plaza,
}: BusquedaContribuyenteParams) => {
  const [value, setValue] = useState(0);
  const [handleExportPdf, setHandleExportPdf] = useState<any | null>(null);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const renderContent = (value: number) => {
    useEffect(() => {
      Ubicacion;
    }, []);
    // const name = options[value];
    switch (value) {
      case 0:
        return (
          <>
            <div>
              <Paper>
                {/* <Typography variant="h5">Datos del Contribuyente</Typography>
                <p>Contenido de Datos del Contribuyente</p> */}
                <DatosDomicilio
                  contribuyente={contribuyente}
                  domicilio={domicilio}
                />
              </Paper>
            </div>
          </>
        );
      case 1:
        return (
          <Box className={"nav-busqueda-contribuyente"}>
            <Paper
              sx={{ display: "flex", flexDirection: "column" }}
              className={classNames.articleHeader}
            >
              <Typography variant="h5" style={{ width: "100%" }}>
                Pagos
              </Typography>
              <Pagos filas={pagos} />
            </Paper>
          </Box>
        );
      case 2:
        return (
          <Box className={"nav-busqueda-contribuyente"}>
            <Paper
              sx={{ display: "flex", flexDirection: "column" }}
                className={classNames.articleHeader}
            >
              <Typography variant="h5" style={{ width: "100%" }}>
                Adeudos
              </Typography>
              <Adeudos filas={adeudos} />
            </Paper>
          </Box>
        );
      case 3:
        return (
          <Box className={"nav-busqueda-contribuyente"}>
            <Paper className={classNames.articleHeader}>
              <TablaProceso />
            </Paper>
          </Box>
        );
      case 4:
        return (
          <Box className={"nav-busqueda-contribuyente"}>
            <Paper className={classNames.articleHeader}>
              <Fotografias fotos={fotos} />
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };
  const handleExportToPDF = () => {
    if (handleExportPdf) handleExportPdf();
  };
  return (
    <Container className="busqueda-contribuyente" maxWidth={"100%" as "sm"}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction label="Contribuyente" icon={<Person />} />
        {/* <BottomNavigationAction
          label="Ubicación geográfica"
          icon={<LocationOn />}
          
        /> */}
        <BottomNavigationAction label="Pagos" icon={<Payment />} />
        <BottomNavigationAction label="Adeudo" icon={<Money />} />
        <BottomNavigationAction
          label="Acciones realizadas"
          icon={<Assignment />}
        />
        <BottomNavigationAction
          label="Fotografías capturadas"
          icon={<PhotoCamera />}
        />
        {/* <BottomNavigationAction
          label="Exportar a PDF"
          icon={<PictureAsPdf />}
          onClick={handleExportToPDF}
        /> */}
      </BottomNavigation>
      <Box mt={2}>{renderContent(value)}</Box>
      <Accordion>
        <AccordionSummary
          style={{ color: "var(--color-text)" }}
          expandIcon={<ExpandMoreIcon />}
        >
          <RoomIcon />
          <Typography>Ubicacion</Typography>
        </AccordionSummary>
        <AccordionDetails defaultValue={0}>
          <Paper className="nav-busqueda-contribuyente">
            {/* <div>
              <Typography variant="h5">Ubicación Geográfica</Typography>
              <p>Contenido de Ubicación Geográfica</p>
            </div> */}
            <Ubicacion coordenadas={coordenadas} />
          </Paper>
        </AccordionDetails>
      </Accordion>
      <PDFFromNodes
        setHandleExport={setHandleExportPdf}
        nodes={[
          <PDFNaucalpan
            {...{
              contribuyente,
              pagos,
              adeudos: adeudos,
              coordenadas,
              domicilio,
              fotos,
              plaza,
            }}
          />,
        ]}
      />

      {/* Botón Flotante en la Esquina Inferior Derecha */}

      <Fab
        color="primary"
        aria-label="Export to PDF"
        onClick={handleExportToPDF}
        style={{ position: "absolute", bottom: "30px", right: "20px" }}
      >
        <PictureAsPdf />
      </Fab>
    </Container>
  );
};

export default Navegacion;
