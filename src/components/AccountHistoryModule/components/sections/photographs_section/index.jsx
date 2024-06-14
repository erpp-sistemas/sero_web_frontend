/* eslint-disable no-undef */
import React from "react"
import ImageCard from "./components/ImageCard"
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Grid, IconButton, Input, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { useStoreZustand } from "../../../../../zustan_store/useStoreZustand"
import { BiSolidImageAdd } from "react-icons/bi"
import SelectBox from "./components/SelectBox"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { FaCloudUploadAlt } from "react-icons/fa"
import dayjs from "dayjs"
import axios from "axios"
import { store } from "../../../../../redux/store"
import { ImCancelCircle } from "react-icons/im"
import { FaRegCircleCheck } from "react-icons/fa6"
import { GrUploadOption } from "react-icons/gr"
import functionsCustom from "../../../../../helpers"
import useAccountData from "../../../../../hooks/accountDataHook"
import useCombinedSlices from "../../../../../hooks/useCombinedSlices"

function PhotographsSections() {

	const {  setImageData, plazaNumber } = useStoreZustand()
	const {photos,informationContributor}=useCombinedSlices()
	const { setAccountData } = useAccountData()
	const [open, setOpen] = React.useState(false)
	const [openDialogForm, setOpenDialogForm] = React.useState(false)
	const [valueDateTime, setValueDateTime] = React.useState(null)

	const [selectedFile, setSelectedFile] = React.useState(null)
	const [setSignedUrl] = React.useState(null)
	const [imageURL, setImageURL] = React.useState(null)
	const [users, setUsers] = React.useState([]);
	const [selectedUserId, setSelectedUserId] = React.useState("")
	const [validateInputs, setValidateInputs] = React.useState({
		inputFile: false,
		dateTimeInput: false,
		avatarInput: false,
		taskInput: false,
		typeInput: false,
		serviceInput: false,
	})

	const changeControl = (event) => {
		setSelectedUserId(event.target.value)
		setValidateInputs((prev) => ({
		...prev,
		avatarInput: !!event.target.value,
		}))
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleClickOpenDialogForm = () => {
		setOpenDialogForm(true)
	}

	const handleClickCloseDialogForm = () => {
		setOpenDialogForm(false)
		setOpen(false)
	}

	const handleChangeDateTime = (newValue) => {

		setValueDateTime(newValue)
			setImageData({
			date_capture: newValue.format("YYYY-MM-DD HH:mm:ss"),
		})
		setValidateInputs((prev) => ({
			...prev,
			dateTimeInput: !!newValue,
		}))

	}

	const handleFileChange = (event) => {

		const file = event.target.files[0]
		const url = URL.createObjectURL(file)
		setImageURL(url)
		setSelectedFile(file)
		setValidateInputs((prev) => ({
			...prev,
			inputFile: !!file,
		}))

	}

	const [imageDataNew, setImageDataNew] = React.useState({
		account: "",
		user_id: "",
		namePhoto: "",
		task_id: "",
		date_capture: "",
		type: "",
		imageUrl: "",
		active: 1,
		service_id: "",
		session_user_id: "",
	})

  React.useEffect(() => {

	const postImageData = async () => {
		
		try {
			const response = await axios.post(
				`http://localhost:3000/api/InsertPhoto/${plazaNumber}/`,
				imageDataNew
			)
			return response
		} catch (error) {
			console.error("Error:", error);
		}

	}

	if (
		imageDataNew.account &&
		imageDataNew.user_id &&
		imageDataNew.namePhoto &&
		imageDataNew.imageUrl &&
		imageDataNew.active &&
		imageDataNew.service_id &&
		imageDataNew.session_user_id
	) {
		postImageData()
	}
	}, [imageDataNew.account, imageDataNew.user_id, imageDataNew.namePhoto, imageDataNew.imageUrl, imageDataNew.active, imageDataNew.service_id, imageDataNew.session_user_id, imageDataNew, plazaNumber])

  const handleFileUpload = async () => {
    if (
      !validateInputs.inputFile &&
      !validateInputs.avatarInput &&
      !validateInputs.dateTimeInput &&
      !validateInputs.serviceInput &&
      !validateInputs.taskInput &&
      !validateInputs.typeInput
    ) {
      console.error("¡Por favor, te faltan campos por llenar ")
      return
    }

    try {
		const fechaActual = new Date()
		const fileName = `${informationContributor[0].account}${functionsCustom.formatDate(fechaActual, "full")}`
		const remoteFileName = fileName
		await uploadFile(selectedFile, remoteFileName, 1)
		const signedUrl = await signUrl(remoteFileName)
		setSignedUrl(signedUrl)
		setImageDataNew((prevImageData) => ({
			...prevImageData,
			account: informationContributor[0].account,
			user_id: selectedUserId,
			session_user_id: store.getState().user.user_id,
			namePhoto: remoteFileName,
			imageUrl: signedUrl,
			active: 1,
		}))
		setSignedUrl(null)
		setSelectedFile(null)
		try {
			const getResponse = await axios.get(
			`http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${informationContributor[0].account}/`
			)

			if (getResponse.status === 200) {
				const accountHistory = getResponse.data
				setAccountData(accountHistory)
				setValidateInputs({
					inputFile: false,
					dateTimeInput: false,
					avatarInput: false,
					taskInput: false,
					typeInput: false,
					serviceInput: false,
				})
				setSignedUrl(null)
				setSelectedFile(null)
				handleClickCloseDialogForm()
			} else {
				console.error(
					"Error obtaining account data:",
					getResponse.status,
					getResponse.data
				)
				throw new Error("Error obtaining account data")
			}

			} catch (error) {
				console.error("Error:", error)
			}

		} catch (error) {
			console.error("Error:", error)
		}

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

	return (

		<>
			
			<Stack
				direction="row"
				useFlexGap
				flexWrap="wrap"
				sx={{
				maxWidth: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				marginTop: "1rem",
				}}
				spacing={2}
			>
				{photos.length > 0 ? (
				photos.map((photo) => (
					<ImageCard key={photo.image_url} photoObject={photo} />
				))
				) : (
				<Typography variant="h3" gutterBottom>
					No hay fotos disponibles
				</Typography>
				)}
			</Stack>

			<Fab onClick={handleClickOpen} color="secondary" aria-label="add">
				<BiSolidImageAdd size={26} />
			</Fab>

			{open && (
				<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				>
				<DialogTitle id="alert-dialog-title">{"Información"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
					¿Deseas agregar una nueva imagen?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
					color="secondary"
					onClick={handleClickOpenDialogForm}
					startIcon={<FaRegCircleCheck />}
					>
					Confirmar
					</Button>
					<Button
					color="secondary"
					onClick={handleClose}
					autoFocus
					startIcon={<ImCancelCircle />}
					>
					Cancelar
					</Button>
				</DialogActions>
				</Dialog>
			)}

			{openDialogForm && (
				<Dialog open={openDialogForm} onClose={handleClickCloseDialogForm}>
				<DialogTitle>Subir Imagen</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
						color="secondary"
						id="filled-select-user"
						select
						label="Usuario"
						variant="filled"
						sx={{ width: "100%" }}
						value={selectedUserId}
						onChange={changeControl}
						>
						{users.map((user) => {
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
						{validateInputs.avatarInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por ingresar un usuario!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa un usuario!
						</Typography>
						)}
						<SelectBox
						hasFetchData={true}
						title={"Tarea"}
						array={""}
						field={"idTarea"}
						setImageDataNew={setImageDataNew}
						imageDataNew={imageDataNew}
						setValidateInputs={setValidateInputs}
						/>
						{validateInputs.taskInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por ingresar una tarea!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa una tarea!
						</Typography>
						)}
						<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Stack spacing={2} sx={{ minWidth: 200, marginTop: "1rem" }}>
							<DateTimePicker
							value={valueDateTime}
							onChange={handleChangeDateTime}
							referenceDate={dayjs("2023-11-23T09:53:16.000").format(
								"YYYY-MM-DDTHH:mm:ss.SSS"
							)}
							/>
							<Typography>
							Stored value:{" "}
							{valueDateTime == null
								? "null"
								: valueDateTime.format("YYYY-MM-DD HH:mm:ss.SSS")}
							</Typography>
						</Stack>
						</LocalizationProvider>
						{validateInputs.dateTimeInput ?   <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por ingresar una fecha!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa una fecha!
						</Typography>
						)}
					</Grid>
					<Grid item xs={6}>
						<SelectBox
						hasFetchData={false}
						title={"TipoImagen"}
						array={[
							{
							value: "Carta invitación fachada predio",
							name: "Carta invitación fachada predio",
							},
							{
							value: "Carta invitación evidencia",
							name: "Carta invitación evidencia",
							},
						]}
						field={"tipo"}
						setImageDataNew={setImageDataNew}
						imageDataNew={imageDataNew}
						setValidateInputs={setValidateInputs}
						/>
						{validateInputs.typeInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por cargar un tipo de tarea!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa un tipo de tarea!
						</Typography>
						)}
						<Input
						sx={{ marginTop: "1rem" }}
						type="file"
						onChange={handleFileChange}
						startAdornment={
							<InputAdornment position="start">
							<IconButton component="label" color="primary">
								<FaCloudUploadAlt />
							</IconButton>
							</InputAdornment>
						}
						/>
						{imageURL ? (
						<img
							src={imageURL}
							alt="prueba"
							style={{
							width: "100%",
							marginTop: "1rem",
							height: "150px",
							}}
						/>
						) : (
						<Typography variant="body1">
							No hay imagen disponible
						</Typography>
						)}
						{validateInputs.inputFile ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por cargar una imagen!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, carga una foto!
						</Typography>
						)}
						<SelectBox
						hasFetchData={false}
						title={"Servicio"}
						array={[
							{ value: 1, name: "Agua" },
							{ value: 2, name: "Predio" },
						]}
						field={"id_servicio"}
						setImageDataNew={setImageDataNew}
						imageDataNew={imageDataNew}
						setValidateInputs={setValidateInputs}
						/>
						{validateInputs.serviceInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
								¡Gracias por ingresar un servicio!
						</Typography></Stack> : (
						<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa un servicio!
						</Typography>
						)}
					</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
					onClick={handleFileUpload}
					color="secondary"
					startIcon={<GrUploadOption />}
					>
					Subir Archivo
					</Button>
					<Button
					onClick={handleClickCloseDialogForm}
					color="secondary"
					startIcon={<ImCancelCircle />}
					>
					Cerrar
					</Button>
				</DialogActions>
				</Dialog>
			)}

		</>
	)

}

export default PhotographsSections
