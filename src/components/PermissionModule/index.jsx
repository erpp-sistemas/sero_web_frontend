import React from "react";
import Container from "../Container";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { getAllMenus, updateMenu } from "../../api/menu";
import { getAllSubMenus } from "../../api/submenu";
import { getAllRoles } from "../../api/rol";
import {
  createMenuRol,
  createSubMenuRol,
  getMenuRolByIdRol,
  getSubMenuRolByIdRol,
  updateMenuRolById,
  updateSubMenuRolById,
} from "../../api/permission";
import CloseIcon from "@mui/icons-material/Close";
import { GrServices } from "react-icons/gr";
import { FaRegCircleCheck } from "react-icons/fa6";
import { AddOutlined, Sync, SyncAltOutlined } from "@mui/icons-material";
import { PiTreeStructureFill } from "react-icons/pi";





/**
 * Modulo
 * @component
 * @returns {JSX.Element} Componente PermissionModule.
 */
function PermissionModule() {
  const [checked, setChecked] = React.useState([true, false]);
  const [menus, setMenus] = React.useState([]);
  const [subMenus, setSubMenus] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState("");
  const [menuRols, setMenuRols] = React.useState([]);
  const [subMenuRols, setSubMenuRols] = React.useState([]);
  const [checkedItems, setCheckedItems] = React.useState({});
  const [snackbar, setSnackbar] = React.useState(null);
  const [isNewMenuRolDialogOpen, setIsNewMenuRolDialogOpen] =
    React.useState(false);
    const [isNewSubMenuRolDialogOpen, setIsNewSubMenuRolDialogOpen] =
    React.useState(false);
  const [menuRolData, setMenuRolData] = React.useState({
    id_menu: "",
    id_rol: "",
    activo: "",
  });

  const [subMenuRolData, setSubMenuRolData] = React.useState({
    id_sub_menu: "",
    id_rol: "",
    activo: "",
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
    const { name, value, type, checked } = event.target;

    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setMenuRolData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };



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
   const handleInputSubMenuOnChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setSubMenuRolData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };


  /**
 * Manejador de eventos que se ejecuta al abrir el diálogo para la creación de un nuevo SubMenuRol.
 * @function
 * @returns {void}
 */
const handleOpenNewSubMenuRolDialog = () => {
  setIsNewSubMenuRolDialogOpen(true);
};

/**
 * Manejador de eventos que se ejecuta al cerrar el diálogo para la creación de un nuevo SubMenuRol.
 * @function
 * @returns {void}
 */
const handleCloseNewSubMenuRolDialog = () => {
  setIsNewSubMenuRolDialogOpen(false);
};

  /**
   * Maneja la apertura del diálogo para la creación de un nuevo menú_rol.
   * @function
   * @returns {void}
   */
  const handleOpenNewMenuRolDialog = () => {
    setIsNewMenuRolDialogOpen(true);
  };

  /**
   * Maneja el cierre del diálogo para la creación de un nuevo menú_rol.
   * @function
   * @returns {void}
   */
  const handleCloseNewMenuRolDialog = () => {
    setIsNewMenuRolDialogOpen(false);
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

  const handleCheckboxChange = async (menuId, checked) => {
    try {
      // Find the corresponding menuRol entry
      const menuRol = menuRols.find((mr) => mr.id_menu === menuId);

      if (menuRol) {
        // Update the state of the menuRol entry
        menuRol.activo = checked;
        setMenuRols([...menuRols]); // Trigger a re-render

        // Perform the API call to update the server using updateMenu
        if (checked) {
          await updateMenuRolById(menuId, {
            id_menu_rol: menuRol.id_menu_rol,
            id_menu: menuRol.id_menu,
            id_rol: selectedRole,
            activo: checked,
            // Include any other data you need to update
          });

          // Perform any additional actions based on the change
          fetchMenuByRolId();

          setSnackbar({
            children: "El menu se asocio exitosamente al rol ",
            severity: "success",
          });
        } else {
          await updateMenuRolById(menuId, {
            id_menu_rol: menuRol.id_menu_rol,
            id_menu: menuRol.id_menu,
            id_rol: selectedRole,
            activo: checked,
            // Include any other data you need to update
          });

          // Perform any additional actions based on the change
          fetchMenuByRolId();

          setSnackbar({
            children: "El menu se desasocio al rol ",
            severity: "error",
          });
        }
      } else {
        // Manejar el caso donde el menú no está asociado y tampoco hay registro en la base de datos
        setSnackbar({
          children:
            "No se pudo asociar o desasociar el menú al rol porque la asociaciòn  no existe debes crear una nueva",
          severity: "warning",
        });
      }
    } catch (error) {
      console.error("Error updating menu_rol entry:", error);
      // Handle the error as needed
    }
  };

  /*  

  const isMenuActive = (menuId) => {
    const matchingMenu = menuRols.find((menuRol) => menuRol.id_menu === menuId);
    return matchingMenu ? matchingMenu.activo : false;
  };

  console.log(checkedItems);

  const handleChange = (menuId) => {
    setCheckedItems((prev) => {
      const menuRolId = getMenuRolByIdRol(menuId); // Implementa esta función
  
      return {
        ...prev,
        [menuRolId]: {
          id_menu_rol: menuRolId,
          id_menu: menuId,
          id_rol: selectedRole, // Asumiendo que `selectedRole` contiene el ID del rol actualmente seleccionado
          activo: !prev[menuRolId]?.activo || true, // Si no existe previamente o estaba inactivo, establece en true
        },
      };
    });
  };
 */

  const handleChangeSelect = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

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

      setRoles(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

      setMenus(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchMenuByRolId = async () => {
    try {
      const data = await getMenuRolByIdRol(selectedRole);
      setMenuRols(data);
    } catch (error) {
      console.error("Error al obtener menu_rol entries por ID de rol:", error);
      // Maneja el error según sea necesario
    }
  };

  const fetchSubMenuByRolId = async () => {
    try {
      const data = await getSubMenuRolByIdRol(selectedRole);
      setSubMenuRols(data);
    } catch (error) {
      console.error("Error al obtener menu_rol entries por ID de rol:", error);
      // Maneja el error según sea necesario
    }
  };
  /**
   * Realiza una solicitud para obtener datos de submenús y actualiza el estado 'rows'.
   */
  const fetchSubMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllSubMenus();

      // Agrega el campo 'id_menu' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_sub_menu,
      }));

      setSubMenus(rowsWithId);
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
    fetchMenuByRolId();
    fetchSubMenuByRolId()
    fetchMenus();
    fetchSubMenus();
    fetchRoles();
  }, [selectedRole]);
  const filteredSubMenusByRole = (menuId, idRol) => {
    // Filtrar submenús basados en el menú padre (menuId)
    const subMenusForMenu = subMenus.filter((subMenu) => subMenu.id_menu_padre === menuId);
  
    // Mapear los submenús y agregar la propiedad 'activo' a cada uno
    const subMenusWithActiveFlag = subMenusForMenu.map((subMenu) => {
      const subMenuRol = subMenuRols.find((subMenuRol) => subMenuRol.id_sub_menu === subMenu.id && subMenuRol.id_rol === idRol);
      const isActive = subMenuRol ? subMenuRol.activo : false;
  
      return {
        ...subMenu,
        activo: isActive,
      };
    });
  
    return subMenusWithActiveFlag;
  };

 /*  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      <FormControlLabel
        label="Child 1"
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Child 2"
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  );

  console.log(menuRolData); */

  /**
   * Manejador de eventos que se ejecuta al intentar agregar un nuevo rol.
   * Verifica la validez de los campos del formulario y realiza la acción correspondiente.
   *
   * @async
   * @function
   */
  const handleAddMenuRol = async () => {
    /**
     * Verifica si todos los campos del formulario están validados.
     *
     * @type {boolean} Indica si todos los campos están validados.
     */

    try {
      const response = await createMenuRol(menuRolData);

      // Aquí puedes manejar la respuesta de la solicitud si es necesario
      console.log("Respuesta de la API:", response.data);

      // Mostrar Snackbar de éxito
      setSnackbar({
        children: "Asociaciòn entre menu y rol exitoso",
        severity: "success",
      });

      // Cerrar el diálogo, actualizar el estado, o realizar otras acciones necesarias
      fetchMenuByRolId();
      handleCloseNewMenuRolDialog();
    } catch (error) {
      console.error("Error al guardar datos:", error);
      setSnackbar({ children: "Error al guardar datos", severity: "error" });
      // Aquí puedes manejar el error según tus necesidades
    }
  };




  /**
   * Manejador de eventos que se ejecuta al intentar agregar un nuevo rol.
   * Verifica la validez de los campos del formulario y realiza la acción correspondiente.
   *
   * @async
   * @function
   */
  const handleAddSubMenuRol = async () => {
    /**
     * Verifica si todos los campos del formulario están validados.
     *
     * @type {boolean} Indica si todos los campos están validados.
     */

    try {
      const response = await createSubMenuRol(subMenuRolData);

      // Aquí puedes manejar la respuesta de la solicitud si es necesario
      console.log("Respuesta de la API:", response.data);

      // Mostrar Snackbar de éxito
      setSnackbar({
        children: "Asociaciòn entre sub-menu y rol exitoso",
        severity: "success",
      });

      // Cerrar el diálogo, actualizar el estado, o realizar otras acciones necesarias
      fetchSubMenuByRolId();
      handleCloseNewSubMenuRolDialog();
    } catch (error) {
      console.error("Error al guardar datos:", error);
      setSnackbar({ children: "Error al guardar datos", severity: "error" });
      // Aquí puedes manejar el error según tus necesidades
    }
  };



  const handleSubMenuCheckboxChange = async (subMenuId, checked) => {
    console.log(subMenuId);
    console.log(checked);
    try {
      // Find the corresponding menuRol entry
      const subMenuRol = subMenuRols.find((mr) => mr.id_sub_menu === subMenuId);

      if (subMenuRol) {

        subMenuRol.activo = checked;
        setSubMenuRols([...subMenuRols]); 

        if (checked) {
          await updateSubMenuRolById(subMenuId, {
            id_sub_menu_rol: subMenuRol.id_sub_menu_rol,
            id_sub_menu: subMenuRol.id_sub_menu,
            id_rol: selectedRole,
            activo: checked,
            // Include any other data you need to update
          });
    
        
          fetchSubMenuByRolId();
    
              setSnackbar({
                children: "El submenu se asocio exitosamente al rol ",
                severity: "success",
              });
          
        } else {
          await updateSubMenuRolById(subMenuId, {
            id_sub_menu_rol: subMenuRol.id_sub_menu_rol,
            id_sub_menu: subMenuRol.id_sub_menu,
            id_rol: selectedRole,
            activo: checked,
            // Include any other data you need to update
          });
      
          // Perform any additional actions based on the change
          fetchSubMenuByRolId();
      
          setSnackbar({
            children: "El submenu se desasocio al rol ",
            severity: "error",
          });
          
        }

    
    }else {
      // Manejar el caso donde el menú no está asociado y tampoco hay registro en la base de datos
      setSnackbar({
        children:
          "No se pudo asociar o desasociar el submenú al rol porque la asociaciòn  no existe debes crear una nueva",
        severity: "warning",
      });
    }
 
    } catch (error) {
      console.error("Error updating menu_rol entry:", error);
      // Handle the error as needed
    }
   
  };

  return (
    <Container>
      {/*  <VerticalTabs/> */}

      <Stack direction="row" spacing={1} sx={{ p: 1 }}>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
          <InputLabel id="demo-simple-select-filled-label">Rol</InputLabel>
          <Select
            sx={{ width: 550 }}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedRole}
            onChange={handleChangeSelect}
          >
            <MenuItem value="">
              <em>Ningun</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.nombre}{" "}
                {/* Replace with the actual property name from your role object */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          <Button
            onClick={handleOpenNewMenuRolDialog}
            variant="outlined"
            size="small"
            color="secondary"
            startIcon={<AddOutlined />}
            endIcon={<PiTreeStructureFill />}
          >
            Ligar Rol-Menu
          </Button>
          <Button
          onClick={handleOpenNewSubMenuRolDialog}
            variant="outlined"
            size="small"
            color="secondary"
            startIcon={<AddOutlined />}
            endIcon={<PiTreeStructureFill />}
          >
            Ligar Rol-SubMenu
          </Button>
          {menus.map((menu) => {
  const menuRol = menuRols.find((mr) => mr.id_menu === menu.id);
  const isChecked = menuRol ? menuRol.activo : false;

  return (
    <FormGroup key={menu.id}>
      <FormControlLabel
        control={
          <Checkbox
            color="secondary"
            checked={isChecked}
            onChange={(event) => {
              handleCheckboxChange(menu.id, event.target.checked);
            }}
          />
        }
        label={menu.nombre}
      />
      {filteredSubMenusByRole(menu.id, selectedRole).map((subMenu) => (
        <FormControlLabel
          key={subMenu.id}
          sx={{ marginLeft: "2rem" }}
          control={
            <Checkbox
              checked={subMenu.activo}
              onChange={(event) => {
                handleSubMenuCheckboxChange(subMenu.id, event.target.checked);
              }}
              color="secondary"
            />
          }
          label={`${subMenu.nombre}`}
        />
      ))}
    </FormGroup>
  );
})}
       
        
        </Box>
      </Stack>

      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      {isNewMenuRolDialogOpen && (
        <Dialog
          fullScreen
          open={isNewMenuRolDialogOpen}
          onClose={handleCloseNewMenuRolDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseNewMenuRolDialog}
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
                Agregar nueva asociaciòn menu rol
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ p: 2 }}>
                  <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-filled-label">
                      Rol
                    </InputLabel>
                    <Select
                      sx={{ width: 450 }}
                      color="secondary"
                      labelId="demo-simple-select-filled-label-id-rol"
                      id="demo-simple-select-filled-id-rol"
                      name="id_rol"
                      value={menuRolData.id_rol}
                      onChange={handleInputOnChange}
                    >
                      <MenuItem value="">
                        <em>Ningun</em>
                      </MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.nombre}{" "}
                          {/* Replace with the actual property name from your role object */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-filled-label">
                      Menu
                    </InputLabel>
                    <Select
                      sx={{ width: 450 }}
                      color="secondary"
                      labelId="demo-simple-select-filled-label-id-menu"
                      id="demo-simple-select-filled-id-menu"
                      name="id_menu"
                      value={menuRolData.id_menu}
                      onChange={handleInputOnChange}
                    >
                      <MenuItem value="">
                        <em>Ningun</em>
                      </MenuItem>
                      {menus.map((menu) => (
                        <MenuItem key={menu.id} value={menu.id}>
                          {menu.nombre}{" "}
                          {/* Replace with the actual property name from your role object */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/*   {validateInputs.nombre ? (
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
                  )}  */}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                      marginBottom: "2rem",
                      p: 2,
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
                  onClick={handleAddMenuRol}
                >
                  Guardar Asociaciòn de Rol con Menu
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
      {isNewSubMenuRolDialogOpen && (
        <Dialog
          fullScreen
          open={isNewSubMenuRolDialogOpen}
          onClose={handleCloseNewSubMenuRolDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseNewSubMenuRolDialog}
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
                Agregar nueva asociaciòn sub-menu rol
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ p: 2 }}>
                  <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-filled-label">
                      Rol
                    </InputLabel>
                    <Select
                      sx={{ width: 450 }}
                      color="secondary"
                      labelId="demo-simple-select-filled-label-id-rol"
                      id="demo-simple-select-filled-id-rol"
                      name="id_rol"
                       value={subMenuRolData.id_rol}
                      onChange={handleInputSubMenuOnChange} 
                    >
                      <MenuItem value="">
                        <em>Ningun</em>
                      </MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.nombre}{" "}
                          {/* Replace with the actual property name from your role object */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-filled-label">
                      SubMenu
                    </InputLabel>
                    <Select
                      sx={{ width: 450 }}
                      color="secondary"
                      labelId="demo-simple-select-filled-label-id-menu"
                      id="demo-simple-select-filled-id-menu"
                      name="id_sub_menu"
                    value={subMenuRolData.id_sub_menu}
                      onChange={handleInputSubMenuOnChange} 
                    >
                      <MenuItem value="">
                        <em>Ningun</em>
                      </MenuItem>
                      {subMenus.map((subMenu) => (
                        <MenuItem key={subMenu.id} value={subMenu.id}>
                          {subMenu.nombre}{" "}
                          {/* Replace with the actual property name from your role object */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/*   {validateInputs.nombre ? (
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
                  )}  */}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                      marginBottom: "2rem",
                      p: 2,
                    }}
                  >
                    <InputLabel sx={{ alignSelf: "center" }}>Activo</InputLabel>
                    <Checkbox
                      {..."label"}
                      onChange={handleInputSubMenuOnChange}
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
                 onClick={handleAddSubMenuRol} 
                >
                  Guardar Asociaciòn de Rol con Sub-Menu
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Container>
  );
}

export default PermissionModule;
