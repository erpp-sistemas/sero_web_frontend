import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export default function charge() {

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

	return (

		<Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>

			<Box sx={{ width: '100px', mb: '2rem', display: 'flex', alignItems: 'center', flexDirection:'row', justifyContent:'center', gap:'1rem' }}>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
			</Box>

			<Box sx={{ width: '80%', mt: '2rem', display: 'flex', alignItems: 'center', flexDirection:'row', justifyContent:'center', gap:'1rem', background: isLightMode ? '#ffffff' :'rgba(0, 0, 0, 0.8)', borderRadius:'10px' }}>
				<Typography sx={{ fontSize: '2rem',}}>Esta actividad puede tardar varios minutos, no recargar, ni cerrar la pestaña</Typography>
			</Box>

		</Box>

	)

}