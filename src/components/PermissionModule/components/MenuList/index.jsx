import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";

import StarBorder from "@mui/icons-material/StarBorder";
import {
  Collapse,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import React from "react";
import MenuTransferList from "../MenuTransferList";
import {
  getAllMenuRol,
  getMenuRolUsuarioByUserId,
} from "../../../../api/permission";
import ListMenuButton from "./components/ListMenuButton";
import { getAllMenus } from "../../../../api/menu";
import { getAllRoles } from "../../../../api/rol";
import { getAllSubMenus } from "../../../../api/submenu";

function MenuList() {
  const [rows, setRows] = React.useState([]);
  const [menus, setMenus] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [subMenus, setSubMenus] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState("");

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };


  console.log(selectedRole);


  const fetchUserMenuPermission = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getMenuRolUsuarioByUserId("70");

      // Agrega el campo 'id_menu' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_menu_rol_usuario,
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
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

    fetchRoles();
    fetchMenus();
    fetchUserMenuPermission();
    fetchSubMenus();
  }, []);

  console.log(subMenus);
  return (
    <>
      <Stack direction="row" spacing={2}>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 250 }}>
          <InputLabel id="demo-simple-select-filled-label">
            Selecciona el rol
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
             value={selectedRole} 
             onChange={handleChange} 
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.nombre}{" "}
                {/* Replace with the actual property name from your role object */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <List
          sx={{ width: "100%", bgcolor: "background" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          /*  subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Nested List Items
      </ListSubheader>
    } */
        >
          {menus.map((menu, index) => {
            return (
              <ListMenuButton data={menu} menus={menus} subMenus={subMenus} />
            );
          })}
        </List>
      </Stack>
    </>
  );
}

export default MenuList;
