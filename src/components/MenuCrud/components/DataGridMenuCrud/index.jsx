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
  NativeSelect,
  Pagination,
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
import * as MUIIcons from "@mui/icons-material";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { faClosedCaptioning } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SearchIcon from "@mui/icons-material/Search";

/**
 * Componente Funcional FaIcon.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.data - Datos del ícono.
 * @param {Function} props.handleOpenFontawesomeIconCatalogDialog - Función para abrir el catálogo de iconos.
 * @param {Object} props.row - Fila de datos asociada al ícono.
 * @param {Function} props.setDataRow - Función para establecer la fila de datos.
 * @returns {JSX.Element} Componente FaIcon.
 */
const FaIcon = ({
  data,
  handleOpenFontawesomeIconCatalogDialog,
  row,
  setDataRow,
}) => {
  const [iconNames, setIconNames] = React.useState([]);
  const [randomColor, setRandomColor] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  /**
   * Maneja el clic del botón para abrir el menú.
   *
   * @param {Event} event - Evento de clic.
   * @returns {void}
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Maneja el cierre del menú.
   *
   * @returns {void}
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  /**
   * Efecto secundario para obtener nombres de iconos y generar un color aleatorio al montar el componente.
   *
   * @returns {void}
   */
  React.useEffect(() => {
    // Obtener los nombres de los iconos al montar el componente
    const names = Object.keys(faIcons);

    setIconNames(names);

    // Generar el color aleatorio y establecerlo solo durante el montaje
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setRandomColor(color);
  }, []);

  /**
   * Obtiene el nombre del ícono filtrado.
   *
   * @param {string} data - Datos del ícono.
   * @returns {string|undefined} Nombre del ícono filtrado.
   */
  const getFilteredIconName = (data) => {
    return iconNames.find((iconName) => {
      return iconName === data;
    });
  };

  const filteredIconName = getFilteredIconName(data);

  return filteredIconName ? (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ bgcolor: randomColor }}
        size="small"
      >
        {<FontAwesomeIcon icon={faIcons[`${filteredIconName}`]} />}
      </IconButton>
      <Menu
        sx={{ p: 2 }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenFontawesomeIconCatalogDialog();
            setDataRow(row);
            handleClose();
          }}
        >
          Catalogo de Iconos FontAwesome
        </MenuItem>
      </Menu>
    </>
  ) : (
    <IconButton>
      <AddOutlined
        onClick={() => {
          handleOpenFontawesomeIconCatalogDialog();
          setDataRow(row);
        }}
      />
    </IconButton>
  );
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

