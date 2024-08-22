import { useState, useEffect } from 'react'
import { Box, Typography, Button, Input, Pagination } from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction'
import SearchIcon from '@mui/icons-material/Search'
import NewVehiculo from '../../components/inventory/newVehiculo'
import EditVehiculo from '../../components/inventory/editVehiculo'
import MantenimientoVehiculo from '../../components/inventory/mantenimientoVehiculo'
import AsignacionVehiculos from '../../components/inventory/asignacionVehiculos'
import InfoIcon from '@mui/icons-material/Info'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import * as React from 'react'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import CheckIcon from '@mui/icons-material/Check'	
import WarningIcon from '@mui/icons-material/Warning'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Alerts from '../../components/Alerts'
import PagosVehiculos from '../../components/inventory/pagosVehiculos'
import toolkitVehiculos from '../../toolkit/toolkitVehiculos'
import { setEditColor, setEditKilometraje, setEditColorLlavero, setEditImagePreview, setEditMarca, setEditModelo, setEditPlaca, setEditSelectedPlace, setEditSerie, setEditTipoMotor, setEditVehiculo } from '../../redux/vehiculosSlices/editarInformacionGeneral.js'
import { setOpen } from '../../redux/vehiculosSlices/editarVehiculoSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { Download } from "@mui/icons-material"

