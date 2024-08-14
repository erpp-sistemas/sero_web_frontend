import { Box, Typography } from "@mui/material"
import EstadoTop from "./estadoTop"
import EstadoDown from "./estadoDown"

const Estado = () => {


	return (

		<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column' }}>
			
			<Typography sx={{ marginTop:{ xs:'30px', md:'10px' }, color:'rgb(207, 249, 224)', width:'100%', textAlign:'start' }}>Selecciona cada punto del vehiculo que tenga un detalle y al finalizar especifica en observaciones el detalle</Typography>
			
			<EstadoTop />

			<EstadoDown />

		</Box>

	)

}

export default Estado