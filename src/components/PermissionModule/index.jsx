import React from "react";
import Container from "../Container";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { getAllMenus } from "../../api/menu";
import { getAllSubMenus } from "../../api/submenu";
import { getAllRoles } from "../../api/rol";

/**
 * Modulo
 * @component
 * @returns {JSX.Element} Componente PermissionModule.
 */
function PermissionModule() {
  const [checked, setChecked] = React.useState([true, false]);
  const [age, setAge] = React.useState("");
  const [menus, setMenus] = React.useState([]);
  const [subMenus, setSubMenus] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState("");

  const handleChangeSelect = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
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

    fetchMenus();
    fetchSubMenus();
    fetchRoles()
  }, []);



  const filteredSubMenus = subMenus.filter((subMenu)=>{
    return subMenu.id_menu_padre ===  1
  })

  console.log(filteredSubMenus);

  const children = (
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
          })}
        </Box>
      </Stack>
    </Container>
  );
}

export default PermissionModule;
