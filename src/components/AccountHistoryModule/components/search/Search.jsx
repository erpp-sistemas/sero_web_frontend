import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useStoreZustand } from "../../../../zustan_store/useStoreZustand";
import axios from "axios";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Pdf from "../pdf";
import ReactPDF from "@react-pdf/renderer";
import useAccountData from "../../../../hooks/accountDataHook";
import useCombinedSlices from "../../../../hooks/useCombinedSlices";
import PropTypes from "prop-types";
import { withErrorBoundary } from "@sentry/react";
import PlaceSelect from "../../../PlaceSelect";
import CancelIcon from "@mui/icons-material/Cancel";
import Pdf2 from "../pdf2";
import html2canvas from "html2canvas";
/**
 * Componente de búsqueda que permite buscar información por cuenta y realizar búsquedas personalizadas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.handleOpenDialog - Función para abrir el diálogo personalizado.
 * @param {Function} props.handelOpenBackDrop - Función para abrir el fondo de carga.
 * @param {Function} props.handelCloseBackDrop - Función para cerrar el fondo de carga.
 * @param {Object} props.ownerDetails - Detalles del propietario.
 * @param {Object} props.ownerHomeImages - Imágenes de la casa del propietario.
 * @param {Object} props.ownerDebts - Deudas del propietario.
 * @param {Object} props.ownerPayments - Pagos del propietario.
 * @returns {JSX.Element} - Elemento JSX que representa el componente de búsqueda.
 */
