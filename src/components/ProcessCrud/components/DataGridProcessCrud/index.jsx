import React from "react";
import {
  createProcess,
  deleteProcess,
  getAllProcesses,
  updateProcess,
} from "../../../../api/process";
import {
  Alert,
  AppBar,
  Avatar,
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
import { AddOutlined, Sync, SyncAltOutlined } from "@mui/icons-material";
import { GrServices } from "react-icons/gr";
import { FaRegCircleCheck } from "react-icons/fa6";

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
  const [isNewProcessDialogOpen, setNewProcessDialogOpen] =
    React.useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const [getRowData, setGetRowData] = React.useState();
  const noButtonRef = React.useRef(null);
  const [selectedWebImage, setSelectedWebImage] = React.useState(null);
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
  })

  

  /**
   * Maneja el cambio de entrada de datos en los campos del formulario.
   *
   * @function
   * @name handleInputOnChange
   * @param {object} event - Objeto de evento que representa el cambio de entrada.
   * @returns {void}
   */
  const handleInputOnChange = (event) => {
    const { name, value, type, checked } = event.target;
    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setProcessData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    // Utilizing switch to handle different fields
    switch (name) {
      case "nombre":
        // Validation logic for the 'name' field
        const isValidName = value.length > 0;

        // Update the validation state for the 'name' field
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: isValidName,
        }));
        break;

      case "procedimiento_almacenado_gestion":
        // Validation logic for the 'stored_procedure_management' field
        const isValidStoredProcedureManagement = value.length > 0;

        // Update the validation state for the 'stored_procedure_management' field
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: isValidStoredProcedureManagement,
        }));
        break;

      case "procedimiento_almacenado_gestion_grafico":
        // Validation logic for the 'stored_procedure_management_chart' field
        const isValidStoredProcedureManagementChart = value.length > 0;

        // Update the validation state for the 'stored_procedure_management_chart' field
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: isValidStoredProcedureManagementChart,
        }));
        break;

      case "tabla_gestion":
        // Validation logic for the 'table_management' field
        const isValidTableManagement = value.length > 0;

        // Update the validation state for the 'table_management' field
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: isValidTableManagement,
        }));
        break;

      case "url_aplicacion_movil":
        // Validation logic for the 'mobile_application_url' field
        const isValidMobileApplicationUrl = value.length > 0;

        // Update the validation state for the 'mobile_application_url' field
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: isValidMobileApplicationUrl,
        }));
        break;

      default:
        // Default logic (can be empty if no additional logic is needed)
        break;
    }
  };

  /**
   * Manejador para abrir el diálogo de nuevo proceso.
   * @function
   * @returns {void}
   */
  const handleOpenNewProcessDialog = () => {
    setNewProcessDialogOpen(true);
  };

  /**
   * Manejador para cerrar el diálogo de nuevo proceso.
   * @function
   * @returns {void}
   */
  const handleCloseNewProcessDialog = () => {
    setNewProcessDialogOpen(false);
  };

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
      resolve(newRow);
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
    /*   {
        field: "actions",
        type: "actions",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Acciones"}
        
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
      }, */

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
        <Button
          color="secondary"
          onClick={handleOpenNewProcessDialog}
          startIcon={<AddOutlined />}
          size="small"
        >
          Agregar Nuevo
        </Button>
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

      const response = await deleteProcess(id);

      setSnackbar({ children: `Se borro exitosamente`, severity: "warning" });
      fetchProcesses();
      return response;
    } catch (error) {
      console.log(error);
      setSnackbar({ children: `${error}`, severity: "error" });
      throw error;
      /*  reject(oldRow); 
       setPromiseArguments(null); */
    }
  };

  /**
   * Manejador de cambio de archivo para la carga de imágenes web.
   * @async
   * @param {Event} event - Objeto de evento que representa el cambio de archivo.
   * @returns {Promise<void>} - Promesa que se resuelve después de la carga y procesamiento del archivo.
   */
  const handleFileChangeWebImage = async (event) => {
    // Obtiene el primer archivo seleccionado
    const file = event.target.files[0];

    // Verifica si se seleccionó un archivo
    if (file) {
      const reader = new FileReader();

      // Configura el callback cuando la lectura del archivo se completa
      reader.onload = () => {
        // Actualiza el estado con la imagen seleccionada
        setSelectedWebImage(reader.result);
      };

      // Lee el contenido del archivo como una URL de datos (data URL)
      reader.readAsDataURL(file);
    }

    try {
      // Intenta cargar el archivo a Amazon S3 y obtén la URL del archivo cargado
      const fileUrl = await uploadToS3(file);
      console.log("URL del archivo subido:", fileUrl);

      // Actualiza el estado 'imagen' en serviceData con la nueva URL del archivo
      setProcessData((prevData) => ({
        ...prevData,
        imagen: fileUrl,
      }));

      // Establece la URL firmada para la imagen (si es necesario)
      setSignedUrl(fileUrl);

      // Configura el mensaje de Snackbar en caso de éxito
      setSnackbar({
        children: "Archivo subido exitosamente",
        severity: "success",
      });
    } catch (error) {
      // Configura el mensaje de Snackbar en caso de error
      setSnackbar({
        children: "Error al subir archivo. Por favor, inténtalo de nuevo.",
        severity: "error",
      });

      console.error("Error al subir archivo:", error.message);
      // Maneja el error según tus requisitos
    }
  };


  
  /**
   * Handle the process of saving data.
   *
   * @function
   * @async
   * @returns {Promise<void>} A Promise that resolves once the data is successfully saved or rejects if an error occurs.
   *
   * @example
   * // Usage example
   * try {
   *   await handleAddProcess();
   *   console.log("Data saved successfully!");
   * } catch (error) {
   *   console.error("Error saving data:", error.message);
   * }
   */

  const handleAddProcess = async () => {
    // Verificar si todos los campos están validados
    const isFormValid = Object.values(validateInputs).every(
      (isValid) => isValid
    );

    if (isFormValid) {
      try {
      
        const response = await createProcess(processData);

        // Aquí puedes manejar la respuesta de la solicitud si es necesario
        console.log("Respuesta de la API:", response.data);

        // Mostrar Snackbar de éxito
        setSnackbar({
          children: "Proceso añadido correctamente",
          severity: "success",
        });

        // Cerrar el diálogo, actualizar el estado, o realizar otras acciones necesarias
        fetchProcesses();
        handleCloseNewProcessDialog()
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
    <Box sx={{ height: 400, width: "100%",'.css-196n7va-MuiSvgIcon-root': {
      fill:"white"
    }  }}>
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
      {isNewProcessDialogOpen && (
        <Dialog
          fullScreen
          open={isNewProcessDialogOpen}
          onClose={handleCloseNewProcessDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseNewProcessDialog}
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
                width: "70%",
                height: "95%",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "1rem" }}>
                Agregar Nuevo Proceso
              </Typography>

              <Grid container spacing={2}>
                <Grid
                  item
                  xs={6}
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
                    <Typography variant="caption" sx={{ mb: "2rem" }}>
                      Imagen
                    </Typography>
                    <Box sx={{ marginBottom: "0.5rem" }}>
                      <img
                        className="rounded-full h-36 w-36 object-cover border-solid border-2 border-white"
                          src={selectedWebImage || url} 
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
                       onChange={handleFileChangeWebImage} 
                      name="imagen"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "0.5rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del proceso"
                    onChange={handleInputOnChange}
                    value={processData.nombre}
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
                    <Stack
                      sx={{ marginTop: "0.2rem", marginBottom: "1rem" }}
                      direction="row"
                    >
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un proceso!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un proceso!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "0.5rem", width: "100%" }}
                    id="input-with-icon-textfield-proccedure-managment"
                    label="Procedimiento Almacenado Gestiòn"
                    onChange={handleInputOnChange}
                    value={processData.procedimiento_almacenado_gestion}
                    type="text"
                    name="procedimiento_almacenado_gestion"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.procedimiento_almacenado_gestion ? (
                    <Stack
                      sx={{ marginTop: "0.2rem", marginBottom: "0.5rem" }}
                      direction="row"
                    >
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un proceso almacenado de gestion!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un proceso almacenado de gestion!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "0.5rem", width: "100%" }}
                    id="input-with-icon-textfield-proccedure-managment-chart"
                    label="Procedimiento Almacenado Gestiòn Grafico"
                    onChange={handleInputOnChange}
                    value={processData.procedimiento_almacenado_gestion_grafico}
                    type="text"
                    name="procedimiento_almacenado_gestion_grafico"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.procedimiento_almacenado_gestion_grafico ? (
                    <Stack
                      sx={{ marginTop: "0.2rem", marginBottom: "1rem" }}
                      direction="row"
                    >
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un proceso almacenado de la
                        gestion del grafico!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un proceso almacenado de la gestion
                      del grafico!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "0.5rem", width: "100%" }}
                    id="input-with-icon-textfield-managment-table"
                    label="Tabla Gestion"
                    onChange={handleInputOnChange}
                    value={processData.tabla_gestion}
                    type="text"
                    name="tabla_gestion"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  {validateInputs.tabla_gestion ? (
                    <Stack
                      sx={{ marginTop: "0.2rem", marginBottom: "1rem" }}
                      direction="row"
                    >
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar una tabla gestion!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa una tabla gestion!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-url"
                    label="Url Aplicacion Movil"
                    onChange={handleInputOnChange}
                    value={processData.url_aplicacion_movil}
                    type="text"
                    name="url_aplicacion_movil"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.url_aplicacion_movil ? (
                    <Stack
                      sx={{ marginTop: "0.2rem", marginBottom: "1rem" }}
                      direction="row"
                    >
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar una url valida!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa una url valida!
                    </Typography>
                  )}
                  {/*  {validateInputs.nombre ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un servicio!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un servicio!
                    </Typography>
                  )} */}

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

                  {/*      {validateInputs.orden ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un orden valido!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un orden valido !
                    </Typography>
                  )} */}
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginBottom: "1rem",
                }}
              >
                <Button
                  endIcon={<Sync />}
                  color="secondary"
                  variant="contained"
                  onClick={handleAddProcess}
                >
                  Guardar Proceso
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
