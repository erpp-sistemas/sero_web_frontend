import React from "react";
import { createRol, getAllRoles, updateRolById } from "../../../../api/rol";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { AddOutlined, Sync, SyncAltOutlined } from "@mui/icons-material";
import { GrServices } from "react-icons/gr";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { FaRegCircleCheck } from "react-icons/fa6";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
/**
 * Componente de celda que muestra un ícono de verificación o de cruz según el valor de la propiedad 'data'.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {any} props.data - Valor que determina si se muestra el ícono de verificación o de cruz.
 * @returns {JSX.Element} Elemento JSX que representa un ícono de verificación o de cruz.
 */
const CheckCell = ({ data }) => {
  /**
   * Renderiza un ícono de verificación si 'data' es verdadero, de lo contrario, muestra un ícono de cruz en rojo.
   *
   * @returns {JSX.Element} Elemento JSX que representa un ícono de verificación o de cruz.
   */
  if (data) {
    return (
      <IconButton aria-label="check" size="small">
        <CheckIcon fontSize="inherit" color="secondary" />
      </IconButton>
    );
  } else {
    return (
      <IconButton aria-label="check" size="small">
        <ClearIcon fontSize="inherit" sx={{ color: "red" }} />
      </IconButton>
    );
  }
};

/**
 * Hook personalizado para simular una mutación asincrónica con datos ficticios.
 *
 * @param {Function} updateRolById - Función para actualizar un rol por ID utilizando la API.
 * @returns {Function} - Función de retorno que realiza la mutación asincrónica.
 *
 * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
 *
 * @async
 * @function
 * @name useFakeMutation
 *
 * @param {Object} rol - Datos del rol para la mutación.
 * @param {string} _action - Acción a realizar ("update", "delete", o "create").
 * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
 */
