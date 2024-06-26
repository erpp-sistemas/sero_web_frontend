import { Box, Typography, useTheme } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { tokens } from "../../theme"
import Header from "../../components/Header"

const Invoices = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const columns = [
		{ field: "id", headerName: "ID" },
		{
			field: "name",
			headerName: "Nombre",
			flex: 1,
			cellClassName: "name-column--cell",
		},
		{
			field: "phone",
			headerName: "Numero teléfonico",
			flex: 1,
		},
		{
			field: "email",
			headerName: "Email",
			flex: 1,
		},
		{
			field: "cost",
			headerName: "Usuarios contactados",
			flex: 1,
			renderCell: (params) => (
				<Typography color={colors.greenAccent[500]}>
				{params.row.cost}
				</Typography>
			),
		},
		{
			field: "date",
			headerName: "fecha",
			flex: 1,
		},
	]

	const mockDataInvoices = [
		{ id: 1, name: "John Doe", phone: "123456789", email: "john@example.com", cost: 100, date: "2022-05-01" },
		{ id: 2, name: "Jane Smith", phone: "987654321", email: "jane@example.com", cost: 150, date: "2022-05-02" },
	]

	return (

		<Box m="20px">

			<Header title="BALANCE" subtitle="Lista de balance por gestor" />
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
				}}
			>
				<DataGrid checkboxSelection rows={mockDataInvoices} columns={columns} />
			</Box>

		</Box>

	)
  
}

export default Invoices
