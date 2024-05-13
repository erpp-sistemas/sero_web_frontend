import React from "react"
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer"
import LogoSer0 from "./assets/images/sero-logo.png"
import LogoErpp from "./assets/images/erpp.png"
import LogoCheck from "./assets/images/marcaAgua.png"
import Roboto from "../pdf/assets/fonts/Oswald-Regular.ttf"
import PropTypes from 'prop-types'

function chunkArray(array, chunkSize) {
	const chunkedArray = []
	for (let i = 0; i < array.length; i += chunkSize) {
		chunkedArray.push(array.slice(i, i + chunkSize))
	}
	return chunkedArray
}

function formatDate(dateString, format) {
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}
	const formattedDate = new Date(dateString).toLocaleString("es-MX", options)

	switch (format) {

		case "date":
		return formattedDate.split(",")[0]
		case "time":
		return formattedDate.split(",")[1].trim()
		case "full":
		return formattedDate
		default:
		return "Invalid format"
	}

}

function formatCurrency(amount) {

	const numericAmount = Number(amount)

	if (!isNaN(numericAmount)) {
		const formattedAmount = numericAmount.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		return formattedAmount

	} else {
		return "Invalid amount"
	}

}

const totalPayments = (array) => {
	let totalCount = 0

	array.forEach((payments) => {
		if (payments.amount_paid != undefined) {
			totalCount += Number(payments.amount_paid)
		}
	})

	return `$${totalCount.toFixed(2)}`
}

Font.register({
	family: "Roboto",
	format: "truetype",
	src: Roboto,
})

