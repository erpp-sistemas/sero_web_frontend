import React, { useState } from "react"
import { Alert, AlertTitle, Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Viewer from "react-viewer"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import functionsCustom from "../../../../../../helpers"
import { BiTask } from "react-icons/bi"
import { FaImages } from "react-icons/fa"
import { MdCloudSync } from "react-icons/md"
import "animate.css"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useStoreZustand } from "../../../../../../zustan_store/useStoreZustand"
import dayjs from "dayjs"
import { store } from "../../../../../../redux/store"
import axios from "axios"
import { ImCancelCircle } from "react-icons/im"
import { FaRegCircleCheck } from "react-icons/fa6"
import { IoLaptop } from "react-icons/io5"
import { FaMobile } from "react-icons/fa"
import { TiTick } from "react-icons/ti"
import { IoDuplicate } from "react-icons/io5"
import useAccountData from "../../../../../../hooks/accountDataHook"
import useCombinedSlices from "../../../../../../hooks/useCombinedSlices"
import PropTypes from 'prop-types'

function ImageCard({ photoObject }) {

	const { setImageData, plazaNumber } = useStoreZustand()
	const{setAccountData} = useAccountData()
	const {informationContributor}=useCombinedSlices()
	const [checked, setChecked] = useState(photoObject.active)
	const [visible, setVisible] = useState(false)
	const [visibleAvatar, setVisibleAvatar] = useState(false)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [valueDateTime, setValueDateTime] = useState(null)
	const [showSuccessAlert, setShowSuccessAlert] = useState(false)
	const [openDialogSwitch, setOpenDialogSwitch] = React.useState(false)
	const [users, setUsers] = useState([])
	const [selectedUserId, setSelectedUserId] = useState("")
	const [validateInputs, setValidateInputs] = React.useState({ dateTimeInput: false, avatarInput: false })

	const changeControl = (event) => {
		setSelectedUserId(event.target.value)
		setValidateInputs((prev) => ({
			...prev,
			avatarInput: !!event.target.value,
		}))
  
	}

	React.useEffect(() => {

		const fetchData = async () => {

			try {
				const response = await axios.get(
				"http://localhost:3000/api/GetUsersByPlaceId"
				)
				setUsers(response.data)
			} catch (error) {
				console.error("Error al obtener datos:", error)
			}

		}

		fetchData()

	}, [])

	const handleMouseOver = (e) => {
		const element = e.target
		element.classList.add("animate__animated", "animate__bounce")
	}

	const handleMouseOut = (e) => {
		const element = e.target
		element.classList.remove("animate__animated", "animate__bounce")
	}

	const handleImageDuplication = async () => {

		if (
			!validateInputs.avatarInput &&
			!validateInputs.dateTimeInput 
		) {
			console.error("¡Por favor, te faltan campos por llenar ");
			return;
		}

		const ImageData = {
			imageId: photoObject.image_id,
			account: informationContributor[0].account,
			type: photoObject.image_type,
			user_id: selectedUserId,
			date_capture: valueDateTime.format("YYYY-MM-DD HH:mm:ss"),
			session_user_id: store.getState().user.user_id,
		}

		try {
			const response = await axios.post(
				`http://localhost:3000/api/DuplicatePhoto/${plazaNumber}/`,
				ImageData
			)
			const { message} = response.data
			if (message === "Operación exitosa") {
				const getResponse = await axios.get(
				`http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${informationContributor[0].account}/`
				)

				if (getResponse.status === 200) {
					const accountHistory = getResponse.data
					setAccountData(accountHistory) 
					setValidateInputs({
					dateTimeInput: false,
					avatarInput: false,
				})
				} else {
					console.error('Error obteniendo datos de la cuenta:', getResponse.status, getResponse.data)
					throw new Error('Error obteniendo datos de la cuenta')
				}

			} else {
				console.error("Error en la operación:", response.data.message);
			}

		} catch (error) {
			console.error("Error al enviar datos al backend:", error);
		}

	}

	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setAnchorEl(null)
	}

	const handleOpenDialog = () => {
		setDialogOpen(true)
		handleCloseMenu()
	}

	const handleCloseDialog = () => {
		setDialogOpen(false)
	}

	const handleChangeDateTime = (newValue) => {
		setValueDateTime(newValue)
		setImageData({
			fechaCaptura: newValue.format("YYYY-MM-DD HH:mm:ss"),
		})
		setValidateInputs((prev) => ({
			...prev,
			dateTimeInput: !!newValue,
		}))
	}

	const handleCheckboxChange = (
		imageId,
		newCheckedState,
		userId,
		setChecked
	) => {
		const payload = {
		imageId,
		active: newCheckedState ? 1 : 0,
		userId,
	}

    axios

		.patch("http://localhost:3000/api/UpdatePhotoState", payload)
		.then((response) => {
			if (response.data.message === "Operación exitosa") {
			setShowSuccessAlert(true)
			}
			setTimeout(() => {
			setShowSuccessAlert(false);
			}, 3000)
		})
		.catch((error) => {
			console.error("Error updating photo state:", error);
		})

		setChecked(newCheckedState)

	}

	const uniqueUserIds = new Set()

	const uniqueUsers = users.filter((user) => {

		if (uniqueUserIds.has(user.user_id)) {
			return false
		}

		uniqueUserIds.add(user.user_id)
		return true

	})

	return (

		<Card
			sx={{
				maxWidth: 285,
				minWidth: 200,
				minHeight: 200,
				width: "100%",
			}}
		>

			{showSuccessAlert && (

				<Alert severity={checked ? "success" : "warning"}>
					<AlertTitle>{checked ? "Èxito" : "Advertencia"}</AlertTitle>
					¡El estado de la imagen se actualizó correctamente! Estado actual:{" "}
					{checked ? "Activa" : "Inactiva"}
				</Alert>

			)}

			<CardHeader
				avatar={ <Avatar onClick={() => { setVisibleAvatar(true) }} src={photoObject.photo_person_who_capture} aria-label="recipe">R</Avatar>}
				action={
				<>
					<IconButton aria-label="settings" onClick={handleClick}>
						<MoreVertIcon />
					</IconButton>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleCloseMenu}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
					<MenuItem onClick={handleOpenDialog}>
						<ListItemIcon>
						<IoDuplicate fontSize="small" />
						</ListItemIcon>
						<ListItemText>Duplicar</ListItemText>
					</MenuItem>
					</Menu>
				</>
				}
				title={photoObject.person_who_capture}
				subheader={functionsCustom.formatDate(photoObject.synchronization_date, "full")}
			/>

			<Viewer
				visible={visibleAvatar}
				onClose={() => {
				setVisibleAvatar(false)
				}}
				images={[
				{
					src: photoObject.photo_person_who_capture,
					alt: photoObject.image_type,
				},
				]}
			/>

			<Box sx={{ position: "relative" }}>

				<Checkbox
					checked={checked}
					onChange={() => setOpenDialogSwitch(true)}
					sx={{ position: "absolute", right: "0" }}
					icon={<ToggleOffIcon fontSize="large" />}
					checkedIcon={
						<ToggleOnIcon
							fontSize="large"
							color={checked ? "secondary" : "warning"}
						/>
					}
				/>

				<Chip
					icon={checked ? <TiTick /> : <ImCancelCircle />}
					size="small"
					sx={{
						position: "absolute",
						marginTop: "0.5rem",
						marginLeft: "0.5rem",
					}}
					label={checked ? "Activo" : "Inactivo"}
					color={checked ? "secondary" : "warning"}
				/>

				<CardMedia
					component="img"
					image={photoObject.image_url}
					alt={photoObject.image_type}
					sx={{ height: "150px" }}
					onClick={() => {
						setVisible(true);
					}}
					/>
					<Viewer
					visible={visible}
					onClose={() => {
						setVisible(false);
					}}
					images={[{ src: photoObject.image_url, alt: photoObject.image_type }]}
				/>

			</Box>

			<CardContent>

				<List dense={true}>

					<ListItem>
						<ListItemIcon sx={{ color: "#5EBFFF" }}>
							<FaImages />
						</ListItemIcon>
						<ListItemText
							sx={{ color: "#5EBFFF" }}
							primary="Tipo de Imagen"
							secondary={`${photoObject.image_type}`}
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ color: "#5EBFFF" }}>
							<BiTask />
						</ListItemIcon>
						<ListItemText
							sx={{ color: "#5EBFFF" }}
							primary="Tarea"
							secondary={`${photoObject.task_done}`}
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ color: "#5EBFFF" }}>
						<MdCloudSync
							onMouseOver={handleMouseOver}
							onMouseOut={handleMouseOut}
						/>
						</ListItemIcon>
						<ListItemText
							sx={{ color: "#5EBFFF" }}
							primary="Fecha de ingeso al sistema"
							secondary={`${functionsCustom.formatDate(
								photoObject.date_capture,
								"full"
							)}`}
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ color: "#5EBFFF" }}>
						{photoObject.type_load === "0" ? <FaMobile /> : <IoLaptop />}
						</ListItemIcon>
						<ListItemText
						sx={{ color: "#5EBFFF" }}
						primary="Plataforma"
						secondary={
							photoObject.type_load === "0" ? "SER0 MOBIL" : "SER0 WEB"
						}
						/>
					</ListItem>

				</List>

			</CardContent>

			<Dialog open={dialogOpen} onClose={handleCloseDialog}>
				<DialogTitle>Duplicar Imagen</DialogTitle>

				<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={6}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Stack spacing={2} sx={{ minWidth: 200, marginTop: "1rem" }}>
						<DateTimePicker
							value={valueDateTime}
							onChange={handleChangeDateTime}
							referenceDate={dayjs("2022-04-17T15:30")}
						/>
						<Typography>
							Stored value:{" "}
							{valueDateTime == null
							? "null"
							: valueDateTime.format("YYYY-MM-DD HH:mm:ss")}
						</Typography>
						</Stack>
					</LocalizationProvider>
					{validateInputs.dateTimeInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por ingresar una fecha!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa una fecha!
						</Typography>
						)}
					</Grid>
					<Grid item xs={6}>
					<TextField
						color="secondary"
						id="filled-select-user"
						select
						label="Usuario"
						variant="filled"
						sx={{ width: "230px" }}
						value={selectedUserId}
						onChange={changeControl}
					>
						{uniqueUsers.map((user) => {
						return (
							<MenuItem key={user.user_id} value={user.user_id}>
							<IconButton>
								<Avatar
								alt={user.name}
								src={user.photo_user}
								sx={{ width: 24, height: 24 }}
								/>
							</IconButton>

							{user.name}
							</MenuItem>
						);
						})}
					</TextField>
					{validateInputs.avatarInput? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por ingresar un usuario!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa una user!
						</Typography>
						)}
			

					</Grid>
				</Grid>
				</DialogContent>

				<DialogActions>
				<Button
					endIcon={<IoDuplicate />}
					onClick={handleImageDuplication}
					color="secondary"
				>
					Duplicar Archivo
				</Button>
				<Button
					onClick={handleCloseDialog}
					endIcon={<ImCancelCircle />}
					color="secondary"
				>
					Cerrar
				</Button>
				</DialogActions>

			</Dialog>

			<Dialog
				open={openDialogSwitch}
				onClose={() => setOpenDialogSwitch(false)}
				aria-labelledby="alert-dialog-title_estate"
				aria-describedby="alert-dialog-description_estate"
			>

				<DialogTitle id="alert-dialog-title">
				{"¿Está seguro de cambiar el estado?"}
				</DialogTitle>

				<DialogContent>
				<DialogContentText id="alert-dialog-description_estate">
					Este cambio afectará el estado de la imagen. ¿Está seguro de
					continuar?
				</DialogContentText>
				</DialogContent>

				<DialogActions>
				<Button
					color="secondary"
					startIcon={<FaRegCircleCheck />}
					onClick={() => {
					setOpenDialogSwitch(false)
					const newCheckedState = !checked
					handleCheckboxChange(
						photoObject.image_id,
						newCheckedState,
						store.getState().user.user_id,
						setChecked
					)
					}}
					autoFocus
				>
					Confirmar
				</Button>
				<Button
					color="secondary"
					onClick={() => setOpenDialogSwitch(false)}
					startIcon={<ImCancelCircle />}
				>
					Cancelar{" "}
				</Button>
				</DialogActions>

			</Dialog>

		</Card>

	)

}

ImageCard.propTypes = {
	photoObject: PropTypes.object,
}

export default ImageCard