const useFakeMutation = () => {
  /**
   * Función que realiza la mutación asincrónica.
   *
   * @async
   *
   * @param {Object} rol - Datos del rol para la mutación.
   * @param {string} _action - Acción a realizar ("update", "delete", o "create").
   * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
   *
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  return React.useCallback(async (rol, _action) => {
    try {
      // Simulando una pausa de 200 ms con setTimeout
      await new Promise((timeoutResolve) => setTimeout(timeoutResolve, 200));

      const response = updateRolById(rol.id, rol);

      return response.data;
    } catch (error) {
      // Maneja errores de Axios o errores de validación

      throw error;
    }
  }, []);
};

/**
 * Función para calcular una mutación basada en las diferencias entre la fila nueva y la fila antigua.
 *
 * @param {Object} newRow - Datos de la fila actualizados.
 * @param {Object} oldRow - Datos de la fila original.
 * @returns {string|null} Mensaje de confirmación de mutación o null si no hay cambios significativos.
 */
function computeMutation(newRow, oldRow) {
  /**
   * Compara los nombres de la fila nueva y la fila antigua.
   *
   * @returns {string|null} Mensaje de confirmación de mutación para el nombre o null si no hay cambios.
   */
  if (newRow.nombre !== oldRow.nombre) {
    return `¿Realmente quieres cambiar el estado del nombre de '${oldRow.nombre}' a '${newRow.nombre}'?`;
  }

  /**
   * Compara el estado 'activo' de la fila nueva y la fila antigua.
   *
   * @returns {string|null} Mensaje de confirmación de mutación para el estado 'activo' o null si no hay cambios.
   */
  if (newRow.activo !== oldRow.activo) {
    return `¿Realmente deseas cambiar el estado de 'Activo' de '${
      oldRow.activo ? "✅" : "❎" || ""
    }' a '${newRow.activo ? "✅" : "❎" || ""}'?`;
  }

  // Si no hay cambios significativos, devuelve null
  return null;
}

/**
 * Componente que muestra una tabla de roles utilizando la biblioteca Material-UI DataGrid.
 *
 * @component
 * @returns {JSX.Element} Elemento JSX que representa la tabla de roles.
 */
function DataGridRolCrud() {
  const [rows, setRows] = React.useState([]);
  const [isNewRolDialogOpen, setIsNewRolDialogOpen] = React.useState(false);
  const mutateRow = useFakeMutation();
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const noButtonRef = React.useRef(null);
  const [rolData, setRolData] = React.useState({
    nombre: "",
    activo: Boolean(""),
  });
  const [validateInputs, setValidateInputs] = React.useState({
    nombre: false,
  });

/**
 * Manejador de eventos que se ejecuta cuando se produce un cambio en los campos de entrada del formulario.
 *
 * @param {Object} event - Objeto del evento que contiene información sobre el cambio.
 * @param {string} event.target.name - Nombre del campo que ha cambiado.
 * @param {string} event.target.value - Valor actual del campo que ha cambiado.
 * @param {string} event.target.type - Tipo del campo que ha cambiado.
 * @param {boolean} event.target.checked - Estado de verificación en caso de un campo de tipo checkbox.
 *
 * @function
 */
  const handleInputOnChange = (event) => {
     /**
   * Desestructura las propiedades del objeto event.target para obtener información sobre el cambio.
   *
   * @type {Object}
   * @property {string} name - Nombre del campo que ha cambiado.
   * @property {string} value - Valor actual del campo que ha cambiado.
   * @property {string} type - Tipo del campo que ha cambiado.
   * @property {boolean} checked - Estado de verificación en caso de un campo de tipo checkbox.
   */
    const { name, value, type, checked } = event.target;

    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setRolData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    switch (name) {
      case "nombre":
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: value.length > 0,
        }));

        break;

      default:
        break;
    }
  };





   /**
   * Manejador que abre el diálogo de creación de un nuevo rol.
   *
   * @function
   */
   const handleOpenNewRolDialog = () => {
    setIsNewRolDialogOpen(true);
  };

  /**
   * Manejador que cierra el diálogo de creación de un nuevo rol.
   *
   * @function
   */
  const handleCloseNewRolDialog = () => {
    setIsNewRolDialogOpen(false);
  };

  /**
   * Función que cierra el componente Snackbar.
   *
   * @function
   * @name handleCloseSnackbar
   *
   * @description Esta función actualiza el estado del componente Snackbar para ocultarlo.
   *
   * @returns {void}
   */
  const handleCloseSnackbar = () => setSnackbar(null);

  /**
   * Función que maneja la acción "No" en el contexto de una promesa.
   *
   * @function
   * @name handleNo
   *
   * @description Esta función resuelve la promesa con la fila antigua para evitar la actualización del estado interno.
   *
   * @returns {void}
   */
  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  /**
   * Maneja el evento cuando se selecciona la opción "Sí" en un diálogo de confirmación.
   *
   * @async
   * @function
   * @throws {Error} Error al intentar realizar la solicitud HTTP para actualizar la fila en el backend.
   */
  const handleYes = async () => {
    /**
     * Obtiene los argumentos de la promesa, incluyendo las filas nuevas y antiguas, así como las funciones de resolución y rechazo.
     *
     * @type {Object}
     * @property {Object} newRow - Datos actualizados de la fila.
     * @property {Object} oldRow - Datos originales de la fila.
     * @property {Function} reject - Función de rechazo de la promesa.
     * @property {Function} resolve - Función de resolución de la promesa.
     */
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Realiza la solicitud HTTP para guardar en el backend
      const response = await mutateRow(newRow, "update");

      // Muestra un mensaje de éxito en una barra de notificaciones
      setSnackbar({
        children: "Rol guardado con éxito",
        severity: "success",
      });

      // Resuelve la promesa con la fila actualizada
      resolve(newRow);
      setPromiseArguments(null);
    } catch (error) {
      // Muestra un mensaje de error en una barra de notificaciones
      setSnackbar({ children: `${error}`, severity: "error" });

      // Rechaza la promesa con la fila original en caso de error
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  /**
   * Maneja el evento cuando el diálogo está completamente abierto.
   *
   * La propiedad `autoFocus` no se utiliza porque, si se usa, la misma tecla Enter que guarda
   * la celda activa desencadena la opción "No". En su lugar, se enfoca manualmente el botón "No"
   * una vez que el diálogo está completamente abierto.
   */
  const handleEntered = () => {
    // La propiedad `autoFocus` no se utiliza porque, si se usa, la misma tecla Enter que guarda
    // la celda activa desencadena la opción "No". En su lugar, enfocamos manualmente el botón "No"
    // una vez que el diálogo está completamente abierto.
    noButtonRef.current?.focus();
  };

  /**
   * Renderiza un cuadro de diálogo de confirmación para la acción de guardar cambios.
   *
   * @function
   * @name renderConfirmDialog
   * @returns {JSX.Element|null} Elemento JSX que representa el cuadro de diálogo de confirmación.
   */
  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>¿Esta usted seguro?</DialogTitle>
        <DialogContent dividers>
          {`Presiona 'Ok' , si  ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button
            endIcon={<ClearIcon />}
            color="secondary"
            ref={noButtonRef}
            onClick={handleNo}
          >
            No
          </Button>
          <Button endIcon={<CheckIcon />} color="secondary" onClick={handleYes}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  /**
   * Proceso de actualización de fila para la función de confirmación antes de realizar una actualización.
   *
   * @function
   * @param {Object} newRow - Datos actualizados de la fila.
   * @param {Object} oldRow - Datos originales de la fila.
   * @returns {Promise} Promesa que se resuelve con la fila actualizada o se rechaza con la fila original si no hay cambios significativos.
   */
  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchRoles = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllRoles();

      // Agrega el campo 'id_rol' a cada fila usando el índice como valor único si no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_rol || index.toString(),
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Efecto secundario para cargar los datos al montar el componente
  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de los roles.
     *
     * @function
     * @async
     * @private
     */

    fetchRoles();
  }, []);

  /**
   * Construye las columnas para la tabla de roles.
   *
   * @function
   * @private
   * @returns {Array} Arreglo de objetos que representan las columnas de la tabla.
   */
  const buildColumns = () => {
    const columns = [
      {
        field: "nombre",
        renderHeader: () => (
          <strong style={{ color: "#254061" }}>
            {"Nombre"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
          </strong>
        ),
        width: 300,
        editable: true,
      },

      {
        field: "activo",
        renderHeader: () => (
          <strong style={{ color: "#254061" }}>
            {"Estado"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
          </strong>
        ),
        width: 300,
        type: "boolean",
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
      },
    ];

    return columns;
  };

  /**
   * Componente que define la barra de herramientas personalizada para la tabla de roles.
   *
   * @component
   * @returns {JSX.Element} Elemento JSX que representa la barra de herramientas personalizada.
   */
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />

        <GridToolbarExport color="secondary" />

         <Button
          color="secondary"
          onClick={handleOpenNewRolDialog}
          startIcon={<AddOutlined />}
          size="small"
        >
          Agregar Nuevo Rol
        </Button> 
      </GridToolbarContainer>
    );
  }



  /**
 * Manejador de eventos que se ejecuta al intentar agregar un nuevo rol.
 * Verifica la validez de los campos del formulario y realiza la acción correspondiente.
 *
 * @async
 * @function
 */
  const handleAddRol = async () => {
    /**
   * Verifica si todos los campos del formulario están validados.
   *
   * @type {boolean} Indica si todos los campos están validados.
   */
    const isFormValid = Object.values(validateInputs).every(
      (isValid) => isValid
    );

    if (isFormValid) {
      try {
      

        const response = await createRol(rolData);

        // Aquí puedes manejar la respuesta de la solicitud si es necesario
        console.log("Respuesta de la API:", response.data);

        // Mostrar Snackbar de éxito
        setSnackbar({
          children: "Rol añadido correctamente",
          severity: "success",
        });

        // Cerrar el diálogo, actualizar el estado, o realizar otras acciones necesarias
        fetchRoles();
        handleCloseNewRolDialog();
      } catch (error) {
        console.error("Error al guardar datos:", error);
        setSnackbar({ children: "Error al guardar datos", severity: "error" });
        // Aquí puedes manejar el error según tus necesidades
      }
    } else {
      console.log(
        "Formulario no válido. Por favor, completa todos los campos correctamente."
      );
      setSnackbar({
        children: "Completa todos los campos correctamente",
        severity: "warning",
      });
      // Puedes mostrar un mensaje al usuario indicando que debe completar todos los campos correctamente.
    }
  };
  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        ".css-196n7va-MuiSvgIcon-root": {
          fill: "white",
        },
      }}
    >
      {renderConfirmDialog()}
      <DataGrid
        rows={rows}
        columns={buildColumns()}
        processRowUpdate={processRowUpdate}
        localeText={{
          toolbarColumns: "Columnas",
          toolbarFilters: "Filtros",
          toolbarDensity: "Tamaño Celda",
          toolbarExport: "Exportar",
        }}

        slots={{ toolbar: CustomToolbar }}
      />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
        {isNewRolDialogOpen && (
        <Dialog
          fullScreen
          open={isNewRolDialogOpen}
          onClose={handleCloseNewRolDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseNewRolDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {/*  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Agrega nueva tarea
              </Typography> */}
              {/*  <Button autoFocus color="inherit"  onClick={handleClose}>
                Guardar
              </Button> */}
            </Toolbar>
          </AppBar>
          {/* Aqui va el contenido */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%", // Ajusta según sea necesario
            }}
          >
            <Paper
              sx={{
                width: "40%",
                height: "auto",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "2rem" }}>
                Agregar Nuevo Rol
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
               
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del rol"
                     onChange={handleInputOnChange}
                    value={rolData.nombre} 
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                   {validateInputs.nombre ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un rol!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un rol!
                    </Typography>
                  )} 

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    <InputLabel sx={{ alignSelf: "center" }}>Activo</InputLabel>
                    <Checkbox
                      {..."label"}
                     onChange={handleInputOnChange}
                      name="activo"
                      size="small"
                      color="secondary"
                    />
                  </Box>

               
                 
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "2.5rem",
                }}
              >
                <Button
                  endIcon={<Sync />}
                  color="secondary"
                  variant="contained"
                  onClick={handleAddRol} 
                 
                >
                  Guardar Rol
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default DataGridRolCrud;
