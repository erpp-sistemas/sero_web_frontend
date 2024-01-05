import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';

import StarBorder from '@mui/icons-material/StarBorder';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React from 'react'
import MenuTransferList from '../MenuTransferList';
import { getAllMenuRol, getMenuRolUsuarioByUserId } from '../../../../api/permission';
import ListMenuButton from './components/ListMenuButton';
import { getAllMenus } from '../../../../api/menu';

function MenuList() {
   
    const [rows, setRows] = React.useState([]);
    const [menus, setMenus] = React.useState([]);


 const fetchUserMenuPermission = async()=>{

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

 }


    
 /*  const fetchPermissionMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllMenuRol();

      // Agrega el campo 'id_menu' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_menu_rol,
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 */

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

  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */

    
    fetchMenus()
    fetchUserMenuPermission()
  }, []);

  

    console.log(rows);
  return (
    <List
    sx={{ width: '100%', bgcolor: 'background' }}
    component="nav"
    aria-labelledby="nested-list-subheader"
   /*  subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Nested List Items
      </ListSubheader>
    } */
  >
   
   {rows.map((menu,index)=>{return <ListMenuButton data={menu} menus={menus}/>


   })}
    
  </List>
  )
}

export default MenuList