import { Box, Button, MenuItem, FormControl, InputLabel, Select, Typography, Tooltip } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import { useEffect, useState } from 'react'
import tool from '../../toolkit/toolkitImpression.js'
import Preview from '../../components/Records/Preview.jsx'
import ChargeCounter from '../../components/Records/chargeCounter.jsx'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'
import ModalDelete from '../../components/Records/modalDelete.jsx'
import { useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from '@mui/material/styles'

/**
	* @name CreacionImpresionFichas
	* @author Iván Sánchez
	* @component
*/
const Impression = () => {

	const [loading, setLoading] = useState(false)
	const [cargando, setCargando] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	const [registros, setRegistros] = useState({})
	const [totalFichas, setTotalFichas] = useState(0)
	const [id, setId] = useState(0)
	const [registro, setRegistro] = useState(null)
	const [rango, setRango] = useState(0)
	const [paquetes, setPaquetes] = useState([])
	const [paquete, setPaquete] = useState({})
	const [selectedCuenta, setSelectedCuenta] = useState('')
	const [idPaq, setIdPaq] = useState(0)
	const [openPreview, setOpenPreview] = useState(0)
	const [completedRequests, setCompletedRequests] = useState(0)
	const user = useSelector(state => state.user)

	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

	const handlePaqueteChange = async (event) => {
		setCargando(true)
		const selectedId = event.target.value
		setIdPaq(event.target.value)
		const selectedPaquete = paquetes.find(item => item.id === selectedId)
		setPaquete(selectedPaquete)
		try {
			await handleRegistro(selectedId)
			setCargando(false)
		} catch (error) {
			console.error('Error al cargar registros:', error)
			setCargando(false)
		}
		
	}	

	const handleDownload = async () =>{
		setCargando(true)
	
		try {
			await tool.downloadZip(idPaq, paquetes)
			setCargando(false)

		} catch (error) {
			console.error('Error al descargar el archivo ZIP:', error)
			setCargando(false)
		}

	}
	
	const handleSeleccionRegistro = (registroN) => {
		setRegistro(registroN)
	}

	const handleStartUp = async () => {
		setLoading(true)
		await tool.updateActivePaquete(idPaq)
		const registrosArray = Object.values(registros)
		registrosArray.sort((a, b) => a.id - b.id)
		for (let registro of registrosArray) {
			await handleGeneratePDF(registro)
		}
		setLoading(false)
		window.location.reload()
	}

	const handleGeneratePDF = async (registro) => {
		const data = {
			id: registro.id,
			id_local: registro.id_local,
			nombre: paquete.nombre,
			cuenta: registro.cuenta,
			propietario: registro.propietario,
			tipo_servicio: registro.tipo_servicio,
			servicio: registro.servicio,
			calle: registro.calle,	
			colonia: registro.colonia,
			latitud: registro.latitud,
			longitud: registro.longitud,
			tarea_gestionada: registro.tarea_gestionada,
			gestor: registro.gestor,
			fecha_gestion: registro.fecha_gestion,
			tipo_gestion: registro.tipo_gestion,
			recibo: registro.recibo,
			fecha_pago: registro.fecha_pago,
			url_evidencia: registro.url_evidencia,
			url_fachada: registro.url_fachada,
			paquete: paquete,
			pagos: registro.pagos,
			clave_catastral: registro.clave_catastral,
			superficie_terreno: registro.superficie_terreno,
			superficie_construccion: registro.superficie_construccion,
			valor_terreno: registro.valor_terreno,
			valor_contruccion: registro.valor_construccion,
			valor_catastral: registro.valor_catastral,
			user: paquete.usuario 
		}

		try {
			const status = await tool.createRecords(data)
			if(status==200){
				setCompletedRequests(prev => prev + 1)
			}else if(status==400){
				console.error('La plaza o servicio no contiene templates:', status)
				setCompletedRequests(prev => prev + 1)
			} else {
				console.error('Error:', status)
				setCompletedRequests(prev => prev + 1)
			}
		} catch (error) {
			console.error('Error fetching data:', error)
		}

	}

	const apiPaquetes = async () => {
		try {
			const paquetes = await tool.getPaquetes()
			const userPaquetes = paquetes.filter(item => item.id_usuario === user.user_id)
			setPaquetes(userPaquetes)
		} catch (error) {
			console.error('Error fetching data:', error)
		}
	}
	
	const handleRegistro = async (idPaquete) => {

		try {

			const paquetes = await tool.getRegistrosById(idPaquete)
			const registrosAgrupados = {}
			const cuentasParaEliminar = new Set()
	
			paquetes.forEach(registro => {

				const { cuenta, activate } = registro
				if (!registrosAgrupados[cuenta]) {
					registrosAgrupados[cuenta] = { 
						id: registro.id, 
						cuenta, 
						calle: registro.calle, 
						id_local: registro.id_local, 
						fecha_pago: registro.fecha_pago, 
						colonia: registro.colonia, 
						latitud: registro.latitud, 
						recibo: registro.recibo, 
						gestor: registro.gestor, 
						fecha_gestion: registro.fecha_gestion, 
						longitud: registro.longitud, 
						propietario: registro.propietario, 
						servicio: registro.servicio, 
						status_previo: registro.status_previo, 
						tarea_gestionada: registro.tarea_gestionada, 
						tipo_gestion: registro.tipo_gestion, 
						tipo_servicio: registro.tipo_servicio, 
						tipo_tarifa: registro.tipo_tarifa, 
						total_pagado: registro.total_pagado, 
						url_evidencia: registro.url_evidencia, 
						url_fachada: registro.url_fachada, 
						activate, 
						clave_catastral: registro.clave_catastral, 
						superficie_terreno: registro.superficie_terreno, 
						superficie_construccion: registro.superficie_construccion, 
						valor_terreno: registro.valor_terreno, 
						valor_construccion: registro.valor_construccion, 
						valor_catastral: registro.valor_catastral, 
						pagos: [] 
					}
				}
	
				if (registro) {
					registrosAgrupados[cuenta].pagos.push({
						descripcion: registro.descripcion || "",
						descuentos: registro.descuentos || "",
						total_pagado: registro.total_pagado || ""
					})
				}
	
				if (activate === true) {
					cuentasParaEliminar.add(cuenta)
				}

			})
	
			const totalFichas = Object.keys(registrosAgrupados).length
			setTotalFichas(totalFichas)
	
			cuentasParaEliminar.forEach(cuenta => {
				delete registrosAgrupados[cuenta]
			})
	
			const registrosFaltantes = Object.keys(registrosAgrupados).length
			
			setRegistros(registrosAgrupados)
			setRango(registrosFaltantes)
			setCargando(false)
			apiPaquetes()

		} catch (error) {

			console.error('Ocurrió un error:', error.message)
			setCargando(false)

		}

	}

	useEffect(() => {
		if (user && user.user_id) {
			apiPaquetes()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const generarText = `Comienza la creación de los archivos PDF`
	const excelText = `Descarga el archivo excel original de los registros`
	const deleteText = `Borra este paquete de fichas`
	const incompletaText = `Descarga las fichas antes de terminar la creacion de todos los PDF`
	const completaText = `Descarga todos los PDF`

	return (

		<Box className='records_impression' minHeight='100vh' display={'flex'} justifyContent={'start'} flexDirection={'column'}>

		<Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={ isLightMode ? '#000000' :'#cff9e0'} fontSize={'2.5rem'}>Creación de Fichas</Typography>
		
			<Box className='records_impression__grid' sx={{ mt:'1rem', width:'auto', display:'flex', minHeight:'500px', justifyContent:'center', alignItems:'start' }} container spacing={0}>

				<Box className='records_impression__content' sx={{ minHeight: '600px', width:'100%', height:'auto', backgroundColor:  isLightMode ? 'rgba(0, 0, 63, 0.202)' : 'rgba(255, 255, 255, 0.250)', borderTopLeftRadius:'10px', borderBottomLeftRadius:'10px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
					
					<Box sx={{ width:'100%', maxWidth:'300px' }} display={'flex'} justifyContent={'space-between'} >

						<FormControl sx={{ width:'100%' }} className='inputCustom'>

							<InputLabel id='demo-simple-select-label' color='primary' sx={{ color:  isLightMode ? '#000000' : '#fff', width:'100%' }}> PAQUETE </InputLabel>

							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								value={idPaq}
								label='PAQUETE'
								onChange={handlePaqueteChange}
								sx={{ color:  isLightMode ? '#000000' : '#ffffff', '& .MuiSelect-select': { borderColor:  isLightMode ? '#000000' : '#ffffff', }, '& .MuiSvgIcon-root': { color:  isLightMode ? '#000000' : '#ffffff', }, }}
							>
								{paquetes.map(item => (
									<MenuItem key={item.id} value={item.id}>{item.id} - {item.nombre}</MenuItem>
								))}
							</Select>

						</FormControl>

					</Box>

					{
						rango > 0 ? (

							<>
								<Typography color={  isLightMode ? '#000000' : '#fffff'} fontSize={'1rem'} mb={'10px'} mt={'10px'}> Ficha Preview</Typography>
								
								<Box sx={{ width:'100%', maxWidth:'300px' }} display={'flex'} justifyContent={'space-between'} >

									<FormControl sx={{ width:'100%' }} className='inputCustom'>

										<InputLabel id='demo-simple-select-label' color='primary' sx={{ color:  isLightMode ? '#000000' : '#fff', width:'100%' }}> FICHA </InputLabel>

										<Select
											labelId='demo-simple-select-label'
											id='demo-simple-select'
											value={selectedCuenta}
											label='FICHA'
											onChange={(event) => setSelectedCuenta(event.target.value)}
											sx={{ color:  isLightMode ? '#000000' : '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
										>
											{Object.keys(registros).slice(0, 5).map((cuenta, index) => (
												<MenuItem key={index} value={cuenta} onClick={() => handleSeleccionRegistro(registros[cuenta])}>{cuenta}</MenuItem>
											))}
										</Select>	

									</FormControl>

								</Box>

							</>

						):(

							false

						)

					}

					

					{ registro ? <Button variant="text" sx={{ marginTop:'30px', width:'100%', maxWidth:'200px', color:  isLightMode ? '#000000' : 'white', fontWeight:'600', fontSize:'.8rem'}} fullWidth onClick={() => setOpenPreview(true)}> VER PREVIEW </Button> :false }

					{ rango > 0 ? 
						<Tooltip
							title={generarText} 
							enterDelay={100} 
							leaveDelay={200}	
						>
							<span>
								<Button onClick={() => handleStartUp()} variant="contained" sx={{ marginTop:'30px', width:'100%', maxWidth:'250px', color:'white', fontWeight:'600', fontSize:'.8rem'}} fullWidth> GENERAR FICHAS PDF </Button> 
							</span>
						</Tooltip>
						: false 
					}

					{
						Object.keys(paquete).length !== 0 ? (
							rango > 0 ? (
								paquete.activate === true ? (
									<Tooltip
										title={incompletaText} 
										enterDelay={100} 
										leaveDelay={200}	
									>
										<span>
											<Button variant="contained" onClick={handleDownload} color="success" sx={{marginTop:'20px', color:'white', fontWeight:'600' }}>DESCARGA INCOMPLETA</Button>
										</span>
									</Tooltip>
								):(
									false
								)
							):(
								<Tooltip
									title={completaText} 
									enterDelay={100} 
									leaveDelay={200}	
								>
									<span>
										<Button variant="contained" onClick={handleDownload} color="success" sx={{marginTop:'20px', color:'white', fontWeight:'600' }}>DESCARGAR ZIP</Button>
									</span>
								</Tooltip>
							)
						):(
							false
						)
					}

				</Box>

				<Box className='records_impression__data' sx={{ minHeight: '600px', height:'auto', width:'100%', background: isLightMode ? 'rgba(0, 0, 63, 0.202)' : 'rgba(255, 255, 255, 0.250)', borderTopRightRadius:'10px', borderBottomRightRadius:'10px', display:'flex', flexDirection:'column', gap:'2rem' }} fullWidth >
										
					{ 

						Object.keys(paquete).length !== 0 ? ( 

							rango > 0 ? (

								<>

									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:  isLightMode ? '#000000' : '#cff9e0' }}>Nombre de paquete:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.nombre}</Typography>
										<Tooltip
											title={deleteText} 
											enterDelay={100} 
											leaveDelay={200}	
										>
										
											<Button onClick={() => (setId(paquete.id), setOpenDelete(true))}  sx={{m:'0', p:'0', width:'auto', }} ><DeleteIcon sx={{color:'red'}}/></Button>
										</Tooltip>
									</Box>
									
									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Nombre de usuario:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.usuario}</Typography>
									</Box>
									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Plaza:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.plaza}</Typography> 
									</Box>
									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Servicio:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.servicio}</Typography> 
									</Box>
									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Fecha de corte:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.fecha_corte}</Typography> 
									</Box>
									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Documento Excel:</Typography>
										<Tooltip
											title={excelText} 
											enterDelay={100} 
											leaveDelay={200}	
										>
											<a 
												href={paquete.excel_document} 
												style={{ 
													textDecoration: 'none',
													color: '#fff',
													cursor: 'pointer',
													background: '#151e27',
													padding: '5px 15px',
													borderRadius: '20px',
													transition: 'background-color 0.3s, color 0.3s', 
												}}
												onMouseOver={(e) => e.target.style.backgroundColor = '#273543'} 
												onMouseOut={(e) => e.target.style.backgroundColor = '#151e27'}
											>
												Descargar
											</a>
										</Tooltip>
									</Box>
									{
										paquete.folio !== 'desconocido' ? (

											<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
												<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Folio:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.folio}</Typography> 
											</Box>

										):( false )

									}
									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' :'#cff9e0' }}>Fichas Faltantes:</Typography><Typography sx={{ fontSize:'1rem' }}>{rango}</Typography> 
									</Box>

									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color: isLightMode ? '#000000' : '#cff9e0' }}>Fichas Totales:</Typography><Typography sx={{ fontSize:'1rem' }}>{totalFichas}</Typography> 
									</Box>

								</>

							):(

								<Box className='record_impression__empty' sx={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:'100%' }}>
									<Typography width={'80%'} mb={'1rem'} fontSize={'1.5rem'} color={'#00FF00'} textAlign={'center'}>Este paquete ya creo todas las fichas posibles y esta listo para descargar, si hubo alguna correción subir ficha individual.</Typography>
									<ArticleIcon sx={{fontSize:'3.5rem', color:'#00FF00'}}></ArticleIcon>
								</Box>

							)
						
						):(

							<Box className='record_impression__empty' sx={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:'100%' }}>
								<Typography mb={'1rem'} fontSize={'1.5rem'} textAlign={'center'}>Selecciona un paquete para ver la informacion</Typography>
								<ArticleIcon sx={{fontSize:'3.5rem'}}></ArticleIcon>
							</Box>

						)

					}

				</Box>

			</Box>

			{ openPreview ? <Preview setOpenPreview={setOpenPreview} registro={registro} paquete={paquete} /> : false }
			{ loading ? <ChargeCounter value={completedRequests} /> : false}
			{ cargando ? <ChargeMessage/> : false} 
			{ openDelete ? <ModalDelete id={id} setOpenDelete={setOpenDelete} /> : false }

		</Box>

	)

}

export default Impression

