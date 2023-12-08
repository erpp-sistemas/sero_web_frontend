import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Container from "../Container";
import { tokens } from "../../../../theme";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import PersonIcon from "@mui/icons-material/Person";
import { CheckBox, Favorite, FavoriteBorder } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useStoreZustand } from "../../../../zustan_store/useStoreZustand";
import { ImCancelCircle } from "react-icons/im";
import useAccountData from "../../../../hooks/accountDataHook";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbZoomCancel } from "react-icons/tb";
import useCombinedSlices from "../../../../hooks/useCombinedSlices";
import PropTypes from "prop-types";
/**
 * Componente funcional que representa un cuadro de diálogo para realizar búsquedas personalizadas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.handleCloseDialog - Función para cerrar el cuadro de diálogo.
 * @returns {JSX.Element} Elemento JSX que representa el cuadro de diálogo de búsqueda.
 */

function SearchDialog({ handleCloseDialog }) {
  const { setRowAccount, plazaNumber, setAlertInfoFromRequest } =
    useStoreZustand();
  const { setAccountData } = useCombinedSlices();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
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
  const [alertInfo, setAlertInfo] = React.useState(null);
  const [responseData, setResponseData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const colors = tokens(theme.palette.mode);
  const label = "hol";

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
    setFormDataFromInputs({
      ...formDataFromInputs,
      [name]: value,
    });
  };
  /**
   * Efecto secundario que realiza la búsqueda cuando todos los campos están verificados.
   *
   * @function
   * @returns {void}
   */
  React.useEffect(() => {
    // Verifica si todas las propiedades de verificationInputs son true
    const allInputsVerified = Object.values(verificationInputs).every(Boolean);

    // Si todas las propiedades son true, procede con la lógica del useEffect
    if (allInputsVerified) {
      const apiUrl = `http://localhost:3000/api/AccountHistoryByParameters/${plazaNumber}/${formDataFromInputs.account}/${formDataFromInputs.owner_name}/${formDataFromInputs.street}/${formDataFromInputs.cologne}`;

      const fetchData = async () => {
        try {
          const response = await axios.get(apiUrl);
          const data = response.data;
          setResponseData(data);
        } catch (error) {
          console.error("Error al hacer la solicitud:", error.message);
        }
      };

      fetchData();
    }
  }, [
    formDataFromInputs.account,
    formDataFromInputs.owner_name,
    formDataFromInputs.street,
    formDataFromInputs.cologne,
    verificationInputs.accountInput,
    verificationInputs.ownerNameinput,
    verificationInputs.streetInput,
    verificationInputs.townInput,
  ]);
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
                width: "auto",
              });
              break;
            case "cologne":
              columns.push({
                field: key,
                headerName: "Colonia",
                width: "auto",
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
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        sx={{ backgroundColor: colors.primary[400] }}
        id="responsive-dialog-title"
      >
        {"BUSQUEDA PERSONALIZADA"}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[400] }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              /*  border: "0.01rem solid white", */
              padding: "2rem",
              borderRadius: "1rem",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
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
              {/*     <FormGroup sx={{display:"flex",flexDirection:"row",justifyContent:"start"}}>
              <FormControlLabel
                  
                  control={<Checkbox />}
                  label="Contenga"
                />
                <FormControlLabel
                  
                  control={<Checkbox />}
                  label="inicie con"
                />
                <FormControlLabel
                  disabled
                  control={<Checkbox />}
                  label="Igual"
                />
              </FormGroup> */}
            </Box>
          </Box>
        </Container>
        {loading ? (
          <Box sx={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : responseData ? (
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
                  setAlertInfoFromRequest({
                    status: response.status,
                    statusText: response.statusText,
                  });
                  setAccountData(data);
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
            checkboxSelection
            disableRowSelectionOnClick
          />
        ) : (
          <Box sx={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {/*   <DialogContentText>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText> */}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
        <Button
          autoFocus
          onClick={handleCloseDialog}
          color="secondary"
          startIcon={<ImCancelCircle />}
        >
          Cerrar
        </Button>
        {/*  <Button  autoFocus>Agree</Button> */}
      </DialogActions>
    </Dialog>
  );
}
/**
 * PropTypes para SearchDialog.
 * @property {Function} handleCloseDialog - Función para cerrar el cuadro de diálogo.
 */
SearchDialog.propTypes = {
  handleCloseDialog: PropTypes.func.isRequired,
};

export default SearchDialog;
