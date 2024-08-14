	import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
	import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
	import EditIcon from '@mui/icons-material/Edit'
	import { useSelector, useDispatch } from 'react-redux'
	import { setEditColor, setEditKilometraje, setEditColorLlavero, setEditMarca, setEditModelo, setEditPlaca, setEditSelectedPlace, setEditSerie, setEditTipoMotor, setEditVehiculo } from '../../../redux/vehiculosSlices/editarInformacionGeneral.js'
	import PlaceSelectDisabled from '../../PlaceSelectDisabled.jsx'
	import jsPDF from 'jspdf'
	import html2canvas from 'html2canvas'

	const Content = () => {
		const editarInformacionGeneral = useSelector(state => state.editarInformacionGeneral)
		const dispatch = useDispatch()

		const currentYear = new Date().getFullYear()
		const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i)

		const handlePlaceChange = (event) => {
			dispatch(setEditSelectedPlace(event.target.value))
		}

		const handleChange = (event) => {
			dispatch(setEditModelo(event.target.value))
		}

		const generatePDF = () => {
			fetch('../plantillas/informacionGeneral.html')
				.then(response => response.text())
				.then(html => {
					const parser = new DOMParser()
					const doc = parser.parseFromString(html, 'text/html')
					const pdfContent = doc.getElementById('pdf-content')
		
					pdfContent.querySelector('#placa').textContent = editarInformacionGeneral.editPlaca
					pdfContent.querySelector('#marca').textContent = editarInformacionGeneral.editMarca
					pdfContent.querySelector('#modelo').textContent = editarInformacionGeneral.editModelo
					pdfContent.querySelector('#vehiculo').textContent = editarInformacionGeneral.editVehiculo
					pdfContent.querySelector('#tipoMotor').textContent = editarInformacionGeneral.editTipoMotor
					pdfContent.querySelector('#color').textContent = editarInformacionGeneral.editColor
					pdfContent.querySelector('#colorLlavero').textContent = editarInformacionGeneral.editColorLlavero
					pdfContent.querySelector('#kilometraje').textContent = editarInformacionGeneral.editKilometraje
					pdfContent.querySelector('#lugar').textContent = editarInformacionGeneral.editSelectedPlace
					pdfContent.querySelector('#serie').textContent = editarInformacionGeneral.editSerie
		
					html2canvas(pdfContent).then((canvas) => {
						const imgData = canvas.toDataURL('image/png')
						const pdf = new jsPDF()
						pdf.addImage(imgData, 'PNG', 10, 10)
						pdf.save('vehiculo.pdf')
					})
				})
				.catch(error => {
					console.error('Error loading HTML template:', error)
				})
		}

		return (

			<Box sx={{ width:'100%', height:'100%', display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column' }}>

				<Box sx={{ m:'50px', display:'flex', justifyContent:'start', alignItems:'center', width:'100%', gap:'20px', flexDirection:{ xs:'column', md:'row'} }}>

					<Box sx={{ width:'20%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'2rem' }}>
						<Box sx={{ width:'200px', height:'200px', border:'1px solid grey', borderRadius:'50%', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center' }}>
							<img src={editarInformacionGeneral.editImagePreview} alt="" width={'100%'} height={'100%'} />
						</Box>
						<Box sx={{ width:'100%', display:'flex', justifyContent:'center', alignItems:'center', gap:'1rem', mt:{ xs:'0px', md:'50px' }, mb:{ xs:'30px', mb:'0px' } }}>
							<Button sx={{ color:'white', background:'rgba(0,0,0,0.6)', border:'1px solid white', padding:'5px 30px', margin:'0', minWidth:'0', borderRadius:'7px' }}>
							<EditIcon sx={{ fontSize:'30px', color:'white' }} />
							</Button>
							<Button 
							sx={{ color:'white', background:'rgba(0,0,0,0.6)', border:'1px solid white', padding:'5px 30px', margin:'0', minWidth:'0', borderRadius:'7px' }}
							onClick={generatePDF}
							>
							<PictureAsPdfIcon sx={{ fontSize:'30px', color:'red' }} />
							</Button>
						</Box>
					</Box>

					<Box sx={{ width:{ xs:'100%', md:'35%'}, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1.5rem' }}>
						<TextField
							sx={{ width:'90%' }}
							id="Placa"
							label="Placa"
							value={ editarInformacionGeneral.editPlaca }
							variant="outlined"
							onChange={event => dispatch(setEditPlaca(event.target.value))}
							disabled
						/>
						<TextField
							sx={{ width:'90%' }}
							id="Marca"
							label="Marca"
							defaultValue={ editarInformacionGeneral.editMarca }
							variant="outlined"
							onChange={event => dispatch(setEditMarca(event.target.value))}
							disabled
						/>
						<FormControl fullWidth variant="filled" sx={{ width:'90%' }}>
							<InputLabel id="modelo">Modelo</InputLabel>
							<Select
							labelId="modelo"
							id="modelo"
							value={ editarInformacionGeneral.editModelo }
							label="Modelo"
							onChange={(handleChange)}
							disabled
							>
							{years.map((year) => (
								<MenuItem key={year} value={year}>{year}</MenuItem>
							))}
							</Select>
						</FormControl>
						<TextField
							sx={{ width:'90%' }}
							id="Vehiculo"
							label="Vehiculo"
							defaultValue={ editarInformacionGeneral.editVehiculo }
							variant="outlined"
							onChange={event => dispatch(setEditVehiculo(event.target.value))}
							disabled
						/>
						<TextField
							sx={{ width:'90%' }}
							id="Tipo de motor"
							label="Tipo de motor"
							defaultValue={ editarInformacionGeneral.editTipoMotor }
							variant="outlined"
							onChange={event => dispatch(setEditTipoMotor(event.target.value))}
							disabled
						/>
					</Box>

					<Box sx={{ width:{ xs:'100%', md:'35%'}, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1.5rem', mb:{ xs:'60px', mb:'0px' } }}>
						<TextField
							sx={{ width:'90%' }}
							id="Color"
							label="Color"
							defaultValue={ editarInformacionGeneral.editColor }
							variant="outlined"
							onChange={event => dispatch(setEditColor(event.target.value))}
							disabled
						/>
						<TextField
							sx={{ width:'90%' }}
							id="Color llavero"
							label="Color llavero"
							defaultValue={ editarInformacionGeneral.editColorLlavero }
							variant="outlined"
							onChange={event => dispatch(setEditColorLlavero(event.target.value))}
							disabled
						/>
						<TextField
							sx={{ width:'90%' }}
							id="Kilometraje"
							label="Kilometraje"
							defaultValue={ editarInformacionGeneral.editKilometraje }
							variant="outlined"
							onChange={event => dispatch(setEditKilometraje(event.target.value))}
							disabled
						/>
						<FormControl fullWidth sx={{ width:'90%' }} disabled>
							<PlaceSelectDisabled      
							disabled      
							selectedPlace={editarInformacionGeneral.editSelectedPlace}
							handlePlaceChange={handlePlaceChange}
							/>
						</FormControl>
						<TextField	
							sx={{ width:'90%' }}
							id="# Serie"
							label="# Serie"
							defaultValue={ editarInformacionGeneral.editSerie }
							variant="outlined"
							onChange={event => dispatch(setEditSerie(event.target.value))}
							disabled
						/>
					</Box>
				</Box>

				<Box>
					
				</Box>

			</Box>

		)

	}

	export default Content