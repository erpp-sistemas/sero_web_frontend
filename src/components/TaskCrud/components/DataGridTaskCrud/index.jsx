import React from "react";
import { getAllTasks, updateTaskById } from "../../../../api/task";
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
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { getAllProcesses } from "../../../../api/process";

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
   * @param {Object} task - Datos de la tarea para la mutación.
   * @param {string} _action - Acción a realizar ("update", "delete", o "create").
   * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
   *
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  return React.useCallback(async (task, _action) => {
    try {
      // Simulando una pausa de 200 ms con setTimeout
      await new Promise((timeoutResolve) => setTimeout(timeoutResolve, 200));

      const response = updateTaskById(task.id_tarea, task);

      return response.data;
    } catch (error) {
      // Maneja errores de Axios o errores de validación
      console.error(error);
      throw error;
    }
  }, []);
};

/**
 * Calcula la mutación necesaria para la actualización de una fila.
 *
 * @param {Object} newRow - La nueva fila con los datos actualizados.
 * @param {Object} oldRow - La fila antigua con los datos originales.
 * @returns {string|null} - Una cadena que describe la mutación, o null si no hay cambios.
 */
function computeMutation(newRow, oldRow) {
  /**
   * @typedef {Object} Mutation
   * @property {string} [nameMutation] - Descripción de la mutación del nombre.
   * @property {string} [activoMutation] - Descripción de la mutación del estado activo.
   * @property {string} [procesoMutation] - Descripción de la mutación del proceso.
   */

  /** @type {Mutation} */
  const mutation = {};

  if (newRow.nombre !== oldRow.nombre) {
    /**
     * Descripción de la mutación del nombre.
     * @type {string}
     */
    mutation.nameMutation = `¿Realmente quieres cambiar el nombre de '${oldRow.nombre}' a '${newRow.nombre}?'`;
  }

  if (newRow.activo !== oldRow.activo) {
    /**
     * Descripción de la mutación del estado activo.
     * @type {string}
     */
    mutation.activoMutation = `¿Realmente deseas cambiar el estado de 'Activo' de '${
      oldRow.activo ? "✅" : "❎" || ""
    }' a '${newRow.activo ? "✅" : "❎" || ""}'?`;
  }

  if (newRow.id_proceso !== oldRow.id_proceso) {
    /**
     * Descripción de la mutación del proceso.
     * @type {string}
     */
    mutation.procesoMutation = `¿Realmente quieres cambiar el proceso de '${oldRow.id_proceso || ""}' a '${
      newRow.id_proceso || ""
    }'?`;
  }

  // Devuelve la mutación completa o null si no hay cambios
  return Object.values(mutation).join("\n") || null;
}

/**
 * Componente funcional que representa una celda de verificación.
 *
 * @component
 * @example

 * <CheckCell data={true} />
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.data - Valor que determina el estado de la celda.
 * @returns {JSX.Element} - Elemento JSX que representa la celda de verificación.
 */
