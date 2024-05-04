import { Box } from '@mui/material'

export default function Preview() {

	return (

		<Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>
			<Box sx={{ maxWidth:'90%', padding:'40px', height:'20rem', background:'#ffffffe2', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', gap:'1rem', borderRadius:'10px' }}>
			</Box>
		</Box>

	)

}
 