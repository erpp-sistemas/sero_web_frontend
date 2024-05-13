import { Box } from '@mui/material'
import Header from '../../components/Header'
import ProcessCrud from '../../components/ProcessCrud'

function Process() {

	return (

		<Box m="20px">

			<Header title="Gestiòn de Procesos" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Procesos en el Sistema" />
			
			<ProcessCrud/>

		</Box>

	)
	
}

export default Process