const CheckCell = ({ data }) => {
  /**
   * Renderiza un icono de verificación si el valor de data es verdadero,
   * o un icono de cruz si el valor de data es falso.
   *
   * @returns {JSX.Element} - Elemento JSX que representa el icono de verificación o cruz.
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
 * Componente que representa una interfaz para la gestión CRUD de tareas en un DataGrid.
 *
 * @component
 * @example

 * <DataGridTaskCrud />
 */
function DataGridTaskCrud() {
  /**
   * Estado para almacenar las filas de datos.
   *
   * @type {Array}
   * @default []
   * @private
   */
  const [rows, setRows] = React.useState([]);
  const [getProcesses, setProcesses] = React.useState([]);
  const mutateRow = useFakeMutation();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
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
   * Construye y devuelve la configuración de columnas para el DataGrid.
   *
   * @function
   * @returns {Array} - Configuración de columnas para el DataGrid.
   * @private
   */
  const buildColumns = () => {
    const columns = [
      {
        field: "nombre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Nombre"}</strong>
        ),
        width: 300,
        editable: true,
      },
      {
        field: "activo",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Activo"}</strong>
        ),
        type: "boolean",
        width: 80,
        align: "left",
        headerAlign: "left",
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
      },
      {
        field: "id_proceso",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Proceso"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
          </strong>
        ),
        type: "singleSelect",
        width: 150,
        align: "left",
        headerAlign: "left",
        editable: true,
        valueGetter: ({ row }) => {
          const targetProcess = getProcesses.find(
            (process) => process.id_proceso === row.id_proceso
          );
          return targetProcess ? targetProcess.nombre : "";
        },
        valueOptions: () => getProcesses.map((process) => process.nombre),
        valueParser: (newValue) => {
          const targetProcess = getProcesses.find(
            (process) => process.nombre === newValue
          );
          return targetProcess ? targetProcess.id_proceso : "";
        },
      },
      {
        field: "actions",
        type: "actions",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Proceso"}
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
              /* onClick={() => handleDeleteClick(id)} */
              color="inherit"
            />,
          ];
        },
      },
    ];

    return columns;
  };

  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */
    const fetchData = async () => {
      try {
        // Aquí deberías hacer tu solicitud de red para obtener los datos
        // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
        const response = await getAllTasks();

        // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_tarea || index.toString(),
        }));

        setRows(rowsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  /**
   * Hook de efecto para cargar datos iniciales al montar el componente.
   *
   * @effect
   * @private
   */

  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */
    const fetchData = async () => {
      try {
        // Aquí deberías hacer tu solicitud de red para obtener los datos
        // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
        const response = await getAllProcesses();

        // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
        const rowsWithId = response
          .map((row, index) => ({
            ...row,
            id: row.id_tarea || index.toString(),
          }))
          .filter((row) => {
            return row.activo;
          });

        setProcesses(rowsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
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
 * Función que maneja la acción "Sí" en el contexto de una promesa al actualizar una tarea en el backend.
 *
 * @function
 * @name handleYes
 * @async
 *
 * @description Esta función realiza una solicitud HTTP para actualizar la tarea en el backend. 
 * Si la solicitud tiene éxito, resuelve la promesa con la respuesta y muestra una notificación de éxito.
 * Si hay un error, muestra una notificación de error, rechaza la promesa y utiliza la fila antigua para mantener el estado interno sin cambios.
 * 
 * @returns {Promise<void>}
 */
  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow, "update");

      setSnackbar({ children: "Tarea guardada exitosamente", severity: "success" });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: "Name can't be empty", severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
    }
   
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };


  /**
 * Función que renderiza un cuadro de diálogo de confirmación.
 *
 * @function
 * @name renderConfirmDialog
 *
 * @description Esta función verifica si hay argumentos de promesa. Si los hay, utiliza la información
 * de la promesa para calcular la mutación entre la fila nueva y antigua. Luego, renderiza un cuadro de diálogo
 * de confirmación con la descripción de la mutación y botones "Sí" y "No" para confirmar o cancelar la acción.
 *
 * @returns {React.ReactElement|null} - Elemento de React que representa el cuadro de diálogo o `null` si no hay argumentos de promesa.
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
          <Button endIcon={<ClearIcon/>} color="secondary" ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button endIcon={<CheckIcon/>} color="secondary" onClick={handleYes}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  /**
   * Componente funcional que representa una barra de herramientas personalizada para un DataGrid.
   *
   * @component
   * @example
   * // Uso en un DataGrid
   * <DataGrid components={{ Toolbar: CustomToolbar }} />
   */
  function CustomToolbar() {
    /**
     * Renderiza una barra de herramientas con botones para gestionar las columnas, filtros, densidad y exportación de un DataGrid.
     *
     * @returns {JSX.Element} - Elemento JSX que representa la barra de herramientas personalizada.
     */

    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />
        <GridToolbarExport color="secondary" />
        {/* <Button
          color="secondary"
          startIcon={<FaTasks />}
          onClick={handleOpenDialog}
        >
          Agregar Nueva Tarea
        </Button> */}
      </GridToolbarContainer>
    );
  }

  /**
   * Función que procesa la actualización de una fila.
   *
   * @param {Object} newRow - La nueva fila con los datos actualizados.
   * @param {Object} oldRow - La fila antigua con los datos originales.
   * @returns {Promise<Object>} - Una promesa que se resolverá con la fila antigua si no hay cambios o con la fila actualizada si hay mutaciones.
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  const processRowUpdate = React.useCallback(
    /**
     * @param {Object} newRow - La nueva fila con los datos actualizados.
     * @param {Object} oldRow - La fila antigua con los datos originales.
     * @returns {Promise<Object>} - Una promesa que se resolverá con la fila antigua si no hay cambios o con la fila actualizada si hay mutaciones.
     * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
     */
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        // Calcula la mutación necesaria para la actualización
        const mutation = computeMutation(newRow, oldRow);

        // Verifica si hay una mutación
        if (mutation) {
          // Guarda los argumentos para resolver o rechazar la promesa más tarde
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          // No hubo cambios, resuelve la promesa con la fila antigua
          resolve(oldRow);
        }
      }),
    []
  );

  /**
   * Renderiza el componente DataGrid con las filas y columnas configuradas.
   *
   * @returns {JSX.Element} - Elemento JSX que representa el DataGrid.
   */
  return (
    <Box style={{ height: 400, width: "100%" }}>
      {renderConfirmDialog()}
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={buildColumns()}
        slots={{ toolbar: CustomToolbar }}
        localeText={{
          toolbarColumns: "Columnas",
          toolbarFilters: "Filtros",
          toolbarDensity: "Tamaño Celda",
          toolbarExport: "Exportar",
        }}
        processRowUpdate={processRowUpdate}
      />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
}

export default DataGridTaskCrud;
