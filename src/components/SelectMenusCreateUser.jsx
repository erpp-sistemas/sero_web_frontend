import React, { useState } from 'react'
import { Box, useTheme, Typography, Button, FormControlLabel, FormGroup, Switch } from '@mui/material'


import { tokens } from '../theme'

import { menuByUserAndRol } from '../api/menu'

const SelectMenusCreateUser = ({role,setSelectedMenus}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [menus,setMenus] = React.useState([])

    const crearObjetoMenu = (id_menu, role) => {
        const menuObject = {
            id_menu: id_menu,
            id_rol: role
        };
    
        return menuObject;
    };




    const handleSwitchProceso= async(e, menu_id)=>{

        let checked = e.target.checked;
        if (checked) {
               setSelectedMenus((prevMenus) => [...(prevMenus || []), crearObjetoMenu(menu_id, role)]);

            }



    }

     /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchMenusByUserAndRol = async (role) => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await menuByUserAndRol(0,1);

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_proceso,
      }));

      setMenus(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    if (role) {
        fetchMenusByUserAndRol(role)
        
    }
   
 
  }, [])
  
    return (
        <Box
            m='20px 0'
            sx={{ backgroundColor: colors.primary[400], marginBottom: '20px', textAlign: 'center' }}
            padding='30px 10px'
            borderRadius='7px'
        >

            <Typography variant="caption" sx={{ fontSize: '16px', color: colors.grey[200] }}>
                Selecciona los menus
            </Typography>

            <Box
                display='flex'
                justifyContent='center'
                gap='20px'
                flexWrap='wrap'
                sx={{ marginTop: '20px' }}
            >
                {menus && menus.map(menu => (
                    <FormGroup >
                        <FormControlLabel control={<Switch color="success" sx={{ width: '70px' }} />}
                            label={menu.name}
                            onChange={e => handleSwitchProceso(e, menu.menu_id)}
                        />
                    </FormGroup>
                ))}
            </Box>

        </Box>
    )
}

export default SelectMenusCreateUser