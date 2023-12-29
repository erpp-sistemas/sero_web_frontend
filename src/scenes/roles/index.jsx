/* import React from 'react'

import { useNavigate } from 'react-router-dom'

import Header from '../../components/Header'
import { tokens } from "../../theme";

import { Box, Button, useTheme, IconButton, Typography } from '@mui/material'
import { DataGrid } from "@mui/x-data-grid";

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ManIcon from '@mui/icons-material/Man';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import HailIcon from '@mui/icons-material/Hail';

import { roles } from '../../data/roles'




const index = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigation = useNavigate()

    const columns = [
        {
            field: "id",
            headerName: "Id rol",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "name",
            headerName: "Nombre",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { name } }) => {
                return (
                    <Box
                        width="90%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={name === "Administrador" ? colors.greenAccent[500]
                            : name === "Directivo" ? colors.blueAccent[500] : name === 'Coordinador' ? colors.yellowAccent[600]
                                : name === 'Gerente' ? colors.primary[200] : name === 'Auxiliar administrativo' ? colors.redAccent[400] : colors.grey[600]
                        }
                        borderRadius="4px"
                    >
                        {name === "Administrador" && <AdminPanelSettingsOutlinedIcon />}
                        {name === "Directivo" && <SecurityOutlinedIcon />}
                        {name === "Coordinador" && <LockOpenOutlinedIcon />}
                        {name === 'Gerente' && (<ManIcon />)}
                        {name === 'Gestor' && (<DirectionsWalkIcon />)}
                        {name === 'Auxiliar administrativo' && <HailIcon />}
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                            {name}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "acciones",
            headerName: "Acciones",
            headerAlign: "center",
            flex: 1,
            renderCell: ({ row: { id } }) => {
                return (
                    <Box
                        width="30%"
                        m="0 auto"
                        display="flex"
                        justifyContent="center"
                        borderRadius="4px"
                    >

                        <IconButton aria-label="edit" onClick={() => handleEditUser(id)}>
                            <EditIcon />
                        </IconButton>

                    </Box>
                );
            },
        },
    ];

    return (
        <Box
            m="20px"
        >
            <Header title="Administración de roles" subtitle="Listado de roles" />
            <Button startIcon={<GroupAddIcon />} onClick={() => navigation('/new-user')} sx={{
                backgroundColor: colors.greenAccent[700],
                width: '100px',
                ":hover": {
                    bgcolor: colors.greenAccent[300],
                    color: "white"
                }
            }} >
                Nuevo
            </Button>

            <Box
                m="20px auto"
                width="70%"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                        textAlign: "center"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        textAlign: "center !important"
                    },
                    "& .name-column--cell": {
                        color: colors.grey[200],
                        fontSize: "14px"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.primary[400],
                        borderBottomColor: colors.greenAccent[700],
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid rows={roles} columns={columns} autoPageSize />
            </Box>

        </Box>
    )
}

export default index */


import { Box, useTheme } from '@mui/material';
import React from 'react'
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import RolCrud from '../../components/RolCrud';
/**
 * Componente que representa la gestión de roles en el sistema.
 *
 * @component
 * @example
 * // Uso del componente 'Roles' en otro componente o archivo.
 * import Roles from './Roles';
 * // ...
 * <Roles />
 *
 * @returns {JSX.Element} Elemento JSX que contiene la interfaz de usuario para la gestión de roles.
 */
function Roles() {
    const user = useSelector((state) => state.user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
    <Header title="Gestiòn de Roles" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Roles en el Sistema" />
 <RolCrud/>
    
  </Box>
  )
}

export default Roles