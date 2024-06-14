import { Box } from '@mui/material'
import Header from "../../components/Header"
import TaskCrud from '../../components/TaskCrud'

function Task() {

	return (
		
		<Box m="20px">
		
			<Header title="Gestiòn de Tareas" subtitle="Operaciones de Crear, Leer, Actualizar y Eliminar Tareas en el Sistema" />

			<TaskCrud/>
			
		</Box>

	)

}

export default Task