import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useSelector, useDispatch } from 'react-redux'
import { setPagosVerificacion, setAñoVerificacion, setMesVerificacion, setCostoVerificacion, setFileNameVerificacion, setFileVerificacion, removePagoVerificacion } from '../../../redux/vehiculosSlices/pagosVerificacionSlice'
import { Meses } from '../../../hooks/estadoVehiculoHook'

export default function Verificacion() {
	const pagosVerificacion = useSelector(state => state.pagosVerificacion)
	const dispatch = useDispatch()

	const getCurrentYearRange = () => {
		const currentYear = new Date().getFullYear()
		const years = []
		for (let i = currentYear - 6; i <= currentYear + 1; i++) {
			years.push(i)
		}
		return years
	}

	const years = getCurrentYearRange()

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file) {
			dispatch(setFileNameVerificacion(file.name))
			dispatch(setFileVerificacion(file))
		}
	}

	const handleAgregarPago = () => {
		const mes = pagosVerificacion.mesVerificacion
		const año = pagosVerificacion.añoVerificacion
		const costo = pagosVerificacion.costoVerificacion
		const file = pagosVerificacion.fileVerificacion
		const fileName = pagosVerificacion.fileNameVerificacion

		if (pagosVerificacion.mesVerificacion && pagosVerificacion.añoVerificacion && pagosVerificacion.fileNameVerificacion) {
			dispatch(setPagosVerificacion([...pagosVerificacion.pagosVerificacion, { mes, año, costo, documento: file, nombre: fileName }]))
			dispatch(setMesVerificacion(''))
			dispatch(setAñoVerificacion(''))
			dispatch(setCostoVerificacion(0))
			dispatch(setFileNameVerificacion(''))
		} else {
			alert('Por favor, selecciona mes, año y documento.')
		}

	}

	const handleRemovePago = (index) => {
		dispatch(removePagoVerificacion(index))
	}

	return (

		<Box sx={{ width: '100%', height: 'auto' }}>

			<Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>

				<Box sx={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '20px', padding: '0' }}>

					<FormControl fullWidth variant="filled" sx={{ minWidth: 150, width: '180px' }}>
						<InputLabel id="mes">Mes</InputLabel>
						<Select
						labelId="mes"
						id="mes"
						value={pagosVerificacion.mesVerificacion}
						label="Mes"
						onChange={(event) => dispatch(setMesVerificacion(event.target.value))}
						sx={{ border: 'none' }}
						>
						{Meses.map((mes, index) => (
							<MenuItem key={index} value={mes}>
							{mes}
							</MenuItem>
						))}
						</Select>
					</FormControl>

					<FormControl fullWidth variant="filled" sx={{ minWidth: 150, width: '180px' }}>
						<InputLabel id="año">Año</InputLabel>
						<Select
						labelId="año"
						id="año"
						value={pagosVerificacion.añoVerificacion}
						label="Año"
						onChange={(event) => dispatch(setAñoVerificacion(event.target.value))}
						sx={{ border: 'none' }}
						>
						{years.map((year, index) => (
							<MenuItem key={index} value={year}>
							{year}
							</MenuItem>
						))}
						</Select>
					</FormControl>

					<TextField
						sx={{
							textTransform: 'uppercase',
							width: '100%',
							maxWidth:'180px',
							'& input[type=number]': {
								'-moz-appearance': 'textfield',
							},
							'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
								'-webkit-appearance': 'none',
								margin: 0,
							},
						}}
						id="filled-basic"
						type="number"
						label="Costo"
						variant="filled"
						value={pagosVerificacion.costoVerificacion}
						onChange={e => dispatch(setCostoVerificacion(e.target.value))}
						onClick={() => dispatch(setCostoVerificacion(''))}
					/>

					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
						
						<input
							accept="*"
							type="file"
							id="file-input"
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>

						<label htmlFor="file-input">
							<Button
								component="span"
								sx={{
									width: 'auto',
									height: 'auto',
									background: '#66bb6a',
									minHeight: '0px',
									minWidth: '0px',
									margin: '0',
									padding: '7px',
									cursor: 'pointer',
								}}
							>
								<UploadFileIcon sx={{ color: '#fff', fontSize: '28px' }} />
							</Button>
						</label>

						<Typography sx={{ width:'100%', height:'auto', minWidth:'200px' }}>{pagosVerificacion.fileNameVerificacion || ''}</Typography>

					</Box>

				</Box>

				<Box sx={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
					<Button sx={{ color: '#fff', background: '#66bb6a', }} onClick={handleAgregarPago}>AGREGAR PAGO</Button>
				</Box>
				
			</Box>

			<Box sx={{ marginTop: '20px' }}>

				<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>

					<thead>
						<tr style={{ backgroundColor:'transparent' }}>
						<th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Acciones</th>
						<th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Mes</th>
						<th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Año</th>
						<th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Costo</th>
						<th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Documento</th>
						</tr>
					</thead>

					<tbody>
						{ 
							pagosVerificacion.pagosVerificacion.map((pago, index) => (
								<tr key={index} style={{ backgroundColor:'transparent',  borderRadius:'10px' }}>
									<td style={{ padding: '8px', borderBottom: '1px solid #ddd', width:'15%', textAlign:'center' }}><Button sx={{ width:'auto', height:'auto', padding:'0', margin:'0', minWidth:'0', color:'red', fontSize:'20px' }} onClick={() => handleRemovePago(index)}><HighlightOffIcon /></Button></td>
									<td style={{ padding: '8px', borderBottom: '1px solid #ddd', width:'15%', textAlign:'center'}}>{pago.mes}</td>
									<td style={{ padding: '8px', borderBottom: '1px solid #ddd', width:'15%', textAlign:'center' }}>{pago.año}</td>
									<td style={{ padding: '8px', borderBottom: '1px solid #ddd', width:'25%', textAlign:'center' }}>$ {pago.costo}</td>
									<td style={{ padding: '8px', borderBottom: '1px solid #ddd', width:'30%', textAlign:'center' }}>{pago.nombre}</td>
								</tr>
							))
							}
					</tbody>

				</table>

			</Box>

		</Box>

	)

}