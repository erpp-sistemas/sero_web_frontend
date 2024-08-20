import { Box, Typography, Button, TextField, FormControl, Select, MenuItem } from "@mui/material"
import { useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { opcionesLiquidos, opcionesLuces, opcionesLlantas, opcionesMecanicas, opcionesAdicionales,  } from "../../../hooks/estadoVehiculoHook.js"
import { useSelector, useDispatch } from 'react-redux'
import MiniGallery from "../newVehiculo/miniGallery"
import { setObservaciones } from '../../../redux/vehiculosSlices/estadoAsignacion.js'

const AsignacionCurso = () => {
	const [open, setOpen] = useState(false)
	const [kilometraje, setKilometraje] = useState()
	const [combustible, setCombustible] = useState('')
	const estado = useSelector(state => state.estadoAsignacion)
	const dispatch = useDispatch()

	return (

		<Box sx={{ width:'100%', height:'auto' }}>

			<Box sx={{ width:'100%', display:'flex', justifyContent:'end', alignItems:'center' }}>
				<Button 
					variant="contained" 
					color="success" 
					onClick={() => console.log('click')}
					sx={{
						color:'white',
						fontSize:'14px',
						fontWeight:'500'
					}}
				>
					terminar Viaje
				</Button>
			</Box>

			<Typography sx={{ fontSize:'20px', fontWeight:'700' }}>
				Asignacion en curso
			</Typography>

			<Box sx={{ mt:'30px' }}>
				<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Asignado por:</span> Antonio Ticante</Typography>
				<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Asignado a:</span> Iván Sánchez</Typography>
				<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Tarea Realizada:</span> Ruta en campo</Typography>
				<Typography sx={{ fontSize:'20px', mt:'10px' }} ><span style={{ fontWeight: 700 }}>Fecha y hora de asignacion:</span> 12/08/2024 11:12:40</Typography>
			</Box>

			<Box sx={{ width:'100%', height:'auto', mt:'20px', borderTop:'1px solid #fff', paddingTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', gap:'15px' }} >

				<Box sx={{ width:'100%', height:'auto', padding:{ xs:'0px', md:'0px 0px' } }}>
					<Typography>Kilometraje Final</Typography>
					<TextField 
						sx={{ 
							width: '100%',
							mt: '10px',
							'& input[type=number]': {
								MozAppearance: 'textfield',
							},
							'& input[type=number]::-webkit-outer-spin-button': {
								WebkitAppearance: 'none',
								margin: 0,
							},
							'& input[type=number]::-webkit-inner-spin-button': {
								WebkitAppearance: 'none',
								margin: 0,
							},
						}} 
						id="filled-basic" 
						value={kilometraje} 
						variant="filled" 
						type="number"
						onChange={e => setKilometraje(e.target.value) }
					/>
				</Box>	

				<FormControl fullWidth variant="filled" sx={{ width:'100%' }}>
					<Typography sx={{mb:'10px'}}>Combustible</Typography>
					<Select
						labelId="combustible"
						id="combustible"
						value={combustible}
						label="Combustible"
						onChange={ event => setCombustible(event.target.value) }
						sx={{
							border: 'none',
							width:'100%'
						}}
					>
						<MenuItem value='1'>Lleno</MenuItem>
						<MenuItem value='0.75'>3/4</MenuItem>
						<MenuItem value='0.50'>1/2</MenuItem>
						<MenuItem value='0.25'>1/4</MenuItem>
						<MenuItem value='0'>Reserva</MenuItem>
					</Select>
				</FormControl>

			</Box>

			<Box sx={{ width:'100%', height:'auto' }} >
				<Button onClick={() => setOpen(!open)} sx={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:{ xs:'5px 20px', md:'5px 20px' }, mt:'20px', background:'rgba(0,0,0,0.5)' }}>
					<Typography sx={{ fontSize:'20px', color:'white' }}>Actualizar incidencias</Typography>
					{ 
						!open ? <ExpandMoreIcon sx={{ fontSize:'20px', color:'white' }}/> : <ExpandLessIcon sx={{ fontSize:'20px', color:'white' }}/> 
					}
				</Button>

				{
					open ? 

					<>

						<Box sx={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'start', mt:'40px', padding:{ xs:'0px', md:'0px 0px' } }}>

							<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto', mt:'20px' }}>

								<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>NIVELES Y PERDIDAS DE LIQUIDOS</Typography>

								{
									opcionesLiquidos.map(({ nombre, variable, set, setImagen }, index) => (
										<Box key={index}>
											<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px'}}>
												<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
												<Button 
													onClick={() => {
														dispatch(set(!estado[variable]))
														dispatch(setImagen(null))
													}}
													sx={{
														width: '20px',
														height: '20px',
														mt:'10px',
														borderRadius: '50%',
														border: '2px solid #fff',
														background: 'none',
														minWidth: 'unset', 
														padding: 'unset', 
														"&.MuiButton-root": {
															boxShadow: 'none',
															'&:hover': {
																backgroundColor: 'none', 
																boxShadow: 'none', 
															},
															'&:active': {
																boxShadow: 'none', 
															}
														}
													}}
												>
													{estado[variable] ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : null}
												</Button>
											</Box>

											<MiniGallery condicional={estado[variable]} type={variable} />
										</Box>
									))
								}

							</Box>

							<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto', mt:'20px' }}>

							<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE LAS LUCES</Typography>

								{
									opcionesLuces.map(({ nombre, variable, set, setImagen }, index) => (
										<Box key={index}>
											<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px'}}>
												<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
												<Button 
													onClick={() => {
														dispatch(set(!estado[variable]))
														dispatch(setImagen(null))
													}}
													sx={{
														width: '20px',
														height: '20px',
														borderRadius: '50%',
														border: '2px solid #fff',
														background: 'none',
														mt:'10px',
														minWidth: 'unset', 
														padding: 'unset', 
														"&.MuiButton-root": {
															boxShadow: 'none',
															'&:hover': {
																backgroundColor: 'none', 
																boxShadow: 'none', 
															},
															'&:active': {
																boxShadow: 'none', 
															}
														}
													}}
												>
													{estado[variable] ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : null}
												</Button>
											</Box>

											<MiniGallery condicional={estado[variable]} type={variable} />
										</Box>
									))
								}

							</Box>

							<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto', mt:'20px' }}>	

								<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE LAS LLANTAS</Typography>

								{
									opcionesLlantas.map(({ nombre, variable, set, setImagen }, index) => (
										<Box key={index}>
											<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px'}}>
												<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
												<Button 
													onClick={() => {
														dispatch(set(!estado[variable]))
														dispatch(setImagen(null))
													}}
													sx={{
														width: '20px',
														height: '20px',
														mt:'10px',
														borderRadius: '50%',
														border: '2px solid #fff',
														background: 'none',
														minWidth: 'unset', 
														padding: 'unset', 
														"&.MuiButton-root": {
															boxShadow: 'none',
															'&:hover': {
																backgroundColor: 'none', 
																boxShadow: 'none', 
															},
															'&:active': {
																boxShadow: 'none', 
															}
														}
													}}
												>
													{estado[variable] ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : null}
												</Button>
											</Box>

											<MiniGallery condicional={estado[variable]} type={variable} />
										</Box>
									))
								}

							</Box>

						</Box>

						<Box sx={{ width:'100%', display:'flex', justifyContent:'start', alignItems:'start', m:'40px 0px', padding:{ xs:'0px', md:'0px 0px' }, gap:'35px' }}>

							<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto', mt:'20px' }}>

								<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO MECANICO</Typography>

								{
									opcionesMecanicas.map(({ nombre, variable, set, setImagen }, index) => (
										<Box key={index}>
											<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px'}}>
												<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
												<Button 
													onClick={() => {
														dispatch(set(!estado[variable]))
														dispatch(setImagen(null))
													}}
													sx={{
														width: '20px',
														height: '20px',
														mt:'10px',
														borderRadius: '50%',
														border: '2px solid #fff',
														background: 'none',
														minWidth: 'unset', 
														padding: 'unset', 
														"&.MuiButton-root": {
															boxShadow: 'none',
															'&:hover': {
																backgroundColor: 'none', 
																boxShadow: 'none', 
															},
															'&:active': {
																boxShadow: 'none', 
															}
														}
													}}
												>
													{estado[variable] ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : null}
												</Button>
											</Box>

											<MiniGallery condicional={estado[variable]} type={variable} />
										</Box>
									))
								}

							</Box>

							<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto', mt:'20px' }}>

								<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE ADICIONALES</Typography>

								{
									opcionesAdicionales.map(({ nombre, variable, set, setImagen }, index) => (
										<Box key={index}>
											<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px'}}>
												<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
												<Button 
													onClick={() => {
														dispatch(set(!estado[variable]))
														dispatch(setImagen(null))
													}}
													sx={{
														width: '20px',
														height: '20px',
														borderRadius: '50%',
														border: '2px solid #fff',
														background: 'none',
														mt:'10px',
														minWidth: 'unset', 
														padding: 'unset', 
														"&.MuiButton-root": {
															boxShadow: 'none',
															'&:hover': {
																backgroundColor: 'none', 
																boxShadow: 'none', 
															},
															'&:active': {
																boxShadow: 'none', 
															}
														}
													}}
												>
													{estado[variable] ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : null}
												</Button>
											</Box>

											<MiniGallery condicional={estado[variable]} type={variable} />
										</Box>
									))
								}

							</Box>

						</Box>

						<Box sx={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'start', m:'40px 0px', padding:{ xs:'0px', md:'0px 0px' } }}>
							<Box sx={{ width:{ xs:'100%', md:'100%'}, height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', flexDirection:'column' }}>
								<Typography sx={{ width:'100%', height:'auto', fontSize:'16px', textAlign:'center' }}>COMENTARIOS</Typography>
								<Box
									component="form"
									sx={{
										width:'100%',
										'& .MuiTextField-root': { width: '100%' },
									}}
									noValidate
									autoComplete="off"
								>
									<TextField
										id="comentarios"
										label="Comentarios"
										multiline
										rows={10}
										defaultValue={estado.observaciones}
										variant="outlined"
										onChange={event => dispatch(setObservaciones(event.target.value))}
									/>
								</Box>		
							</Box>
						</Box>

					</>

					: false
				}

			</Box>

		</Box>

	)

}

export default AsignacionCurso