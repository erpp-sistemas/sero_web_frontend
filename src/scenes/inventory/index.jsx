import { useState } from 'react'
import { Box, Typography, Button, Input, Pagination, PaginationItem, Select, FormControl, InputLabel, MenuItem } from '@mui/material'
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

/**
 * @name PáginaPrincipalInventarios
 * @author Iván Sánchez
 * @component
*/
function Inventory() {
    const [filtro, setFiltro] = useState('todos')
    const [currentPage, setCurrentPage] = useState(1)
	const [openNew, setOpenNew] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [openMantenimiento, setOpenMantenimiento] = useState(false)
	const [openAsignacion, setOpenAsignacion] = useState(false)
	const [openPagos, setOpenPagos] = useState(false)
    const itemsPerPage = 4
	const [alert, setAlert] = useState(false)
	const [alertError, setAlertError] = useState(false)
	const [alertClean, setAlertClean] = useState(false)
	const [encargado, setEncargado] = useState('')

    const handleFiltroChange = (nuevoFiltro) => {
        setFiltro(nuevoFiltro)
        setCurrentPage(1)
    }

	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

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

	const CustomPaginationItem = styled(PaginationItem)(({ selected }) => ({
		...(selected && {
			backgroundColor: 'green',
			color: '#fff',
			'&:hover': {
				backgroundColor: 'darkgreen',
			},
		}),
	}))

    const vehiculos = [
        { id: 1, tipo: 'MOTOCICLETA', marca: 'ITALIKA', matricula: '8496F5', tenencia: 'pagado', img: 'https://dhqlmcogwd1an.cloudfront.net/images/cache/01-italika-st90-210-150.jpeg' },
        { id: 2, tipo: 'MOTOCICLETA', marca: 'HONDA', matricula: 'FC1234', tenencia: 'noPagado', img: 'https://ss207.liverpool.com.mx/xl/1139648206.jpg'},
        { id: 3, tipo: 'MOTOCICLETA', marca: 'ITALIKA', matricula: '8496F5', tenencia: 'pagado', img: 'https://dhqlmcogwd1an.cloudfront.net/images/cache/01-italika-st90-210-150.jpeg' },
        { id: 4, tipo: 'CAMIONETA', marca: 'TOYOTA', matricula: 'ASD321', tenencia: 'proximo', img: 'https://www.shutterstock.com/image-photo/delivery-van-side-view-isolated-600nw-2340171635.jpg'},
        { id: 5, tipo: 'MOTOCICLETA', marca: 'HONDA', matricula: 'FC1234', tenencia: 'noPagado', img: 'https://ss207.liverpool.com.mx/xl/1139648206.jpg'},
        { id: 6, tipo: 'CAMIONETA', marca: 'TOYOTA', matricula: 'ASD321', tenencia: 'proximo', img: 'https://www.shutterstock.com/image-photo/delivery-van-side-view-isolated-600nw-2340171635.jpg'},
    ]

    const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
        if (filtro === 'todos') return true
        return vehiculo.tenencia === filtro
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = vehiculosFiltrados.slice(indexOfFirstItem, indexOfLastItem)

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

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
				sx={{ m: "0 0 5px 0", fontSize:'24px' }}
				width={'100%'} 
				textAlign={'start'} 
				padding={'0px 50px'}
			>
                Control vehicular
            </Typography>

			<Typography
				sx={{ m: "0 0 5px 0" }}
				color={'#4cceac'}
				width={'100%'} 
				textAlign={'start'} 
				fontSize={'16px'} 
				padding={'0px 50px'}
			>
				Creación, asignación, historial y manejo de vehículos entre otras opciones en el sistema.
			</Typography>

            <Box sx={{ width:'100%', padding:'0px 50px', mt:'30px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>

                <Box sx={{ width:'auto', display:'flex', justifyContent:'center', alignItems:'center', gap:'15px' }}>

                    <Button 
                        onClick={() => handleFiltroChange('todos')} 
                        sx={{ 
                            border:'1px solid white', 
                            borderRadius:'20px', 
							padding:'5px 20px',
							color:'#fff',
							fontWeight:'500',
							fontSize:'14px',
                            background: filtro === 'todos' ? isLightMode ? '#4cceac' : 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
							'&:hover': {
								background: isLightMode ? 'rgba(0, 178, 139, 0.4)' : 'rgba(255,255,255,0.3)', 
								cursor: 'pointer'
							}
                        }}
                    >
                        Todos los vehículos
                    </Button> 

                    <Button 
                        onClick={() => handleFiltroChange('noPagado')} 
                        sx={{ 
                            border:'1px solid white', 
                            borderRadius:'20px', 
							padding:'5px 20px',
							color:'#fff',
							fontWeight:'500',
							fontSize:'14px',
                            background: filtro === 'noPagado' ? isLightMode ? '#4cceac' : 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
							'&:hover': {
								background: isLightMode ? 'rgba(0, 178, 139, 0.4)' : 'rgba(255,255,255,0.3)', 
								cursor: 'pointer'
							}
                        }}
                    >
                        Vehículos con deuda
                    </Button> 

                    <Button 
                        onClick={() => handleFiltroChange('proximo')} 
                        sx={{ 
                            border:'1px solid white', 
                            borderRadius:'20px', 
							padding:'5px 20px',
							color:'#fff',
							fontWeight:'500',
							fontSize:'14px',
                            background: filtro === 'proximo' ? isLightMode ? '#4cceac' : 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
							'&:hover': {
								background: isLightMode ? 'rgba(0, 178, 139, 0.4)' : 'rgba(255,255,255,0.3)', 
								cursor: 'pointer'
							}
                        }}
                    >
                        Vehículos con pagos cercanos
                    </Button>
					
                </Box>

                <Button 
					variant="contained" 
					color="success" 
					onClick={() => setOpenNew(!openNew)}
					sx={{
						color:'white',
						fontSize:'14px',
						fontWeight:'500'
					}}
				>
					+ Agregar vehículo
				</Button>

            </Box>

            <Box sx={{ width:'100%', mt:'30px', padding:'0px 50px', display:'flex', justifyContent:'start', alignItems:'center' }}>

                <Box sx={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                    <SearchIcon />
                    <Input type="text" placeholder='Buscar por placa'/>
                </Box>

				<Box sx={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>

					<FormControl 
						fullWidth
						sx={{
							ml:'30px'
						}}
					>
						<InputLabel id="encargado">ENCARGADO</InputLabel>
						<Select
							labelId="encargado"
							id="encargado"
							value={encargado}
							label="ENCARGADO"
							onChange={event => setEncargado(event.target.value)}
							sx={{
								width:'200px'
							}}
						>
							<MenuItem value={'administrador'}>Administrador</MenuItem>
						</Select>
					</FormControl>

                </Box>

            </Box>

            <Box 
                sx={{ width:'100%', height:'auto', marginTop:'10px', mb:'100px', padding:'0px 50px', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', gap:'15px' }}
            >
                {currentItems.map((vehiculo) => (
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
                            <img src={vehiculo.img} alt="" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                        </Box>

                        <Box sx={{ width:'100%', height:'100px', display:'flex', justifyContent:'space-between', alignItems:'start', padding:'5px' }}>
                            <button><ConstructionIcon sx={{ color:'#003566', fontSize:'30px' }} onClick={() => setOpenMantenimiento(true)}/></button>
                            <button><InfoIcon sx={{ color:'#2dc653', fontSize:'30px' }} onClick={() => setOpenEdit(true)}/></button>
                        </Box>

                        <Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', fontWeight:'600' }}>{vehiculo.tipo}</Typography>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', mt:'10px' }}>{vehiculo.marca}</Typography>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', mt:'10px' }}>{vehiculo.matricula}</Typography>


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
									color:'white',
									background:'#023e8a',
									padding:'10px 20px',
									fontSize:'13px',
									fontWeight:'600'
								}}
								onClick={() => setOpenAsignacion(true)}
							>
								ASIGNACIÓN
							</Button>
						</Box>

                    </Box>

                ))}

            </Box>

            <Box>
			<Pagination
				count={Math.ceil(vehiculosFiltrados.length / itemsPerPage)}
				page={currentPage}
				onChange={handlePageChange}
				color="primary"
				renderItem={(item) => (
					<CustomPaginationItem
						{...item}
						selected={item.page === currentPage}
					/>
				)}
			/>
            </Box>

			{ openNew ? <NewVehiculo setOpenNew={setOpenNew} setAlertClean={setAlertClean} /> : false }

			{ openEdit ? <EditVehiculo setOpenNew={setOpenEdit} /> : false }

			{ openMantenimiento ? <MantenimientoVehiculo setOpenNew={setOpenMantenimiento} /> : false }

			{ openAsignacion ? <AsignacionVehiculos setOpenNew={setOpenAsignacion} /> : false }

			{ openPagos ? <PagosVehiculos setOpenNew={setOpenPagos} /> : false }

			<Alerts message='VEHICULO AGREGADO CORRECTAMENTE' alertOpen={alert} setAlertOpen={setAlert} variant='success'/>

			<Alerts message='SE LIMPIARON LOS CAMPOS DE AGREGAR UN VEHICULO' alertOpen={alertClean} setAlertOpen={setAlertClean} variant='info'/>

			<Alerts message='HUBO UN ERROR AL AGREGAR UN VEHICULO' alertOpen={alertError} setAlertOpen={setAlertError} variant='error'/>

        </Box>

    )

}

export default Inventory