import { Box, Typography } from "@mui/material"
import PropTypes from "prop-types"

export default function PreviewsInfo ({ seleccionFormato }) {

	return (

		<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', alingItems:'center', flexWrap:'wrap', gap:'0px', mt:'30px' }}>
						
			<Box sx={{ width:'50%', minWidth:'300px' }}>

				<Box sx={{ display:'flex', justifyContent:'start', alingItems:'start', flexDirection:'column', gap:'5px' }}>
					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
						<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Cuenta: </Typography>
						<Typography sx={{ fontSize:'20px', color:'white' }}>{ seleccionFormato != null ? seleccionFormato.cuentas : false }</Typography>
					</Box>
				</Box>

				<Box sx={{ display:'flex', justifyContent:'start', alingItems:'start', flexDirection:'column', gap:'5px' }}>
					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
						<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Bimestre y año inicial: </Typography>
						<Typography sx={{ fontSize:'20px', color:'white' }}>{ seleccionFormato != null ? seleccionFormato.bimestre_incio + ' - ' + seleccionFormato.año_inicio  : false }</Typography>
					</Box>
				</Box>

				<Box sx={{ display:'flex', justifyContent:'start', alingItems:'start', flexDirection:'column', gap:'5px' }}>
					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
						<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Bimestre y año final: </Typography>
						<Typography sx={{ fontSize:'20px', color:'white' }}>{ seleccionFormato != null ? seleccionFormato.bimestre_final + ' - ' + seleccionFormato.año_final : false }</Typography>
					</Box>
				</Box>

			</Box>

			<Box sx={{ width:'50%', minWidth:'300px' }}>

				<Box sx={{ display:'flex', justifyContent:'start', alingItems:'start', flexDirection:'column', gap:'5px' }}>
					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
						<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Expediente: </Typography>
						<Typography sx={{ fontSize:'20px', color:'white' }}>{ seleccionFormato != null ? seleccionFormato.folio : false }</Typography>
					</Box>
				</Box>

				<Box sx={{ display:'flex', justifyContent:'start', alingItems:'start', flexDirection:'column', gap:'5px' }}>
					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
						<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Notificacion: </Typography>
						<Typography sx={{ fontSize:'20px', color:'white' }}>{ seleccionFormato != null ? seleccionFormato.notificacion : false }</Typography>
					</Box>
				</Box>

			</Box>

			<Box sx={{ width:'100%', mt:'20px' }}>
				<Box sx={{ display:'flex', justifyContent:'start', alingItems:'start', flexDirection:'column', gap:'5px' }}>
					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', gap:'10px', alingItems:'center' }}>
						<Typography sx={{ fontSize:'20px', fontWeight:'600' }}>Dirección: </Typography>
						<Typography sx={{ fontSize:'20px', color:'white' }}>{ seleccionFormato != null ? seleccionFormato.domicilio : false }</Typography>
					</Box>
				</Box>
			</Box>

		</Box>

	) 

}


PreviewsInfo.propTypes = {
    seleccionFormato: PropTypes.object,
}