/**
 * @name PáginaPrincipalInventarios
 * @author Iván Sánchez
 * @component
*/
function Inventory() {
	const [openNew, setOpenNew] = useState(false)
	const [openMantenimiento, setOpenMantenimiento] = useState(false)
	const [openAsignacion, setOpenAsignacion] = useState(false)
	const [openPagos, setOpenPagos] = useState(false)
	const [alert, setAlert] = useState(false)
	const [alertError, setAlertError] = useState(false)
	const [alertClean, setAlertClean] = useState(false)
	const [vehiculosPrueba, setVehiculosPrueba] = useState([])
	const [busqueda, setBusqueda] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [filtro, setFiltro] = useState('todos')

	const editarVehiculo = useSelector(state => state.editarVehiculo)
	const dispatch = useDispatch()

	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

	const itemsPerPage = 4

	const HtmlTooltip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} />
		))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			color: 'rgba(0, 0, 0, 0.2)',
			maxWidth: 220,
			fontSize: theme.typography.pxToRem(12),
			border: '1px solid #dadde9',
		},
	}))

	const CambiarVehiculo = async (vehiculo) => {
		console.log(vehiculo)
		dispatch(setEditColorLlavero(vehiculo.color_llavero))
		dispatch(setEditColor(vehiculo.color))
		dispatch(setEditKilometraje(vehiculo.kilometraje))
		dispatch(setEditImagePreview(vehiculo.imagen_vehiculo))
		dispatch(setEditMarca(vehiculo.marca))
		dispatch(setEditModelo(vehiculo.modelo))
		dispatch(setEditPlaca(vehiculo.placa))
		dispatch(setEditSelectedPlace(vehiculo.plaza))
		dispatch(setEditSerie(vehiculo.serie))
		dispatch(setEditTipoMotor(vehiculo.tipo_motor))
		dispatch(setEditVehiculo(vehiculo.vehiculo))
	}

	const dataVeiculos = async () => {
		try {
			const response = await toolkitVehiculos.getVehiculos()
			const data = response.data.data
			setVehiculosPrueba(data)
		} catch (err) {
			console.error(err)
		} 
	}

    useEffect(() => {
        dataVeiculos()
    }, [])
	
	const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

	const filteredVehiculos = vehiculosPrueba.filter((vehiculo) =>
        vehiculo.placa.toLowerCase().includes(busqueda.toLowerCase())
    )

    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = filteredVehiculos.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage) || 1 

    return (

        <Box
            width={'100%'}
            padding={'10px'}
            minHeight='100vh'
            display={'flex'}
            justifyContent={'start'}
            alignItems={'center'}
            flexDirection={'column'}
        >
            <Typography 
				variant="h3"
				fontWeight="bold"
				color={ isLightMode ? '#000' : '#e0e0e0' }
				sx={{ 
					m: "0 0 5px 0", 
					fontSize:'24px',
					padding:{
						xs:'0px 5px',
						md:'0px 50px'
					},
					width:'100%',
					textAlign:'start'
				}}
			>
                Control vehicular
            </Typography>
			<Typography
				sx={{
					m: "0 0 5px 0",
					padding:{
						xs:'0px 5px',
						md:'0px 50px'
					},
				}}
				color={'#4cceac'}
				width={'100%'} 
				textAlign={'start'} 
				fontSize={'16px'} 
				
			>
				Creación, asignación, historial y manejo de vehículos entre otras opciones en el sistema.
			</Typography>

            <Box sx={{ width:'100%', padding:{ xs:'0px 5px', md:'0px 50px' }, mt:'30px', display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:{ xs:'column', md:'row' }, gap:{ xs:'20px', md:'0px' } }}>

                <Box sx={{ width:'auto', display:'flex', justifyContent:'center', alignItems:'center', gap:'15px', flexDirection:{ xs:'column', md:'row' } }}>

                    <Button 
                        onClick={() => setFiltro('todos')} 
                        sx={{ 
                            borderRadius:'20px', 
							padding:'5px 20px',
							color:'#fff',
							fontWeight:'700',
							fontSize:'12px',
                            background: filtro === 'todos' ? '#00ff00' : 'rgba(255,255,255, 0.4)' ,
							'&:hover': {
								background: 'rgba(255,255,255, 0.6)', 
								cursor: 'pointer'
							}
                        }}
                    >
                        Todos los vehículos
                    </Button> 

                    <Button 
                        onClick={() => setFiltro('noPagado')} 
                        sx={{ 
                            borderRadius:'20px', 
							padding:'5px 20px',
							color:'#fff',
							fontWeight:'700',
							fontSize:'12px',
							background: filtro === 'noPagado' ? '#00ff00' : 'rgba(255,255,255, 0.4)' ,
							'&:hover': {
								background: 'rgba(255,255,255, 0.6)', 
								cursor: 'pointer'
							}
                        }}
                    >
                        Vehículos con deuda
                    </Button> 

                    <Button 
                        onClick={() => setFiltro('proximo')} 
                        sx={{ 
                            borderRadius:'20px', 
							padding:'5px 20px',
							color:'#fff',
							fontWeight:'700',
							fontSize:'12px',
							background: filtro === 'proximo' ? '#00ff00' : 'rgba(255,255,255, 0.4)' ,
							'&:hover': {
								background: 'rgba(255,255,255, 0.6)', 
								cursor: 'pointer'
							}
                        }}
                    >
                        Vehículos con pagos cercanos
                    </Button>
					
                </Box>

                <Button 
					variant="contained" 
					onClick={() => setOpenNew(!openNew)}
					sx={{
						color:'white',
						fontSize:'14px',
						fontWeight:'500',
						bgcolor: 'secondary.main', 
						'&:hover': { bgcolor: 'secondary.dark' }
					}}
				>
					+ Agregar vehículo
				</Button>

            </Box>

            <Box sx={{ width:'100%', mt:'30px', padding:'0px 50px', display:'flex', justifyContent:'start', alignItems:'center', gap:'2rem' }}>

                <Box sx={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                    <SearchIcon />
                    <Input type="text" onChange={e => setBusqueda(e.target.value)} value={busqueda} placeholder='Buscar por placa'/>
                </Box>

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

            <Box 
                sx={{ width:'100%', height:'auto', marginTop:'10px', mb:'100px', padding:'0px 50px', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', gap:'15px' }}
            >
                {
					currentItems.map((vehiculo) => (
						<Box 
							key={vehiculo.id} 
							sx={{ 
								minWidth:'250px', 
								height:'340px', 
								position:'relative', 
								borderRadius:'10px', 
								padding:'5px',
								mt:'100px',
								background: 'linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
								boxShadow: '5px 10px 20px rgba(0, 0, 0, 0.5)'
							}}
						>
							<Box 
								sx={{ 
									width: '120px', 
									height: '120px', 
									background: '#ffffff', 
									display: 'flex', 
									justifyContent: 'center', 
									alignItems: 'center', 
									borderRadius: '50%', 
									overflow: 'hidden', 
									position: 'absolute', 
									top: '0%', 
									left: '50%', 
									transform: 'translate(-50%,-40%)',
									boxShadow: isLightMode ? '4px 7px 8px rgba(0,0,0,0.7)' : '', 
								}}
							>
								<img src={vehiculo.imagen_vehiculo} alt="" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
							</Box>

							<Box sx={{ width:'100%', height:'100px', display:'flex', justifyContent:'space-between', alignItems:'start', padding:'5px' }}>
								<button><ConstructionIcon sx={{ color:'#003566', fontSize:'30px' }} onClick={() => setOpenMantenimiento(true)}/></button>
								<button><InfoIcon sx={{ color:'#2dc653', fontSize:'30px' }} onClick={() => { dispatch(setOpen(true)); CambiarVehiculo(vehiculo) }}/></button>
							</Box>

							<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
								<Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', fontWeight:'600', textTransform:'uppercase' }}>{vehiculo.vehiculo}</Typography>
								<Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', mt:'10px', textTransform:'uppercase' }}>{vehiculo.marca}</Typography>
								<Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', mt:'10px', textTransform:'uppercase' }}>{vehiculo.placa}</Typography>

								<HtmlTooltip
									title={
										<React.Fragment>
												{ vehiculo.tenencia === 'noPagado' ? <Typography sx={{ color:'red'}}>Tiene pagos vencidos</Typography> : vehiculo.tenencia === 'proximo' ? <Typography sx={{ color:'#ee9b00', width:'100%', textAlign:'center' }}>Los pagos estan proximos a vencer</Typography> : <Typography color={'#457b9d'}>Los pagos estan al corriente</Typography>  }
										</React.Fragment>
									}
								>
									<Box 
										sx={{ 
											display:'flex',
											justifyContent:'center',
											alignItems:'center',
											borderRadius:'50%',
											mt:'10px'
										}}
									>
										{
											vehiculo.tenencia === 'noPagado' 
												? <Button onClick={() => setOpenPagos(true)} sx={{ height:'30px', cursor:'pointer', background:'none' }}>
													<PriorityHighIcon sx={{ color:'red', fontSize:'30px'}}/>
												</Button> : 
													vehiculo.tenencia === 'proximo' 
														? <Button onClick={() => setOpenPagos(true)} sx={{ height:'30px', cursor:'pointer', background:'none' }}>
															<WarningIcon sx={{ color:'yellow', fontSize:'30px' }}/> 
														</Button>
															: <Button onClick={() => setOpenPagos(true)} sx={{ height:'30px', cursor:'pointer', background:'none',  }}>
																<CheckIcon sx={{ color:'blue', fontSize:'30px' }}/> 
															</Button>
										}
									</Box>
								</HtmlTooltip>
							
							</Box>

							<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', mt:'20px' }}>
								<Button
									sx={{
										padding:'10px 20px',
										fontSize:'13px',
										fontWeight:'600',
										color:'white',
										bgcolor: 'secondary.main', 
										'&:hover': { bgcolor: 'secondary.dark' }
									}}
									onClick={() => setOpenAsignacion(true)}
								>
									ASIGNACIÓN
								</Button>
							</Box>

						</Box>
					))
				}

            </Box>

            <Box>
				<Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
					variant="outlined" color="secondary"
                    shape="rounded"
                />
            </Box>

			{ openNew ? <NewVehiculo setOpenNew={setOpenNew} setAlert={setAlert} setAlertClean={setAlertClean} dataVeiculos={dataVeiculos} /> : false }

			{ editarVehiculo.open ? <EditVehiculo /> : false }

			{ openMantenimiento ? <MantenimientoVehiculo setOpenMantenimiento={setOpenMantenimiento} /> : false }

			{ openAsignacion ? <AsignacionVehiculos setOpenAsignacion={setOpenAsignacion} /> : false }

			{ openPagos ? <PagosVehiculos setOpenPagos={setOpenPagos} /> : false }

			<Alerts message='VEHICULO AGREGADO CORRECTAMENTE' alertOpen={alert} setAlertOpen={setAlert} variant='success'/>

			<Alerts message='SE LIMPIARON LOS CAMPOS DE AGREGAR UN VEHICULO' alertOpen={alertClean} setAlertOpen={setAlertClean} variant='info'/>

			<Alerts message='HUBO UN ERROR AL AGREGAR UN VEHICULO' alertOpen={alertError} setAlertOpen={setAlertError} variant='error'/>

        </Box>

    )

}

export default Inventory