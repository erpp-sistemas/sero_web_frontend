import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import functionsCustom from "../../../../../helpers"
import useCombinedSlices from "../../../../../hooks/useCombinedSlices"

function PaymentsSections() {
	
	const { payments } = useCombinedSlices()

	const buildColumns = ()=>{

		const columns = [

		{
			field: "reference",
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>
				{"Referencia "}
			</strong>
			),
			width: 100,
			editable: true,
		},
		{
			field: "description",
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>
				{"Descripciòn"}
			</strong>
			),
			width: 300,
			editable: true,
			valueGetter: ({ value }) => {
			switch (value) {
				case "DERECHOS DE AGUA POTABLE REZAGO":
				return `💦 ${value}`;
				default:
				return value;
			}
			},
		},{
			field: "payment_period",
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>
				{"Periodo de Pago "}
			</strong>
			),
			width: 150,
			editable: true,
		
		},{
			field: "payment_date",
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>
				{"Fecha de Pago"}
			</strong>
			),
			width: 150,
			editable: true,
			type: "dateTime",
			valueGetter: ({ value }) => {
			return new Date(value);
			},
		},
		{
			field: "amount_paid",
			renderHeader: () => (
			<strong style={{ color: "#5EBFFF" }}>
				{"Pago "}
			</strong>
			),
			width: 150,
			editable: true,
			type: "string",
			valueGetter: ({ value }) => {
			return value
				? `$ ${functionsCustom.formatNumberWithCommas(value)}`
				: `$ 00.00`;
			},

		}]

		return columns

	}

	const buildRows = ()=>{
		const rows = []

		payments?.forEach((debtObject, index) => {
			const allUndefined = Object.values(debtObject).every(
			(value) => value === undefined
		)
	
			if (debtObject && !allUndefined) {
				debtObject = { ...debtObject, id: index + 1 }
				rows.push(debtObject)
			}

		})

		return rows

	}

	function CustomToolbar() {

		return (

			<GridToolbarContainer>
				<GridToolbarColumnsButton color="secondary" />
				<GridToolbarFilterButton color="secondary" />
				<GridToolbarDensitySelector color="secondary" />
				<GridToolbarExport color="secondary" />
			</GridToolbarContainer>

		)

	}

	return (
		<Box
			sx={{
				height: 300,
				width: "100%",
				"& .cold": {
				color: "red",
				},
				"& .payment": {
				color: "#17E85D",
				},
				"& .secondLetter": {
				color: "#ff9900",
				},
				"& .thirdLetter": {
				color: "#33cc33",
				},
				"& .fourthLetter": {
				color: "#ff0000",
				},
			}}
		>

		<DataGrid
			slots={{ toolbar: CustomToolbar}}
			localeText={{
			toolbarColumns: "Columnas",
			toolbarFilters: "Filtros",
			toolbarDensity: "Tamaño Celda",
			toolbarExport: "Exportar",
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
			pageSizeOptions={[5,10,30,50]}
			checkboxSelection
			disableRowSelectionOnClick
			getCellClassName={(params) => {
			if (
				params.value &&
				typeof params.value === "string" &&
				params.value.includes("$")
			) {
				return "payment";
			}
			}}
		/>

		</Box>
		
	)

}

export default PaymentsSections
