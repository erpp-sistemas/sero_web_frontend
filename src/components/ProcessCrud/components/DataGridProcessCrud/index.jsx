import React from "react";
import { deleteProcess, getAllProcesses, updateProcess } from "../../../../api/process";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToS3 } from "../../../../services/s3.service";

/**
 * Hook personalizado para simular una mutación asincrónica con datos ficticios.
 *
 * @param {Function} updateProcess - Función para actualizar un proceso por ID utilizando la API.
 * @returns {Function} - Función de retorno que realiza la mutación asincrónica.
 *
 * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
 *
 * @async
 * @function
 * @name useFakeMutation
 *
 * @param {Object} process - Datos del progreso para la mutación.
 * @param {string} _action - Acción a realizar ("update", "delete", o "create").
 * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
 */
const useFakeMutation = () => {
  /**
   * Función que realiza la mutación asincrónica.
   *
   * @async
   *
   * @param {Object} process - Datos del progreso para la mutación.
   * @param {string} _action - Acción a realizar ("update", "delete", o "create").
   * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
   *
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  return React.useCallback(async (process, _action) => {
    try {
      // Simulando una pausa de 200 ms con setTimeout
      await new Promise((timeoutResolve) => setTimeout(timeoutResolve, 200));

      const response = updateProcess(process.id, process);

      return response.data;
    } catch (error) {
      // Maneja errores de Axios o errores de validación

      throw error;
    }
  }, []);
};

/**
 * Computes a mutation description based on the changes between the new and old row data.
 *
 * @function
 * @param {Object} newRow - The new row data.
 * @param {Object} oldRow - The old row data.
 * @returns {string|null} - A string describing the mutation or null if no changes detected.
 *
 * @example
 * // Usage example
 * const mutationDescription = computeMutation(newRow, oldRow);
 * if (mutationDescription) {
 *   console.log("Mutation:", mutationDescription);
 * } else {
 *   console.log("No changes detected.");
 * }
 */

function computeMutation(newRow, oldRow) {
  if (newRow.nombre !== oldRow.nombre) {
    return `¿Realmente quieres cambiar el nombre de '${oldRow.nombre}' a '${newRow.nombre}'`;
  }
  if (newRow.activo !== oldRow.activo) {
    return `¿Realmente deseas cambiar el estado de 'Activo' de '${
      oldRow.activo ? "✅" : "❎" || ""
    }' a '${newRow.activo ? "✅" : "❎" || ""}'?`;
  }

  if (
    newRow.procedimiento_almacenado_gestion !==
    oldRow.procedimiento_almacenado_gestion
  ) {
    return `Proceso from '${
      oldRow.procedimiento_almacenado_gestion || ""
    }' to '${newRow.procedimiento_almacenado_gestion || ""}'`;
  }

  if (
    newRow.procedimiento_almacenado_gestion_grafico !==
    oldRow.procedimiento_almacenado_gestion_grafico
  ) {
    return `Proceso from '${
      oldRow.procedimiento_almacenado_gestion_grafico || ""
    }' to '${newRow.procedimiento_almacenado_gestion_grafico || ""}'`;
  }

  if (newRow.tabla_gestion !== oldRow.tabla_gestion) {
    return `Proceso from '${oldRow.tabla_gestion || ""}' to '${
      newRow.tabla_gestion || ""
    }'`;
  }

  if (newRow.url_aplicacion_movil !== oldRow.url_aplicacion_movil) {
    return `Proceso from '${oldRow.url_aplicacion_movil || ""}' to '${
      newRow.url_aplicacion_movil || ""
    }'`;
  }

  return null;
}
function DataGridProcess() {
  const [rows, setRows] = React.useState([]);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");
  const [url, setUrl] = React.useState(
    "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
  );
  const mutateRow = useFakeMutation();
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [singnedUrl, setSignedUrl] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [getRowData, setGetRowData] = React.useState();
  const noButtonRef = React.useRef(null);
  const [processData, setProcessData] = React.useState({
    nombre: "",
    imagen: "",
    activo: Boolean(""),
    procedimiento_almacenado_gestion: "",
    procedimiento_almacenado_gestion_grafico: "",
    tabla_gestion: "",
    url_aplicacion_movil: "",
  });

  const [validateInputs, setValidateInputs] = React.useState({
    nombre: false,
    procedimiento_almacenado_gestion: false,
    procedimiento_almacenado_gestion_grafico: false,
    tabla_gestion: false,
    url_aplicacion_movil: false,
  });

  /**
   * Abre el diálogo de imagen.
   *
   * @returns {void}
   */
  const handleOpenImageDialog = () => {
    setIsImageDialogOpen(true);
  };

  /**
   * Cierra el diálogo de imagen.
   *
   * @returns {void}
   */

  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false);
  };

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

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  /**
   * Handles the user's confirmation to update a row.
   *
   * @function
   * @async
   * @throws {Error} Throws an error if the update request fails.
   * @returns {Promise<void>} A Promise that resolves when the update is successful.
   *
   * @example
   * // Usage example
   * try {
   *   await handleYes();
   *   console.log("Update successful");
   * } catch (error) {
   *   console.error("Update failed:", error.message);
   * }
   */

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow, "update");

      setSnackbar({
        children: "Proceso guardado con exito ",
        severity: "success",
      });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: `${error}`, severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  /**
   * Process row update by computing the mutation and returning a Promise.
   *
   * @function
   * @param {Object} newRow - The updated row data.
   * @param {Object} oldRow - The original row data.
   * @returns {Promise<Object>} A Promise that resolves with the updated row data or rejects with the original row data if nothing was changed.
   *
   * @example
   * // Usage example
   * const updatedRow = await processRowUpdate(newData, oldData);
   * console.log("Row updated:", updatedRow);
   *
   * @example
   * // Usage example with error handling
   * try {
   *   const updatedRow = await processRowUpdate(newData, oldData);
   *   console.log("Row updated:", updatedRow);
   * } catch (error) {
   *   console.error("Update failed:", error.message);
   * }
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

  const fetchProcesses = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllProcesses();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_proceso,
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */

    fetchProcesses();
  }, []);

  /**
   * Componente funcional que representa una imagen de avatar con funcionalidad adicional.
   *
   * @component
   * @name AvatarImage
   * @param {object} props - Propiedades del componente.
   * @param {string} props.data - Datos de la imagen del avatar.
   * @param {Function} props.handleClickOpen - Función para manejar la apertura de un diálogo.
   * @param {Function} props.getDataRow - Función para obtener datos de una fila.
   * @returns {JSX.Element} Elemento JSX que representa la imagen de avatar.
   */
  const AvatarImage = ({ data, handleClickOpen, getDataRow }) => {
    return (
      <Avatar
        onClick={() => {
          console.log(data);
          handleOpenImageDialog();
          setGetRowData(getDataRow);
        }}
        alt="Remy Sharp"
        src={data}
      />
    );
  };
  /**
   * Componente funcional que representa una celda con marca de verificación o cruz.
   *
   * @component
   * @name CheckCell
   * @param {object} props - Propiedades del componente.
   * @param {boolean} props.data - Datos para determinar si mostrar la marca de verificación o cruz.
   * @returns {JSX.Element} Elemento JSX que representa la celda con marca de verificación o cruz.
   */
  const CheckCell = ({ data }) => {
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
   * Maneja el evento de confirmación al hacer clic en "Sí" en el cuadro de diálogo de confirmación.
   *
   * @function
   * @name handleYes
   * @async
   * @throws {Error} Se lanza un error si ocurre un problema al realizar la operación.
   * @returns {Promise<void>} Una promesa que se resuelve después de realizar la operación.
   */

  /**
   * Construye y devuelve las columnas para la tabla de procesos.
   *
   * @function
   * @name buildColumns
   * @returns {Array} - Un array de objetos que representa las columnas de la tabla.
   */
  const buildColumns = () => {
    const columns = [
      {
        field: "nombre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Nombre"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 130,
        editable: true,
      },
      {
        field: "imagen",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Imagen"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 100,
        editable: false,
        renderCell: (params) => (
          <AvatarImage
            /*  handleClickOpen={handleClickOpen}*/
            getDataRow={params.row}
            data={params.row.imagen}
          />
        ),
      },
      {
        field: "activo",
        type: "boolean",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Estado"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 80,
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
      },
      {
        field: "procedimiento_almacenado_gestion",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Procedimiento Almacenado"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 200,
        editable: true,
      },
      {
        field: "procedimiento_almacenado_gestion_grafico",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Procedimiento Almacenado Gestion Grafico"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 300,
        editable: true,
      },
      {
        field: "tabla_gestion",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Tabla Gestion"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      {
        field: "url_aplicacion_movil",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Url Aplicacion Movil"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      {
        field: "actions",
        type: "actions",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Acciones"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
                  onClick={() => handleDeleteClick(id)} 
              color="inherit"
            />,
          ];
        },
      },

      /*  {
              field: "fecha_ingreso",
              type: "dateTime",
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Fecha de Ingreso"}
                  
                </strong>
              ),
              valueGetter: ({ value }) => {
                return value && new Date(value);
              },
              width: 180,
              editable: true,
            }, */
    ];

    return columns;
  };

  /**
   * Cierra la notificación (snackbar) actualmente abierta.
   *
   * @function
   * @name handleCloseSnackbar
   */
  const handleCloseSnackbar = () => setSnackbar(null);
  /**
   * Componente que representa la barra de herramientas personalizada para la tabla.
   *
   * @component
   * @name CustomToolbar
   * @returns {JSX.Element} JSX que renderiza la barra de herramientas personalizada.
   */
  function CustomToolbar() {
    /*   console.log(handleOpenDialog); */
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />

        <GridToolbarExport color="secondary" />
        {/*  <Button
          color="secondary"
          startIcon={<FaTasks />}
          onClick={handleOpenDialog}
        >
          Agregar Nueva Tarea
        </Button> */}
        {/*   <Button
          color="secondary"
          onClick={handleOpenDialogForm}
          startIcon={<AddOutlinedIcon />}
        >
          Agregar Nuevo Proceso
        </Button> */}
      </GridToolbarContainer>
    );
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    try {
      const fileUrl = await uploadToS3(file);
      console.log("URL del archivo subido:", fileUrl);

      setSignedUrl(fileUrl);
      // Configura el mensaje de Snackbar en caso de éxito
      setSnackbar({
        children: "Archivo subido exitosamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        children: "Error al subir archivo. Por favor, inténtalo de nuevo.",
        severity: "error",
      });
      console.error("Error al subir archivo:", error.message);
      // Handle the error according to your requirements
    }
  };

  /**
   * Handles the save operation for the updated row data.
   *
   * @async
   * @function
   *
   * @throws {Error} If there is an error during the save operation.
   *
   * @example
   * // Usage example
   * // Assuming getRowData is an object you want to update and getUrl is the API endpoint
   * handleSave();
   */

  const handleSave = async () => {
    /**
     * The updated row data object.
     *
     * @typedef {Object} UpdatedRowData
     * @property {string} id - The unique identifier of the row.
     * @property {string} field - The field to be updated (e.g., "imagen", "icono_app_movil").
     * @property {string} imagen - The updated image URL.
     * @property {string} icono_app_movil - The updated icon URL for the mobile app.
     * @property {string} ... - Other properties of the row data.
     */

    if (getRowData) {
      try {
        // Assuming getRowData is an object you want to update and getUrl is the API endpoint

        // Modify the getRowData object with the new getUrl value

        console.log(getRowData);

        let updatedRowData;

        updatedRowData = { ...getRowData, imagen: singnedUrl };

      

        // Make a PUT request using the updatedRowData
        /*    console.log(updatedRowData);
         */

        const response = await updateProcess(getRowData.id, updatedRowData);

        // You can handle the response as needed
        console.log("Save successful:", response.data);
        setSnackbar({
          children: "Guardado exitoso",
          severity: "success",
        });
        // If you want to close something after successful save, uncomment the following line
        fetchProcesses();
        handleCloseImageDialog();
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
        // Show an error notification
        setSnackbar({
          mchildren: "Error al guardar la imagen",
          severity: "error",
        });
      }
    }
  };

   /**
   * Maneja el clic en el botón de eliminación y realiza la eliminación de la fila con el ID proporcionado.
   *
   * @async
   * @function
   * @name handleDeleteClick
   * @param {string} id - El ID de la fila a eliminar.
   * @returns {Promise<void>} - Una promesa que se resuelve después de la eliminación exitosa.
   */
   const handleDeleteClick = async (id) => {
    

    try {
      // Make the HTTP request to save in the backend
     /*  const response = await axios.delete(
        `http://localhost:3000/api/processes/${id}`
      ); */

      const response = await deleteProcess(id)
    

      setSnackbar({ children: `Se borro exitosamente`, severity: "warning" });
      fetchProcesses()
      return response
    } catch (error) {
      console.log(error);
      setSnackbar({ children: `${error}`, severity: "error" });
      throw error;
      /*  reject(oldRow); 
       setPromiseArguments(null); */
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
         {renderConfirmDialog()}
      <DataGrid
        rows={rows}
        columns={buildColumns()}
        localeText={{
          toolbarColumns: "Columnas",
          toolbarFilters: "Filtros",
          toolbarDensity: "Tamaño Celda",
          toolbarExport: "Exportar",
        }}
        slots={{ toolbar: CustomToolbar }}
        processRowUpdate={processRowUpdate}
      />{" "}
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {isImageDialogOpen && (
        <Dialog
          fullScreen
          open={isImageDialogOpen}
          onClose={handleCloseImageDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseImageDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Sound
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Gua
              </Button> */}
            </Toolbar>
          </AppBar>
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
                height: "70%",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "2rem" }}>
                Cambiar Imagen
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ marginBottom: "1rem" }}>
                        <img
                          className="rounded-full h-36 w-36 object-cover border-solid border-2 border-white"
                          src={selectedImage || url}
                          alt="Your Image"
                        />
                      </Box>

                      <TextField
                        type="file"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          inputProps: {
                            accept: "image/*", // specify accepted file types if needed
                          },
                        }}
                        onChange={handleFileChange}
                      />
                    </Box>
                  </Grid>
                  {/* 
                  <Grid item xs={6}>
                    Caracteristicas
                  </Grid> */}
                </Grid>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "1rem",
                }}
              >
                <Button
                  onClick={handleSave}
                  color="secondary"
                  variant="contained"
                >
                  Guardar Imagen
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default DataGridProcess;
