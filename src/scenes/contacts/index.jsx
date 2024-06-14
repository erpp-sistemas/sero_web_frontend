import { Box } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../theme"
import Header from "../../components/Header"
import { useTheme } from "@mui/material"

const Contacts = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const columns = [
		{ field: "id", headerName: "ID", flex: 0.5 },
		{ field: "registrarId", headerName: "Registrar ID" },
		{
			field: "name",
			headerName: "Nombre",
			flex: 1,
			cellClassName: "name-column--cell",
		},
		{
			field: "age",
			headerName: "Edad",
			type: "number",
			headerAlign: "left",
			align: "left",
		},
		{
			field: "phone",
			headerName: "Teléfono celular",
			flex: 1,
		},
		{
			field: "email",
			headerName: "Email",
			flex: 1,
		},
		{
			field: "address",
			headerName: "Dirección",
			flex: 1,
		},
		{
			field: "city",
			headerName: "Ciudad",
			flex: 1,
		},
		{
			field: "zipCode",
			headerName: "Código postal",
			flex: 1,
		},
	]

	return (

		<Box m="20px">
			<Header
				title="CONTACTOS"
				subtitle="Lista de referencia de contactos"
			/>
			<Box
				m="40px 0 0 0"
				height="75vh"
				sx={{
				"& .MuiDataGrid-root": {
					border: "none",
				},
				"& .MuiDataGrid-cell": {
					borderBottom: "none",
				},
				"& .name-column--cell": {
					color: colors.greenAccent[300],
				},
				"& .MuiDataGrid-columnHeaders": {
					backgroundColor: colors.blueAccent[700],
					borderBottom: "none",
				},
				"& .MuiDataGrid-virtualScroller": {
					backgroundColor: colors.primary[400],
				},
				"& .MuiDataGrid-footerContainer": {
					borderTop: "none",
					backgroundColor: colors.blueAccent[700],
				},
				"& .MuiCheckbox-root": {
					color: `${colors.greenAccent[200]} !important`,
				},
				"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
					color: `${colors.grey[100]} !important`,
				},
				}}
			>
				<DataGrid
				// eslint-disable-next-line no-undef
				rows={mockDataContacts}
				columns={columns}
				components={{ Toolbar: GridToolbar }}
				/>
			</Box>
		</Box>

	)

}

export default Contacts

