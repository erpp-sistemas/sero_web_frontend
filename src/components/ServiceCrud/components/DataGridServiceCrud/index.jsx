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
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import React from "react";
import {
  createService,
  deleteService,
  getAllServices,
  updateService,
} from "../../../../api/service";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { BiSolidImageAdd } from "react-icons/bi";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";

import { uploadToS3 } from "../../../../services/s3.service";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbZoomCancel } from "react-icons/tb";

import { AddOutlined, Sync, SyncAltOutlined } from "@mui/icons-material";
import { FaTasks } from "react-icons/fa";
import { GrServices } from "react-icons/gr";

/**
 * Hook personalizado para simular una mutación asincrónica con datos ficticios.
 *
 * @param {Function} updateTaskById - Función para actualizar una tarea por ID utilizando la API.
 * @returns {Function} - Función de retorno que realiza la mutación asincrónica.
 *
 * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
 *
 * @async
 * @function
 * @name useFakeMutation
 *
 * @param {Object} task - Datos de la tarea para la mutación.
 * @param {string} _action - Acción a realizar ("update", "delete", o "create").
 * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
 */
const useFakeMutation = () => {
  /**
   * Función que realiza la mutación asincrónica.
   *
   * @async
   *
   * @param {Object} service - Datos del servicio para la mutación.
   * @param {string} _action - Acción a realizar ("update", "delete", o "create").
   * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
   *
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  return React.useCallback(async (service, _action) => {
    try {
      // Simulando una pausa de 200 ms con setTimeout
      await new Promise((timeoutResolve) => setTimeout(timeoutResolve, 200));

      const response = updateService(service.id, service);

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
    return `Nombre de '${oldRow.nombre}' a '${newRow.nombre}'`;
  }

  if (newRow.fecha_ingreso !== oldRow.fecha_ingreso) {
    return `Name from '${oldRow.fecha_ingreso}' to '${newRow.fecha_ingreso}'`;
  }

  if (newRow.activo !== oldRow.activo) {
    return `Name from '${oldRow.activo}' to '${newRow.activo}'`;
  }

  if (newRow.orden !== oldRow.orden) {
    return `Orden de '${oldRow.orden}' a '${newRow.orden}'`;
  }
  /*  if (newRow.activo !== oldRow.activo) {
      return `¿Realmente deseas cambiar el estado de 'Activo' de '${
        oldRow.activo ? "✅" : "❎" || ""
      }' a '${newRow.activo ? "✅" : "❎" || ""}'?`;
    }
  
    if (newRow.id_proceso !== oldRow.id_proceso) {
      return `Proceso from '${oldRow.id_proceso || ""}' to '${
        newRow.id_proceso || ""
      }'`;
    } */
  return null;
}

