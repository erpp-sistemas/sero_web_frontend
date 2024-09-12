import React, { useState, useEffect, useMemo } from 'react'
import { Box, Avatar, Tooltip, Button, TextField, Typography, Badge, InputAdornment, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
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
import GeneralDataModal from '../../components/EditUser/GeneralDataModal.jsx'
import AssignedPlacesModal from '../../components/EditUser/AssignedPlacesModal.jsx'
import AssignedMenuAndSubMenuModal from '../../components/EditUser/AssignedMenuAndSubMenuModal.jsx'
import { AddOutlined, Cancel, CheckCircle, Face, FileDownload, Lock, Looks, NoAccounts, People, PeopleAlt, Person, PersonOutline, Place, Search } from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import * as ExcelJS from "exceljs";
import { updateActiveUserRequest } from '../../api/auth.js'
import LoadingModal from '../../components/LoadingModal.jsx';
import CustomAlert from '../../components/CustomAlert.jsx';

function Index() {

	const user = useSelector((state) => state.user);
	const [users, setUsers] = React.useState([])
	const [selectedUser, setSelectedUser] = useState(null)
	const [openModal, setOpenModal] = useState(false)
	const [generalDataOpenModal, setGeneralDataOpenModal] = useState(false)
	const [assignedPlacesOpenModal, setAssignedPlacesOpenModal] = useState(false)
	const [assignedMenuAndSubMenuOpenModal, setAssignedMenuAndSubMenuOpenModal] = useState(false)
	const [filter, setFilter] = useState('all');
	const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertType, setAlertType] = useState("info");
	const [alertMessage, setAlertMessage] = useState("");

	const UsersByUserId = async (user_id) => {
		try {
      setIsLoading(true)
      const response = await getUsersByUserIdRequest(user_id)
      setUsers(response.data)	
      setIsLoading(false)		
		} catch (error) {
		console.error('Error fetching data:', error)
    setIsLoading(false)
		}
	}

	const refreshUsers = async () => {
		await UsersByUserId(user.user_id);
	};

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

	const handleGeneralDataOpenModal = (data) => {
		setSelectedUser(data)
		setGeneralDataOpenModal(true)
	}

	const handleGeneralDataCloseModal = () => {
		setSelectedUser(null)
		setGeneralDataOpenModal(false)
		refreshUsers();
	}

	const handleAssignedPlacesOpenModal = (data) => {
		setSelectedUser(data)
		setAssignedPlacesOpenModal(true)
	}

	const handleAssignedPlacesCloseModal = () => {
		setSelectedUser(null)
		setAssignedPlacesOpenModal(false)
		refreshUsers();
	}
	const handleAssignedMenuAndSubMenuOpenModal = (data) => {
		setSelectedUser(data)
		setAssignedMenuAndSubMenuOpenModal(true)
	}

	const handleAssignedMenuAndSubMenuCloseModal = () => {
		setSelectedUser(null)
		setAssignedMenuAndSubMenuOpenModal(false)
		refreshUsers();
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
			field: 'first_last_name', 
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
			width:130,
			renderCell: (params) => (
			<StatusCell 
        		user_id={params.row.user_id} 
				name={`${params.row.name} ${params.row.first_last_name} ${params.row.second_last_name}`}
				user_name={params.row.user_name}
				password={params.row.password}
				active={params.row.active} 
				activeWeb={params.row.active_web} 
				activeMobile={params.row.active_mobil} 
        		onStatusChange={handleStatusChange}
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
			width: 180,
			renderCell: (params) => {
				const profile = params.row.profile; 
			
				return (
					<div>
						{/* Botón Detalles */}
						{profile === 'Administrador' || profile === 'Gestor' || profile !== 'Administrador' ? (
							<Tooltip title="Detalles">
								<span>
									<Button 
										variant="outlined" 
										color="info" 
										size='small'
										onClick={() => handleOpenModal(params.row)}
										sx={{ minWidth: 'auto' }}
									>
										<InfoIcon />
									</Button>
								</span>
							</Tooltip>
						) : null}
			
						{/* Botón Datos Generales */}
						{profile === 'Administrador' || profile === 'Gestor' || profile !== 'Administrador' ? (
							<Tooltip title="Datos Generales">
								<span>
									<Button 
										variant="outlined" 
										color="secondary" 
										size='small'
										onClick={() => handleGeneralDataOpenModal(params.row)}
										sx={{ minWidth: 'auto' }}
									>
										<Person />
									</Button>
								</span>
							</Tooltip>
						) : null}
			
						{/* Botón Plazas, Servicios y Procesos */}
						{profile === 'Gestor' || profile !== 'Administrador' ? (
							<Tooltip title="Plazas, Servicios y Procesos">
								<span>
									<Button 
										variant="outlined" 
										color="secondary" 
										size='small'
										onClick={() => handleAssignedPlacesOpenModal(params.row)}
										sx={{ minWidth: 'auto' }}
									>
										<Place />
									</Button>
								</span>
							</Tooltip>
						) : null}
			
						{/* Botón Permisos */}
						{profile !== 'Administrador' && profile !== 'Gestor' ? (
							<Tooltip title="Permisos">
								<span>
									<Button 
										variant="outlined" 
										color="secondary" 
										size='small'
										onClick={() => handleAssignedMenuAndSubMenuOpenModal(params.row)}
										sx={{ minWidth: 'auto' }}
									>
										<Lock />
									</Button>
								</span>
							</Tooltip>
						) : null}
					</div>
				);
			}			
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

  const handleStatusChange = async (user_id, name, user_name, password, newStatus, type) => {
  
    console.log(`Enviando ${type} con nuevo estatus: ${newStatus} para usuario con ID: ${user_id}`);
    try {
      setIsLoading(true)
      await updateActiveUser(user_id, name, user_name, password, type, newStatus);
      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("Felicidades!!... Se actualizo el estatus con exito");
      setIsLoading(false)
	    refreshUsers();
    } catch (error) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage(`¡Error! ${error.message}`);
      setIsLoading(false)
    }
  };

  const updateActiveUser = async (user_id, name, user_name, password, type, status_user) => {
    try {
        const res = await updateActiveUserRequest(user_id, name, user_name, password, type, status_user);
        
        if (res.status === 200) {
          console.log('Success:', res.data.message);          
        } else {
          console.log(`Unexpected status code: ${res.status}`);          
        }
  
    } catch (error) {
       if (error.response) {
        const status = error.response.status;
        
        if (status === 400) {
          console.log('Bad Request:', error.response.data.message);
          
        } else if (status === 500) {
          console.log('Server Error:', error.response.data.message);
          
        } else {
          console.log(`Error (${status}):`, error.response.data.message);
          
        }
      } else {
        console.log('Error:', error.message);
        
      }
    }
  }

  const getColor = (status) => {
    return status === 'activo' ? 'success.main' : 'error.main';
  };

	const StatusCell = ({ user_id, name, user_name, password, active, activeWeb, activeMobile, onStatusChange }) => {
    const [open, setOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [statusType, setStatusType] = useState('');
  
    const handleClickOpen = (status, type) => {
      setCurrentStatus(status);
      setStatusType(type);
      setOpen(true);
    };
  
    const handleClose = (confirmed) => {
      if (confirmed) {
        const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
        onStatusChange(user_id, name, user_name, password, newStatus, statusType);
      }
      setOpen(false);
    };  

    const iconStyles = (status) => ({
      color: 'white',
      backgroundColor: getColor(status),
      '&:hover': {
      color: getColor(status),      
      },
    });

    const getStatusTypeText = (statusType) => {
      switch (statusType) {
        case 'active':
          return 'el USUARIO';
        case 'activeWeb':
          return 'la PLATAFORMA WEB';
        case 'activeMobile':
          return 'la APP MOVIL';
        default:
          return 'el objeto';
      }
    };
    
		return (
			<div>
				<Tooltip title={active === 'activo' ? "Usuario activo" : "Usuario inactivo"}>
			<IconButton 
			sx={iconStyles(active)}
			onClick={() => handleClickOpen(active, 'active')}
			>
          <FaceIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={activeWeb === 'activo' ? "Con acceso a la web" : "Sin acceso a la web"}>
        <IconButton 
        sx={iconStyles(activeWeb)}
        onClick={() => handleClickOpen(activeWeb, 'activeWeb')}
        >
          <ComputerIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={activeMobile === 'activo' ? "Con acceso a la app móvil" : "Sin acceso a la app móvil"}>
        <IconButton 
        sx={iconStyles(activeMobile)}
        onClick={() => handleClickOpen(activeMobile, 'activeMobile')}
        >
          <AppShortcutIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas cambiar el estado a "{currentStatus === 'activo' ? 'inactivo' : 'activo'}" para {getStatusTypeText(statusType)}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="error" variant='contained'>
            Cancelar
          </Button>
          <Button onClick={() => handleClose(true)} color="secondary" variant='contained'>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
			</div>
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
			<LoadingModal open={isLoading} />
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />

      </Box>
      <Grid container spacing={2} xs={12} alignItems="center" mb={2}>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={3}>
            <Button
                variant="contained"
                color="secondary"
                onClick={exportToExcel}
                startIcon={<FileDownload />}
				width={'100%'}
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
				// onRowClick={(params) => handleOpenModal(params.row)}
				/>
			</Box>

			<UserDetailsModal open={openModal} onClose={handleCloseModal} user={selectedUser} />
			<GeneralDataModal open={generalDataOpenModal} onClose={handleGeneralDataCloseModal} data={selectedUser}/>
			<AssignedPlacesModal open={assignedPlacesOpenModal} onClose={handleAssignedPlacesCloseModal} data={selectedUser}/>
			<AssignedMenuAndSubMenuModal open={assignedMenuAndSubMenuOpenModal} onClose={handleAssignedMenuAndSubMenuCloseModal} data={selectedUser}/>
		</Box>

	)

}

export default Index
