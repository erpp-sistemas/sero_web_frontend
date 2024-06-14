import { Box, Typography, Button } from '@mui/material'
import tool from '../../toolkit/toolkitImpression.js'
import PropTypes from 'prop-types'

export default function ModalDelete({ id, setOpenDelete }) {

	const deletePaquete = async () => {
		const respuesta = await tool.deleteRecords(id)
		if(respuesta===200){
			window.location.reload()
		}else{
			console.error('Hubo un fallo con la eliminacion del paquete')
		}
	}

	return (

		<Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>
			<Box sx={{ maxWidth:'90%', padding:'40px', height:'20rem', background:'#ffffffe2', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', gap:'1rem', borderRadius:'10px' }}>
				<Typography sx={{ color:'#141B2D', textAlign:'center', fontSize:'1.8rem' }} >¿Estas seguro de querer eliminar este paquete?</Typography>
				<Box sx={{  display: 'flex', alignItems: 'center', justifyContent:'center', gap:'10px'}}>
					<Button onClick={() => deletePaquete()} variant="contained" color="success" sx={{ textAlign:'center', color:'white', mt:'1rem' }}>Confirmar</Button>
					<Button onClick={() => setOpenDelete(false)} variant="contained" color="error" sx={{ textAlign:'center', color:'white', mt:'1rem' }}>Cancelar</Button>
				</Box>
			</Box>
		</Box>

	)

}

ModalDelete.propTypes = {
	id: PropTypes.number.isRequired,
	setOpenDelete: PropTypes.func.isRequired,
}
 