function DataGridServiceCrud() {
  // Estado para almacenar la URL
  const [url, setUrl] = React.useState(
    "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
  );
  const [rows, setRows] = React.useState([]);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const mutateRow = useFakeMutation();
  const [isNewServiceDialogOpen, setNewServiceDialogOpen] =
    React.useState(false);

  // Estado para almacenar la imagen seleccionada
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState("");
  const [selectedAppIcon, setSelectedAppIcon] = React.useState(null);
  const [selectedWebImage, setSelectedWebImage] = React.useState(null);
  const [getRowData, setGetRowData] = React.useState();
  const [singnedUrl, setSignedUrl] = React.useState(null);
  const noButtonRef = React.useRef(null);
  const [serviceData, setServiceData] = React.useState({
    nombre: "",
    imagen: "",
    activo: Boolean(""),
    orden: Number(""),
    icono_app_movil: "",
  });
  const [validateInputs, setValidateInputs] = React.useState({
    nombre: false,
    orden: false,
  });
  /**
   * Maneja los cambios en los campos de entrada y actualiza el estado correspondiente.
   *
   * @param {Object} event - Objeto del evento que desencadena la función.
   * @param {Object} event.target - El elemento que disparó el evento.
   * @param {string} event.target.name - El nombre del campo de entrada.
   * @param {string|boolean} event.target.value - El valor del campo de entrada.
   * @param {string} event.target.type - El tipo del campo de entrada.
   * @param {boolean} event.target.checked - El estado de la casilla de verificación (solo para campos de tipo checkbox).
   */
  const handleInputOnChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setServiceData((prevState) => ({
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

      case "orden":
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
   * Abre el diálogo para crear un nuevo servicio.
   *
   * @function
   * @name handleOpenNewServiceDialog
   * @returns {void}
   */
  const handleOpenNewServiceDialog = () => {
    setNewServiceDialogOpen(true);
  };

  /**
   * Cierra el diálogo para crear un nuevo servicio.
   *
   * @function
   * @name handleCloseNewServiceDialog
   * @returns {void}
   */
  const handleCloseNewServiceDialog = () => {
    setNewServiceDialogOpen(false);
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

  /**
   * Maneja el evento de clic para eliminar una tarea.
   *
   * @async
   * @function
   * @name handleDeleteClick
   *
   * @param {string} id - El identificador único de la tarea que se va a eliminar.
   * @returns {Promise<void>} - Una promesa que se resuelve después de intentar eliminar la tarea.
   *
   * @throws {Error} - Se lanza un error si hay un problema al intentar eliminar la tarea.
   *
   * @description Esta función realiza una solicitud HTTP para eliminar la tarea con el identificador proporcionado.
   * Si la solicitud tiene éxito, muestra un mensaje en el Snackbar indicando que la tarea se ha eliminado correctamente.
   * Si hay un error durante el proceso, muestra un mensaje de error en el Snackbar.
   */
  const handleDeleteClick = async (id) => {
    try {
      // Realizar la solicitud HTTP para eliminar la tarea en el backend
      const response = await deleteService(id);
      

      // Mostrar un mensaje en el Snackbar después de la eliminación exitosa
      setSnackbar({
        children: "Tarea eliminada exitosamente",
        severity: "success",
      });

      fetchData()
    } catch (error) {
      fetchData()
      // Mostrar un mensaje de error en el Snackbar si hay un problema al eliminar la tarea
      setSnackbar({
        children: "Error al eliminar la tarea",
        severity: "error",
      });
      console.error("Error al eliminar la tarea:", error);
      throw error; // Relanzar el error para que pueda ser manejado en otras partes de la aplicación si es necesario
    }
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
        children: "Servicio guardado con exito ",
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
    setServiceData((prevData) => ({
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
   * Maneja el cambio de un archivo para el icono de la aplicación y realiza acciones relacionadas.
   *
   * @param {Object} event - Objeto del evento que desencadena la función.
   * @param {FileList} event.target.files - Lista de archivos seleccionados.
   * @throws {Error} Lanza un error si hay un problema al subir el archivo.
   * @returns {Promise<void>} Una promesa que se resuelve cuando se completa el proceso de manejo del archivo.
   */
  const handleFileChangeAppIcon = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedAppIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }

    try {
      const fileUrl = await uploadToS3(file);
      console.log("URL del archivo subido:", fileUrl);

      setServiceData((prevData) => {
        // Update the 'imagen' property in the state with the new fileUrl
        return { ...prevData, icono_app_movil: fileUrl };
      });

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
   * Componente que muestra una imagen en forma de Avatar.
   *
   * @component
   * @param {Object} props - Propiedades del componente.
   * @param {string|null} props.data - URL de la imagen o nulo si no hay imagen.
   * @param {Function} props.setGetRowData - Función para actualizar datos del componente padre.
   * @param {Object} props.getDataRow - Datos de la fila asociada a la imagen.
   * @param {string} props.field - Nombre del campo asociado a la imagen ("imagen" o "icono_app_movil").
   * @param {Function} props.setUrl - Función para actualizar la URL de la imagen en el componente padre.
   * @returns {JSX.Element} El componente AvatarImage.
   */
  const AvatarImage = ({
    data,
    setGetRowData,
    getDataRow,
    field,
    setUrl,
    /*  handleClickOpen,
      ,
      ,
      ,
      , */
  }) => {
    if (!data) {
      return (
        <IconButton
          onClick={() => {
            handleOpenImageDialog();
            switch (field) {
              case "imagen":
                setGetRowData({ ...getDataRow, field: field });

                break;

              case "icono_app_movil":
                setGetRowData({ ...getDataRow, field: field });

                break;

              default:
                break;
            }
          }}
          aria-label="delete"
        >
          <BiSolidImageAdd />
        </IconButton>
      );
    } else {
      return (
        <Avatar
          onClick={(e) => {
            handleOpenImageDialog();
            setUrl(e.target.src);

            switch (field) {
              case "imagen":
                setGetRowData({ ...getDataRow, field: field });

                break;

              case "icono_app_movil":
                setGetRowData({ ...getDataRow, field: field });

                break;

              default:
                break;
            }
          }}
          alt="Remy Sharp"
          src={data}
        />
      );
    }
  };

  const fetchData = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllServices();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
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

    fetchData();
  }, []);

  const buildColumns = () => {
    /**
     * The configuration for a column in the data grid.
     *
     * @typedef {Object} ColumnConfig
     * @property {string} field - The field identifier for the column.
     * @property {Function} [renderHeader] - The function to render the header content.
     * @property {number} [width] - The width of the column.
     * @property {boolean} [editable] - Indicates whether the column is editable.
     * @property {Function} [renderCell] - The function to render the cell content.
     * @property {string} [type] - The type of the column (e.g., 'boolean', 'dateTime').
     * @property {string} [cellClassName] - The class name for the cell.
     * @property {Function} [getActions] - The function to get actions for the cell.
     */
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
        width: 180,
        editable: true,
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
        width: 200,
        editable: false,
        renderCell: (params) => (
          <AvatarImage
            data={params.row.imagen}
            setGetRowData={setGetRowData}
            getDataRow={params.row}
            field={"imagen"}
            setUrl={setUrl}
            /*  
              
              
              handleClickOpen={handleClickOpen}
              
              */
          />
        ),
      },
      {
        field: "icono_app_movil",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Icono de App Movil"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 200,
        editable: true,
        renderCell: (params) => (
          <AvatarImage
            data={params.row.icono_app_movil}
            setGetRowData={setGetRowData}
            getDataRow={params.row}
            /*    data={params.row.icono_app_movil} */
            /* handleClickOpen={handleClickOpen} */
            setUrl={setUrl}
            field={"icono_app_movil"}
          />
        ),
      },
      {
        field: "activo",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Estado"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 80,
        type: "boolean",
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
      },
      {
        field: "orden",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Orden"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 100,
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
    ];

    return columns;
  };

  /**
   * CheckCell component for rendering an IconButton with check or clear icon based on data.
   *
   * @component
   * @param {Object} props - The component props.
   * @param {boolean} props.data - Boolean data to determine the icon.
   * @returns {JSX.Element} - The rendered CheckCell component.
   *
   * @example
   * // Usage example
   * <CheckCell data={true} />
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

        let updatedRowData;
        switch (getRowData.field) {
          case "imagen":
            updatedRowData = { ...getRowData, imagen: singnedUrl };

            break;

          case "icono_app_movil":
            updatedRowData = { ...getRowData, icono_app_movil: singnedUrl };

            break;

          default:
            // Si field no coincide con ninguna condición, usa un valor predeterminado o maneja según tu lógica
            updatedRowData = { ...getRowData };
            break;
        }

        // Make a PUT request using the updatedRowData
        /*    console.log(updatedRowData);
         */

        const response = await updateService(getRowData.id, updatedRowData);

        // You can handle the response as needed
        console.log("Save successful:", response.data);
        setSnackbar({
          children: "Guardado exitoso",
          severity: "success",
        });
        // If you want to close something after successful save, uncomment the following line
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
   * Custom toolbar component for the service grid. It includes various actions like column selection,
   * filtering, density selector, and export. Additionally, it provides a button to open a dialog
   * for adding a new service.
   *
   * @component
   * @param {Object} props - The properties passed to the component.
   * @param {Function} props.handleOpenDialog - The function to handle opening the dialog for adding a new service.
   * @returns {React.ReactElement} The rendered component.
   *
   * @example
   * // Usage example
   * const handleOpenDialogFunc = () => {
   *   // Implement the logic to open the dialog for adding a new service
   * };
   *
   * // Render the CustomToolbar component with the handleOpenDialog function
   * <CustomToolbar handleOpenDialog={handleOpenDialogFunc} />
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
          onClick={handleOpenNewServiceDialog}
          startIcon={<AddOutlined />}
          size="small"
        >
          Agregar Nuevo Servicio
        </Button>
      </GridToolbarContainer>
    );
  }

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
   *   await handleAddService();
   *   console.log("Data saved successfully!");
   * } catch (error) {
   *   console.error("Error saving data:", error.message);
   * }
   */

  const handleAddService = async () => {
    // Verificar si todos los campos están validados
    const isFormValid = Object.values(validateInputs).every(
      (isValid) => isValid
    );

    if (isFormValid) {
      try {
        /*  const response = await axios.post(
         "http://localhost:3000/api/services",
         serviceData
       ); */

        const response = await createService(serviceData);

        // Aquí puedes manejar la respuesta de la solicitud si es necesario
        console.log("Respuesta de la API:", response.data);

        // Mostrar Snackbar de éxito
        setSnackbar({
          children: "Servicio añadido correctamente",
          severity: "success",
        });

        // Cerrar el diálogo, actualizar el estado, o realizar otras acciones necesarias
        fetchData();
        handleCloseNewServiceDialog();
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
    <Box style={{ height: 400, width: "100%" }}>
      {renderConfirmDialog()}
      <DataGrid
        processRowUpdate={processRowUpdate}
        localeText={{
          toolbarColumns: "Columnas",
          toolbarFilters: "Filtros",
          toolbarDensity: "Tamaño Celda",
          toolbarExport: "Exportar",
        }}
        rows={rows}
        columns={buildColumns()}
        slots={{ toolbar: CustomToolbar }}
      />

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
                      <Box>
                        <img
                          className="rounded-full h-36 w-36 object-cover"
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
                  variant="contained" /* onClick={handleAddTask} */
                >
                  Guardar Imagen
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}

      {isNewServiceDialogOpen && (
        <Dialog
          fullScreen
          open={isNewServiceDialogOpen}
          onClose={handleCloseNewServiceDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseNewServiceDialog}
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
                height: "85%",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "2rem" }}>
                Agregar Nuevo Servicio
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
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
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del servicio"
                    onChange={handleInputOnChange}
                    value={serviceData.nombre}
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
                        ¡Gracias por ingresar un servicio!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un servicio!
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

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-order"
                    label="Orden"
                    onChange={handleInputOnChange}
                    value={serviceData.orden}
                    type="text"
                    name="orden"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.orden ? (
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
                  )}
                </Grid>

                <Grid
                  item
                  xs={3}
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
                      Icono de la app
                    </Typography>
                    <Box sx={{ marginBottom: "0.5rem" }}>
                      <img
                        className="rounded-full h-36 w-36 object-cover border-solid border-2 border-white"
                        src={selectedAppIcon || url}
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
                      onChange={handleFileChangeAppIcon}
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
                  onClick={handleAddService}
                 
                >
                  Guardar Servicio
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default DataGridServiceCrud;
