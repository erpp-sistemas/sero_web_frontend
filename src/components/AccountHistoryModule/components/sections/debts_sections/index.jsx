import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import functionsCustom from "../../../../../helpers"
import useCombinedSlices from "../../../../../hooks/useCombinedSlices"

function DebtsSections() {

	const { debts } = useCombinedSlices()

	const buildColumns = () => {
		const columns =[
		{
			field: "debt_amount",
			renderHeader: () => (
			<strong style={{color:"#5EBFFF"}}>
				{"Deuda "}
			</strong>
			),
			width: 150,
			editable: true,
			type:'string',
			valueGetter:({ value }) => {
			return value
			? `$ ${functionsCustom.formatNumberWithCommas(value)}`
			: `$ 00.00`;
			}

		},
		{
			field: "last_payment_date",
			renderHeader: () => (
			<strong style={{color:"#5EBFFF"}}>
				{"Fecha Ultimo Pago "}
			</strong>
			),
			width: 150,
			editable: true,
			type:'dateTime',
			valueGetter:({ value }) => {
			return new Date(value)
			}
		
		},
		{
			field: "update_date",
			renderHeader: () => (
			<strong style={{color:"#5EBFFF"}}>
				{"Fecha Actualizaciòn "}
			</strong>
			),
			width: 150,
			editable: true,
			type:'dateTime',
			valueGetter:({ value }) => {
			return new Date(value)
			}
		},
		
		{
			field: "cutoff_date",
			renderHeader: () => (
			<strong style={{color:"#5EBFFF"}}>
				{"Fecha de Corte "}
			</strong>
			),
			width: 150,
			editable: true,
			type:'dateTime',
			valueGetter:({ value }) => {
			return new Date(value)
			}
		},
		{
			field: "last_two_month_payment",
			renderHeader: () => (
			<strong style={{color:"#5EBFFF"}}>
				{"Pago Ultimo Bimestre"}
			</strong>
			),
			width: 150,
			editable: true,
			type:'string',
			valueGetter:({ value }) => {
			return value?`$ ${value}.00`:`$ 00.00`
			}
		},]

		return columns

	}

	const buildRows = () => {
		const rows = []

		debts?.forEach((debtObject, index) => {
			const allUndefined = Object.values(debtObject).every(value => value === undefined);
			
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
				<GridToolbarFilterButton color="secondary"/>
				<GridToolbarDensitySelector color="secondary"/>
				<GridToolbarExport color="secondary"/>
			</GridToolbarContainer>

		)

	}
	

	return (
		
		<Box  sx={{
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
		}}>
		
		<DataGrid
			slots={{ toolbar: CustomToolbar }}
			localeText={{
			toolbarColumns: "Columnas",
			toolbarFilters: "Filtros",
			toolbarDensity: "Tamaño Celda",
			toolbarExport: "Exportar"
			}}
			color
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

export default DebtsSections
