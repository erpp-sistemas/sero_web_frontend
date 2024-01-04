import React from "react";
import { createMenu, getAllMenus, updateMenu } from "../../../../api/menu";
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
  Menu,
  MenuItem,
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
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { AddOutlined } from "@mui/icons-material";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbZoomCancel } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import CloseIcon from "@mui/icons-material/Close";
import { Sync, SyncAltOutlined } from "@mui/icons-material";
import * as MUIIcons from '@mui/icons-material';
import * as faIcons from '@fortawesome/free-solid-svg-icons'
import { faClosedCaptioning } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



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

const FaIcon = ({data})=>{
  const [iconNames, setIconNames] = React.useState([]);
  const [randomColor, setRandomColor] = React.useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    // Obtener los nombres de los iconos al montar el componente
    const names = Object.keys(faIcons);
 
    setIconNames(names);

    // Generar el color aleatorio y establecerlo solo durante el montaje
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setRandomColor(color);
  }, []); 

  const getFilteredIconName = (data) => {
    return iconNames.find((iconName) =>{ 
     
      
      return iconName === data});
  };

  const filteredIconName = getFilteredIconName(data);
  

  return filteredIconName ? (<>
    <IconButton  onClick={handleClick} sx={{ bgcolor: randomColor }} size="small">
      {<FontAwesomeIcon icon={faIcons[`${filteredIconName}`]} /> }
    </IconButton>
     <Menu
     id="basic-menu"
     anchorEl={anchorEl}
     open={open}
     onClose={handleClose}
     MenuListProps={{
       'aria-labelledby': 'basic-button',
     }}
   >
     <MenuItem>Profile</MenuItem>
     <MenuItem >My account</MenuItem>
     <MenuItem >Logout</MenuItem>
   </Menu>
   </>
    
  ) : data;

}

