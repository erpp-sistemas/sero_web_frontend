import React, { useState, useEffect } from 'react';
import { List, ListItemButton, ListItemText, ListSubheader, CircularProgress, Typography, Checkbox, Box, Button } from '@mui/material';
import { menusProfileRequest } from '../../api/menu.js';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

function StepThree({ profileId, onNextThree, onFormDataThree }) {
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);    

    const getMenusProfile = async (profileId) => {
        try {
            const response = await menusProfileRequest(profileId);
            setMenus(response.data);
        } catch (error) {
            setError(error.message || 'Error fetching menus');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getMenusProfile(profileId);
    }, [profileId]);

    const handleToggle = (menuId, parentId) => {
        let newSelected = [...selectedItems];

        const menuIndex = newSelected.findIndex(item => item.parentId === parentId);
        if (menuIndex !== -1) {
            const childIndex = newSelected[menuIndex].children.findIndex(child => child === menuId);
            if (childIndex !== -1) {
                newSelected[menuIndex].children.splice(childIndex, 1);
                // Si no quedan hijos, eliminar el menú padre
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

        // Muestra el objeto que se va formando en formato JSON
        console.log(JSON.stringify(newSelected, null, 2));
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

    const handleSubmit = (e) => {
      e.preventDefault();

      onNextThree(selectedItems);
      onFormDataThree(selectedItems)
    };

    return (
    <form onSubmit={handleSubmit}>
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Menus a los que tendra acceso
                </ListSubheader>
            }
        >
            {Object.values(groupedMenus).map(menu => (
                <React.Fragment key={menu.id}>
                    <ListItemButton>
                        <ListItemText primary={menu.name} sx={{ color: 'gray'}} />
                    </ListItemButton>
                    {menu.children.map(child => (
                        <ListItemButton key={child.id} sx={{ pl: 6 }}>
                            <Checkbox
                                color="success"
                                checked={selectedItems.some(item => item.parentId === menu.id && item.children.includes(child.id))}
                                onChange={() => handleToggle(child.id, menu.id)}
                            />
                            <ListItemText primary={child.name} sx={{ color: 'white'}} />
                        </ListItemButton>
                    ))}
                </React.Fragment>
            ))}
        </List>
        <Box mt={2}>
          <Button type="submit" sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }} variant="contained" color="secondary" endIcon={<KeyboardTabIcon/>}>
            Finalizar
          </Button>
        </Box>
      </form>
    );
}

export default StepThree;
