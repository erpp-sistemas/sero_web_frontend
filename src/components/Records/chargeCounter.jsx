import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

export default function ChargeCounter(props) {

	return (

		<Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>

			<Box sx={{ width: '100px', mb: '2rem', display: 'flex', alignItems: 'center', flexDirection:'row', justifyContent:'center', gap:'1rem' }}>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
			</Box>

			<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection:'column', justifyContent:'center' }}>
				<Typography variant="body2" color="text.secondary" sx={{ color: "#fff", fontWeight: '700', fontSize: '2rem' }}>{`Creando ficha numero: ${Math.round(props?.value,)}`}</Typography>
			</Box>

		</Box>

	)

}

ChargeCounter.propTypes = {
	value: PropTypes.number.isRequired,
}