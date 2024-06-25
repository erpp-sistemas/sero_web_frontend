import React, { useState, useEffect, useMemo } from 'react'
import { Box, Avatar, Tooltip, Button, TextField, Typography, Badge, InputAdornment, Grid } from '@mui/material'
import Header from '../../components/Header'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, } from '@mui/x-data-grid'
import { getUsersByUserIdRequest } from '../../api/user.js'
import Viewer from 'react-viewer'
import Chip from '@mui/material/Chip'
import { green, red, lightBlue } from '@mui/material/colors'
import AvatarGroup from '@mui/material/AvatarGroup'
import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import FaceIcon from '@mui/icons-material/Face'
import WorkIcon from '@mui/icons-material/Work'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import ComputerIcon from '@mui/icons-material/Computer'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import InfoIcon from '@mui/icons-material/Info'
import UserDetailsModal from '../../components/UsersList/UserDetailsModal.jsx'
import { AddOutlined, Cancel, CheckCircle, Face, FileDownload, NoAccounts, People, PeopleAlt, Search } from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import * as ExcelJS from "exceljs";

function Index() {

	const user = useSelector((state) => state.user);
	const [users, setUsers] = React.useState([])
	const [selectedUser, setSelectedUser] = useState(null)
	const [openModal, setOpenModal] = useState(false)
	const [filter, setFilter] = useState('all');
	const [searchText, setSearchText] = useState('');

	const UsersByUserId = async (user_id) => {
		try {
		const response = await getUsersByUserIdRequest(user_id)
		setUsers(response.data)		
		} catch (error) {
		console.error('Error fetching data:', error)
		}
	}

	useEffect(() => {
		UsersByUserId(user.user_id)    
	}, [user.user_id])

	const handleOpenModal = (user) => {
		setSelectedUser(user)
		setOpenModal(true)
	}

	const handleCloseModal = () => {
		setSelectedUser(null)
		setOpenModal(false)
	}

  const buildColumns = useMemo(() => {
    return [
		{ 
			field: 'name',
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
			),
			width: 150,
			editable: false,
		},
		{ 
			field: 'last_name', 
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"APELLIDO PATERNO"}</strong>
			),
			width: 120,
		},
		{ 
			field: 'second_last_name', 
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"APELLIDO MATERNO"}</strong>
			),
			width: 120,
		},
		{ 
			field: 'url_image',
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
			),
			width: 70,
			renderCell: (params) => <AvatarImage data={params.row.url_image} />,
		},
		{ 
			field: 'user_name',
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"NOMBRE DE USUARIO"}</strong>
			),
			width: 200,
			renderCell: (params) => (
			<div style={{ color: 'rgba(0, 191, 255, 1)' }}>
				{params.value}
			</div>
			),
		},
		{ 
			field: 'profile',
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"PERFIL"}</strong>
			),
			width: 150,
			renderCell: (params) => <ProfileCell data={params.row.profile} />,
		},
		{ 
			field: 'active',
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"ESTATUS"}</strong>
			),
			width:100,
			renderCell: (params) => (
			<StatusCell 
				active={params.row.active} 
				activeWeb={params.row.active_web} 
				activeMobile={params.row.active_mobile} 
			/>
			),
			autoHeight: true, 
		},      
		{ 
			field: 'assigned_places',
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>{"PLAZAS ASIGNADAS"}</strong>
			),
			width: 200,
			renderCell: (params) => <AssignedPlacesAvatar places={params.value} />,
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			width: 150,
			renderCell: (params) => (
			<Tooltip title="Detalles">
				<Button 
				variant="outlined" 
				color="info" 
				size='small'
				onClick={() => handleOpenModal(params.row)}
				sx={{minWidth: 'auto'}}
				>
				<InfoIcon />
				</Button>
			</Tooltip>
			),
		},
		];
  }, []);

	const AvatarImage = ({ data }) => {
		const [visibleAvatar, setVisibleAvatar] = React.useState(false)
		return (
		<>
			<Avatar
			onClick={() => {
				setVisibleAvatar(true)
			}}
			alt="Remy Sharp"
			src={data}
			/>
	
			<Viewer
			visible={visibleAvatar}
			onClose={() => {
				setVisibleAvatar(false)
			}}
			images={[{ src: data, alt: 'avatar' }]}          
			/>
		</>
		)
	}

	const StatusCell = ({ active, activeWeb, activeMobile }) => {
		return (
		<AvatarGroup max={3}>
			{active === 'activo' && (
			<Tooltip title="Usuario activo">
				<Avatar sx={{ bgcolor: green[500], width:26, height:26 }}>
				<FaceIcon />
				</Avatar>
			</Tooltip>
			)}
			{active !== 'activo' && (
			<Tooltip title="Usuario inactivo">
				<Avatar sx={{ bgcolor: red[500], width:26, height:26 }}>
				<FaceIcon/>
				</Avatar>
			</Tooltip>
			)}
			{activeWeb === 'activo' && (
			<Tooltip title="Con acceso a la web">
				<Avatar sx={{ bgcolor: green[500], width:26, height:26 }}>
				<ComputerIcon />
				</Avatar>
			</Tooltip>
			)}
			{activeWeb !== 'activo' && (
			<Tooltip title="Sin acceso a la web">
				<Avatar sx={{ bgcolor: red[500], width:26, height:26 }}>
				<ComputerIcon />
				</Avatar>
			</Tooltip>
			)}
			{activeMobile === 'activo' && (
			<Tooltip title="Con acceso a la app móvil">
				<Avatar sx={{ bgcolor: green[500], width:26, height:26 }}>
				<AppShortcutIcon />
				</Avatar>
			</Tooltip>
			)}
			{activeMobile !== 'activo' && (
			<Tooltip title="Sin acceso a la app móvil">
				<Avatar sx={{ bgcolor: red[500], width:26, height:26 }}>
				<AppShortcutIcon />
				</Avatar>
			</Tooltip>
			)}        
		</AvatarGroup>
		)
	}
  
	const AssignedPlacesAvatar = ({ places }) => {
		
		const placeArray = places.split(',').map(place => place.trim())
	
		return (
		<AvatarGroup max={10}>

			{placeArray.map((place, index) => (
			<Tooltip key={index} title={place}>
				<Avatar sx={{ bgcolor: lightBlue[500], width: 35, height: 35, fontWeight: 'bold' }}>
				{place
					.split(' ')
					.map(word => word[0])
					.join('')}
				</Avatar>
			</Tooltip>
			))}
		</AvatarGroup>
		)
	}

	const ProfileCell = ({ data }) => {
		const profileData = {
		'Administrador': { color: 'success', icon: <FaceIcon /> },
		'Directivo': { color: 'warning', icon: <WorkIcon /> },
		'Gerente': { color: 'error', icon: <BusinessCenterIcon /> },
		'Coordinador': { color: 'info', icon: <SupervisorAccountIcon /> },
		'Gestor': { color: 'default', icon: <AccountCircleIcon /> },
		'Auxiliar Administrativo': { color: 'secondary', icon: <AssignmentIndIcon /> },
		'Sistemas': { color: 'primary', icon: <ComputerIcon /> },
		'Recursos Humanos': { color: 'info', icon: <PeopleIcon /> },
		'Lektor': { color: 'warning', icon: <MenuBookIcon /> },
		}
	
		const profileInfo = profileData[data]
	
		return profileInfo ? (
		<Chip 
			label={data} 
			color={profileInfo.color} 
			variant="outlined" 
			icon={profileInfo.icon} 
		/>
		) : (
		data
		)
	}

	function CustomToolbar() {
		return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton color="secondary" />
			<GridToolbarFilterButton color="secondary" />
			<GridToolbarDensitySelector color="secondary" />

			<GridToolbarExport color="secondary" />

			<Link to="/user-new" style={{ textDecoration: 'none' }}>
			<Button
				color="secondary"
				startIcon={<AddOutlined />}
				size="small"
			>
				Agregar Nuevo Usuario
			</Button>
			</Link>
		</GridToolbarContainer>
		)
	}

	const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSearchText('');
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredUsers = useMemo(() => {
		let filtered = users;
		switch (filter) {
			case 'active':
				filtered = users.filter(user => user.active === 'activo');
				break;
			case 'inactive':
				filtered = users.filter(user => user.active === 'in activo');
				break;
			case 'all':
			default:
				break;
		}
		if (searchText) {
			filtered = filtered.filter(user => 
				Object.values(user).some(value => 
					String(value).toLowerCase().includes(searchText.toLowerCase())
				)
			);
		}
		return filtered;
	}, [users, filter, searchText]);

  const exportToExcel = async () => {
    try {
      
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");
                    
        const headers = Object.keys(filteredUsers[0]);
        worksheet.addRow(headers);              
        
        filteredUsers.forEach(row => {
            const values = headers.map(header => row[header]);
            worksheet.addRow(values);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
  };
  
	return (

		<Box m="20px">

			<Header title="Listado de usuario" />
			<Box mb={2} >
				<Badge
					badgeContent={filter === 'all' ? filteredUsers.length : 0}
					color="secondary"
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          max={9999} 
				>
					<Chip
						label="Todos los usuarios"
						clickable
						color={filter === 'all' ? 'success' : 'default'}
						onClick={() => handleFilterChange('all')}
						icon={<People />}
            sx={{m:1}}
					/>
				</Badge>
				<Badge
					badgeContent={filter === 'active' ? filteredUsers.length : 0}
					color="secondary"
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          max={9999} 
				>
					<Chip
						label="Usuarios activos"
						clickable
						color={filter === 'active' ? 'success' : 'default'}
						onClick={() => handleFilterChange('active')}
						icon={<CheckCircle />}
            sx={{m:1}}
					/>
				</Badge>
				<Badge
					badgeContent={filter === 'inactive' ? filteredUsers.length : 0}
					color="error"
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          max={9999} 
				>
					<Chip
						label="Usuarios baja"
						clickable
						color={filter === 'inactive' ? 'success' : 'default'}
						onClick={() => handleFilterChange('inactive')}
						icon={<Cancel />}
            sx={{m:1}}
					/>
				</Badge>

      </Box>
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={6}>
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Ingresa lo que quieres buscar"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="secondary" />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'grey',
                        },
                        '&:hover fieldset': {
                            borderColor: 'secondary.main',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'secondary.main',
                        },
                    },
                }}
            />
            {filteredUsers.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                    No se encontraron resultados.
                </Typography>
            )}
        </Grid>
        <Grid item xs={3}>
            <Button
                variant="contained"
                color="secondary"
                onClick={exportToExcel}
                startIcon={<FileDownload />}
            >
                Exportar a Excel
            </Button>
        </Grid>
      </Grid>
			<Box
				sx={{
				height: 400,
				width: '100%',
				'.css-196n7va-MuiSvgIcon-root': {
					fill: 'white',
				},
				}}
			>
				<DataGrid
				rows={filteredUsers}
				columns={buildColumns}
				getRowId={(row) => row.user_id}
				editable={false} 
				slots={{ toolbar: CustomToolbar }}
				onRowClick={(params) => handleOpenModal(params.row)}
				/>
			</Box>

			<UserDetailsModal open={openModal} onClose={handleCloseModal} user={selectedUser} />

		</Box>

	)

}

export default Index
