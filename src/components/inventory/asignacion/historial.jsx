import { Box, Typography, Button, Card , CardContent} from "@mui/material"
import PropTypes from "prop-types"

const Historial = ({ asignar, setAsignar, selection, setSelection, active, setActive }) => {

	console.log(setActive)

	return (

		<Box sx={{ width:{ xs:'100%', md:'30%' }, height:{ xs:'390px', md:'auto' }, overflow:'hidden' }}>
				
			<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0px 10px' }}>
				<Typography sx={{ width:'auto', textAlign:'start', fontSize:'24px', fontWeight:'500', padding:'0px 20px' }}>Historial</Typography>

				{
					active ? 
						<Button 
							sx={{ fontSize:'12px', padding:'5px 20px' }} 
							variant="outlined" 
							color={ !asignar ? 'success' : 'error' } 
							onClick={() => { selection ? (setSelection(false), setAsignar(!asignar)) : setAsignar(!asignar) }} 
						>
							{ asignar ? "CANCELAR" : "ASIGNAR" }	
						</Button> 
					: false
				}
			
			</Box>

			<Box sx={{ width:'100%', height:'90%', overflowX:'hidden', overflowY:'scroll', mt:'10px', display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column', margin:'10px 0px', padding:'0', maxHeight:'500px' }}>
				
				<Card onClick={() => { asignar ? setSelection(true) : setSelection(!selection), setAsignar(false) }} sx={{ width:'98%', height:'auto', minWidth:'98%', minHeight:'200px', borderRadius:'10px', mt:'20px', padding:'15px', cursor:'pointer' }}>
					<CardContent>
						<Typography color="text.secondary" sx={{ mb:'5px', fontSize:{ xs:'18px', md:'20px' } }}>Fecha de asignación: 02-08-2024</Typography>
						<Typography color="text.secondary" sx={{ mb:'5px', fontSize:{ xs:'18px', md:'20px' } }}>Encargado: Antonio Ticante</Typography>
						<Typography color="text.secondary" sx={{ mb:'5px', fontSize:{ xs:'18px', md:'20px' } }}>Asignado: Iván Sánchez</Typography>
						<Typography color="text.secondary" sx={{ mb:'5px', fontSize:{ xs:'18px', md:'20px' } }}>Tarea: Ruta en campo</Typography>
						<Typography color="text.secondary" sx={{ mb:'5px', fontSize:{ xs:'18px', md:'20px' } }}>Estatus: Terminado</Typography>
					</CardContent>
				</Card>

			</Box>

		</Box>

	)

}

Historial.propTypes = {
	asignar: PropTypes.bool.isRequired,
	setAsignar: PropTypes.func.isRequired,
	selection: PropTypes.bool.isRequired,
	setSelection: PropTypes.func.isRequired,
	active: PropTypes.bool.isRequired,
	setActive: PropTypes.func.isRequired,
}

export default Historial