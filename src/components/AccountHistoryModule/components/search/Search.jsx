import {
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
import ReactPDF from '@react-pdf/renderer';
import useAccountData from '../../../../hooks/accountDataHook'
import useCombinedSlices from "../../../../hooks/useCombinedSlices";
function Search({ handleOpenDialog, handelOpenBackDrop, handelCloseBackDrop,ownerDetails,ownerHomeImages,ownerDebts,ownerPayments}) {
  const {setPlazaNumber,plazaNumber,setAlertInfoFromRequest,alertInfo}=useStoreZustand();
  const [searchValue, setSearchValue] = React.useState("");
  
  /* const { setAccountData} = useStoreZustand(); */
  const{setAccountData} = useAccountData()
  const [openPDF, setOpenPDF] = React.useState(false);
  console.log(ownerHomeImages);
  const handleOpenPDF = () => {
    setOpenPDF(true);
  };
  const handleClosePDF = () => {
    setOpenPDF(false);
    
  };
 


  

  const handleAccountSearch = () => {
    setAlertInfoFromRequest(null)
    const startTime = Date.now(); // Guarda el tiempo de inicio
    handelOpenBackDrop();
    const apiUrl = `http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${searchValue}/`;
    // Aquí puedes realizar la acción de búsqueda con el valor de "cuenta"
    // Por ahora, solo mostraremos el valor en la consola

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        console.log(response);
    
        const requestInfo = {
          url: apiUrl,
          status: response.status,
          statusText: response.statusText,
        };
    
        setAlertInfoFromRequest(requestInfo);
    
        // Hacer algo con los datos, por ejemplo, actualizar el estado del componente
        setAccountData(data);
      } catch (error) {
        // Manejar errores, por ejemplo, imprimir el mensaje de error en la consola
        console.log(error);
        console.error("Error al hacer la solicitud:", error.message);
    
        const requestInfo = {
          url: apiUrl,
          status: error.response ? error.response.status : undefined,
          statusText: error.response ? error.response.statusText : undefined,
        };
    
        setAlertInfoFromRequest(requestInfo);
      } finally {
        const endTime = Date.now(); // Guarda el tiempo de finalización
        const duration = endTime - startTime; // Calcula la duración de la solicitud
    
        // Cierra el backdrop después de completar la búsqueda, considerando la duración
        setTimeout(() => {
          handelCloseBackDrop();
    
        }, duration);
        setTimeout(() => {
          handelCloseBackDrop();
          setAlertInfoFromRequest(null);
        }, duration + 3000);
      }
    };
    

    // Llama a la función para hacer la solicitud al montar el componente
    fetchData();

    // Si necesitas hacer algo cuando el componente se desmonta, puedes devolver una función desde useEffect

  };

  const changeControl = (e,controlName)=>{
    setPlazaNumber(e.target.value)
  }
  return (
    <>
      <TextField
        color='secondary'
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
        
      </TextField>

      <TextField
      color='secondary'
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
      color='secondary'
        sx={{color:"black",fontWeight:"bolder"}}
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
      {openPDF && ownerDetails  && (
        <Dialog open={openPDF} onClose={openPDF}
       
        maxWidth={true}

        
        >
          <DialogTitle>Pdf Visualizer</DialogTitle>
          <DialogContentText>
            <PDFViewer width={800} height={1200}>
              <Pdf  ownerDetails={ownerDetails} ownerHomeImages={ownerHomeImages} ownerDebts={ownerDebts} ownerPayments={ownerPayments}/>
            </PDFViewer>
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleClosePDF} color="secondary">Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default Search;
