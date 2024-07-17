import { Box, Typography, Button } from "@mui/material"
import PropTypes from 'prop-types'

const NewVehiculo = ({ setOpenNew }) => {

	return (

		<Box 
			sx={{
				width:'100%',
				position:'fixed',
				top:'0',
				left:'0',
				display:'flex',
				justifyContent:'center',
				alignItems:'center',
				height:'100vh',
				background:'rgba(0,0,0,0.3)',
				zIndex:'9999'
			}}
		>
			<Box sx={{}}>
				<Button
					onClick={() => setOpenNew(false)}
					sx={{ color:'white' }}
				>
					X
				</Button>
				<Typography>Agregar un nuevo vehículo</Typography>
			</Box>
		</Box>

	)

}

NewVehiculo.propTypes = {
	setOpenNew: PropTypes.func.isRequired, 
	openNew: PropTypes.bool.isRequired, 
}

export default NewVehiculo
