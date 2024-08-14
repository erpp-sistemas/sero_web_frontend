import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useSelector, useDispatch } from 'react-redux'
import { setPagosPlacas, setAñoPlacas, setMesPlacas, setCostoPlacas, setFileNamePlacas, setFilePlacas, removePagoPlacas } from '../../../redux/vehiculosSlices/pagosPlacasSlice'
import { Meses } from '../../../hooks/estadoVehiculoHook'
import { Download } from "@mui/icons-material"

export default function Placas() {
	const pagosPlacas = useSelector(state => state.pagosPlacas)
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
			dispatch(setFileNamePlacas(file.name))
			dispatch(setFilePlacas(file))
		}
	}

	const handleAgregarPago = () => {
		const mes = pagosPlacas.mesPlacas
		const año = pagosPlacas.añoPlacas
		const costo = pagosPlacas.costoPlacas
		const file = pagosPlacas.filePlacas
		const fileName = pagosPlacas.fileNamePlacas

		if (pagosPlacas.mesPlacas && pagosPlacas.añoPlacas && pagosPlacas.fileNamePlacas) {
			dispatch(setPagosPlacas([...pagosPlacas.pagosPlacas, { mes, año, costo, documento: file, nombre: fileName }]))
			dispatch(setMesPlacas(''))
			dispatch(setAñoPlacas(''))
			dispatch(setCostoPlacas(0))
			dispatch(setFileNamePlacas(''))
		} else {
			alert('Por favor, selecciona mes, año y documento.')
		}

	}

	const handleRemovePago = (index) => {
		dispatch(removePagoPlacas(index))
	}

	return (

		<Box sx={{ width: '100%', height: 'auto', minWidth:'800px' }}>

			<Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>

				<Box sx={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '20px', padding: '0' }}>

					<FormControl fullWidth variant="filled" sx={{ minWidth: 150, width: '180px' }}>
						<InputLabel id="mes">Mes</InputLabel>
						<Select
						labelId="mes"
						id="mes"
						value={pagosPlacas.mesPlacas}
						label="Mes"
						onChange={(event) => dispatch(setMesPlacas(event.target.value))}
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
						value={pagosPlacas.añoPlacas}
						label="Año"
						onChange={(event) => dispatch(setAñoPlacas(event.target.value))}
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
						value={pagosPlacas.costoPlacas}
						onChange={e => dispatch(setCostoPlacas(e.target.value))}
						onClick={() => dispatch(setCostoPlacas(''))}
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

						<Typography sx={{ width:'100%', height:'auto', minWidth:'200px' }}>{pagosPlacas.fileNamePlacas || ''}</Typography>

					</Box>

				</Box>

				<Box sx={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
					<Button sx={{ color: '#fff', background: '#66bb6a', }} onClick={handleAgregarPago}>AGREGAR PAGO</Button>
				</Box>
				
			</Box>

			<Box sx={{ mt:'15px' }}>
				<Button 
					variant="outlined"                             
					color="secondary"       
					sx={{ width:'auto' }}                     
					onClick={() => {
						console.log('exportar')                 
					}}
					size="small"
					startIcon={<Download />}
				>                                                        
					Exportar
				</Button>
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
							pagosPlacas.pagosPlacas.map((pago, index) => (
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