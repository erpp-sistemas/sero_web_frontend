import { Box, Typography, Button, FormControl, TextField, InputLabel, Select, MenuItem } from "@mui/material"
import CompareIcon from '@mui/icons-material/Compare'
import PlaceSelect from '../../PlaceSelect'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { setKilometraje, setSelectedPlace, setImage, setModelo, setVehiculo, setMarca, setColor, setColorLlavero, setSerie, setTipoMotor } from '../../../redux/vehiculosSlices/informacionGeneralSlice.js'
import { setErrorKilometraje, setErrorSelectedPlace, setErrorImage, setErrorModelo, setErrorVehiculo, setErrorMarca, setErrorColor, setErrorColorLlavero, setErrorSerie, setErrorTipoMotor } from '../../../redux/vehiculosSlices/informacionGeneralErrorsSlice.js'

const InformacionGeneral = () => {
	
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

	const informacionGeneral = useSelector(state => state.informacionGeneral)
	const informacionGeneralErrors = useSelector(state => state.informacionGeneralErrors)
	const dispatch = useDispatch()

	const vehiculos = [
		'Automovil',
		'Motocicleta',
		'Camioneta'
	]

	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i)

	const handlePlaceChange = (event) => {
		dispatch(setSelectedPlace(event.target.value))
		dispatch(setErrorSelectedPlace(false))
	}

	const handleChange = (event) => {
		dispatch(setModelo(event.target.value))
		dispatch(setErrorModelo(false))
	}

	const handleImageUpload = (event) => {
		const file = event.target.files[0]
		dispatch(setErrorImage(false))
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				dispatch(setImage(reader.result))
			}
			reader.readAsDataURL(file)
		}
	}

	return(

		<Box
			sx={{
				width:'100%',
				height:'auto',
				padding:'0px 30px',
				display:'flex',
				justifyContent:'center',
				alignItems:'center',
				flexWrap:'wrap'
			}}
		>

			<Box sx={{ width:'33%', height:'100%', padding:'0', margin:'0' }}>

				<Typography sx={{ fontSize:'20px', fontWeight:'500' }}>Fotografia</Typography>

				<Button
					sx={{
						width:'170px',
						height:'180px',
						border: isLightMode ? informacionGeneralErrors.errorImage ? '1px solid red' : '1px solid #000' : informacionGeneralErrors.errorImage ? '1px solid red' : '1px solid #fff',
						marginTop:'20px',
						position:'relative',
						display:'flex',
						justifyContent:'center',
						alignItems:'center',
						padding:'0',
						overflow:'hidden',
						borderRadius:'10px',
						background: informacionGeneral.image ? '#000' : 'transparent'
					}}
				>

					<CompareIcon sx={{ color:'#38b000', position:'absolute', fontSize:'45px' }} />

					{
						informacionGeneral.image ? <img src={informacionGeneral.image} alt="Preview" style={{ width: '100%', height: 'auto' }} /> : false
					}

					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							opacity: 0,
							cursor: 'pointer'
						}}
					/>

				</Button>

				<Typography sx={{ fontSize:'20px', fontWeight:'500', mt:'20px' }}>Seleccionar Tipo de vehículo</Typography>

				<Box>

					{
						vehiculos.length > 0 ? 
							vehiculos.map((item, index) => (
								<Box 
									key={index}
									sx={{
										width:'auto',
										maxWidth:'200px',
										height:'auto',
										display:'flex',
										justifyContent:'start',
										alignItems:'center',
										gap:'10px',
										mt:'20px'
									}} 
								>
									<Button
										onClick={() => (dispatch(setVehiculo(informacionGeneral.vehiculo === item ? '' : item)), dispatch(setErrorVehiculo(false)))}
										id={`tipo_${item.toLowerCase()}`}
										sx={{
											width: '20px',
											height: '20px',
											borderRadius: '50%',
											border: isLightMode ? informacionGeneralErrors.errorVehiculo ? '2px solid red' : '2px solid #17212F' : informacionGeneralErrors.errorVehiculo ? '2px solid red' : '2px solid #fff',
											background: 'none',
											minWidth: 'unset', 
											padding: 'unset', 
											"&.MuiButton-root": {
												boxShadow: 'none',
												'&:hover': {
													backgroundColor: 'none', 
													boxShadow: 'none', 
												},
												'&:active': {
													boxShadow: 'none', 
												}
											}
										}}
									>
										{ informacionGeneral.vehiculo === item ? <Box sx={{ width:'70%', height:'70%', background: isLightMode ? '#17212F' : '#fff' , borderRadius:'50%' }}></Box> : false }
									</Button>
									<label className="lable_vehiculos" htmlFor={`tipo_${item.toLowerCase()}`}>{item}</label>
								</Box>
							))
						: null
					}

				</Box>

			</Box>
			
			<Box sx={{ width:'33%', height:'100%', padding:'0 20px', margin:'0' }}>
				<TextField sx={{ width:'100%', border: informacionGeneralErrors.errorMarca ? '1px solid red' : 'none' }} id="filled-basic" label="Marca" variant="filled" value={informacionGeneral.marca} onChange={e => (dispatch(setMarca(e.target.value)), dispatch(setErrorMarca(false)))}/>
				<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth: 120 }}>
					<InputLabel id="modelo">Modelo</InputLabel>
					<Select
						labelId="modelo"
						id="modelo"
						value={informacionGeneral.modelo}
						label="Modelo"
						onChange={(handleChange)}
						sx={{
							border: informacionGeneralErrors.errorModelo ? '1px solid red' : false
						}}
					>
						{years.map((year) => (
							<MenuItem key={year} value={year}>{year}</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField sx={{ width:'100%', mt:'10px', border: informacionGeneralErrors.errorKilometraje ? '1px solid red' : 'none' }} id="filled-basic" value={informacionGeneral.kilometraje} label="Kilometraje" variant="filled" onChange={e => (dispatch(setKilometraje(e.target.value)), dispatch(setErrorKilometraje(false)))}/>
				<TextField sx={{ width:'100%', mt:'10px', border: informacionGeneralErrors.errorSerie ? '1px solid red' : 'none' }} id="filled-basic" label="Serie" variant="filled" value={informacionGeneral.serie} onChange={e => (dispatch(setSerie(e.target.value)), dispatch(setErrorSerie(false)))}/>
			</Box>

			<Box sx={{ width:'33%', minWidth:'400px', height:'100%', padding:'0 20px', margin:'0' }}>
				<TextField sx={{ width:'100%', border: informacionGeneralErrors.errorColor ? '1px solid red' : false }} id="filled-basic" label="Color" variant="filled" value={informacionGeneral.color} onChange={e => (dispatch(setColor(e.target.value)), dispatch(setErrorColor(false)))} />
				<TextField sx={{ width:'100%', mt:'10px', border: informacionGeneralErrors.errorColorLlavero ? '1px solid red' : false }} id="filled-basic" label="Color de llavero" variant="filled" value={informacionGeneral.colorLlavero} onChange={e => (dispatch(setColorLlavero(e.target.value)), dispatch(setErrorColorLlavero(false)))} />
				<TextField sx={{ width:'100%', mt:'10px', mb:'10px', border: informacionGeneralErrors.errorTipoMotor ? '1px solid red' : false }} id="filled-basic" label="Tipo de motor" variant="filled" value={informacionGeneral.tipoMotor} onChange={e => (dispatch(setTipoMotor(e.target.value)), dispatch(setErrorTipoMotor(false)))}/>
				<FormControl fullWidth sx={{ border: informacionGeneralErrors.errorSelectedPlace ? '1px solid red' : false }}>
					<PlaceSelect            
						selectedPlace={informacionGeneral.selectedPlace}
						handlePlaceChange={handlePlaceChange}
					/>
				</FormControl>
			</Box>

		</Box> 

	)

}

InformacionGeneral.propTypes = {
	setNext: PropTypes.func.isRequired,
}

export default InformacionGeneral