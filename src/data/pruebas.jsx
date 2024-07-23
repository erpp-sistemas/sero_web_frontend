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
		console.log(response.data)	
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
		
		];
  }, []);

	

	const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSearchText('');
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
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
