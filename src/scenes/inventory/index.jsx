import { useState } from 'react'
import { Box, Typography, Button, Input, Pagination, PaginationItem } from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction';
import SearchIcon from '@mui/icons-material/Search'
import NewVehiculo from '../../components/inventory/newVehiculo'
import InfoIcon from '@mui/icons-material/Info'

/**
 * @name PáginaPrincipalInventarios
 * @author Iván Sánchez
 * @component
 */
function Inventory() {
    const [filtro, setFiltro] = useState('todos')
    const [currentPage, setCurrentPage] = useState(1)
	const [openNew, setOpenNew] = useState(false)
    const itemsPerPage = 4

    const handleFiltroChange = (nuevoFiltro) => {
        setFiltro(nuevoFiltro)
        setCurrentPage(1)
    }

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
				color='#e0e0e0'
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
                            color:'white', 
                            border:'1px solid white', 
                            borderRadius:'20px', 
                            background: filtro === 'todos' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' 
                        }}
                    >
                        Todos los vehículos
                    </Button> 
                    <Button 
                        onClick={() => handleFiltroChange('noPagado')} 
                        sx={{ 
                            color:'white', 
                            border:'1px solid white', 
                            borderRadius:'20px', 
                            background: filtro === 'noPagado' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' 
                        }}
                    >
                        Vehículos con deuda
                    </Button> 
                    <Button 
                        onClick={() => handleFiltroChange('proximo')} 
                        sx={{ 
                            color:'white', 
                            border:'1px solid white', 
                            borderRadius:'20px', 
                            background: filtro === 'proximo' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' 
                        }}
                    >
                        Vehículos con pagos cercanos
                    </Button>
                </Box>

                <Button variant="contained" color="success" onClick={() => setOpenNew(!openNew)}>+ Agregar vehículo</Button>

            </Box>

            <Box sx={{ width:'100%', mt:'30px', padding:'0px 50px' }}>
                <Box sx={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                    <SearchIcon />
                    <Input type="text" placeholder='Buscar por placa'/>
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
                            background:'rgba(0,0,0,0.3)', 
                            position:'relative', 
                            borderRadius:'10px', 
                            padding:'5px',
                            border: vehiculo.tenencia === 'pagado' ? '2px solid green' : vehiculo.tenencia === 'proximo' ? '2px solid yellow' : vehiculo.tenencia === 'noPagado' ? '2px solid red' : false, 
                            mt:'100px' 
                        }}
                    >
                        <Box 
                            sx={{ 
                                width: '130px', 
                                height: '130px', 
                                background: '#fff', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                borderRadius: '100%', 
                                overflow: 'hidden', 
                                position: 'absolute', 
                                top: '0%', 
                                left: '50%', 
                                transform: 'translate(-50%,-40%)',
                                border: vehiculo.tenencia === 'pagado' ? '2px solid green' : vehiculo.tenencia === 'proximo' ? '2px solid yellow' : vehiculo.tenencia === 'noPagado' ? '2px solid red' : false
                            }}
                        >
                            <img src={vehiculo.img} alt="" width={'100%'} height={'100%'} />
                        </Box>

                        <Box sx={{ width:'100%', height:'100px', display:'flex', justifyContent:'space-between', alignItems:'start', padding:'5px' }}>
                            <button><ConstructionIcon sx={{ color:'red', fontSize:'30px' }} /></button>
                            <button><InfoIcon sx={{ color:'blue', fontSize:'30px' }} /></button>
                        </Box>

                        <Box sx={{ width:'100%', height:'auto' }}>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', fontWeight:'600' }}>{vehiculo.tipo}</Typography>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', mt:'10px' }}>{vehiculo.marca}</Typography>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', mt:'10px' }}>{vehiculo.matricula}</Typography>
                            <Typography sx={{ width:'100%', textAlign:'center', fontSize:'18px', fontWeight:'600', mt:'10px', color: vehiculo.tenencia === 'pagado' ? 'green' : vehiculo.tenencia === 'proximo' ? 'yellow' : vehiculo.tenencia === 'noPagado' ? 'red' : false }}>PAGOS</Typography>
                        </Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', mt:'10px' }}>
							<Button
								sx={{
									color:'white',
									background:'black',
									
								}}
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
					<PaginationItem
						{...item}
						sx={{
							color: item.page === currentPage ? 'green' : 'inherit',
						}}
					/>
				)}
			/>
            </Box>

			{ openNew ? <NewVehiculo setOpenNew={setOpenNew} /> : false }

        </Box>

    )

}

export default Inventory