import { Box, Button, MenuItem, FormControl, InputLabel, Select, TextField, Typography } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import { useEffect, useState } from 'react'
import tool from '../../toolkit/toolkitImpression.js'
import Preview from '../../components/Records/Preview.jsx'
import Charge from '../../components/Records/charge.jsx'

const Impression = () => {

	const [loading, setLoading] = useState(false)
	const [registros, setRegistros] = useState({})
	const [registro, setRegistro] = useState(null)
	const [rango, setRango] = useState(0)
	const [rangoInicial, setRangoInicial] = useState(0)
	const [rangoFinal, setRangoFinal] = useState(0)
	const [paquetes, setPaquetes] = useState([])
	const [paquete, setPaquete] = useState({})
	const [selectedCuenta, setSelectedCuenta] = useState('')
	const [idPaquete, setIdPaquete] = useState(0)
	const [openPreview, setOpenPreview] = useState(0)

	const handlePaqueteChange = async (event) => {
		setLoading(true)
        const selectedId = event.target.value
		setIdPaquete(event.target.value)
        const selectedPaquete = paquetes.find(item => item.id === selectedId)
        setPaquete(selectedPaquete)
		console.log(paquete)
		handleRegistro()
		
	}	

	const handleSeleccionRegistro = (registroN) => {
		setRegistro(registroN)
		console.log(registro)
	}

	const handleRegistro = async () => {

		try {

			const paquetes = await tool.getRegistrosById(idPaquete)
	
			const registrosAgrupados = {}
	
			paquetes.forEach(registro => {
				const {
					cuenta,
					calle,
					colonia,
					status_previo,
					tarea_gestionada,
					tipo_gestion,
					tipo_servicio,
					tipo_tarifa,
					total_pagado,
					url_evidencia,
					url_fachada,
				} = registro
	
				if (!registrosAgrupados[cuenta]) {
					registrosAgrupados[cuenta] = {
						calle,
						colonia,
						status_previo,
						tarea_gestionada,
						tipo_gestion,
						tipo_servicio,
						tipo_tarifa,
						total_pagado,
						url_evidencia,
						url_fachada,
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
			})

			setRegistros(registrosAgrupados)
			setRango(Object.keys(registrosAgrupados).length)
			setRangoInicial(1)
			setRangoFinal(Object.keys(registrosAgrupados).length)
			setLoading(false)
	
		} catch (error) {
			console.error('Ocurrió un error:', error.message)
		}

	}

	useEffect(() => {

		const apiPaquetes = async () => {
			try {
				const paquetes = await tool.getPaquetes()
				setPaquetes(paquetes)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		apiPaquetes()

	}, [])

	useEffect(() => {
		if (idPaquete) {
			handleRegistro()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idPaquete])

    return (

        <Box className='records_impression' minHeight='100vh' display={'flex'} justifyContent={'start'} flexDirection={'column'}>

           <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Creación de Fichas</Typography>
		
            <Box className='records_impression__grid' sx={{ mt:'1rem', width:'auto', display:'flex', minHeight:'500px', justifyContent:'center', alignItems:'center' }} container spacing={0}>

				<Box className='records_impression__content' sx={{ minHeight: '500px', width:'100%', height:'auto', backgroundColor:'rgba(255, 255, 255, 0.250)', borderTopLeftRadius:'10px', borderBottomLeftRadius:'10px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
					
					<Box sx={{ width:'100%', maxWidth:'300px' }} display={'flex'} justifyContent={'space-between'} >

						<FormControl sx={{ width:'100%' }} className='inputCustom'>

							<InputLabel id='demo-simple-select-label' color='primary' sx={{ color:'#fff', width:'100%' }}> PAQUETE </InputLabel>

							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								value={idPaquete}
								label='PAQUETE'
								onChange={handlePaqueteChange}
								sx={{ color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
							>
								{paquetes.map(item => (
                                    <MenuItem key={item.id} value={item.id}>{item.id} - {item.nombre}</MenuItem>
                                ))}
							</Select>

						</FormControl>

					</Box>

					<InputLabel id='demo-simple-select-label' color='primary' sx={{ color:'#fff', mt:'10px', mb:'10px' }}> RANGO </InputLabel>

				<Box className='records_impression__ranges' sx={{ width:'100%', maxWidth:'300px', display:'flex', justifyContent:'center', alignItems:'center', gap:'.5rem' }}>
					
					<TextField 
						sx={{ 
							width:'100%', 
							'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': { color: 'black' },
							'& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { 
								'-webkit-appearance': 'none', 
								margin: 0,
							},
							'& input[type=number]': {
								'-moz-appearance': 'textfield',  
							}
						}} 
						id='outlined-basic' 
						label='INICIO'	
						onChange={(event) => setRangoInicial(event.target.value)}
						variant='outlined' 
						value={rangoInicial}
						type='number'
					/>
					
					<TextField 
						sx={{ 
							width:'100%', 
							'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': { color: 'black' },
							'& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {  
								'-webkit-appearance': 'none',  
								margin: 0,
							},
							'& input[type=number]': {
								'-moz-appearance': 'textfield', 
							}
						}} 
						id='outlined-basic' 
						label='FINAL' 
						onChange={(event) => setRangoFinal(event.target.value)}
						variant='outlined' 
						value={rangoFinal}
						type='number'
					/>

				</Box>

					<Typography color={'#fffff'} fontSize={'1rem'} mb={'10px'} mt={'10px'}> Ficha Preview</Typography>
	
					<Box sx={{ width:'100%', maxWidth:'300px' }} display={'flex'} justifyContent={'space-between'} >

						<FormControl sx={{ width:'100%' }} className='inputCustom'>

							<InputLabel id='demo-simple-select-label' color='primary' sx={{ color:'#fff', width:'100%' }}> FICHA </InputLabel>

							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								value={selectedCuenta}
								label='FICHA'
								onChange={(event) => setSelectedCuenta(event.target.value)}
								sx={{ color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
							>
								{Object.keys(registros).slice(0, 10).map((cuenta, index) => (
									<MenuItem key={index} value={cuenta} onClick={() => handleSeleccionRegistro(registros[cuenta])}>{cuenta}</MenuItem>
								))}
							</Select>	

						</FormControl>

					</Box>

					{ registro ? <Button variant="text" sx={{ marginTop:'30px', width:'100%', maxWidth:'200px', color:'white', fontWeight:'600', fontSize:'.8rem'}} fullWidth onClick={() => setOpenPreview(true)}> VER PREVIEW </Button> :false }

					<Button variant="contained" sx={{ marginTop:'30px', width:'100%', maxWidth:'250px', color:'white', fontWeight:'600', fontSize:'.8rem'}} fullWidth> GENERAR FICHAS PDF </Button>

				</Box>

				<Box className='records_impression__data' sx={{ minHeight: '500px', height:'auto', width:'100%', background:'rgba(255, 255, 255, 0.250)', borderTopRightRadius:'10px', borderBottomRightRadius:'10px', display:'flex', flexDirection:'column', gap:'2rem' }} fullWidth >
										
					{ 
						Object.keys(paquete).length !== 0 ? ( 

						<>
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Nombre de paquete:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.nombre}</Typography>
							</Box>
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Nombre de usuario:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.usuario}</Typography>
							</Box>
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Plaza:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.plaza}</Typography> 
							</Box>
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Servicio:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.servicio}</Typography> 
							</Box>
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Fecha de corte:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.fecha_corte}</Typography> 
							</Box>
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Documento Excel:</Typography>
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
							</Box>
							{
								paquete.folio !== 'desconocido' ? (

									<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Folio:</Typography><Typography sx={{ fontSize:'1rem' }}>{paquete.folio}</Typography> 
									</Box>

								):( false )

							}
							<Box className='records_impression__data__box' display={'flex'} justifyContent={'center'} alignItems={'center'}>
								<Typography sx={{ fontWeight:'600', fontSize:'1.1rem', color:'#cff9e0' }}>Cantidad de Registros:</Typography><Typography sx={{ fontSize:'1rem' }}>{rango}</Typography> 
							</Box>

						</>

						):(
							<Box className='record_impression__empty' sx={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:'100%' }}>
								<Typography mb={'1rem'} fontSize={'1.5rem'} textAlign={'center'}>Selecciona un paquete para ver la informacion</Typography>
								<ArticleIcon sx={{fontSize:'3.5rem'}}></ArticleIcon>
							</Box>
						)

					}

				</Box>

            </Box>

			{ openPreview ? <Preview setOpenPreview={setOpenPreview} registro={registro}  /> : false }
			{ loading ? <Charge /> : false}

        </Box>

    )

}

export default Impression

