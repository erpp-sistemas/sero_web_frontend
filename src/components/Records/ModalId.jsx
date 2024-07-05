import { Box, Typography, Button } from '@mui/material'
import { setModal } from '../../redux/recordsSlice.js'
import { useDispatch } from 'react-redux'

export default function ModalId() {

	const dispatch = useDispatch()

	const redirect = () => {
		dispatch(setModal(false))
		window.location.href = '/impresion'
	}

	return (

		<Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>
			<Box sx={{ maxWidth:'90%', padding:'40px', height:'20rem', background:'#ffffffe2', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', gap:'1rem', borderRadius:'10px' }}>
				<Typography sx={{ color:'#141B2D', textAlign:'center', fontSize:'1.8rem' }} >La carga de los datos fue existosa</Typography>
				<Typography sx={{ color:'#141B2D', textAlign:'center', fontSize:'1rem' }}>Tu paquete ha sido creado con exito</Typography>
				<Button onClick={() => redirect()} variant="contained" color="success" sx={{ textAlign:'center', color:'white', mt:'1rem' }}>Continuar</Button>
			</Box>
		</Box>

	)

}
