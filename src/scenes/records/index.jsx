import { Box, Typography, Checkbox, FormControl, TextField, Button, Tooltip, InputLabel, Select, MenuItem } from '@mui/material'
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
import { setActivity, setPlazas, setServicios, setFileName, setSelectionCompleted, setFolio, setRegistros, setPorcentaje, setCargando, setModal, setIdPaquete } from '../../redux/recordsSlice.js'
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import { useTheme } from '@mui/material/styles'

/**
	* @name PáginaPrincipalFichas
	* @author Iván Sánchez
	* @component
*/
function Records() {

	const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedService, setSelectedService] = useState('')
    const [fechaImpresion, setFechaImpresion] = useState(null)
    const [mesFacturacion, setMesFacturacion] = useState(null)
    const [firma, setFirma] = useState(true)

	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

	const handleServiceChange = (event) => {
		setSelectedService(event.target.value)
	}

	const handlePlaceChange = (event) => {
		setSelectedPlace(event.target.value) 
		setSelectedService('')
	}

	const [fechaCorte, setfechaCorte] = useState(null)
	const [nombre, setNombre] = useState('nuevo')
	const [excel, setExcel] = useState(null)
	const user = useSelector(state => state.user)
	const { activity, plaza, servicio, fileName, folio, selectionCompleted, registros, porcentaje, cargando, modal } = useSelector(state => state.records)
	const dispatch = useDispatch()

	const Progreso = useMemo(() => {
		return porcentaje
	}, [porcentaje])

	const calcularProgreso = (total) => {
		const calculo = total * 100 / registros.length
		dispatch(setPorcentaje(calculo))
	}

	const handleChange = (event) => {
		setMesFacturacion(event.target.value)
	}

	const processUpload = async () => {

		dispatch(setPorcentaje(0))
		dispatch(setCargando(true))

		try {

            const excelURL = await tool.uploadS3(excel, user.name)
			
			const data = {
				id_servicio: selectedService,
				nombre: nombre,
				fecha_corte: fechaCorte.format('YYYY-MM-DD'),
				folio: folio || 'desconocido',
				id_plaza: selectedPlace,
				excel_document: excelURL.filePath,
				id_usuario: user.user_id,
				activate: 0,
				firma: firma ? 1 : 0,
				mes_facturacion: mesFacturacion,
				fecha_impresion: fechaImpresion,
			}	
	
			const id_paquete = await tool.generatePaquete(data)
			let total = 0
			for (let ficha of registros) {
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

	const changeName = () => {

		const now = new Date()

		const formattedDate = now.toLocaleDateString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).replace(/\//g, '-')
	
		const formattedTime = now.toLocaleTimeString('es-ES', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).replace(/:/g, '-')
	
		const fullName = user.name.replace(' ', '_')
		const newName = `${formattedDate}:${formattedTime}_${fullName}`
		setNombre(newName)

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

	const paqueteText = `Sube tu archivo excel con los registros necesarios y crea los PDF necesarios`
	const individualesText = `Sube tu archivo excel solo con una cuenta y folio para crear un unico PDF`
	const crearText = `Completa todos los campos para habilitar el boton`

	return (

		<Box width={'100%'} padding={'10px'} minHeight='100vh' display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>
			
			<div className='records_title'>
				<Typography mr={'12px'} textAlign={'center'} color={isLightMode ? '#000000' : '#cff9e0'} fontSize={'2.2rem'}>Registro de fichas</Typography>
			</div>
			
			<div className={isLightMode ? 'records__ligth' : 'records'}>	 

				<Box className='records__checkbox' marginTop={'2rem'} display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>

					<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

						<label htmlFor='package' style={{ textAlign: 'center', color:isLightMode ? '#000000' : '#cff9e0', fontSize: '1.1rem', cursor: 'pointer' }}>Crear Paquete</label>
						
						<Tooltip
							title={paqueteText} 
							enterDelay={100} 
							leaveDelay={200}	
						>
							<Checkbox
								id='package'
								checked={activity}
								onChange={() => {
									dispatch(setActivity(true))
									dispatch(setFolio(null))
								}}
								sx={{ '& .MuiSvgIcon-root': { fontSize: '25px', color: activity ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
							/>
						</Tooltip>

					</Box>

					<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

						<label htmlFor='individual' style={{ textAlign: 'center', color: isLightMode ? '#000000' : '#cff9e0', fontSize: '1.1rem', cursor: 'pointer' }}>Crear Individuales</label>

						<Tooltip
							title={individualesText} 
							enterDelay={100} 
							leaveDelay={200}	
						>
							<Checkbox
								id='individual'
								checked={!activity}
								onChange={() => {
									dispatch(setActivity(false))
									dispatch(setFolio(null))
								}}
								sx={{ '& .MuiSvgIcon-root': { fontSize: '25px', color: !activity ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
							/>
						</Tooltip>

					</Box>

				</Box>

				<Box marginTop={'2rem'}>

					<Box className='' width={'350px'} >

						<FormControl fullWidth>

							<PlaceSelect                
								selectedPlace={selectedPlace}
								handlePlaceChange={handlePlaceChange}
							/>

						</FormControl>

						<FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '0.6rem' }} >

							<ServiceSelect
								selectedPlace={selectedPlace}                  
								selectedService={selectedService}
								handleServiceChange={handleServiceChange}
							/>

						</FormControl>

						<LocalizationProvider dateAdapter={AdapterDayjs} >

							<DemoContainer components={['DatePicker']}>

								<DatePicker
									label='Fecha de corte'
									value={fechaCorte}
									onChange={(newValue) => { setfechaCorte(newValue), changeName() }}
									sx={{ marginBottom:'20px', width:'100%', '& .MuiSvgIcon-root': { color:isLightMode ? '#000000' : '#ffffff', }, '& .MuiInputLabel-root': { color: isLightMode ? '#000000' : '#ffffff', }, '& .MuiInputBase-input': { color: isLightMode ? '#000000' : '#ffffff', }, }}
								/>

							</DemoContainer>

						</LocalizationProvider>

						{

							fechaCorte !== null ? 

							<FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '0.6rem' }} >

								<TextField
									sx={{
										width: '100%',
									}}
									id='outlined-basic'
									label='Nombre'
									variant='outlined'
									value={nombre}
									disabled
								/>

							</FormControl>
							
							: false

						}
						
						{!activity &&
							
							<Box mt={'1rem'}>
								<TextField
									sx={{ width: '99%', '& .MuiInputLabel-root': { color:isLightMode ? '#000000' : '#ffffff', }, '& .MuiInputBase-input': { color: isLightMode ? '#000000' : '#ffffff', }, }}
									id='outlined-basic'
									label='Folio existente'
									variant='outlined'
									value={folio}
									onChange={(e) => dispatch(setFolio(e.target.value))}
								/>
							</Box>
	
						}

						{
							(selectedPlace === 4 && selectedService === 1 || selectedPlace === 2 && selectedService === 1 ) && (

								<>

									<br />
									<LocalizationProvider dateAdapter={AdapterDayjs}>

										<DemoContainer components={['DatePicker']}>

											<DatePicker
												label='Fecha de impresión'
												value={fechaImpresion}
												onChange={(newValue) => { setFechaImpresion(newValue) }}
												sx={{ width:'100%', '& .MuiSvgIcon-root': { color: isLightMode ? '#000000' :'#ffffff', }, '& .MuiInputLabel-root': { color:isLightMode ? '#000000' : '#ffffff', }, '& .MuiInputBase-input': { color: isLightMode ? '#000000' : '#ffffff', }, }}
											/>

										</DemoContainer>

									</LocalizationProvider>
								</>

						)}

						{
							(selectedPlace === 2 && selectedService === 1 ) && (

								<>

								<InputLabel 
									id="mes-facturacion-label"
									sx={{
										marginTop: '20px'
									}}
								>
									Mes de facturación
								</InputLabel>
								<Select
									labelId="mes-facturacion-label"
									id="mes-facturacion"
									value={mesFacturacion}
									onChange={handleChange}
									label="Mes de facturación"
									sx={{
										width:'100%'
									}}
								>
									<MenuItem value="Enero">Enero</MenuItem>
									<MenuItem value="Febrero">Febrero</MenuItem>
									<MenuItem value="Marzo">Marzo</MenuItem>
									<MenuItem value="Abril">Abril</MenuItem>
									<MenuItem value="Mayo">Mayo</MenuItem>
									<MenuItem value="Junio">Junio</MenuItem>
									<MenuItem value="Julio">Julio</MenuItem>
									<MenuItem value="Agosto">Agosto</MenuItem>
									<MenuItem value="Septiembre">Septiembre</MenuItem>
									<MenuItem value="Octubre">Octubre</MenuItem>
									<MenuItem value="Noviembre">Noviembre</MenuItem>
									<MenuItem value="Diciembre">Diciembre</MenuItem>
								</Select>

								</>

						)}

						{
							(selectedPlace === 2 && selectedService === 2) && (

							<Box className='records__checkbox' marginTop={'2rem'} display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>

								<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

									<label htmlFor='package' style={{ textAlign: 'center', color: isLightMode ? '#000000' :'#cff9e0', fontSize: '0.9rem', cursor: 'pointer' }}>Con Firma</label>

									<Checkbox
										id='package'	
										checked={firma}
										onChange={() => {
											setFirma(true)
										}}
										sx={{ '& .MuiSvgIcon-root': { fontSize: '20px', color: firma ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
									/>

								</Box>

								<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

									<label htmlFor='individual' style={{ textAlign: 'center', color: isLightMode ? '#000000' : '#cff9e0', fontSize: '0.9rem', cursor: 'pointer' }}>Sin Firma</label>

									<Checkbox	
										id='individual'
										checked={!firma}
										onChange={() => {
											setFirma(false)
										}}
										sx={{ '& .MuiSvgIcon-root': { fontSize: '20px', color: !firma ? '#28a745' : 'grey', }, '&:hover': { backgroundColor: '#228d3b', }, }}
									/>

								</Box>

							</Box>

						)}

					</Box>

					{selectionCompleted && (

						<>

							<Box mt={2}>
								<Typography variant='body1' sx={{ color: isLightMode ? '#000000' : '#fff' }}>
									Total de registros esperados: {registros.length}
								</Typography>
							</Box>


							<Box mt={'2rem'}>

								{fileName && (

									<Typography variant='body1' sx={{ marginBottom: '1rem', color: isLightMode ? '#000000' : '#fff' }}>
										Archivo seleccionado: {fileName}
									</Typography>

								)}

								<input 
									type="file" 
									id="file-upload" 
									onChange={handleFileUpload} 
									style={{ display: 'none' }} 
									accept=".xlsx,.xls" 
								/>

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

						{(registros.length === 0 || (!activity && !folio) || cargando || nombre == '') ? (
							<Tooltip
								title={crearText} 
								enterDelay={100} 
								leaveDelay={200}	
							>
								<span>
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
									disabled={true}
									onClick={processUpload}
								>
									CREAR REGISTROS
								</Button>
								</span>
							</Tooltip>
							) : (
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
								disabled={false}
								onClick={processUpload}
							>
								CREAR REGISTROS
							</Button>
							)}

						{modal ? <ModalId  nombre={nombre}/> : false }

					</Box>

				</Box>

			</div>

		</Box>

	)

}

export default Records
