import { Box } from '@mui/material'
import Header from '../../components/Header'
import PlacesModule from '../../components/PlacesModule'

function Places() {

	return (

		<Box m="20px">

			<Header title="Gestiòn de Plazas" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Plazas en el Sistema" />

			<PlacesModule/>
			
		</Box>

	)
	
}

export default Places