const MUIcon = ({
  data,
  handleOpenMaterialUiIconCatalogDialog,
  setDataRowMui,
  row,
}) => {
  const [iconNames, setIconNames] = React.useState([]);
  const [randomColor, setRandomColor] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openNewSubMenuDialog, setOpenNewSubMenuDialog] = React.useState(false);

  /**
   * Función que maneja la apertura del diálogo de submenú.
   * Cambia el estado a true para indicar que el diálogo debe abrirse.
   * @function
   */
  const handleOpenNewSubMenuDialog = () => {
    setOpenNewSubMenuDialog(true);
  };

  /**
   * Función que maneja el cierre del diálogo de submenú.
   * Cambia el estado a false para indicar que el diálogo debe cerrarse.
   * @function
   */
  const handleCloseNewSubMenuDialog = () => {
    setOpenNewSubMenuDialog(false);
  };
  /**
   * Maneja el clic del botón para abrir el menú.
   *
   * @param {Event} event - Evento de clic.
   * @returns {void}
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Maneja el cierre del menú.
   *
   * @returns {void}
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Efecto secundario para obtener nombres de iconos y generar un color aleatorio al montar el componente.
   *
   * @returns {void}
   */
  React.useEffect(() => {
    // Obtener los nombres de los iconos al montar el componente
    const names = Object.keys(MUIIcons);

    setIconNames(names);

    // Generar el color aleatorio y establecerlo solo durante el montaje
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setRandomColor(color);
  }, []);

  const getFilteredIconName = (data) => {
    return iconNames.find((iconName) => {
      return iconName === data;
    });
  };

  const filteredIconName = getFilteredIconName(data);

  return filteredIconName ? (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ bgcolor: randomColor }}
        size="small"
      >
        {filteredIconName && React.createElement(MUIIcons[filteredIconName])}
      </IconButton>
      <Menu
        sx={{ p: 2 }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenMaterialUiIconCatalogDialog();
            setDataRowMui(row);
            handleClose();
          }}
        >
          Catalogo de Iconos Material UI
        </MenuItem>
      </Menu>
    </>
  ) : (
    <IconButton>
      <AddOutlined
        onClick={() => {
          handleOpenMaterialUiIconCatalogDialog();
          setDataRowMui(row);
        }}
      />
    </IconButton>
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
  const [isOpenFontawesomeIconCatalogDialog, setFontawesomeIconCatalogDialog] =
    React.useState(false);
  const [isOpenMaterialUiIconCatalogDialog, setMaterialUiIconCatalogDialog] =
    React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [iconNames, setIconNames] = React.useState([]);
  const [selectedIcon, setSelectedIcon] = React.useState("");
  const [iconColors, setIconColors] = React.useState([]);
  const [getRow, setDataRow] = React.useState("");
  const [iconNamesMui, setIconNamesMui] = React.useState([]);
  const [searchQueryMui, setSearchQueryMui] = React.useState("");
  const [selectedIconMui, setSelectedIconMui] = React.useState("");
  const [iconColorsMui, setIconColorsMui] = React.useState([]);
  const [getRowMui, setDataRowMui] = React.useState("");
  const mutateRow = useFakeMutation();
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const noButtonRef = React.useRef(null);

  const [isNewMenuDialogOpen, setNewMenuDialogOpen] = React.useState(false);
  const [menuData, setMenuData] = React.useState({
    nombre: "",
    descripcion: "",
    url: "",
    activo: Boolean(""),
    route: "",
    id_menu_padre: "",
  });

  const [validateInputs, setValidateInputs] = React.useState({
    nombre: false,
    descripcion: false,
    url: false,
    route: false,
    id_menu_padre: false,
  });

  /**
   * Maneja el cambio en la barra de búsqueda.
   *
   * @param {object} event - El evento del cambio en la barra de búsqueda.
   */
  const handleSearchChangeMui = (event) => {
    setSearchQueryMui(event.target.value);
    setCurrentPageMui(1); // Resetear la página al realizar una nueva búsqueda
    setSelectedIconMui("");
  };
  /**
   * Maneja el cambio en la barra de búsqueda.
   *
   * @param {object} event - El evento del cambio en la barra de búsqueda.
   */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Resetear la página al realizar una nueva búsqueda
    setSelectedIcon("");
  };

  React.useEffect(() => {
    // Generar colores para todos los íconos al cargar el componente
    const colors = iconNames.map(() => getRandomColor());
    setIconColors(colors);
  }, [iconNames]);

  React.useEffect(() => {
    // Generar colores para todos los íconos al cargar el componente
    const colors = iconNames.map(() => getRandomColor());
    setIconColorsMui(colors);
  }, [iconNamesMui]);

  const filteredIcons = iconNames.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIconsMui = iconNamesMui.filter((icon) =>
    icon.toLowerCase().includes(searchQueryMui.toLowerCase())
  );

  const itemsPerPage = 100; // Número de íconos por página
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPageMui, setCurrentPageMui] = React.useState(1);
  // Lógica para calcular los íconos que deben mostrarse en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleIcons = filteredIcons.slice(startIndex, endIndex);
  // Lógica para calcular los íconos que deben mostrarse en la página actual
  const startIndexMui = (currentPageMui - 1) * itemsPerPage;
  const endIndexMui = startIndexMui + itemsPerPage;
  const visibleIconsMui = filteredIconsMui.slice(startIndexMui, endIndexMui);

  React.useEffect(() => {
    // Obtener los nombres de los iconos al montar el componente
    const names = Object.keys(faIcons);

    setIconNames(names);

    // Generar el color aleatorio y establecerlo solo durante el montaje
    // Generar el color aleatorio y establecerlo solo durante el montaje
  }, []);

  React.useEffect(() => {
    // Obtener los nombres de los iconos al montar el componente
    const names = Object.keys(MUIIcons);

    setIconNamesMui(names);

    // Generar el color aleatorio y establecerlo solo durante el montaje
    // Generar el color aleatorio y establecerlo solo durante el montaje
  }, []);

  /**
   * Genera un color aleatorio en formato hexadecimal.
   *
   * @returns {string} - Color hexadecimal generado aleatoriamente.
   */
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  /**
   * Maneja el clic en un icono.
   *
   * @param {string} icon - El nombre del icono seleccionado.
   */
  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  /**
   * Maneja el clic en un icono.
   *
   * @param {string} icon - El nombre del icono seleccionado.
   */
  const handleIconClickMui = (icon) => {
    setSelectedIconMui(icon);
  };

  /**
   * Maneja la apertura del diálogo de catálogo de iconos de FontAwesome.
   */
  const handleOpenFontawesomeIconCatalogDialog = () => {
    setFontawesomeIconCatalogDialog(true);
  };

  /**
   * Maneja el cierre del diálogo de catálogo de iconos de FontAwesome.
   */
  const handleCloseFontawesomeIconCatalogDialog = () => {
    setFontawesomeIconCatalogDialog(false);
  };

  /**
   * Maneja la apertura del diálogo de catálogo de iconos de Material-UI.
   * @function
   * @returns {void}
   */
  const handleOpenMaterialUiIconCatalogDialog = () => {
    setMaterialUiIconCatalogDialog(true);
  };

  /**
   * Maneja el cierre del diálogo de catálogo de iconos de Material-UI.
   * @function
   * @returns {void}
   */
  const handleCloseMaterialUiIconCatalogDialog = () => {
    setMaterialUiIconCatalogDialog(false);
  };

  /**
   * Maneja el cambio de página en la paginación.
   *
   * @param {object} event - El evento del cambio de página.
   * @param {number} newPage - El número de la nueva página.
   */
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * Maneja el cambio de página en la paginación.
   *
   * @param {object} event - El evento del cambio de página.
   * @param {number} newPage - El número de la nueva página.
   */

  const handlePageChangeMui = (event, newPage) => {
    setCurrentPageMui(newPage);
  };

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

  /**
   * Maneja el cambio de icono para un submenú.
   *
   * @param {string} selectedIcon - El nuevo icono seleccionado.
   * @param {Function} handleCloseFontawesomeIconCatalogDialog - Función para cerrar el diálogo del catálogo de FontAwesome.
   */
  const handleChangeIcon = async (
    selectedIcon,
    handleCloseFontawesomeIconCatalogDialog
  ) => {
    // Obtiene la fila actual
    const currentRow = getRow;

    // Crea un nuevo objeto con el mismo contenido que getRow, pero con el icono actualizado
    const updatedRow = {
      ...currentRow,
      icono: selectedIcon,
    };

    // Aquí puedes realizar cualquier lógica adicional necesaria para manejar el cambio del icono

    try {
      // Realiza una solicitud para actualizar el submenú con el nuevo icono
      const response = await updateMenu(updatedRow.id, updatedRow);

      // Aquí puedes manejar la respuesta de la solicitud si es necesario

      // Muestra Snackbar de éxito
      setSnackbar({
        children: "Icono añadido correctamente",
        severity: "success",
      });

      // Cierra el diálogo, actualiza el estado, o realiza otras acciones necesarias
      fetchMenus();
      handleCloseFontawesomeIconCatalogDialog();
    } catch (error) {
      console.error("Error al guardar datos:", error);
      // Muestra Snackbar de error
      setSnackbar({ children: "Error al guardar datos", severity: "error" });
      // Aquí puedes manejar el error según tus necesidades
    }

    // Cierra el diálogo u realiza otras acciones después de cambiar el icono
  };

  /**
   * Maneja el cambio de icono en un diálogo de catálogo de iconos de Material-UI.
   * @param {string} selectedIconMui - Icono seleccionado de Material-UI.
   * @param {Function} handleCloseMaterialUiIconCatalogDialog - Función para cerrar el diálogo de catálogo de iconos de Material-UI.
   */
  const handleChangeIconMui = async (
    selectedIconMui,
    handleCloseMaterialUiIconCatalogDialog
  ) => {
    // Obtiene la fila actual mediante la función getRowMui
    const currentRow = getRowMui;

    // Crea un nuevo objeto con el mismo contenido que getRow, pero con el icono actualizado
    const updatedRow = {
      ...currentRow,
      icon_mui: selectedIconMui,
    };

    // Aquí puedes realizar cualquier lógica adicional necesaria para manejar el cambio del icono

    try {
      // Actualiza la fila en la base de datos mediante una función de actualización (updateSubMenu)
      const response = await updateMenu(updatedRow.id, updatedRow);

      // Aquí puedes manejar la respuesta de la solicitud si es necesario

      // Muestra Snackbar de éxito
      setSnackbar({
        children: "Icono cambiado satisfactoriamente",
        severity: "success",
      });

      // Cierra el diálogo, actualiza el estado, o realiza otras acciones necesarias
      fetchMenus();
      handleCloseMaterialUiIconCatalogDialog();
    } catch (error) {
      console.error("Error al guardar datos:", error);

      // Muestra Snackbar de error
      setSnackbar({ children: "Error al guardar datos", severity: "error" });

      // Aquí puedes manejar el error según tus necesidades
    }

    // Cierra el diálogo u realiza otras acciones después de cambiar el icono
  };

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
            row={params.row}
            setDataRow={setDataRow}
            data={params.row.icono}
            handleOpenFontawesomeIconCatalogDialog={
              handleOpenFontawesomeIconCatalogDialog
            }
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
            row={params.row}
            setDataRowMui={setDataRowMui}
            data={params.row.icon_mui}
            handleOpenMaterialUiIconCatalogDialog={
              handleOpenMaterialUiIconCatalogDialog
            }
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

  const handleAddMenu = async (selectedIcon, selectedIconMui) => {
    // Verificar si todos los campos están validados
    const isFormValid = Object.values(validateInputs).every(
      (isValid) => isValid
    );

    if (isFormValid) {

      const updatedRow = {
        ...menuData,
        icono: selectedIcon,
        icon_mui:selectedIconMui
      };
      try {
        const response = await createMenu(updatedRow);

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

      {isOpenFontawesomeIconCatalogDialog && (
        <Dialog
          fullScreen
          open={isOpenFontawesomeIconCatalogDialog}
          onClose={handleCloseFontawesomeIconCatalogDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseFontawesomeIconCatalogDialog}
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
                Agregar Nuevo Icono
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                    id="input-with-icon-textfield-search-icon"
                    label="Busqueda de Iconos"
                    onChange={handleSearchChange}
                    value={searchQuery + selectedIcon}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <Box>
                    {visibleIcons.slice(0, 100)?.map((icon, index) => {
                      const randomColor = getRandomColor();
                      return (
                        <IconButton
                          sx={{ bgcolor: iconColors[index], m: 0.2 }}
                          size="small"
                          onClick={() => handleIconClick(icon)}
                        >
                          {<FontAwesomeIcon icon={faIcons[`${icon}`]} />}
                        </IconButton>
                      );
                    })}
                    <Pagination
                      sx={{ mt: 2 }}
                      count={Math.ceil(filteredIcons.length / itemsPerPage)}
                      size="small"
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                  </Box>
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
                  onClick={() =>
                    handleChangeIcon(
                      selectedIcon,
                      handleCloseFontawesomeIconCatalogDialog
                    )
                  }
                >
                  Cambiar Icono
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}

      {isOpenMaterialUiIconCatalogDialog && (
        <Dialog
          fullScreen
          open={isOpenMaterialUiIconCatalogDialog}
          onClose={handleCloseMaterialUiIconCatalogDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseMaterialUiIconCatalogDialog}
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
                Agregar Nuevo Icono de Material UI
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                    id="input-with-icon-textfield-search-icon"
                    label="Busqueda de Iconos"
                    onChange={handleSearchChangeMui}
                    value={searchQueryMui + selectedIconMui}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <Box>
                    {visibleIconsMui.slice(0, 100)?.map((icon, index) => {
                      const randomColor = getRandomColor();
                      return (
                        <IconButton
                          sx={{ bgcolor: iconColorsMui[index], m: 0.2 }}
                          size="small"
                          onClick={() => handleIconClickMui(icon)}
                        >
                          {" "}
                          {React.createElement(MUIIcons[icon])}
                        </IconButton>
                      );
                    })}
                    <Pagination
                      sx={{ mt: 2 }}
                      count={Math.ceil(filteredIconsMui.length / itemsPerPage)}
                      size="small"
                      page={currentPageMui}
                      onChange={handlePageChangeMui}
                    />
                  </Box>
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
                  onClick={() =>
                    handleChangeIconMui(
                      selectedIconMui,
                      handleCloseMaterialUiIconCatalogDialog
                    )
                  }
                >
                  Cambiar Icono
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
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
                <Grid item xs={4}>
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
                        ¡Gracias por ingresar un menu!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un menu!
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
                    id="input-with-icon-textfield-menu-padre"
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
                <Grid item xs={4}>
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-search-icon"
                    label="Busqueda de Material Icons"
                    onChange={handleSearchChangeMui}
                    value={searchQueryMui + selectedIconMui}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  <Box>
                    {visibleIconsMui.slice(0, 100)?.map((icon, index) => {
                      return (
                        <IconButton
                          sx={{ bgcolor: iconColorsMui[index], m: 0.2 }}
                          size="small"
                          onClick={() => handleIconClickMui(icon)}
                        >
                          {" "}
                          {React.createElement(MUIIcons[icon])}
                        </IconButton>
                      );
                    })}
                    <Pagination
                      sx={{ mt: 2 }}
                      count={Math.ceil(filteredIconsMui.length / itemsPerPage)}
                      size="small"
                      page={currentPageMui}
                      onChange={handlePageChangeMui}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "1rem", width: "100%" }}
                    id="input-with-icon-textfield-search-icon"
                    label="Busqueda de FontAwesome Iconos"
                    onChange={handleSearchChange}
                    value={searchQuery + selectedIcon}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <Box>
                    {visibleIcons.slice(0, 100)?.map((icon, index) => {
                      const randomColor = getRandomColor();
                      return (
                        <IconButton
                          sx={{ bgcolor: iconColors[index], m: 0.2 }}
                          size="small"
                          onClick={() => handleIconClick(icon)}
                        >
                          {<FontAwesomeIcon icon={faIcons[`${icon}`]} />}
                        </IconButton>
                      );
                    })}
                    <Pagination
                      sx={{ mt: 2 }}
                      count={Math.ceil(filteredIcons.length / itemsPerPage)}
                      size="small"
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                  </Box>
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
                  onClick={() => handleAddMenu(selectedIcon, selectedIconMui)}
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