const MUIcon = ({ data }) => {



  const [iconNames, setIconNames] = React.useState([]);
  const [randomColor, setRandomColor] = React.useState('');
  React.useEffect(() => {
    // Obtener los nombres de los iconos al montar el componente
    const names = Object.keys(MUIIcons);
    setIconNames(names);

     // Generar el color aleatorio y establecerlo solo durante el montaje
     const letters = '0123456789ABCDEF';
     let color = '#';
     for (let i = 0; i < 6; i++) {
       color += letters[Math.floor(Math.random() * 16)];
     }
     setRandomColor(color);
  }, []); 
  
  const getFilteredIconName = (data) => {
    return iconNames.find((iconName) => iconName === data);
  };

  const filteredIconName = getFilteredIconName(data);
 
 

  return filteredIconName?  <IconButton sx={{bgcolor:randomColor}} size="small">
   {filteredIconName && React.createElement(MUIIcons[filteredIconName])}
</IconButton>:null
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
  const [isNewMenuDialogOpen, setNewMenuDialogOpen] = React.useState(false);
  const [menuData, setMenuData] = React.useState({
    nombre: "",
    descripcion: "",
    url: "",
    icono: "",
    activo: Boolean(""),
    icon_mui: "",
    route: "",
    id_menu_padre: "",
  });

  const [validateInputs, setValidateInputs] = React.useState({
    nombre: false,
    descripcion: false,
    url: false,
    icono: false,
    icon_mui: false,
    route: false,
    id_menu_padre: false,
  });


  
  /**
   * Manejador para el cambio de entrada en los campos del formulario.
   * @function
   * @param {Object} event - El evento del cambio de entrada.
   * @param {string} event.target.name - El nombre del campo cambiado.
   * @param {string} event.target.value - El nuevo valor del campo.
   * @param {string} event.target.type - El tipo del campo (puede ser "text", "checkbox", etc.).
   * @param {boolean} event.target.checked - El estado de la casilla de verificación si el campo es de tipo "checkbox".
   * @returns {void}
   */
  const handleInputOnChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setMenuData((prevState) => ({
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

      case "descripcion":
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: value.length > 0,
        }));

        break;

      case "url":
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: value.length > 0,
        }));

        break;

      case "icon_mui":
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: value.length > 0,
        }));

        break;

      case "icono":
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: value.length > 0,
        }));

        break;

      case "route":
        setValidateInputs((prevValidateInputs) => ({
          ...prevValidateInputs,
          [name]: value.length > 0,
        }));

        break;

      case "id_menu_padre":
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
   * Manejador para abrir el diálogo del nuevo menú.
   * @function
   * @name handleOpenNewMenuDialog
   * @returns {void}
   */
  const handleOpenNewMenuDialog = () => {
    setNewMenuDialogOpen(true);
  };

  /**
   * Manejador para cerrar el diálogo del nuevo menú.
   * @function
   * @name handleCloseNewMenuDialog
   * @returns {void}
   */
  const handleCloseNewMenuDialog = () => {
    setNewMenuDialogOpen(false);
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
          onClick={handleOpenNewMenuDialog}
          startIcon={<AddOutlined />}
          size="small"
        >
          Agregar Nuevo Menu
        </Button>
      </GridToolbarContainer>
    );
  }

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
        renderCell: (params) => (
          <FaIcon
            data={params.row.icono}
           
            
          />
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
         renderCell: (params) => (
          <MUIcon
            data={params.row.icon_mui}
           
            
          />
        ), 
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
   *   await handleAddMenu();
   *   console.log("Data saved successfully!");
   * } catch (error) {
   *   console.error("Error saving data:", error.message);
   * }
   */

   const handleAddMenu = async () => {
    // Verificar si todos los campos están validados
    const isFormValid = Object.values(validateInputs).every(
      (isValid) => isValid
    );

    if (isFormValid) {
      try {
      

        const response = await createMenu(menuData);

        // Aquí puedes manejar la respuesta de la solicitud si es necesario
        console.log("Respuesta de la API:", response.data);

        // Mostrar Snackbar de éxito
        setSnackbar({
          children: "Menu añadido correctamente",
          severity: "success",
        });

        // Cerrar el diálogo, actualizar el estado, o realizar otras acciones necesarias
        fetchMenus();
        handleCloseNewMenuDialog();
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
        height: "auto",
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

      {isNewMenuDialogOpen && (
        <Dialog
          fullScreen
          open={isNewMenuDialogOpen}
          onClose={handleCloseNewMenuDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseNewMenuDialog}
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
                width: "80%",
                height: "auto",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "2rem" }}>
                Agregar Nuevo Menu
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {/*  nombre,
        descripcion,
        url,
        icono,
        activo,
        icon_mui,
        route,
        id_menu_padre */}
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del menu"
                    onChange={handleInputOnChange}
                    value={menuData.nombre}
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

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-descripcion"
                    label="Descripciòn"
                    onChange={handleInputOnChange}
                    value={menuData.descripcion}
                    type="text"
                    name="descripcion"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.descripcion ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar una descripciòn!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa una descripciòn!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-url"
                    label="Url"
                    onChange={handleInputOnChange}
                    value={menuData.url}
                    type="text"
                    name="url"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.url ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar una url!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa una url!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-icono"
                    label="Icono"
                    onChange={handleInputOnChange}
                    value={menuData.icono}
                    type="text"
                    name="icono"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.icono ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un icono!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un icono!
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                      marginBottom: "0.2rem",
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
                <Grid item xs={6}>
                  {/* icon_mui,
        route,
        id_menu_padre */}
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-icon_mui"
                    label="Icon MUI"
                    onChange={handleInputOnChange}
                    value={menuData.icon_mui}
                    type="text"
                    name="icon_mui"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.icon_mui ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un icono!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un icono!
                    </Typography>
                  )}
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-route"
                    label="Ruta"
                    onChange={handleInputOnChange}
                    value={menuData.route}
                    type="text"
                    name="route"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.route ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar una ruta!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa una ruta!
                    </Typography>
                  )}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-id-menu-padre"
                    label="Menu Padre"
                    onChange={handleInputOnChange}
                    value={menuData.id_menu_padre}
                    type="text"
                    name="id_menu_padre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  {validateInputs.id_menu_padre ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un menu padre!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un menu padre!
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "0.5rem",
                }}
              >
                <Button
                  endIcon={<Sync />}
                  color="secondary"
                  variant="contained"
                    onClick={handleAddMenu} 
                >
                  Guardar Menu
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default DataGridMenuCrud;