const styles = StyleSheet.create({
	body: {
		minHeight: "100%",
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	logo: {
		width: 150,
		height: 50,
	},
	image: {
		width: "100%",
		height: "auto",
	},
	logoWaterMark: {
		width: 700,
		height: 800,
	},
	title: {
		color: "#254061",
		textAlign: "center",
		fontFamily: "Roboto",
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
	table: {
		display: "table",
		width: "auto",
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0,
		color: "gray",
	},
	tableTitle: { color: "gray", fontSize: 14 },
	tableRow: {
		margin: "auto",
		flexDirection: "row",
	},
	tableColTitle: {
		width: "100%",
		borderStyle: "solid",
		borderColor: "black",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		color: "white",
		backgroundColor: "#254061",
	},
	tableColContentTitle: {
		width: "100%",
		borderStyle: "solid",
		borderColor: "black",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		color: "gray",
		backgroundColor: "white",
	},
	tableColHeader: {
		width: "25%",
		borderColor: "black",
		borderStyle: "solid",
		fontWeight: "bold",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		color: "#254061",
		backgroundColor: "#e6e6e6",
	},
	tableColHeaderImages: {
		width: "33.33%",
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		color: "white",
		backgroundColor: "#254061",
	},
	tableCol: {
		width: "25%",
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableColCoordinates: {
		width: "100%",
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableCellCoordinates: {
		margin: "auto",
		marginTop: 5,
		fontSize: 10,
		fontFamily: "Roboto",
	},
	tableColImage: {
		width: "33.33%",
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableColImageMap: {
		width: "100%",
		height:150,
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		alignItems: "center",
		justifyContent: "center", 
	},
	imageMap: {
		width: "100%",
		height: "auto",
		resizeMode: "cover",
	},
	tableColMap: {
		width: "50%",
		height: 300,
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableCell: {
		margin: "auto",
		marginTop: 5,
		fontSize: 10,
		fontFamily: "Roboto",
	},
	tableCellContent: {
		fontSize: 11,
		textAlign: "center",
		fontFamily: "Roboto",
	},
	cellMap: {
		width: "100%",
		height: "auto",
	},
	footer: {
		position: "absolute",
		bottom: 10,
		right: 10,
	},

})

function Pdf({ ownerDetails, ownerHomeImages, ownerPayments, ownerActions }) {

	const sortedOwnerActions = [...ownerActions].sort((a, b) => {
		const taskDoneA = parseFloat(a.task_done)
		const taskDoneB = parseFloat(b.task_done)
		return taskDoneA - taskDoneB
	})

	const [ setImage] = React.useState("")

	React.useEffect(() => {
		setImage(ownerHomeImages[1]?.imageUrl)
	}, [ownerHomeImages, setImage])

	function getMap(longitude, latitude) {
		const geo_punto = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l+000(${longitude},${latitude})/${longitude},${latitude},17,0/400x250?access_token=pk.eyJ1IjoibGVzdGF0eCIsImEiOiJjbDJoMzJrbmYwYTNrM2NteGVtMzBsODFvIn0.lTrpDiiVnBWEv141_PnuUg`
		return geo_punto
	}

	return (

		<Document title={`Cuenta No. ${ownerDetails[0].account}`}>

			<Page size="A4" style={{ ...styles.body, height: 1000 }} wrap={true}>

				<View
					style={{
						position: "absolute",
						zIndex: 1,
						top: "-5%",
						left: "-10%",
						color: "rgba(255, 255, 255, 0.3)",
						opacity: 0.1,
						filter: "blur(8px)",
					}}
				>
					<Image style={styles.logoWaterMark} src={LogoCheck} />
				</View>

				<View style={styles.header}>
					<Image style={styles.logo} src={LogoErpp} />
					<Image style={styles.logo} src={LogoSer0} />
				</View>

				<View>
					<Text style={styles.title}>Historial de Cuenta</Text>
				</View>

				<View style={styles.section}>

					<View style={styles.table}>

						<View style={styles.tableRow}>
							<View style={styles.tableColTitle}>
								<Text style={styles.tableCell}>Datos del Propietario</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Cuenta</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Propietario</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Servicio</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Tarifa</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
									{ownerDetails[0].account || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCellContent}>
									{ownerDetails[0]["owner_name"] || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
									{ownerDetails[0]["type_service"] || ""}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
									{ownerDetails[0]["rate_type"] || ""}
								</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Giro</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Serie de Medidor</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>{""}</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>{""}</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>{ownerDetails.turn || ""} </Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["meter_series"] || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>{""}</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>{""}</Text>
							</View>
						</View>
						
						<View style={styles.tableRow}>
							<View style={styles.tableColTitle}>
								<Text style={styles.tableCell}>Domicilio del Propietario</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableColContentTitle}>
								<Text style={styles.tableCell}>{ownerDetails[0].street}</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Num. Interior</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Num. Exterior</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Colonia</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Manzana</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["outdoor_number"] || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["interior_number"] || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCellContent}>
								{ownerDetails[0]["cologne"] || ""}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["square"] || ""}
								</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Entre Calles </Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Entre Calles 2</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Poblaciòn</Text>
							</View>
							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>C.P.</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["between_street_1"] || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["between_street_2"] || ""}{" "}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["town"] || ""}
								</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>
								{ownerDetails[0]["poastal_code"] || ""}
								</Text>
							</View>
						</View>

						<View style={styles.tableRow}></View>

						<View style={styles.tableRow}>
							<View style={styles.tableColTitle}>
								<Text style={styles.tableCell}>Geolocalizaciòn</Text>
							</View>
						</View>

						<View style={styles.tableColImageMap}>
							<Image
								src={getMap(
								ownerDetails[0].longitude,
								ownerDetails[0].latitude
								)}
								style={styles.imageMap}
							/>
						</View>
					
						<View style={styles.tableColCoordinates}>
							<Text style={styles.tableCellCoordinates}>
								{`Longitud: ${ownerDetails[0].longitude}   Latitud: ${ownerDetails[0].latitude}`}
							</Text>
						</View>

					</View>
			
				</View>

				<View style={styles.footer}>
					<Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>www.erpp.mx</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Jaimes Balmes no. 11</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Polanco I Sección</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Miguel Hgo. CDMX</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>C.P. 11510</Text>
				</View>

			</Page>

			<Page size="A4" style={{ ...styles.body, height: "100vh" }} wrap={false}>

				<View
					style={{
						position: "absolute",
						zIndex: 1,
						top: "-5%",
						left: "-10%",
						color: "rgba(255, 255, 255, 0.3)",
						opacity: 0.1,
						filter: "blur(8px)",
					}}
				>
					<Image style={styles.logoWaterMark} src={LogoCheck} />
				</View>

				<View style={styles.header}>
					<Image style={styles.logo} src={LogoErpp} />
					<Image style={styles.logo} src={LogoSer0} />
				</View>
				
				<View style={styles.tableRow}>
					<View style={styles.tableColTitle}>
						<Text style={styles.tableCell}>Imagenes</Text>
					</View>
				</View>

				{ownerHomeImages.length > 0 ? (

					chunkArray(ownerHomeImages, 3).map((imageRow, rowIndex) => (
						
						<React.Fragment key={rowIndex}>
						

						<View style={styles.tableRow}>
							{imageRow.map((image, colIndex) => (
							<View key={colIndex} style={styles.tableColHeaderImages}>
								<Text style={styles.tableCell}>{image.image_type}</Text>
							</View>
							))}
						</View>

						<View style={styles.tableRow}>
							{imageRow.map((image, colIndex) => (
							<View key={colIndex} style={styles.tableColImage}>
								<Image
								style={styles.image}
								src={{
									uri: image.image_url,
									method: "GET",
									headers: { "Cache-Control": "no-cache" },
									body: "",
								}}
								/>
							</View>
							))}
						</View>

						</React.Fragment>

					))

				) : (

					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>{""}</Text>
					</View>
				
				)}

				{sortedOwnerActions.length > 0 ? (

					<>

						<View style={styles.tableRow}>
							<View style={styles.tableColTitle}>
								<Text style={styles.tableCell}>Acciones Realizadas</Text>
							</View>
						</View>

						<View style={styles.tableRow}>

							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Tarea</Text>
							</View>

							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Gestor</Text>
							</View>

							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Fecha de captura</Text>
							</View>

							<View style={styles.tableColHeader}>
								<Text style={styles.tableCell}>Proceso</Text>
							</View>

						</View>

						{sortedOwnerActions.map((actions, index) => (

							<View style={styles.tableRow} key={index}>
								<View style={styles.tableCol}>
									<Text style={{ ...styles.tableCell, color: 'gray' }}>{actions.task_done}</Text>
								</View>
								<View style={styles.tableCol}>
									<Text style={{ ...styles.tableCell, color: 'gray' }}>
										{actions.person_who_capture}
									</Text>
								</View>
								<View style={styles.tableCol}>
									<Text style={{ ...styles.tableCell, color: 'gray' }}>
										{formatDate(actions.date_capture, "full") || ""}
									</Text>
								</View>
								<View style={styles.tableCol}>
									<Text style={styles.tableCell}></Text>
								</View>
							</View>

						))}

						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableCell}>{""}</Text>
						</View>

					</>

				) : (

					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>{""}</Text>
					</View>

				)}

				<View style={styles.footer}>
					<Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>www.erpp.mx</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Jaimes Balmes no. 11</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Polanco I Sección</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Miguel Hgo. CDMX</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>C.P. 11510</Text>
				</View>

			</Page>

			<Page
				size="A4"
				style={{ ...styles.body, minHeight: "100vh" }}
				wrap={false}
			>
				
				<View
					style={{
						position: "absolute",
						zIndex: 1,
						top: "-5%",
						left: "-10%",
						color: "rgba(255, 255, 255, 0.3)",
						opacity: 0.1,
						filter: "blur(8px)",
					}}
				>
					<Image style={styles.logoWaterMark} src={LogoCheck} />
				</View>

				<View style={styles.header}>
					<Image style={styles.logo} src={LogoErpp} />
					<Image style={styles.logo} src={LogoSer0} />
				</View>

				<View style={styles.header}>

					<View style={styles.section}>

						<View style={styles.table}>

							<View style={styles.tableRow}>
								<View style={styles.tableColTitle}>
								<Text style={styles.tableCell}>Pagos</Text>
								</View>
							</View>

							{ownerPayments.length > 0 ? (

							<>
								<View style={styles.tableRow}>
									<View style={styles.tableColHeader}>
									<Text style={styles.tableCell}>Referencia</Text>
									</View>
									<View style={styles.tableColHeader}>
									<Text style={styles.tableCell}>Descripción</Text>
									</View>
									<View style={styles.tableColHeader}>
									<Text style={styles.tableCell}>Fecha de Pago</Text>
									</View>
									<View style={styles.tableColHeader}>
									<Text style={styles.tableCell}>Monto a pagar</Text>
									</View>
								</View>

								{ownerPayments.map((payments, index) => (

									<View style={styles.tableRow} key={index}>

										<View style={styles.tableCol}>
											<Text style={styles.tableCell}>
												{payments.reference || ""}
											</Text>
										</View>

										<View style={styles.tableCol}>
											<Text style={styles.tableCell}>
												{payments.description || ""}
											</Text>
										</View>

										<View style={styles.tableCol}>
											<Text style={styles.tableCell}>
												{formatDate(payments.payment_date, "full") || ""}
											</Text>
										</View>

										<View style={styles.tableCol}>
											<Text style={styles.tableCell}>
												{formatCurrency(payments.amount_paid) || ""}
											</Text>
										</View>
										
									</View>

								))}

								<View style={styles.tableRow}>

									<View style={styles.tableCol}>
										<Text style={styles.tableCell}></Text>
									</View>

									<View style={styles.tableCol}>
										<Text style={styles.tableCell}></Text>
									</View>

									<View style={styles.tableCol}>
										<Text style={styles.tableCell}>Total</Text>
									</View>

									<View style={styles.tableCol}>
										<Text style={styles.tableCell}>
											{totalPayments(ownerPayments) || ""}
										</Text>
									</View>

								</View>

							</>

						) : (

							<View style={styles.tableRow}>
								<Text style={styles.tableCell}>
									No hay pagos registrados.
								</Text>
							</View>

						)}

						</View>

					</View>
					
				</View>

				<View style={styles.footer}>
					<Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>www.erpp.mx</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Jaimes Balmes no. 11</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Polanco I Sección</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>Miguel Hgo. CDMX</Text>
					<Text style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}>C.P. 11510</Text>
				</View>

			</Page>

		</Document>

	)

}

Pdf.propTypes = {
	ownerDetails: PropTypes.func.isRequired,
	ownerHomeImages: PropTypes.func.isRequired,
	ownerPayments: PropTypes.func.isRequired,
	ownerActions: PropTypes.func.isRequired,
}

export default Pdf
