import { Box, Button, InputLabel, Select, Typography, MenuItem, FormControl, TextField } from "@mui/material"
import MiniGallery from "../newVehiculo/miniGallery"
import { setCombustible, setBateria, setNeumaticos, setObservaciones } from '../../../redux/vehiculosSlices/estadoAsignacion.js'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { opcionesLiquidos, opcionesLuces, opcionesLlantas, opcionesMecanicas, opcionesAdicionales,  } from "../../../hooks/estadoVehiculoHook.js"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux'

const EstadoActual = () => {
	const [open, setOpen] = useState(false)
	const estado = useSelector(state => state.estadoAsignacion)
	const dispatch = useDispatch()

	return (

		<Box sx={{ width:'100%', mt:'20px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>

			<Button onClick={() => setOpen(!open)} sx={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:{ xs:'5px 20px', md:'5px 20px' }, mt:'20px', background:'rgba(0,0,0,0.5)' }}>
				<Typography sx={{ fontSize:'20px', color:'white' }}>Estado actual</Typography>
				{ 
					!open ? <ExpandMoreIcon sx={{ fontSize:'20px', color:'white' }}/> : <ExpandLessIcon sx={{ fontSize:'20px', color:'white' }}/> 
				}
			</Button>

			{	 
				open ?

				<>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', mt:'20px', flexDirection:{ xs:'column', md:'row'} }}>

						<Box sx={{ height:'100%', display:'flex', justifyContent:{ xs:'center', md:'flex-start' }, alignItems:{ xs:'center', md:'flex-start' }, gap:'10px', marginTop:'10px', width:'100%', flexDirection:{ xs:'column', md:'row'} }}>

							<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth:'auto', width:'100%' }}>
								<InputLabel id="combustible">Combustible</InputLabel>
								<Select
									labelId="combustible"
									id="combustible"
									value={estado.combustible}
									label="Combustible"
									onChange={ event => dispatch(setCombustible(event.target.value)) }
									disabled
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

							<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth:'auto', width:'100%' }}>
								<InputLabel id="bateria">Bateria</InputLabel>
								<Select
									labelId="bateria"
									id="bateria"
									value={estado.bateria}
									label="Bateria"
									onChange={ event => dispatch(setBateria(event.target.value)) }
									sx={{
										border: 'none'
									}}
								>
									<MenuItem value={'Buen estado'}>Buen estado</MenuItem>
									<MenuItem value={'Mal estado'}>Mal estado</MenuItem>
								</Select>
							</FormControl>

							<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth:'auto', width:'100%' }}>
								<InputLabel id="neumaticos">Neumaticos</InputLabel>
								<Select
									labelId="neumaticos"
									id="neumaticos"
									value={ estado.neumaticos }
									label="Neumaticos"
									onChange={ event => dispatch(setNeumaticos(event.target.value)) }
									sx={{
										border: 'none'
									}}
								>
									<MenuItem value='nuevos'>Nuevos</MenuItem>
									<MenuItem value='bien'>Buen estado</MenuItem>
									<MenuItem value='corridos'>Mal estado</MenuItem>
								</Select>
							</FormControl>

						</Box>

					</Box>

					<Box sx={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'start', mt:'40px', padding:{ xs:'0px', md:'0px 0px' }, flexDirection:{ xs:'column', md:'row'} }}>

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
					
					<Box sx={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'start', m:'40px 0px', padding:{ xs:'0px', md:'0px 0px' }, flexDirection:{ xs:'column', md:'row'} }}>

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

						<Box sx={{ width:{ xs:'100%', md:'31%'}, height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', flexDirection:'column' }}>
							<Typography sx={{ width:'100%', height:'auto', fontSize:'16px', textAlign:'center' }}>OBSERVACIONES</Typography>
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
									id="observaciones"
									label="Observaciones"
									multiline
									rows={5}
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
	)

}

export default EstadoActual