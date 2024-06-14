import { Box } from '@mui/material'
import Header from '../../components/Header'
import PermissionModule from '../../components/PermissionModule'

function Permission() {

	return (

		<Box m="20px">

			<Header title="Gestiòn de Permisos" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Permisos en el Sistema" />

			<PermissionModule/>
			
		</Box>

	)

}

export default Permission