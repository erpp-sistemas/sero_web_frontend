import { Box, Typography, Checkbox, FormControl, InputLabel, MenuItem, TextField, Button, Select } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as XLSX from 'xlsx'
import useFichasState from '../../hooks/fichasStates.js'
import Modal from '../../components/Records/Modal.jsx'
import { useNavigate } from 'react-router-dom'
import tool from '../../toolkit/toolkitFicha.js'
import LinerProgress from '../../components/Records/LinerProgress.jsx'
import { useSelector } from 'react-redux'
import { dispatch } from '../../redux/store.js'
import { setFechaCortePaquete, setFolioPaquete, setIdPaquete, setPlazaPaquete, setServicioPaquete } from '../../redux/paqueteReducer.js'

/**
	* Página principal de fichas
	* Iván Sánchez
	* @component
	* @returns {JSX.Element} Componente Process.>
*/
function Records() {

	// const [excel, setExcel] = useState(null)

	const { activity, setActivity, plazas, setPlazas, plaza, setPlaza, servicios, setServicios, setServicio, servicio, fileName, setFileName, selectionCompleted, setFolio, folio, setSelectionCompleted, cargando, setCargando, regsitros, setRegistros, porcentaje, setPorcentaje, modal, setModal, setFechaCorte, fechaCorte } = useFichasState()

	// const navigate = useNavigate()
	// const paquete = useSelector(p => p.paquete)

	// const handleChange = async (event) => {
	// 	dispatch(setPlazaPaquete(event.target.value))
	// 	const servicios = await tool.getServicios(event.target.value)
	// 	setServicios(servicios)
	// }

	// const Progreso = useMemo(() => {
	// 	return porcentaje
	// }, [porcentaje])

	// const calcularProgreso = (total) => {
	// 	const calculo = total * 100 / regsitros.length
	// 	setPorcentaje(calculo)
	// }

	// const processUpload = async () => {
	// 	setPorcentaje(0)
	// 	setCargando(true)

	// 	const data = {
	// 		servicio: paquete.servicio,
	// 		fecha_corte: paquete.fecha_corte.format('YYYY-MM-DD'),
	// 		folio: paquete.folio || 'desconocido',
	// 		plaza: paquete.plaza,
	// 		excel_document: excel 
	// 	}

	// 	const id_paquete = await tool.generatePaquete(data)
	// 	dispatch(setIdPaquete(id_paquete))
	// 	let total = 0
	// 	for (let ficha of regsitros) {
	// 		await tool.uploadFichas({ id_paquete, ...ficha })
	// 		total += 1
	// 		calcularProgreso(total)
	// 	}
	// 	setCargando(false)
	// 	setModal(true)
	// }

	const handleFileUpload = (e) => {

		const file = e.target.files?.[0]
		if (!file) return
		// setExcel(file)
		const reader = new FileReader()

		reader.onload = async (event) => {
			const data = new Uint8Array(event.target?.result)
			const workbook = XLSX.read(data, { type: 'array' })
			const sheetName = workbook.SheetNames[0]
			const sheet = workbook.Sheets[sheetName]
			const options = { header: 1 }
			const jsonData = XLSX.utils.sheet_to_json(sheet, options)

			const filasFormateadas = await tool.formatearFila(jsonData, folio)

			setRegistros(filasFormateadas)
			console.log(filasFormateadas)
		}

		reader.readAsArrayBuffer(file)
		setFileName(file.name)
	}

	// const handleChangeTwo = async (event) => {
	// 	dispatch(setServicioPaquete(event.target.value))
	// }

	useEffect(() => {

		const apiPlazas = async () => {
			try {
				const plazas = await tool.getPlazas()
				setPlazas(plazas)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		const apiServicios = async () => {
			try {
				const servicios = await tool.getServicios()
				setServicios(servicios)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		apiPlazas()
		apiServicios()

	}, [setPlazas, setServicios])

	useEffect(() => {
		setSelectionCompleted(plaza !== '' && servicio !== '' && fechaCorte !== null)
	}, [plaza, servicio, fechaCorte, setSelectionCompleted])

	return (

		<Box padding={'10px'} minHeight='100vh' display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>

			{/* <Modal open={modal} setOpen={setModal} text={`Este es su folio ${paquete.id}`} type={"success"} action={() => navigate("/impresion")} />*/}

			<Typography textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Generador de fichas</Typography> 

			<Box marginTop={'2rem'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} width={'100%'} gap={'2rem'}>

				<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

					<label htmlFor='package' style={{ textAlign: 'center', color: '#cff9e0', fontSize: '1.1rem', cursor: 'pointer' }}>Crear Paquete</label>

					<Checkbox
						id='package'
						checked={activity}
						onChange={() => setActivity(true)}
						sx={{ '& .MuiSvgIcon-root': { fontSize: '20px', color: activity ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
					/>

				</Box>

				<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

					<label htmlFor='individual' style={{ textAlign: 'center', color: '#cff9e0', fontSize: '1.1rem', cursor: 'pointer' }}>Crear Individuales</label>

					<Checkbox
						id='individual'
						checked={!activity}
						onChange={() => setActivity(false)}
						sx={{ '& .MuiSvgIcon-root': { fontSize: '20px', color: !activity ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
					/>

				</Box>

			</Box>

			<Box marginTop={'2rem'}>

				<Box width={'100%'} minWidth={'20rem'}>

					<FormControl fullWidth>

						<InputLabel id="demo-simple-select-label" sx={{ color: '#ffffff' }}>Plaza</InputLabel>

						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={plaza}
							label="Plaza"
							onChange={(e) => setPlaza(e.target.value)}
							sx={{ color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
						>

							{plazas.filter(plaza => plaza.active).map((plaza, index) => (

								<MenuItem key={index} value={plaza.id}>
									{plaza.nombre}
								</MenuItem>

							))}

						</Select>

					</FormControl>

					<FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '0.6rem' }} >

						<InputLabel id="demo-simple-select-label" sx={{ color: '#ffffff' }}>Servicio</InputLabel>

						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={servicio}
							label="Plaza"
							onChange={(e)=>(setServicio(e.target.value))}
							sx={{ color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
						>

							{servicios.filter(servicio => servicio.active).map((servicio, index) => (
								<MenuItem key={index} value={servicio.id}>
									{servicio.nombre}
								</MenuItem>

							))}

						</Select>

					</FormControl>

					<LocalizationProvider dateAdapter={AdapterDayjs} >

						<DemoContainer components={['DatePicker']}>

							<DatePicker
								label="Fecha de corte"
								value={fechaCorte}
								onChange={(newValue) => { setFechaCorte(newValue) }}
								sx={{ width: '99%', '& .MuiSvgIcon-root': { color: '#ffffff', }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputBase-input': { color: '#ffffff', }, }}
							/>

						</DemoContainer>

					</LocalizationProvider>

				</Box>

				{selectionCompleted && (

					<>

						<Box mt={2}>
							<Typography variant="body1" sx={{ color: '#fff' }}>
								Total de registros esperados: {regsitros.length}
							</Typography>
						</Box>

						{!activity &&
						
							<Box mt={'1rem'}>
								<TextField
									sx={{ width: '99%', '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputBase-input': { color: '#ffffff', }, }}
									id="outlined-basic"
									label="Folio existente"
									variant="outlined"
									value={folio}
									onChange={(e) => setFolio(e.target.value)}
								/>
							</Box>

						}

						<Box mt={'2rem'}>

							{fileName && (

								<Typography variant="body1" sx={{ marginBottom: '1rem', color: '#fff' }}>
									Archivo seleccionado: {fileName}
								</Typography>

							)}

							<input type="file" id="file-upload" onChange={handleFileUpload} style={{ display: 'none' }} />

							<label htmlFor="file-upload">
								<Button component="span" fullWidth variant="contained" >SUBIR EXCEL</Button>
							</label>

						</Box>

					</>

				)}

				{/* <Box mt={'2rem'}>

					{Progreso > 0 && <LinerProgress value={Progreso} />}

					<Button
						sx={{
							bgcolor: regsitros.length === 0 ? '#cccccc' : '#2fd968',
							'&:hover': {
								bgcolor: regsitros.length === 0 ? '#cccccc' : '#1faa4d',
							},
							'&:active': {
								bgcolor: regsitros.length === 0 ? '#cccccc' : '#157c38',
							},
						}}
						fullWidth
						variant="contained"
						disabled={regsitros.length === 0 || (!activity && !paquete.folio) || cargando}
						onClick={processUpload}
					>
						CREAR REGISTROS
					</Button>

				</Box> */}

			</Box>

		</Box>

	)

}

export default Records