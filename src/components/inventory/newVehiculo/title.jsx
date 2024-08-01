import { Box, Typography, Button } from "@mui/material"
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { setKilometraje, setSelectedPlace, setImage, setModelo, setPlaca, setVehiculo, setMarca, setSerie, setColor, setColorLlavero, setTipoMotor, setImagePreview } from "../../../redux/vehiculosSlices/informacionGeneralSlice.js"
import { setFactura, setFrente, setGarantia, setLadoDerecho, setLadoIzquierdo, setNombreFactura, setNombreGarantia, setNombreSeguro, setNombreTarjetaCirculacion, setPreviewFrente, setPreviewLadoDerecho, setPreviewLadoIzquierdo, setPreviewTrasera, setSeguro, setTarjetaCirculacion, setTrasera } from '../../../redux/vehiculosSlices/documentosSlice.js'
import { setCombustible, setBateria, setNeumaticos, setFugaAceite, setFugaCombustible, setFugaAceiteMotor, setDireccionalesDelanteras, setDireccionalesTraseras, setLucesTablero, setLuzFreno, setLlantaDelantera, setLlantaTrasera, setDeformacionesLlanta, setEncendido, setTensionCadena, setFrenoDelantero, setFrenoTrasero, setAmortiguadores, setDireccion, setSilla, setEspejos, setVelocimetro, setClaxon, setPalancas, setObservaciones } from "../../../redux/vehiculosSlices/estadoSlice.js"
import { setImagenFugaAceite, setImagenFugaCombustible, setImagenFugaAceiteMotor, setImagenDireccionalesDelanteras, setImagenDireccionalesTraseras, setImagenLucesTablero, setImagenLuzFreno, setImagenLlantaDelantera, setImagenLlantaTrasera, setImagenDeformacionesLlanta, setImagenEncendido, setImagenTensionCadena, setImagenFrenoDelantero, setImagenFrenoTrasero, setImagenAmortiguadores, setImagenSilla, setImagenEspejos, setImagenVelocimetro, setImagenClaxon, setImagenPalancas } from '../../../redux/vehiculosSlices/imagenesEstadoSlice.js'
import { setPagosVerificacion } from '../../../redux/vehiculosSlices/pagosVerificacionSlice.js'
import { setPagosTenencia } from '../../../redux/vehiculosSlices/pagosTenenciaSlice.js'
import { removeAllPagoPlacas } from '../../../redux/vehiculosSlices/pagosPlacasSlice.js'
import { setPagosExtraordinarios } from '../../../redux/vehiculosSlices/pagosExtraordinariosSlice.js'
import { useDispatch } from 'react-redux'

const Title = ({ setAnimation }) => {

	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'
	const dispatch = useDispatch()

	const close = () => {
		setAnimation(true)
	}

	const ResetData = () => {
		dispatch(setKilometraje('')); dispatch(setSelectedPlace('')); dispatch(setImage(null)); dispatch(setImagePreview(null)); dispatch(setModelo('')); dispatch(setPlaca('')); dispatch(setVehiculo('')); dispatch(setSerie('')); dispatch(setMarca('')); dispatch(setColor('')); dispatch(setColorLlavero('')); dispatch(setTipoMotor(''));
		dispatch(setFactura(null)); dispatch(setFrente(null)); dispatch(setGarantia(null)); dispatch(setLadoDerecho(null)); dispatch(setLadoIzquierdo(null)); dispatch(setNombreFactura('')); dispatch(setNombreGarantia('')); dispatch(setNombreSeguro('')); dispatch(setNombreTarjetaCirculacion('')); 
		dispatch(setPreviewFrente(null)); dispatch(setPreviewLadoDerecho(null)); dispatch(setPreviewLadoIzquierdo(null)); dispatch(setPreviewTrasera(null)); dispatch(setSeguro(null)); dispatch(setTarjetaCirculacion(null)); dispatch(setTrasera(null));
		dispatch(setCombustible('')); dispatch(setBateria('')); dispatch(setNeumaticos('')); dispatch(setFugaAceite(false)); dispatch(setFugaCombustible(false)); dispatch(setFugaAceiteMotor(false)); dispatch(setDireccionalesDelanteras(false)); dispatch(setDireccionalesTraseras(false)); dispatch(setLucesTablero(false));
		dispatch(setLuzFreno(false)); dispatch(setLlantaDelantera(false)); dispatch(setLlantaTrasera(false)); dispatch(setDeformacionesLlanta(false)); dispatch(setEncendido(false)); dispatch(setTensionCadena(false)); dispatch(setFrenoDelantero(false)); dispatch(setFrenoTrasero(false)); dispatch(setAmortiguadores(false));
		dispatch(setDireccion(false)); dispatch(setSilla(false)); dispatch(setEspejos(false)); dispatch(setVelocimetro(false)); dispatch(setClaxon(false)); dispatch(setPalancas(false)); dispatch(setObservaciones(''));
		dispatch(setImagenFugaAceite(null)); dispatch(setImagenFugaCombustible(null)); dispatch(setImagenFugaAceiteMotor(null)); dispatch(setImagenDireccionalesDelanteras(null)); dispatch(setImagenDireccionalesTraseras(null)); dispatch(setImagenLucesTablero(null)); dispatch(setImagenLuzFreno(null));
		dispatch(setImagenLlantaDelantera(null)); dispatch(setImagenLlantaTrasera(null)); dispatch(setImagenDeformacionesLlanta(null)); dispatch(setImagenEncendido(null)); dispatch(setImagenTensionCadena(null)); dispatch(setImagenFrenoDelantero(null)); dispatch(setImagenFrenoTrasero(null));
		dispatch(setImagenAmortiguadores(null)); dispatch(setImagenSilla(null)); dispatch(setImagenEspejos(null)); dispatch(setImagenVelocimetro(null)); dispatch(setImagenClaxon(null)); dispatch(setImagenPalancas(null));
		dispatch(setPagosExtraordinarios([])); dispatch(removeAllPagoPlacas()); dispatch(setPagosTenencia([])); dispatch(setPagosVerificacion([]));
	}

	return (

		<Box
			sx={{
				width:'100%',
				height:'auto',
				display:'flex',
				justifyContent:'space-between',
				alignItems:'center',
			}}
		>

			<Typography sx={{ color: isLightMode ? '#000' : '#fff', fontSize: '30px', fontWeight: '500' }}>
				Agregar un nuevo vehículo
			</Typography>

			<Button
				onClick={() => { close(); ResetData(); }}
				sx={{ color: 'black' }}
			>
				<CloseFullscreenIcon 
					sx={{
						color: 'red',
						fontSize: '24px',
						fontWeight: '500'
					}}
				/>
			</Button>

		</Box>

	)
	
} 

Title.propTypes = {
	setAnimation: PropTypes.func.isRequired
}

export default Title