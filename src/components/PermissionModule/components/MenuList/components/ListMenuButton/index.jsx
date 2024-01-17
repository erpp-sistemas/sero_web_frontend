import React from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuTransferList from '../../../MenuTransferList';
function ListMenuButton({data,menus,subMenus}) {

  console.log(subMenus);
  console.log(menus);

    

   
   
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen(!open);
    };
     console.log(menus);
    const menuData = menus.find(menu => menu.id_menu === data.id_menu);
      return (
        <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        {/* Utiliza `menuData?.nombre` para evitar errores si `menuData` es undefined */}
        <ListItemText primary={menuData?.nombre || 'Nombre no encontrado'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ p: 3 }}>
          <MenuTransferList subMenus={subMenus} menus={menus} menuData={menuData}/>
        </List>
      </Collapse>
    </>
      );
}

export default ListMenuButton