import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, useTheme, IconButton, Button } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { tokens } from "../../theme"
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"
import EditIcon from '@mui/icons-material/Edit'
import FaceIcon from '@mui/icons-material/Face'
import QrCodeIcon from '@mui/icons-material/QrCode'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import Header from "../../components/Header"
import Modal from '../../components/MaterialUI/ModalDataUser'
import { users } from '../../data/users'

const Team = () => {

	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const navigation = useNavigate()
	const [usuarios, setUsuarios] = useState([])
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		setUsuarios(users)
	}, [])


	const handleEditUser = (id_user) => {
		console.info(id_user)
	}

	const handleSeeUser = (id_user) => {
		setShowModal(true)
		console.info(id_user)
	}

	const columns = [
		{
		field: "name",
		headerName: "Nombre",
		flex: 1,
		headerAlign: "center",
		cellClassName: "name-column--cell",
		},
		{
		field: "username",
		headerName: "Username",
		headerAlign: "center",
		align: "center",
		flex: 1,
		cellClassName: "name-column--cell",
		},
		{
		field: "accessLevel",
		headerName: "Rol",
		flex: 1,
		headerAlign: "center",
		renderCell: ({ row: { access } }) => {
			return (
			<Box
				width="90%"
				m="0 auto"
				p="5px"
				display="flex"
				justifyContent="center"
				backgroundColor={access === "administrador" ? colors.greenAccent[500]
				: access === "directivo" ? colors.blueAccent[500] : access === 'coordinador' ? colors.yellowAccent[600]
					: colors.grey[600]
				}
				borderRadius="4px"
			>
				{access === "administrador" && <AdminPanelSettingsOutlinedIcon />}
				{access === "directivo" && <SecurityOutlinedIcon />}
				{access === "coordinador" && <LockOpenOutlinedIcon />}
				<Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
				{access}
				</Typography>
			</Box>
			);
		},
		},
		{
		field: "estatus",
		headerName: "Estatus",
		headerAlign: "center",
		renderCell: ({ row: { estatus } }) => {
			return (
			<Box
				width="35%"
				m="0 auto"
				p="5px"
				display="flex"
				justifyContent="center"
				borderRadius="4px"
			>
				<Typography color={estatus === "activo" ? colors.greenAccent[600] : colors.redAccent[500]} sx={{ ml: "5px", fontSize: '12px' }}>
				{estatus.toUpperCase()}
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
				<IconButton aria-label="perfil" onClick={() => handleSeeUser(id)}>
				<FaceIcon />
				</IconButton>
				<IconButton aria-label="qr">
				<QrCodeIcon />
				</IconButton>

			</Box>
			)
		},
		},
	]


	return (

		<Box m="20px">

			{showModal && (<Modal user={''} setShowModal={setShowModal} />)}

			<Header title="Administración de usuarios" subtitle="Listado usuarios SER0" />

			<Button startIcon={<GroupAddIcon />} onClick={() => navigation('/new-user')}
				sx={{
				backgroundColor: colors.greenAccent[700],
				width: '100px',
				":hover": {
					bgcolor: colors.greenAccent[300],
					color: "white"
				}
				}}
			>
				Nuevo
			</Button>
			
			<Box
				m="20px auto"
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
				<DataGrid rows={usuarios} columns={columns} autoPageSize />
			</Box>

		</Box>

	)

}

export default Team
