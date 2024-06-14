import { Box, Button, Dialog, DialogActions, DialogContentText, DialogTitle, InputAdornment, TextField } from "@mui/material"
import React from "react"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import SearchIcon from "@mui/icons-material/Search"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import ManageSearchIcon from "@mui/icons-material/ManageSearch"
import { useStoreZustand } from "../../../../zustan_store/useStoreZustand"
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer"
import Pdf from "../pdf"
import useCombinedSlices from "../../../../hooks/useCombinedSlices"
import PropTypes from "prop-types"
import PlaceSelect from "../../../PlaceSelect"
import CancelIcon from "@mui/icons-material/Cancel"
import Pdf2 from "../pdf2"

function Search({ handleOpenDialog, handelOpenBackDrop, handelCloseBackDrop, ownerDetails, ownerHomeImages, ownerDebts, ownerPayments, ownerActions, accountNumber }) {

	const { setPlazaNumber, plazaNumber } =
	useStoreZustand()
	const [searchValue, setSearchValue] = React.useState("")
	const { setAccountData, setAlertInfo } = useCombinedSlices();
	const [openPDF, setOpenPDF] = React.useState(false);

	const handleOpenPDF = () => {
		setOpenPDF(true)
	}

	const handleClosePDF = () => {
		setOpenPDF(false)
	}

	const handleAccountSearch = () => {
		setAlertInfo(null)
		const startTime = Date.now()
		handelOpenBackDrop()
		const apiUrl = `http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${searchValue}/`

		const fetchData = async () => {

			try {

				const response = await axios.get(apiUrl)
				const data = response.data;

				const requestInfo = {
					url: apiUrl,
					status: response.status,
					statusText: response.statusText,
				}

				setAlertInfo(requestInfo)
				setAccountData(data)

			} catch (error) {

				console.error("Error al hacer la solicitud:", error.message)
				const requestInfo = {
					url: apiUrl,
					status: error.response ? error.response.status : undefined,
					statusText: error.response ? error.response.statusText : undefined,
				}
				setAlertInfo(requestInfo)

			} finally {

				const endTime = Date.now()
				const duration = endTime - startTime

				setTimeout(() => {
					handelCloseBackDrop()
				}, duration)

				setTimeout(() => {
					handelCloseBackDrop()
					setAlertInfo(null)
				}, duration + 3000)

			}

		}

		fetchData()

	}

	const handlePlaceChange = (e) => {
		setPlazaNumber(e.target.value);
	}

	return (
		<>

			<Box sx={{ width: "35%" }}>
				<PlaceSelect handlePlaceChange={handlePlaceChange} />
			</Box>

			<TextField
				color="secondary"
				id="input-with-icon-textfield"
				label="Cuenta"
				InputProps={{
				startAdornment: (
					<InputAdornment position="start">
					<AccountTreeIcon />
					</InputAdornment>
				),
				}}
				variant="filled"
				sx={{ width: "20%" }}
				onChange={(e) => setSearchValue(e.target.value)}
				value={accountNumber || searchValue}
			/>

			<Button
				color="secondary"
				sx={{ color: "black", fontWeight: "bolder" }}
				onClick={handleAccountSearch}
				variant="contained"
				startIcon={<SearchIcon />}
			>
				Bùsqueda
			</Button>

			<Button
				onClick={handleOpenDialog}
				variant="contained"
				startIcon={<ManageSearchIcon />}
			>
				Personalizada
			</Button>
				
			<Button onClick={handleOpenPDF} variant="contained">
				<PictureAsPdfIcon />
			</Button>

			{openPDF && ownerDetails && (

				<Dialog open={openPDF} onClose={openPDF} maxWidth={true}>

					<DialogTitle>Descarga tu Pdf</DialogTitle>

					<DialogContentText>

						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>

							{(() => {
								const imagesLength = ownerHomeImages.length

								switch (true) {
								case imagesLength === 0:
									return null
								case imagesLength <= 3:
									return (
									<PDFDownloadLink
										document={
										<Pdf
											ownerDetails={ownerDetails}
											ownerHomeImages={ownerHomeImages}
											ownerDebts={ownerDebts}
											ownerPayments={ownerPayments}
											ownerActions={ownerActions}
										/>
										}
										fileName={`Cuenta_No_${ownerDetails[0].account}.pdf`}
									>
										<Button color="secondary">
										{" "}
										<PictureAsPdfIcon />
										</Button>
									</PDFDownloadLink>
									)
								case imagesLength <= 6:
									break
								case imagesLength > 6:
									return (
									<PDFDownloadLink
										document={
										<Pdf2
											ownerDetails={ownerDetails}
											ownerHomeImages={ownerHomeImages}
											ownerDebts={ownerDebts}
											ownerPayments={ownerPayments}
											ownerActions={ownerActions}
										/>
										}
										fileName={`Cuenta_No_${ownerDetails[0].account}.pdf`}
									>
										<Button color="secondary">
										{" "}
										<PictureAsPdfIcon />
										</Button>
									</PDFDownloadLink>
									)

								default:
									return null
								}
							})()}
							
						</Box>

					</DialogContentText>

					<DialogActions>
						<Button onClick={handleClosePDF} color="secondary">
							<CancelIcon />
						</Button>
					</DialogActions>

				</Dialog>

			)}

		</>

	)

}

Search.propTypes = {
	handleOpenDialog: PropTypes.func.isRequired,
	handelOpenBackDrop: PropTypes.func.isRequired,
	handelCloseBackDrop: PropTypes.func.isRequired,
	ownerDetails: PropTypes.object,
	ownerHomeImages: PropTypes.object,
	ownerDebts: PropTypes.object,
	ownerPayments: PropTypes.object,
	ownerActions: PropTypes.object,
	accountNumber: PropTypes.object,
}

export default Search
