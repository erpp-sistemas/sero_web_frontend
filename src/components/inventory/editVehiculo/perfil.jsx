import { Box, Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import { useSelector } from 'react-redux'
import QrCodeIcon from '@mui/icons-material/QrCode'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setEditar, setQr } from '../../../redux/vehiculosSlices/editarVehiculoSlice.js'

const Perfil = () => {
	const editarInformacionGeneral = useSelector(state => state.editarInformacionGeneral)
	const editarVehiculo = useSelector(state => state.editarVehiculo)
	const dispatch = useDispatch()

	return(

		<Box sx={{ width:{ xs:'80%', md:'20%' }, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'2rem' }}>

			{	
				!editarVehiculo.qr ? 

					<Box sx={{ width:'200px', height:'200px', border:'1px solid grey', borderRadius:'10px', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center' }}>
						<img src={editarInformacionGeneral.editImagePreview} alt="" width={'100%'} height={'100%'} />
					</Box>

				: 
					<Box sx={{ width:'200px', height:'200px', border:'1px solid grey', borderRadius:'10px', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center' }}>
						<img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png" alt="" width={'100%'} height={'100%'} />
					</Box>

			}

			<Box sx={{ width:'100%', display:'flex', justifyContent:'center', alignItems:'center', gap:'1rem', mt:{ xs:'0px', md:'10px' }, mb:{ xs:'30px', mb:'0px' }, flexWrap:'wrap' }}>
				
				<Button 
					variant="outlined"                             
					color="secondary"
					sx={{ 
						width:{ xs:'100%', md:'45%' }, 
						background: editarVehiculo.editar ? 'rgba(255,255,255,0.2)' : false ,
						padding:'5px 30px', 
						margin:'0', 
						minWidth:'0', 
						borderRadius:'7px' 
					}}
					onClick={() => dispatch(setEditar(!editarVehiculo.editar))}
				>
					<EditIcon sx={{ fontSize:'30px' }} />
				</Button>

				<Button 	
					variant="outlined"                             
					color="secondary"
					sx={{ 
						width:{ xs:'100%', md:'45%' }, 
						padding:'5px 30px', 
						margin:'0', 
						minWidth:'0', 
						borderRadius:'7px',
						background: editarVehiculo.qr ? 'rgba(255,255,255,0.2)' : false
					}}
					onClick={ ()=> dispatch(setQr(!editarVehiculo.qr)) }
				>
					<QrCodeIcon sx={{ fontSize:'30px' }} />
				</Button>

				<Button 
					variant="outlined"                             
					color="secondary"
					sx={{ 
						width:{ xs:'100%', md:'45%' }, 
						padding:'5px 30px', 
						margin:'0', 
						minWidth:'0', 
						borderRadius:'7px' 
					}}
				>
					<LocalPrintshopIcon sx={{ fontSize:'30px' }} />
				</Button>

			</Box>

		</Box>

	)

}

Perfil.propTypes = {
	setEditar: PropTypes.func.isRequired,
	editar: PropTypes.bool.isRequired,
}

export default Perfil