import { Box } from '@mui/material'
import Header from '../../components/Header'
import RolCrud from '../../components/RolCrud'

function Roles() {

	return (

		<Box m="20px">

			<Header title="Gestiòn de Roles" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Roles en el Sistema" />

			<RolCrud/>

		</Box>

	)
	
}

export default Roles