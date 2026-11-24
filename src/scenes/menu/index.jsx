import { Alert, Box } from '@mui/material'
import Header from '../../components/Header'
import MenuCrud from '../../components/MenuCrud'

// S02-H2.6: solo consulta. Los menús y submenús se dan de alta por migración (decisión 6) y un submenú nuevo no
// aparece en el menú lateral hasta tener su recurso y permisos (Roles y permisos).
function Menu() {

	return (

		<Box m="20px">

			<Header title="Menús del sistema" subtitle="Consulta de menús y submenús (solo lectura)" />

			<Alert severity="info" sx={{ mb: 2 }}>
				Esta pantalla es solo de consulta. Los menús nuevos se dan de alta por migración, y un submenú nuevo no aparece
				en el menú lateral hasta tener su pantalla en <a href="/roles-y-permisos">Roles y permisos</a> con sus permisos.
			</Alert>

			<MenuCrud/>

		</Box>

	)

}

export default Menu
