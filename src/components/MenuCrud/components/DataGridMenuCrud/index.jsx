import React from "react";
import { getAllMenus, updateMenu } from "../../../../api/menu";
import {
  Alert,
  Avatar,
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
import { DataGrid } from "@mui/x-data-grid";
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

const AvatarImage = ({ data }) => {
  return (
    <Avatar
      alt="Remy Sharp"
      src={data}
    />
  );
};

/**
 * Hook personalizado para simular una mutación asincrónica con datos ficticios.
 *
 * @param {Function} updateMenuById - Función para actualizar un menu por ID utilizando la API.
 * @returns {Function} - Función de retorno que realiza la mutación asincrónica.
 *
 * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
 *
 * @async
 * @function
 * @name useFakeMutation
 *
 * @param {Object} rol - Datos del menu para la mutación.
 * @param {string} _action - Acción a realizar ("update", "delete", o "create").
 * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
 */
const useFakeMutation = () => {
  /**
   * Función que realiza la mutación asincrónica.
   *
   * @async
   *
   * @param {Object} menu - Datos del menu para la mutación.
   * @param {string} _action - Acción a realizar ("update", "delete", o "create").
   * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
   *
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  return React.useCallback(async (menu, _action) => {
    try {
      // Simulando una pausa de 200 ms con setTimeout
      await new Promise((timeoutResolve) => setTimeout(timeoutResolve, 200));
      const response = await updateMenu(menu.id, menu);

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

  if (newRow.id_menu_padre !== oldRow.id_menu_padre) {
    return `¿Realmente quieres cambiar el estado del id_menu_padre de '${oldRow.id_menu_padre}' a '${newRow.id_menu_padre}'?`;
  }

  if (newRow.descripcion !== oldRow.descripcion) {
    return `¿Realmente quieres cambiar el estado de la descripcion de '${oldRow.descripcion}' a '${newRow.descripcion}'?`;
  }

  if (newRow.url !== oldRow.url) {
    return `¿Realmente quieres cambiar el estado de la url de '${oldRow.url}' a '${newRow.url}'?`;
  }

  if (newRow.icono !== oldRow.icono) {
    return `¿Realmente quieres cambiar el estado del icono de '${oldRow.icono}' a '${newRow.icono}'?`;
  }

  if (newRow.icon_mui !== oldRow.icon_mui) {
    return `¿Realmente quieres cambiar el estado de icon_mui de '${oldRow.icon_mui}' a '${newRow.icon_mui}'?`;
  }

  if (newRow.route !== oldRow.route) {
    return `¿Realmente quieres cambiar el estado del route de '${oldRow.route}' a '${newRow.route}'?`;
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
function DataGridMenuCrud() {
  const [rows, setRows] = React.useState([]);
  const mutateRow = useFakeMutation();
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const noButtonRef = React.useRef(null);

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
        children: "Menu guardado con éxito",
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

  const fetchMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllMenus();

      // Agrega el campo 'id_menu' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_menu,
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

    fetchMenus();
  }, []);

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
        width: 180,
        editable: true,
      },
      {
        field: "id_menu_padre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Menu Padre"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      {
        field: "descripcion",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Descripción"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },

      {
        field: "url",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Url"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      {
        field: "icono",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Icono"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
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
        field: "icon_mui",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Icon Mui"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
        /* renderCell: (params) => (
          <AvatarImage
            data={params.row.icon_mui}
           
            
          />
        ), */
      },
      {
        field: "route",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Ruta"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
    ];
    return columns;
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
        processRowUpdate={processRowUpdate}
        rows={rows}
        columns={buildColumns()}
      />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
}

export default DataGridMenuCrud;
