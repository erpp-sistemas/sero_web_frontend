import { Box } from "@mui/material"
import Header from "../../components/Header"
import PieChart from "../../components/PieChart"
import SelectFormPregunta from '../../components/MaterialUI/SelectFormPreguntaEncuesta'

const Pie = ( data, preguntas, handlePregunta, idPreguntaSeleccionada, tipo) => {

	return (

		<Box m="20px">

			<Header title="Pie Chart" subtitle={data[0]?.pregunta} />

			<SelectFormPregunta
				data={[preguntas]}
				handleChange={handlePregunta}
				itemSeleccionado={idPreguntaSeleccionada}
			/>

			<Box height="90vh">
				<PieChart dataSQL={data} tipo={tipo} />
			</Box>

		</Box>

	)

}

export default Pie
