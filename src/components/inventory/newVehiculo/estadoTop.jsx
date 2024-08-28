import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import MiniGallery from "./miniGallery"
import { setErrorCombustible, setErrorBateria, setErrorNeumatico } from '../../../redux/vehiculosSlices/estadoErrorsSlice.js'
import { setCombustible, setBateria, setNeumaticos } from '../../../redux/vehiculosSlices/estadoSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { opcionesLiquidos, opcionesLuces, opcionesLlantas } from "../../../hooks/estadoVehiculoHook.js"

export default function EstadoTop () {
	const estado = useSelector(state => state.estado)
	const comentarios = useSelector(state => state.comentarios)
	const estadoErrors = useSelector(state => state.estadoErrors)
	const dispatch = useDispatch()
	
	return (

		<Box sx={{ width:'100%', display:'flex', justifyContent:'start', alignItems:'start', flexWrap:'wrap' }}>
		
			<Box sx={{ width:{ xs:'100%', md:'23%' }, height:'100%', display:'flex', justifyContent:{ xs:'center', md:'flex-start' }, alignItems:{ xs:'center', md:'flex-start' }, gap:'10px', flexDirection:'column', marginTop:'10px' }}>

				<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth:'270px', width:'100%',  border: estadoErrors.errorCombustible ? '1px solid red' : false }}>
					<InputLabel id="combustible">Combustible</InputLabel>
					<Select
						labelId="combustible"
						id="combustible"
						value={estado.combustible}
						label="Combustible"
						onChange={( event => (dispatch(setCombustible(event.target.value)), dispatch(setErrorCombustible(false))))}
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

				<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth:'270px', width:'100%', border: estadoErrors.errorCombustible ? '1px solid red' : false }}>
					<InputLabel id="bateria">Bateria</InputLabel>
					<Select
						labelId="bateria"
						id="bateria"
						value={estado.bateria}
						label="Bateria"
						onChange={( event => (dispatch(setBateria(event.target.value)), dispatch(setErrorBateria(false))))}
						sx={{
							border: 'none'
						}}
					>
						<MenuItem value={'Buen estado'}>Buen estado</MenuItem>
						<MenuItem value={'Mal estado'}>Mal estado</MenuItem>
					</Select>
				</FormControl>

				<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth:'270px', width:'100%', border: estadoErrors.errorCombustible ? '1px solid red' : false }}>
					<InputLabel id="neumaticos">Neumaticos</InputLabel>
					<Select
						labelId="neumaticos"
						id="neumaticos"
						value={estado.neumaticos}
						label="Neumaticos"
						onChange={( event => (dispatch(setNeumaticos(event.target.value)), dispatch(setErrorNeumatico(false))))}
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

			<Box sx={{ width:{ xs:'100%', md:'73%' }, height:'auto', display:'flex', justifyContent:'start', alignItems:'start', gap:'40px', marginTop:{ xs:'30px', md:'10px' }, flexWrap:'wrap', marginLeft:{ xs:'0px', md:'20px' }, }}>

				<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto' }}>

					<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>NIVELES Y PERDIDAS DE LIQUIDOS</Typography>

					{
						opcionesLiquidos.map(({ nombre, variable, set, setImagen, comentario, setComentario }, index) => (
							<Box key={index}>
								<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
									<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
									<Button 
										onClick={() => {
											dispatch(set(!estado[variable]));
											dispatch(setImagen(null));
										}}
										sx={{
											width: '20px',
											height: '20px',
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

								<MiniGallery condicional={estado[variable]} type={variable} comentario={comentarios[comentario]} setComentario={setComentario} />
							</Box>
						))
					}

				</Box>

				<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto' }}>

					<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE LAS LUCES</Typography>

					{
						opcionesLuces.map(({ nombre, variable, set, setImagen, comentario, setComentario }, index) => (
							<Box key={index}>
								<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
									<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
									<Button 
										onClick={() => {
											dispatch(set(!estado[variable]));
											dispatch(setImagen(null));
										}}
										sx={{
											width: '20px',
											height: '20px',
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

								<MiniGallery condicional={estado[variable]} type={variable} comentario={comentarios[comentario]} setComentario={setComentario} />
							</Box>
						))
					}
					
				</Box>

				<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto' }}>

					<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE LAS LLANTAS</Typography>

					{
						opcionesLlantas.map(({ nombre, variable, set, setImagen, comentario, setComentario }, index) => (
							<Box key={index}>
								<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
									<Typography sx={{ fontSize:'12px' }}>{nombre}</Typography>
									<Button 
										onClick={() => {
											dispatch(set(!estado[variable]));
											dispatch(setImagen(null));
										}}
										sx={{
											width: '20px',
											height: '20px',
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

								<MiniGallery condicional={estado[variable]} type={variable} comentario={comentarios[comentario]} setComentario={setComentario} />
							</Box>
						))
					}

				</Box>

			</Box>

		</Box>
		
	)


}