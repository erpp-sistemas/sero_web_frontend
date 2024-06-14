import { AppBar, Box, Button, Dialog, IconButton, InputAdornment, Stack, TextField, Toolbar, Typography } from "@mui/material"
import React from "react"
import RecentActorsIcon from "@mui/icons-material/RecentActors"
import PersonIcon from "@mui/icons-material/Person"
import { FaRegCircleCheck } from "react-icons/fa6"
import { TbZoomCancel } from "react-icons/tb"
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"
import { useStoreZustand } from "../../../../zustan_store/useStoreZustand"
import CloseIcon from '@mui/icons-material/Close'
import useCombinedSlices from "../../../../hooks/useCombinedSlices"
import PropTypes from "prop-types"

function DialogSearch({ handleCloseDialog, setAccountNumber }) {

	const { plazaNumber, setAlertInfoFromRequest } = useStoreZustand()
    const { setAccountData } = useCombinedSlices()
	const [ responseData, setResponseData ] = React.useState(null)
	const [ setLoading ] = React.useState(false)
	const [ formDataFromInputs, setFormDataFromInputs ] = React.useState({
		account: "",
		owner_name: "",
		street: "",
		cologne: "",
	})
	const [verificationInputs, setVerificationInputs] = React.useState({
		accountInput: false,
		ownerNameinput: false,
		streetInput: false,
		townInput: false,
	})

	const handleChangeInput = (e) => {
		const { name, value } = e.target

		setVerificationInputs((prev) => {
		switch (name) {
			case "account":
			return {
				...prev,
				[name]: !!value,
				accountInput: value.length > 0 ? true : false,
			}

			case "owner_name":
			return {
				...prev,
				[name]: !!value,
				ownerNameinput: value.length > 0 ? true : false,
			}

			case "street":
			return {
				...prev,
				[name]: !!value,
				streetInput: value.length > 0 ? true : false,
			}

			case "cologne":
			return {
				...prev,
				[name]: !!value,
				townInput: value.length > 0 ? true : false,
			}

		}
		})

		setFormDataFromInputs((prev) => ({
			...prev,
			[name]:value,
		}))

	}

	const handleSearch = async () => {

		for (const key in formDataFromInputs) {
			if (formDataFromInputs[key] === "") {
				formDataFromInputs[key] = "vacio"
			}
		}

		const apiUrl = `http://localhost:3000/api/AccountHistoryByParameters/${plazaNumber}/${formDataFromInputs.account}/${formDataFromInputs.owner_name}/${formDataFromInputs.street}/${formDataFromInputs.cologne}`
		
		try {
			const response = await axios.get(apiUrl)
			const data = response.data
			setResponseData(data)
		} catch (error) {
			console.error("Error al hacer la solicitud:", error.message)
		}

	}

	const buildColumns = () => {
		const columns = []

		responseData?.forEach((responseDataObject, index) => {

			if (index === 0) {

				for (const key in responseDataObject) {

					switch (key) {

						case "account":
						columns.push({
							field: key,
							headerName: "Cuenta",
							width: 150,
						})
						break

						case "owner_name":
						columns.push({
							field: key,
							headerName: "Propietario",
							width: 250,
						})
						break

						case "street":
						columns.push({
							field: key,
							headerName: "Calle",
							width: 200,
						})
						break

						case "cologne":
						columns.push({
							field: key,
							headerName: "Colonia",
							width: 300,
							editable: true,
						})
						break

						default:
						break
					}

				}

			}

		})

		return columns

	}

	const buildRows = () => {
		const rows = []

		responseData?.forEach((responseDataObject, index) => {
			rows.push({ id: index + 1, ...responseDataObject })
		})

		return rows
	}

	return (

		<Dialog fullScreen open={true} onClose={handleCloseDialog}>

			<AppBar sx={{ position: "relative" }}>

				<Toolbar>

					<IconButton edge="start" color="inherit" onClick={handleCloseDialog} aria-label="close" >
						<CloseIcon/>
					</IconButton>

				</Toolbar>

			</AppBar>

			<Box sx={{padding:"30px"}}>

				<Stack direction="row" spacing={4}>

					<Box sx={{ p: 2}}  >
						
						<TextField
							color="secondary"
							sx={{ marginBottom: "1rem", width: "400px" }}
							id="input-with-icon-textfield-account"
							label="Cuenta"
							onChange={handleChangeInput}
							value={formDataFromInputs.account}
							type="text"
							name="account"
							InputProps={{
							startAdornment: (
								<InputAdornment position="start">
								<RecentActorsIcon />
								</InputAdornment>
							),
							}}
							variant="standard"
						/>

						{verificationInputs.accountInput ? (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
								<Typography color={"secondary"} variant="caption">
									¡Gracias por ingresar una cuenta!
								</Typography>
							</Stack>

						) : (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<TbZoomCancel style={{ color: "red" }} />{" "}
								<Typography sx={{ color: "red" }} variant="caption">
									* ¡Por favor, ingresa una cuenta!
								</Typography>
							</Stack>

						)}

						<TextField
							color="secondary"
							size="small"
							sx={{ width: "400px", marginBottom: "1rem" }}
							id="input-with-icon-textfield-contributor"
							name="owner_name"
							label="Propietario"
							onChange={handleChangeInput}
							value={formDataFromInputs.owner_name}
							InputProps={{
							startAdornment: (
								<InputAdornment position="start">
								<PersonIcon />
								</InputAdornment>
							),
							}}
							variant="standard"
						/>
						
						{verificationInputs.ownerNameinput ? (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
								<Typography color={"secondary"} variant="caption">
									¡Gracias por ingresar un propietario!
								</Typography>
							</Stack>

						) : (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<TbZoomCancel style={{ color: "red" }} />{" "}
								<Typography sx={{ color: "red" }} variant="caption">
									* ¡Por favor, ingresa un nombre de propietario!
								</Typography>
							</Stack>

						)}

						<TextField
							color="secondary"
							size="small"
							sx={{ width: "400px", marginBottom: "1rem" }}
							id="input-with-icon-textfield-street"
							label="Calle"
							name="street"
							onChange={handleChangeInput}
							value={formDataFromInputs.street}
							InputProps={{
							startAdornment: (
								<InputAdornment position="start">
								<PersonIcon />
								</InputAdornment>
							),
							}}
							variant="standard"
						/>

						{verificationInputs.streetInput ? (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
								<Typography color={"secondary"} variant="caption">
									¡Gracias por ingresar una calle!
								</Typography>
							</Stack>

						) : (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<TbZoomCancel style={{ color: "red" }} />{" "}
								<Typography sx={{ color: "red" }} variant="caption">
									* ¡Por favor, ingresa una calle valida!
								</Typography>
							</Stack>

						)}

						<TextField
							color="secondary"
							size="small"
							sx={{ width: "400px", marginBottom: "1rem" }}
							id="input-with-icon-textfield-cologne"
							label="Colonia"
							name="cologne"
							onChange={handleChangeInput}
							value={formDataFromInputs.cologne}
							InputProps={{
							startAdornment: (
								<InputAdornment position="start">
								<PersonIcon color="" />
								</InputAdornment>
							),
							}}
							variant="standard"
						/>

						{verificationInputs.townInput ? (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
								<Typography color={"secondary"} variant="caption">
									¡Gracias por ingresar una colonia!
								</Typography>
							</Stack>

						) : (

							<Stack sx={{ marginTop: "0.5rem" }} direction="row">
								<TbZoomCancel style={{ color: "red" }} />{" "}
								<Typography sx={{ color: "red" }} variant="caption">
									* ¡Por favor, ingresa un nombre de colonia valido!
								</Typography>
							</Stack>

						)}

						<Box sx={{ display: "flex", justifyContent: "end" }}>
							<Button onClick={handleSearch} variant="contained" color="secondary">Buscar</Button>
						</Box>

					</Box>

					<Box sx={{ p: 3,width:"60%" }}>

						{" "}

						<DataGrid
							onRowClick={(params) => {
								setLoading(true);
								const plaza_id = plazaNumber;
								const account_id = params.row.account;
								const apiUrl = `http://localhost:3000/api/AccountHistoryByCount/${plaza_id}/${account_id}/`;
				
								const fetchData = async () => {

								try {

									const response = await axios.get(apiUrl)
									const data = response.data
									setAccountData(data)
									setAccountNumber(account_id)

								} catch (error) {

									console.error("Error al hacer la solicitud:", error.message)
									setAlertInfoFromRequest({
										status: error.response?.status || 500,
										statusText: error.message,
									})

									} finally {

										setLoading(false)
										setTimeout(() => {
											handleCloseDialog()
										}, 10)
										setTimeout(() => {
											setAlertInfoFromRequest(null)
										}, 3000)

									}

								}
				
								fetchData()

							}}

							rows={buildRows()}
							columns={buildColumns()}
							initialState={{
								pagination: {
									paginationModel: {
									pageSize: 5,
									},
								},
							}}
							pageSizeOptions={[5]}
							disableRowSelectionOnClick
						/>

						{" "}
						
					</Box>

				</Stack>

			</Box>

		</Dialog>

	)

}

DialogSearch.propTypes = {
	handleCloseDialog: PropTypes.func.isRequired,
	setAccountNumber: PropTypes.func.isRequired,
}

export default DialogSearch
