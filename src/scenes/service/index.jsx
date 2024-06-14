import { Box } from '@mui/material'
import Header from '../../components/Header'
import ServiceCrud from '../../components/ServiceCrud'

function Service() {

	return (

		<Box m="20px">

			<Header title="Gestiòn de Servicios" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Servicios en el Sistema" />

			<ServiceCrud/>

		</Box>

	)
	
}

export default Service