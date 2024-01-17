import React from "react";
import Container from "../Container";
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
} from "@mui/material";
import { getAllMenus, updateMenu } from "../../api/menu";
import { getAllSubMenus } from "../../api/submenu";
import { getAllRoles } from "../../api/rol";
import { getMenuRolByIdRol, updateMenuRolById } from "../../api/permission";

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
  const [checkedItems, setCheckedItems] = React.useState({});
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
            id_menu:  menuRol.id_menu,
            id_rol: selectedRole,
            activo: checked,
            // Include any other data you need to update
          });
  
          // Perform any additional actions based on the change
          fetchMenuByRolId()
  
          setSnackbar({
            children: "El menu se asocio exitosamente al rol ",
            severity: "success",
          });
          
        }else{

          await updateMenuRolById(menuId, {
            id_menu_rol: menuRol.id_menu_rol,
            id_menu:  menuRol.id_menu,
            id_rol: selectedRole,
            activo: checked,
            // Include any other data you need to update
          });
  
          // Perform any additional actions based on the change
          fetchMenuByRolId()
  
          setSnackbar({
            children: "El menu se desasocio al rol ",
            severity: "error",
          });
          
        }
       

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
    fetchMenus();
    fetchSubMenus();
    fetchRoles();
  }, [selectedRole]);

  const filteredSubMenus = subMenus.filter((subMenu) => {
    return subMenu.id_menu_padre === 1;
  });

  /*   const children = (
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
  ); */
 
  return (
    <Container>
      {/*  <VerticalTabs/> */}
      <Stack direction="row" spacing={1}>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
          <InputLabel id="demo-simple-select-filled-label">Rol</InputLabel>
          <Select
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
                        // Handle checkbox change here
                        handleCheckboxChange(menu.id, event.target.checked);
                      }}
                    />
                  }
                  label={menu.nombre}
                />
              </FormGroup>
            );
          })}
          {/*   {menuRols.map((menuRol)=>{
            console.log(menuRol);

            console.log(menus);
            const menuNames = menus.filter((menu)=>{
              return menuRol.id_menu === menu.id_menu 
            })
           
          
           
          })} */}
          {/*  {menus.map((menu) => {
            if (menu.activo) {
              const filteredSubMenus = subMenus.filter((subMenu) => {
                return subMenu.id_menu_padre === menu.id;
              });

              return (
                <FormGroup key={menu.id}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label={`${menu.nombre}`}
                  />
                  {filteredSubMenus.map((subMenu) => (
                    <FormControlLabel sx={{marginLeft:"2rem"}}
                      key={subMenu.id}
                      control={<Checkbox defaultChecked />}
                      label={`${subMenu.nombre}`}
                    />
                  ))}
                </FormGroup>
              );
            }
            return null;
          })} */}
        </Box>
      </Stack>

      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Container>
  );
}

export default PermissionModule;
