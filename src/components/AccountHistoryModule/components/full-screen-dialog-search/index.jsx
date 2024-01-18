import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import PersonIcon from "@mui/icons-material/Person";

import { FaRegCircleCheck } from "react-icons/fa6";
import { TbZoomCancel } from "react-icons/tb";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useStoreZustand } from "../../../../zustan_store/useStoreZustand";
import CloseIcon from '@mui/icons-material/Close';
import useCombinedSlices from "../../../../hooks/useCombinedSlices";
function DialogSearch({ handleCloseDialog,setAccountNumber }) {
  const { setRowAccount, plazaNumber, setAlertInfoFromRequest } =
    useStoreZustand();
    const { setAccountData } = useCombinedSlices();
  const [responseData, setResponseData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [formDataFromInputs, setFormDataFromInputs] = React.useState({
    account: "",
    owner_name: "",
    street: "",
    cologne: "",
  });
  const [verificationInputs, setVerificationInputs] = React.useState({
    accountInput: false,
    ownerNameinput: false,
    streetInput: false,
    townInput: false,
  });

  /**
   * Maneja el cambio en los campos de entrada y actualiza el estado correspondiente.
   *
   * @param {Object} e - Evento de cambio.
   * @param {string} e.target.name - Nombre del campo de entrada.
   * @param {string} e.target.value - Valor del campo de entrada.
   * @returns {void}
   */

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setVerificationInputs((prev) => {
      switch (name) {
        case "account":
          return {
            ...prev,
            [name]: !!value,
            accountInput: value.length > 0 ? true : false,
          };

        case "owner_name":
          return {
            ...prev,
            [name]: !!value,
            ownerNameinput: value.length > 0 ? true : false,
          };
        case "street":
          return {
            ...prev,
            [name]: !!value,
            streetInput: value.length > 0 ? true : false,
          };
        case "cologne":
          return {
            ...prev,
            [name]: !!value,
            townInput: value.length > 0 ? true : false,
          };
        // Agrega más casos si es necesario para otros campos

        /*  default:
          return {
            ...prev,
            [name]: !!value,
          }; */
      }
    });
    setFormDataFromInputs((prev) => ({
      ...prev,
      [name]:value,
    }));
  };

  
  const handleSearch = async () => {
    for (const key in formDataFromInputs) {
      // Verificar si el valor es una cadena vacía y cambiarlo por "vacio"
      if (formDataFromInputs[key] === "") {
        formDataFromInputs[key] = "vacio";
      }
    }
    const apiUrl = `http://localhost:3000/api/AccountHistoryByParameters/${plazaNumber}/${formDataFromInputs.account}/${formDataFromInputs.owner_name}/${formDataFromInputs.street}/${formDataFromInputs.cologne}`;
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      setResponseData(data);
    } catch (error) {
      console.error("Error al hacer la solicitud:", error.message);
    }
  };

  /**
   * Función auxiliar que construye las columnas para el componente DataGrid.
   *
   * @function
   * @returns {Array} Arreglo de objetos que representan las columnas del DataGrid.
   */
  const buildColumns = () => {
    const columns = [];

    responseData?.forEach((responseDataObject, index) => {
      if (index === 0) {
        for (const key in responseDataObject) {
          switch (key) {
            case "account":
              columns.push({
                field: key,
                headerName: "Cuenta",
                width: 150,
              });
              break;
            case "owner_name":
              columns.push({
                field: key,
                headerName: "Propietario",
                width: 250,
              });
              break;

            case "street":
              columns.push({
                field: key,
                headerName: "Calle",
                width: 200,
              });
              break;
            case "cologne":
              columns.push({
                field: key,
                headerName: "Colonia",
                width: 300,
                editable: true,
              });
              break;
            /*      case "cutoffDate":
          columns.push({
            field: key,
            headerName: "Fecha Corte",
            width: 150,
            editable: true,
            type:'dateTime',
            valueGetter:({ value }) => {
              return new Date(value)
            }
          });
          break;
        case "lasTwoMonthPayment":
          columns.push({
            field: key,
            headerName: "Pago Dos Meses Anteriores",
            width: 150,
            editable: true,
            type:'string',
            valueGetter:({ value }) => {
              return value?`$ ${value}.00`:`$ 00.00`
            }
          });
          break;
          case "debtAmount":
          columns.push({
            field: key,
            headerName: "Deuda",
            width: 150,
            editable: true,
            type:'string',
            valueGetter:({ value }) => {
              return value?`$ ${value}.00`:`$ 00.00`
            }

          });

          break; */

            default:
              break;
          }
        }
      }
    });

    return columns;
  };

  /**
   * Función auxiliar que construye las filas para el componente DataGrid.
   *
   * @function
   * @returns {Array} Arreglo de objetos que representan las filas del DataGrid.
   */
  const buildRows = () => {
    const rows = [];

    // Itera sobre los objetos de responseData y construye las filas
    responseData?.forEach((responseDataObject, index) => {
      rows.push({ id: index + 1, ...responseDataObject });
    });

    return rows;
  };

  return (
    <Dialog fullScreen open={true} onClose={handleCloseDialog}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
          >
            <CloseIcon/>
          </IconButton>
       {/*    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Sound
          </Typography>
          <Button autoFocus color="inherit" onClick={handleCloseDialog}>
            save
          </Button> */}
        </Toolbar>
      </AppBar>
      <Box sx={{padding:"30px"}}>
      <Stack direction="row" spacing={4}>
        <Box sx={{ p: 2}}  >
          <TextField
            color="secondary"
            sx={{ marginBottom: "1rem", width: "400px" }}
            id="input-with-icon-textfield-account"
            label="Cuenta"
            onChange={handleChangeInput}
            value={formDataFromInputs.account}
            type="text"
            name="account"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RecentActorsIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          {verificationInputs.accountInput ? (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
              <Typography color={"secondary"} variant="caption">
                ¡Gracias por ingresar una cuenta!
              </Typography>
            </Stack>
          ) : (
            /* TbZoomCancel */
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <TbZoomCancel style={{ color: "red" }} />{" "}
              <Typography sx={{ color: "red" }} variant="caption">
                * ¡Por favor, ingresa una cuenta!
              </Typography>
            </Stack>
          )}
          <TextField
            color="secondary"
            size="small"
            sx={{ width: "400px", marginBottom: "1rem" }}
            id="input-with-icon-textfield-contributor"
            name="owner_name"
            label="Propietario"
            onChange={handleChangeInput}
            value={formDataFromInputs.owner_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          {verificationInputs.ownerNameinput ? (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
              <Typography color={"secondary"} variant="caption">
                ¡Gracias por ingresar un propietario!
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <TbZoomCancel style={{ color: "red" }} />{" "}
              <Typography sx={{ color: "red" }} variant="caption">
                * ¡Por favor, ingresa un nombre de propietario!
              </Typography>
            </Stack>
          )}
          <TextField
            color="secondary"
            size="small"
            sx={{ width: "400px", marginBottom: "1rem" }}
            id="input-with-icon-textfield-street"
            label="Calle"
            name="street"
            onChange={handleChangeInput}
            value={formDataFromInputs.street}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          {verificationInputs.streetInput ? (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
              <Typography color={"secondary"} variant="caption">
                ¡Gracias por ingresar una calle!
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <TbZoomCancel style={{ color: "red" }} />{" "}
              <Typography sx={{ color: "red" }} variant="caption">
                * ¡Por favor, ingresa una calle valida!
              </Typography>
            </Stack>
          )}

          <TextField
            color="secondary"
            size="small"
            sx={{ width: "400px", marginBottom: "1rem" }}
            id="input-with-icon-textfield-cologne"
            label="Colonia"
            name="cologne"
            onChange={handleChangeInput}
            value={formDataFromInputs.cologne}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="" />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          {verificationInputs.townInput ? (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
              <Typography color={"secondary"} variant="caption">
                ¡Gracias por ingresar una colonia!
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ marginTop: "0.5rem" }} direction="row">
              <TbZoomCancel style={{ color: "red" }} />{" "}
              <Typography sx={{ color: "red" }} variant="caption">
                * ¡Por favor, ingresa un nombre de colonia valido!
              </Typography>
            </Stack>
          )}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={handleSearch} variant="contained" color="secondary">
              Buscar
            </Button>
          </Box>
        </Box>
        <Box sx={{ p: 3,width:"60%" }}>
          {" "}
          <DataGrid
             onRowClick={(params) => {
                setLoading(true); // Activa el indicador de carga
                const plaza_id = plazaNumber;
                const account_id = params.row.account;
                
                const apiUrl = `http://localhost:3000/api/AccountHistoryByCount/${plaza_id}/${account_id}/`;
  
                const fetchData = async () => {
                  try {
                    const response = await axios.get(apiUrl);
                    const data = response.data;
  
                    // Hacer algo con los datos, por ejemplo, actualizar el estado del componente
                  /*   setAlertInfoFromRequest({
                      status: response.status,
                      statusText: response.statusText,
                    }); */
                    setAccountData(data);
                    setAccountNumber(account_id)
                  } catch (error) {
                    // Manejar errores, por ejemplo, imprimir el mensaje de error en la consola
                    console.error("Error al hacer la solicitud:", error.message);
                    setAlertInfoFromRequest({
                      status: error.response?.status || 500,
                      statusText: error.message,
                    });
                  } finally {
                    setLoading(false); // Desactiva el indicador de carga después de la solicitud
  
                    // Cierra el backdrop después de completar la búsqueda, considerando la duración
                    setTimeout(() => {
                      handelCloseBackDrop();
                    }, 0);
  
                    // Limpia la alerta después de cierto tiempo
                    setTimeout(() => {
                      handleCloseDialog();
                    }, 10);
                    setTimeout(() => {
                      setAlertInfoFromRequest(null);
                    }, 3000);
                  }
                };
  
                // Llama a la función para hacer la solicitud al hacer clic en la fila
                fetchData();
              }}
            rows={buildRows()}
            columns={buildColumns()}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
           
            disableRowSelectionOnClick
          />{" "}
        </Box>
      </Stack>
      </Box>
    </Dialog>
  );
}

export default DialogSearch;
