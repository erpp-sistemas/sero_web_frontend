import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types"

export default function InformacionPrincipal ({ seleccion }) {

	return(

		<Box sx={{ display:'flex', justifyContent:'center', alingItems:'center', flexDirection:'column', gap:'5px', m:'20px 0px' }}>
			<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
				<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Cuenta: </Typography>
				<Typography sx={{ fontSize:'20px' }}>{seleccion ? seleccion.cuenta : 'No seleccionado'}</Typography>
			</Box>

			<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
				<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Clave Catastral: </Typography>
				<Typography sx={{ fontSize:'20px' }}>{seleccion ? seleccion.clave_catastral : 'No seleccionado'}</Typography>
			</Box>

			<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
				<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Propietario: </Typography>
				<Typography sx={{ fontSize:'20px' }}>{seleccion ? seleccion.propietario : 'No seleccionado'}</Typography>
			</Box>
		</Box>

	)

}

InformacionPrincipal.propTypes = {	
    seleccion: PropTypes.shape({
        cuenta: PropTypes.string,
		clave_catastral: PropTypes.string,
		propietario: PropTypes.string
    })
}