import { Box } from "@mui/material"
import { useState } from "react"
import EstadoActual from "./estadoActual.jsx"
import AsignacionTerminada from "./asignacionTerminada.jsx"
import Vacia from "./vacia.jsx"
import Historial from "./historial.jsx"
import BotonAsignar from "./botonAsignar.jsx"
import InformacionPrincipal from "./informacionPrincipal.jsx"
import AsignacionCurso from "./asignacionCurso.jsx"

const Content = () => {
	const [asignar, setAsignar] = useState(false)
	const [active, setActive] = useState(true)
	const [selection, setSelection] = useState(false)
	const [ tipo ] = useState(false)
	const [incidencia, setIncidencia] = useState(false)

	return(

		<Box sx={{ width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'start', flexWrap:'wrap' }}>
	
			<Historial  
				asignar={asignar}
				setAsignar={setAsignar}
				selection={selection}
				setSelection={setSelection}
				active={active}
				setActive={setActive}
			/>

			<Box sx={{ width:{ xs:'100%', md:'69%' }, height:'auto', mb:'40px', padding:'20px' }} >

				{
					asignar ? 

						<>

							<BotonAsignar />

							<InformacionPrincipal />

							<EstadoActual />
							
						</>

					: selection ? 

						!tipo ? 

							<AsignacionTerminada 
								incidencia={incidencia}
								setIncidencia={setIncidencia}
							/>

						: 
							<AsignacionCurso />

					: 

					<Vacia />

				}

			</Box>

		</Box>

	)

}

export default Content