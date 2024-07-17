import { Box, Button, MenuItem, FormControl, InputLabel, Select, Typography, Tooltip } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import { useEffect, useState } from 'react'
import tool from '../../toolkit/toolkitImpression.js'
import ChargeCounter from '../../components/Records/chargeCounter.jsx'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'
import ModalDelete from '../../components/Records/modalDelete.jsx'
import { useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from '@mui/material/styles'
import * as XLSX from 'xlsx'

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
	const [registrosOriginales, setRegistrosOriginales] = useState({})
	const [totalFichas, setTotalFichas] = useState(0)
	const [id, setId] = useState(0)
	const [rango, setRango] = useState(0)
	const [paquetes, setPaquetes] = useState([])
	const [paquete, setPaquete] = useState({})
	const [idPaq, setIdPaq] = useState(0)
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
			await tool.counterFiles(idPaq, paquetes)
			setCargando(false)

		} catch (error) {
			console.error('Error al descargar el archivo ZIP:', error)
			setCargando(false)
		}

	}

	const handleStartUp = async () => {
		setLoading(true)
		await tool.updateActivePaquete(idPaq)
		const registrosArray = Object.values(registros)
		registrosArray.sort((a, b) => a.id - b.id)
		let id_nuevo = (totalFichas - rango)+1
		for (let registro of registrosArray) {
			await handleGeneratePDF(registro, id_nuevo)
			id_nuevo++
		}
		setLoading(false)
		window.location.reload()
	}

	const handleGeneratePDF = async (registro, id_nuevo) => {

		const data = {
			id: registro.id,
			id_nuevo: id_nuevo,
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
			medidor: registro.medidor,
			fecha_gestion: registro.fecha_gestion,
			tipo_tarifa: registro.tipo_tarifa,
			giro: registro.giro,
			tipo_gestion: registro.tipo_gestion,
			recibo: registro.recibo,
			fecha_pago: registro.fecha_pago,
			url_evidencia: registro.url_evidencia,
			url_fachada: registro.url_fachada,
			paquete: paquete,
			proceso: registro.proceso,
			pagos: registro.pagos,
			recibos: registro.recibos,
			clave_catastral: registro.clave_catastral,
			superficie_terreno: registro.superficie_terreno,
			superficie_construccion: registro.superficie_construccion,
			valor_terreno: registro.valor_terreno,
			valor_contruccion: registro.valor_construccion,
			valor_catastral: registro.valor_catastral,
			fecha_actualizacion: registro.fecha_actualizacion,
			fecha_corte_adeudo: registro.fecha_corte_adeudo,
			monto_adeudo: registro.monto_adeudo,
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

			const registrosO = paquetes.map(registro => ({ ...registro }))

			console.log(registrosO)

			setRegistrosOriginales(registrosO)

			paquetes.forEach(registro => {
				const { cuenta, activate } = registro
				if (!registrosAgrupados[cuenta]) {
					registrosAgrupados[cuenta] = { 
						id: registro.id, 
						cuenta, 
						calle: registro.calle, 
						id_local: registro.id_local, 
						giro: registro.giro, 
						colonia: registro.colonia, 
						latitud: registro.latitud, 
						folio: registro.folio,
						gestor: registro.gestor, 
						fecha_gestion: registro.fecha_gestion, 
						longitud: registro.longitud, 
						propietario: registro.propietario, 
						servicio: registro.servicio, 
						status_previo: registro.status_previo, 
						tarea_gestionada: registro.tarea_gestionada, 
						tipo_gestion: registro.tipo_gestion, 
						medidor: registro.medidor,
						tipo_servicio: registro.tipo_servicio, 
						tipo_tarifa: registro.tipo_tarifa, 
						total_pagado: registro.total_pagado, 
						url_evidencia: registro.url_evidencia, 
						url_fachada: registro.url_fachada, 
						proceso: registro.proceso,
						activate, 
						clave_catastral: registro.clave_catastral, 
						superficie_terreno: registro.superficie_terreno, 
						superficie_construccion: registro.superficie_construccion, 
						valor_terreno: registro.valor_terreno, 
						valor_construccion: registro.valor_construccion, 
						valor_catastral: registro.valor_catastral, 
						fecha_actualizacion: registro.fecha_actualizacion,
						fecha_corte_adeudo: registro.fecha_corte_adeudo,
						monto_adeudo: registro.monto_adeudo,
						pagos: [] 
					}
				}
	
				if (registro) {
					registrosAgrupados[cuenta].pagos.push({
						descripcion: registro.descripcion || "",
						descuentos: registro.descuentos || "",
						total_pagado: registro.total_pagado || 0,
						fecha_pago: registro.fecha_pago || "", 
						recibo: registro.recibo || ""
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
			console.log(registrosOriginales)
	
		} catch (error) {
			console.error('Ocurrió un error:', error.message)
			setCargando(false)
		}
	}

	const createExcel = () => {
		if (Object.keys(registrosOriginales).length === 0) {
			console.error('No hay registros para exportar a Excel.')
			return
		}
	
		const data = Object.values(registrosOriginales).map(registro => ({
			id_local: registro.id_local,
			cuenta: registro.cuenta,
			folio: registro.folio,
			calle: registro.calle,
			colonia: registro.colonia,
			latitud: registro.latitud,
			longitud: registro.longitud,
			propietario: registro.propietario,
			servicio: registro.servicio,
			tarea_gestionada: registro.tarea_gestionada,
			gestor: registro.gestor,
			fecha_gestion: registro.fecha_gestion,
			medidor: registro.medidor,
			tipo_servicio: registro.tipo_servicio,
			giro: registro.giro,
			tipo_tarifa: registro.tipo_tarifa,
			total_pagado: registro.total_pagado,
			proceso: registro.proceso,
			url_evidencia: registro.url_evidencia,
			url_fachada: registro.url_fachada,
			clave_catastral: registro.clave_catastral,
			superficie_terreno: registro.superficie_terreno,
			superficie_construccion: registro.superficie_construccion,
			valor_terreno: registro.valor_terreno,
			valor_construccion: registro.valor_construccion,
			valor_catastral: registro.valor_catastral,
			fecha_pago: registro.fecha_pago,
			recibo: registro.recibo,
			descuento: registro.descuento,
			descripcion: registro.descripcion,
			fecha_actualizacion: registro.fecha_actualizacion,
			fecha_corte_adeudo: registro.fecha_corte_adeudo,
			monto_adeudo: registro.monto_adeudo
		}))
	
		const worksheet = XLSX.utils.json_to_sheet(data)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros')
	
		XLSX.writeFile(workbook, 'registros.xlsx')

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

	return (

		<Box className='records_impression' minHeight='100vh' display={'flex'} justifyContent={'start'} flexDirection={'column'}>

			<Typography 
				variant="h3"
				fontWeight="bold"
				color='#e0e0e0'
				sx={{ m: "0 0 5px 0", fontSize:'24px' }}
				width={'100%'} 
				textAlign={'start'} 
				padding={'0px 50px'}
			>
                Creación de fichas
            </Typography>

			<Typography
				sx={{ m: "0 0 5px 0" }}
				color={'#4cceac'}
				width={'100%'} 
				textAlign={'start'} 
				fontSize={'16px'} 
				padding={'0px 50px'}
			>
				Creación, impresión y subida de fichas al sistema online de almacenamiento.
			</Typography>
		
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

					{/* {
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

					} */}

					

					{/* { registro ? <Button variant="text" sx={{ marginTop:'30px', width:'100%', maxWidth:'200px', color:  isLightMode ? '#000000' : 'white', fontWeight:'600', fontSize:'.8rem'}} fullWidth onClick={() => setOpenPreview(true)}> VER PREVIEW </Button> :false } */}

					{ rango > 0 ? 
						<Tooltip
							title={generarText} 
							enterDelay={100} 
							leaveDelay={200}	
						>
							<span>
								<Button onClick={() => handleStartUp()} variant="contained" sx={{ marginTop:'10px', width:'100%', maxWidth:'250px', color:'white', fontWeight:'600', fontSize:'.8rem'}} fullWidth> GENERAR FICHAS PDF </Button> 
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
								<>
									<Box sx={{ width:'100%', mt:'10px', display:'flex', justifyContent:'center', alignItems:'center', gap:'1rem', maxWidth:'300px' }}>
										<Button variant="contained" onClick={handleDownload} color="success" sx={{  width:'50%', color:'white', fontWeight:'600', fontSize:'.6rem' }}>DESCARGAR</Button>
										<Button onClick={() => createExcel()} variant="contained" sx={{ width:'50%', color:'white', fontWeight:'600', fontSize:'.6rem'}}>Crear Excel</Button>
									</Box>
									<Box>
										<Button variant="outlined" onClick={() => (setId(paquete.id), setOpenDelete(true))} color="error" sx={{ background:'rgba(255, 0, 0, 0.3)', width:'50%', color:'white', fontWeight:'600', fontSize:'.6rem', mt:'10px' }}><DeleteIcon sx={{ color:'red' }} /></Button>
									</Box>
								</>
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
									<Typography width={'80%'} mb={'1rem'} fontSize={'1.5rem'} color={'#cff9e0'} textAlign={'center'}>Este paquete ya creo todas las fichas posibles y esta listo para descargar, si hubo alguna correción subir ficha individual.</Typography>
									<ArticleIcon sx={{fontSize:'3.5rem', color:'#cff9e0'}}></ArticleIcon>
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

			{ loading ? <ChargeCounter value={completedRequests} /> : false}
			{ cargando ? <ChargeMessage/> : false} 
			{ openDelete ? <ModalDelete id={id} setOpenDelete={setOpenDelete} /> : false }

		</Box>

	)

}

export default Impression
