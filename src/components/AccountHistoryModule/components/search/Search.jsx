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
import { PDFViewer } from "@react-pdf/renderer";
import Pdf from "../pdf";
import ReactPDF from "@react-pdf/renderer";
import useAccountData from "../../../../hooks/accountDataHook";
import useCombinedSlices from "../../../../hooks/useCombinedSlices";
import PropTypes from 'prop-types';
import { withErrorBoundary } from '@sentry/react';
import PlaceSelect from "../../../PlaceSelect";

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
}) {
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
  

  const handlePlaceChange = (e)=>{
    setPlazaNumber(e.target.value);

  }
  return (
    <>
    <Box sx={{width:"35%"}}>
    <PlaceSelect handlePlaceChange={handlePlaceChange}/>
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
        value={searchValue}
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
      <Button onClick={handleOpenPDF} variant="contained">
        <PictureAsPdfIcon />
      </Button>
      {openPDF && ownerDetails && (
        <Dialog open={openPDF} onClose={openPDF} maxWidth={true}>
          <DialogTitle>Pdf Visualizer</DialogTitle>
          <DialogContentText>
            <PDFViewer width={800} height={1200}>
              <Pdf
                ownerDetails={ownerDetails}
                ownerHomeImages={ownerHomeImages}
                ownerDebts={ownerDebts}
                ownerPayments={ownerPayments}
              />
            </PDFViewer>
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleClosePDF} color="secondary">
              Cerrar
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