function Search({
  handleOpenDialog,
  handelOpenBackDrop,
  handelCloseBackDrop,
  ownerDetails,
  ownerHomeImages,
  ownerDebts,
  ownerPayments,
  ownerActions,
  accountNumber,
}) {


  const pdfViewerRef = React.useRef(null);
  const [capturedImageURL, setCapturedImageURL] = React.useState(null);

  // ... (other state and useEffect)

 /*  React.useEffect(() => {
    const handleCapture = () => {
      if (pdfViewerRef.current) {


          // Increase pixel ratio for higher resolution
      // Increase pixel ratio for higher resolution
      const scale = window.devicePixelRatio || 1;

      // Set canvas dimensions based on the original size and pixel ratio
      const width = pdfViewerRef.current.offsetWidth * scale;
      const height = pdfViewerRef.current.offsetHeight * scale;

        html2canvas(pdfViewerRef.current, {    useCORS: true,
          scale: scale,
          width: width,
          height: height,
          // Set quality for better image quality (default is 0.92)
          // Adjust this value as needed (between 0 and 1)
          quality: 1, }).then((canvas) => {
          const image = canvas.toDataURL("image/png");
          setCapturedImageURL(image);
        });
      }
    };

    // Call the capture function when the component mounts
    handleCapture();
  }, []); */



  const { setPlazaNumber, plazaNumber, setAlertInfoFromRequest } =
    useStoreZustand();
  const [searchValue, setSearchValue] = React.useState("");

  /* const { setAccountData} = useStoreZustand(); */
  const { setAccountData, alertInfo, setAlertInfo } = useCombinedSlices();
  const [openPDF, setOpenPDF] = React.useState(false);

  /**
   * Abre el visor de PDF.
   */
  const handleOpenPDF = () => {
    setOpenPDF(true);
  };
  /**
   * Cierra el visor de PDF.
   */
  const handleClosePDF = () => {
    setOpenPDF(false);
  };
  /**
   * Realiza la búsqueda de cuenta al hacer clic en el botón de búsqueda.
   */
  const handleAccountSearch = () => {
    setAlertInfo(null);
    const startTime = Date.now(); // Guarda el tiempo de inicio
    handelOpenBackDrop();
    const apiUrl = `http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${searchValue}/`;
    // Aquí puedes realizar la acción de búsqueda con el valor de "cuenta"
    // Por ahora, solo mostraremos el valor en la consola

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const requestInfo = {
          url: apiUrl,
          status: response.status,
          statusText: response.statusText,
        };

        

        setAlertInfo(requestInfo);

        // Hacer algo con los datos, por ejemplo, actualizar el estado del componente
        setAccountData(data);
      } catch (error) {
        // Manejar errores, por ejemplo, imprimir el mensaje de error en la consola

        console.error("Error al hacer la solicitud:", error.message);

        const requestInfo = {
          url: apiUrl,
          status: error.response ? error.response.status : undefined,
          statusText: error.response ? error.response.statusText : undefined,
        };

        setAlertInfo(requestInfo);
      } finally {
        const endTime = Date.now(); // Guarda el tiempo de finalización
        const duration = endTime - startTime; // Calcula la duración de la solicitud

        // Cierra el backdrop después de completar la búsqueda, considerando la duración
        setTimeout(() => {
          handelCloseBackDrop();
        }, duration);
        setTimeout(() => {
          handelCloseBackDrop();
          setAlertInfo(null);
        }, duration + 3000);
      }
    };

    // Llama a la función para hacer la solicitud al montar el componente
    fetchData();

    // Si necesitas hacer algo cuando el componente se desmonta, puedes devolver una función desde useEffect
  };
  /**
   * Maneja el cambio en el control (plaza) y actualiza el estado correspondiente.
   *
   * @param {Object} e - Evento de cambio.
   * @param {string} controlName - Nombre del control.
   */

  const handlePlaceChange = (e) => {
    setPlazaNumber(e.target.value);
  };
  return (
    <>
      <Box sx={{ width: "35%" }}>
        <PlaceSelect handlePlaceChange={handlePlaceChange} />
      </Box>
      {/*   <TextField
        color="secondary"
        id="filled-select-currency"
        select
        label="Plaza"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PlaceIcon />
            </InputAdornment>
          ),
        }}
        variant="filled"
        sx={{ width: "30%" }}
        defaultValue=""
        onChange={(e) => changeControl(e, "plaza")}
      >
        <MenuItem key="" value="">
          {" "}
          No sabe
        </MenuItem>
        <MenuItem key="2" value="2">
          {" "}
          Cuautitlàn Izcalli{" "}
        </MenuItem>
        <MenuItem key="3" value="3">
          {" "}
          Naucalpan
        </MenuItem>
        <MenuItem key="4" value="4">
          {" "}
          Cuautitlan Mèxico
        </MenuItem>
      </TextField> */}

      <TextField
        color="secondary"
        id="input-with-icon-textfield"
        label="Cuenta"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountTreeIcon />
            </InputAdornment>
          ),
        }}
        variant="filled"
        sx={{ width: "20%" }}
        onChange={(e) => setSearchValue(e.target.value)}
        value={accountNumber || searchValue}
      />
      <Button
        color="secondary"
        sx={{ color: "black", fontWeight: "bolder" }}
        onClick={handleAccountSearch}
        variant="contained"
        startIcon={<SearchIcon />}
      >
        Bùsqueda
      </Button>
      <Button
        onClick={handleOpenDialog}
        variant="contained"
        startIcon={<ManageSearchIcon />}
      >
        Personalizada
      </Button>
      {/* <div>
        <img src={geo_punto} style={{width:"400px",height:"400px"}}/>
      </div> */}
      <Button onClick={handleOpenPDF} variant="contained">
        <PictureAsPdfIcon />
      </Button>

     {/*  <div
        ref={pdfViewerRef}
        style={{ width: "200px", height: "150px", backgroundColor: "red" }}
      >
       
        <img
          style={{ width: "100%", height: "auto" }}
          src={
            "https://bucket-files-msg.s3.us-east-2.amazonaws.com/00000007-0000000719/01/2024%2C%2014%3A08%3A10?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT5FEWJS6OYP6WLHR%2F20240119%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20240119T200810Z&X-Amz-Expires=604800&X-Amz-Signature=3865c886928eee77e0ab2547ad4c638e5fcc789d6e7df187f78c38f4a335a40e&X-Amz-SignedHeaders=host"
          }
        />
      </div>
      {capturedImageURL && (
        <img
          style={{ width: "100%", height: "auto" }}
          src={`${capturedImageURL}`}
        />
      )} */}

      {openPDF && ownerDetails && (
        <Dialog open={openPDF} onClose={openPDF} maxWidth={true}>
          <DialogTitle>Descarga tu Pdf</DialogTitle>
          <DialogContentText>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {(() => {
                const imagesLength = ownerHomeImages.length;

                switch (true) {
                  case imagesLength === 0:
                    return null; // No PDFDownloadLink for 0 images
                  case imagesLength <= 3:
                    return (
                      <PDFDownloadLink
                        document={
                          <Pdf
                            ownerDetails={ownerDetails}
                            ownerHomeImages={ownerHomeImages}
                            ownerDebts={ownerDebts}
                            ownerPayments={ownerPayments}
                            ownerActions={ownerActions}
                          />
                        }
                        fileName={`Cuenta_No_${ownerDetails[0].account}.pdf`}
                      >
                        <Button color="secondary">
                          {" "}
                          <PictureAsPdfIcon />
                        </Button>
                      </PDFDownloadLink>
                    );
                  case imagesLength <= 6:
                    // Render for 4 to 6 images
                    // ...
                    break;
                  case imagesLength > 6:
                    return (
                      <PDFDownloadLink
                        document={
                          <Pdf2
                            ownerDetails={ownerDetails}
                            ownerHomeImages={ownerHomeImages}
                            ownerDebts={ownerDebts}
                            ownerPayments={ownerPayments}
                            ownerActions={ownerActions}
                          />
                        }
                        fileName={`Cuenta_No_${ownerDetails[0].account}.pdf`}
                      >
                        <Button color="secondary">
                          {" "}
                          <PictureAsPdfIcon />
                        </Button>
                      </PDFDownloadLink>
                    );
                    break;
                  // Add cases for other lengths as needed

                  default:
                    return null; // Default case (fallback)
                }
              })()}
            </Box>
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleClosePDF} color="secondary">
              <CancelIcon />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
Search.propTypes = {
  handleOpenDialog: PropTypes.func.isRequired,
  handelOpenBackDrop: PropTypes.func.isRequired,
  handelCloseBackDrop: PropTypes.func.isRequired,
  ownerDetails: PropTypes.object,
  ownerHomeImages: PropTypes.object,
  ownerDebts: PropTypes.object,
  ownerPayments: PropTypes.object,
};
export default withErrorBoundary(Search);
