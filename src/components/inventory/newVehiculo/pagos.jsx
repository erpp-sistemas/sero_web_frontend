import { Box, Typography, Button } from "@mui/material"
import PropTypes from 'prop-types'

const Pagos = ({ setNext }) => {

	return (

		<Box sx={{ width:'100%', height:'auto' }}>

			<Typography>Pagos</Typography>

			<Button sx={{ fontSize:'20px', color:'white' }} onClick={() => setNext('estado')}>{'<'}</Button>
			<Typography sx={{ fontSize:'20px', color:'white' }}>Pagos</Typography>

		</Box>

	)

}

Pagos.propTypes = {
	setNext: PropTypes.func.isRequired,
}

export default Pagos