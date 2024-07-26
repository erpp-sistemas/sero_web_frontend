import React, { useState, useEffect } from 'react';
import { List, ListItemButton, ListItemText, ListItem, ListSubheader, CircularProgress, Typography, Box, Button, Chip, Divider } from '@mui/material';
import { menusProfileRequest } from '../../api/menu.js';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import * as MUIIcons from "@mui/icons-material";
import LoadingModal from '../LoadingModal.jsx';
import CustomAlert from '../CustomAlert.jsx';
import { Dialog, DialogContent } from '@mui/material';

function AssignedMenuAndSubMenu({ open, onClose, data }) {
  if (!data) return null;

  const { assigned_permissions, profile_id } = data;

  console.log('data inicial: ', data);

  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const getMenusProfile = async (profileId) => {
    try {
      const response = await menusProfileRequest(profileId);
      setMenus(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message || 'Error fetching menus');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getMenusProfile(profile_id);
  }, [profile_id]);

  useEffect(() => {
    if (assigned_permissions) {
      const parsedPermissions = JSON.parse(assigned_permissions).map(item => ({
        parentId: item.parentId,
        children: item.children ? item.children.map(child => child.id_sub_menu) : []
      }));
      setSelectedItems(parsedPermissions);
    }
  }, [assigned_permissions]);

  const handleToggle = (menuId, parentId) => {
    let newSelected = [...selectedItems];

    const menuIndex = newSelected.findIndex(item => item.parentId === parentId);
    if (menuIndex !== -1) {
      const childIndex = newSelected[menuIndex].children.findIndex(child => child === menuId);
      if (childIndex !== -1) {
        newSelected[menuIndex].children.splice(childIndex, 1);
        if (newSelected[menuIndex].children.length === 0) {
          newSelected.splice(menuIndex, 1);
        }
      } else {
        newSelected[menuIndex].children.push(menuId);
      }
    } else {
      newSelected.push({ parentId, children: [menuId] });
    }

    setSelectedItems(newSelected);
    console.log(newSelected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("¡Error! Debes seleccionar al menos un menú.");
      return;
    }

    onNextThree(selectedItems);
    onFormDataThree(selectedItems);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  const groupedMenus = {};
  menus.forEach(menu => {
    if (menu.id_menu_parent === 0) {
      groupedMenus[menu.id] = {
        ...menu,
        children: []
      };
    } else {
      if (groupedMenus[menu.id_menu_parent]) {
        groupedMenus[menu.id_menu_parent].children.push(menu);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <LoadingModal open={isLoading} />
          <CustomAlert
            alertOpen={alertOpen}
            type={alertType}
            message={alertMessage}
            onClose={setAlertOpen}
          />
          <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'transparent',
              margin: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '16px',
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <>
                <Typography variant="h5" gutterBottom>
                  Menús a los que tendrá acceso
                </Typography>
                <Divider sx={{ backgroundColor: '#5EBFFF' }} />
              </>
            }
          >
            {Object.values(groupedMenus)
              .filter(menu => menu.children.length > 0)
              .map(menu => (
                <React.Fragment key={menu.id}>
                  <ListItemButton>
                    <ListItemText primary={menu.name} />
                  </ListItemButton>
                  {menu.children.map(child => {
                    const IconComponent = MUIIcons[child.icon_mui];
                    return (
                      <ListItem key={child.id} sx={{ pl: 6 }}>
                        <Chip
                          label={child.name}
                          color={selectedItems.some(item => item.parentId === menu.id && item.children.includes(child.id)) ? 'secondary' : 'default'}
                          onClick={() => handleToggle(child.id, menu.id)}
                          icon={IconComponent ? <IconComponent /> : null}
                        />
                      </ListItem>
                    );
                  })}
                </React.Fragment>
              ))}
          </List>
          <Box mt={2}>
            <Button type="submit" sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }} variant="contained" color="secondary" endIcon={<KeyboardTabIcon />}>
              Finalizar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignedMenuAndSubMenu;
