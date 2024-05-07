import { Box } from '@mui/material'

export default function charge() {

	return (

		<Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>

			<Box sx={{ width: '100px', mb: '2rem', display: 'flex', alignItems: 'center', flexDirection:'row', justifyContent:'center', gap:'1rem' }}>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
				<div className='charge_bar'></div>
			</Box>

		</Box>

	)

}