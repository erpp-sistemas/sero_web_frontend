import { Box, Typography } from "@mui/material"
import PropTypes from "prop-types"

const AsignacionTerminada = ({ incidencia, setIncidencia }) => {

	console.log(setIncidencia)

	return (

		<Box sx={{ width:'100%', height:'auto' }}>

			<Box sx={{  width:'100%', height:'auto' }}>

				<Typography sx={{ fontSize:'20px', fontWeight:'700' }} >Asignacion terminada</Typography>

				<Box sx={{ mt:'30px' }}>
					<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Asignado por:</span> Antonio Ticante</Typography>
					<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Asignado a:</span> Iván Sánchez</Typography>
					<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Tarea Realizada:</span> Ruta en campo</Typography>
					<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Fecha y hora de asignacion:</span> 12/08/2024 11:12:40</Typography>
					<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Fecha y hora de entrega:</span> 12/08/2024 18:30:10</Typography>
				</Box>

				<Box sx={{ mt:'20px' }}>
					<Typography sx={{ fontSize:'20px', fontWeight:'700' }}>Accidente / Incidencia</Typography>
				</Box>

				{ 
					incidencia ? 

					<Box sx={{ width:'100%', height:'auto', }}>

						<Typography sx={{ fontSize:'20px', mt:'20px' }}>Comenzo a tirar aceite a mitad de viaje del clutch</Typography>

						<Box sx={{ width:'100%', height:'300px', border:'1px solid white', borderRadius:'5px', mt:'20px', padding:'15px', display:'flex', justifyContent:'start', alignItems:'start', flexWrap:'wrap', gap:'15px', overflowX:'hidden' }}>
							<Box sx={{ width:'150px', height:'150px', background:'white', borderRadius:'5px', overflow:'hidden' }}>
								<img src="" alt="" style={{ width: '100%', height: '100%' }} />
							</Box>
						</Box>

					</Box> 

					: 
					
					<Box sx={{ width:'100%', height:'auto' }}>
						<Typography sx={{ fontSize:'20px', mt:'20px' }}>Viaje completado sin incidencias</Typography>
					</Box> 

				}
		
			</Box>

		</Box> 
		
	) 

}

AsignacionTerminada.propTypes = {
	incidencia: PropTypes.bool.isRequired,
	setIncidencia: PropTypes.func.isRequired,
}

export default AsignacionTerminada