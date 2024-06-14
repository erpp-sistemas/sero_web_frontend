import { Box } from '@mui/material'
import Header from '../../components/Header'
import MenuCrud from '../../components/MenuCrud'

function Menu() {

	return (
		
		<Box m="20px">

			<Header title="Gestiòn de Menus" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Menus en el Sistema" />

			<MenuCrud/>

		</Box>

	)

}

export default Menu