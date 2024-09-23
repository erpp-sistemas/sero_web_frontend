import { Box, Button } from "@mui/material"
import PropTypes from 'prop-types'

export default function Buttons({ setAction, action }) {

	return(

		<Box sx={{ width:'100%', height:'auto', m:'20px 0px', display:'flex', justifyContent:'center', alignItems:'center', gap:'30px' }}>

			<Button
				sx={{
					m:'0px',
					color:'white',
					fontSize:'12px',
					background:action === 'formatos' ? '#00ff00' : 'rgba(255,255,255,0.3)',
					borderRadius:'50px',
					p:'5px 25px'
				}}
				onClick={() => setAction('formatos')}
			>
				Formatos
			</Button>

			<Button
				sx={{
					m:'0px',
					p:'5px 25px',
					color:'white',
					fontSize:'12px',
					borderRadius:'50px',
					background:action === 'catastro' ? '#00ff00' : 'rgba(255,255,255,0.3)',
				}}
				onClick={() => setAction('catastro')}
			>
				Actualizar Listado de Catastro
			</Button>

		</Box>

	)

}

Buttons.propTypes = {
	setAction: PropTypes.func.isRequired,
	action: PropTypes.string.isRequired,
}