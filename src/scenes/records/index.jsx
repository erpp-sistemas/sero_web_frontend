import { Box, Typography, Checkbox, FormControl, InputLabel, MenuItem, TextField, Button, Select } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as XLSX from 'xlsx'
import tool from '../../toolkit/toolkitFicha.js'
import LinearProgressWithLabel from '../../components/Records/LinerProgress.jsx'
import ModalId from '../../components/Records/ModalId.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { setActivity, setPlazas, setServicios, setPlaza, setServicio, setFileName, setSelectionCompleted, setFolio, setRegistros, setPorcentaje, setCargando, setModal, setIdPaquete } from '../../redux/recordsSlice.js'

/**
	* Página principal de fichas
	* Iván Sánchez
	* @component
	* @returns {JSX.Element} Componente Process.>
*/
function Records() {

	const [fechaCorte, setfechaCorte] = useState(null)
	const [nombreExiste, setNombreExiste] = useState(false)
	const [nombre, setNombre] = useState('')
	// eslint-disable-next-line no-unused-vars
	const [excel, setExcel] = useState(null)
	const user = useSelector(state => state.user)
	const { activity, plazas, servicios, plaza, servicio, fileName, folio, selectionCompleted, registros, porcentaje, cargando, modal } = useSelector(state => state.records)
	const dispatch = useDispatch()

	const Progreso = useMemo(() => {
		return porcentaje
	}, [porcentaje])

	const calcularProgreso = (total) => {
		const calculo = total * 100 / registros.length
		dispatch(setPorcentaje(calculo))
	}

	const processUpload = async () => {

		dispatch(setPorcentaje(0))
		dispatch(setCargando(true))

		try {

            const excelURL = await tool.uploadS3(excel)
			
			const data = {
				id_servicio: servicio,
				nombre: nombre,
				fecha_corte: fechaCorte.format('YYYY-MM-DD'),
				folio: folio || 'desconocido',
				id_plaza: plaza,
				excel_document: excelURL.filePath,
				id_usuario: user.profile_id
			}
	
			const id_paquete = await tool.generatePaquete(data)
			let total = 0
			for (let ficha of registros) {
				console.log(ficha)
				await tool.uploadFichas({ id_paquete, ...ficha })
				total += 1
				calcularProgreso(total)
			}

			dispatch(setIdPaquete(id_paquete))
			dispatch(setCargando(false))
			dispatch(setModal(true))

        } catch (error) {
            console.error('Error al subir el archivo de Excel:', error)
        }

	}

	const handleFileUpload = (e) => {

		const file = e.target.files?.[0]
		if (!file) return
		setExcel(file)
		const reader = new FileReader()

		reader.onload = async (event) => {
			const data = new Uint8Array(event.target?.result)
			const workbook = XLSX.read(data, { type: 'array' })
			const sheetName = workbook.SheetNames[0]
			const sheet = workbook.Sheets[sheetName]
			const options = { header: 1 }
			const jsonData = XLSX.utils.sheet_to_json(sheet, options)
			const filasFormateadas = await tool.formatearFila(jsonData, folio)
			dispatch(setRegistros(filasFormateadas))
		}

		reader.readAsArrayBuffer(file)
		dispatch(setFileName(file.name))
	}

	useEffect(() => {

		const apiPlazas = async () => {
			try {
				const plazas = await tool.getPlazas()
				dispatch(setPlazas(plazas))
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		const apiServicios = async () => {
			try {
				const servicios = await tool.getServicios()
				dispatch(setServicios(servicios))
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		apiPlazas()
		apiServicios()

	}, [dispatch])

	useEffect(() => {
		dispatch(setSelectionCompleted(plaza !== '' && servicio !== '' && fechaCorte !== null))
	}, [dispatch, fechaCorte, plaza, servicio])

	
	useEffect(() => {
		
		const handleNombreChange = async () => {

			try {
				const data = await tool.getName(nombre)
				setNombreExiste(data.data.existe)
			} catch (error) {
				console.error('Error al verificar el nombre:', error)
			}

		}

		handleNombreChange()

	}, [nombre])

	return (

		<Box width={'100%'} padding={'10px'} minHeight='100vh' display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>
			
			<Typography mb={'2rem'} textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Registro de fichas</Typography>
			
			<div className='records'>	 

				<Box className='records__checkbox' marginTop={'2rem'} display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>

					<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

						<label htmlFor='package' style={{ textAlign: 'center', color: '#cff9e0', fontSize: '1.1rem', cursor: 'pointer' }}>Crear Paquete</label>

						<Checkbox
							id='package'
							checked={activity}
							onChange={() => {
								dispatch(setActivity(true))
								dispatch(setFolio(null))
							}}
							sx={{ '& .MuiSvgIcon-root': { fontSize: '25px', color: activity ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
						/>

					</Box>

					<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

						<label htmlFor='individual' style={{ textAlign: 'center', color: '#cff9e0', fontSize: '1.1rem', cursor: 'pointer' }}>Crear Individuales</label>

						<Checkbox
							id='individual'
							checked={!activity}
							onChange={() => {
								dispatch(setActivity(false))
								dispatch(setFolio(null))
							}}
							sx={{ '& .MuiSvgIcon-root': { fontSize: '25px', color: !activity ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
						/>
	
					</Box>

				</Box>

				<Box marginTop={'2rem'}>

					<Box className='' width={'350px'} >

					<TextField
						sx={{
							width: '100%',
							marginBottom: '1rem',
							'& .MuiInputLabel-root': {
								color: nombreExiste ? 'rgb(185, 0, 0) !important' : 'white !important',
							},
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: nombreExiste ? 'rgb(185, 0, 0) !important' : 'white !important', 
								},
								'&:hover fieldset': {
									borderColor: nombreExiste ? 'rgb(185, 0, 0) !important' : 'white !important',
								},
								'&.Mui-focused fieldset': {
									borderColor: nombreExiste ? 'rgb(185, 0, 0) !important' : 'white !important', 
								},
							},
						}}
						id='outlined-basic'
						label='Nombre'
						variant='outlined'
						value={nombre}
						onChange={(e) => 	setNombre(e.target.value)}
					/>

						{ nombreExiste ? <p className='records_aviso'>Ya existe un registro con este nombre.</p> : false }

						<FormControl fullWidth>

							<InputLabel 
								id='demo-simple-select-label' 
								sx={{ 
									color: '#ffffff',
								}}
							>Plaza</InputLabel>

							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								className="custom-select"
								value={plaza}
								label='Plaza'
								onChange={(e) => dispatch(setPlaza(e.target.value))}
								sx={{ 
									width:'100%', 
									color: '#ffffff',
									'&:focus': {  
										color: '#ffffff important',
										borderColor: '#ffffff !important', 
									},
								}}
							>

								{plazas.filter(plaza => plaza.active).map((plaza, index) => (

									<MenuItem key={index} value={plaza.id}>
										{plaza.nombre}
									</MenuItem>

								))}

							</Select>

						</FormControl>

						<FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '0.6rem' }} >

							<InputLabel id='demo-simple-select-label' sx={{ color: '#ffffff' }}>Servicio</InputLabel>

							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								value={servicio}
								label='Plaza'
								onChange={(e)=>(dispatch(setServicio(e.target.value)))}
								sx={{ width:'100%', color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
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
									label='Fecha de corte'
									value={fechaCorte}
									onChange={(newValue) => { setfechaCorte(newValue) }}
									sx={{ width:'100%', '& .MuiSvgIcon-root': { color: '#ffffff', }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputBase-input': { color: '#ffffff', }, }}
								/>

							</DemoContainer>

						</LocalizationProvider>

					</Box>

					{selectionCompleted && (

						<>

							<Box mt={2}>
								<Typography variant='body1' sx={{ color: '#fff' }}>
									Total de registros esperados: {registros.length}
								</Typography>
							</Box>

							{!activity &&
							
								<Box mt={'1rem'}>
									<TextField
										sx={{ width: '99%', '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputBase-input': { color: '#ffffff', }, }}
										id='outlined-basic'
										label='Folio existente'
										variant='outlined'
										value={folio}
										onChange={(e) => dispatch(setFolio(e.target.value))}
									/>
								</Box>

							}

							<Box mt={'2rem'}>

								{fileName && (

									<Typography variant='body1' sx={{ marginBottom: '1rem', color: '#fff' }}>
										Archivo seleccionado: {fileName}
									</Typography>

								)}

								<input type='file' id='file-upload' onChange={handleFileUpload} style={{ display: 'none' }} />

								<label htmlFor='file-upload'>
									<Button 
										sx={{
											backgroundColor: '#add8e6', 
											color: '#000000', 
											'&:hover': {
												backgroundColor: '#87ceeb', 
											},
										}}
										component='span' 
										fullWidth 
										variant='contained' 
									>SUBIR EXCEL</Button>
								</label>

							</Box>

						</>

					)}

					<Box mt={'2rem'}>

						{cargando ? <LinearProgressWithLabel value={Progreso} /> : false}

						<Button
							sx={{
								bgcolor: registros.length === 0 ? '#cccccc' : '#2fd968',
								'&:hover': {
									bgcolor: registros.length === 0 ? '#cccccc' : '#1faa4d',
								},
								'&:active': {
									bgcolor: registros.length === 0 ? '#cccccc' : '#157c38',
								},
							}}
							fullWidth
							variant='contained'
							disabled={registros.length === 0 || (!activity && !folio) || cargando || nombreExiste || nombre == '' }
							onClick={processUpload}
						>
							CREAR REGISTROS
						</Button>

						{modal ? <ModalId  nombre={nombre}/> : false }

					</Box>

				</Box>

			</div>

		</Box>

	)

}

export default Records
