import { Box, Typography, Button, TextField } from "@mui/material"
import { useSelector, useDispatch } from 'react-redux'
import { setObservaciones} from '../../../redux/vehiculosSlices/estadoSlice.js'
import MiniGallery from "./miniGallery"
import { opcionesMecanicas } from "../../../hooks/estadoVehiculoHook.js"
import { opcionesAdicionales } from "../../../hooks/estadoVehiculoHook.js"

export default function EstadoDown() {
	const estado = useSelector(state => state.estado)
	const comentarios = useSelector(state => state.comentarios)
	const dispatch = useDispatch()

	return (

		<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', alignItems:'start', gap:'40px', marginLeft:'0px', marginTop:'50px', flexWrap:'wrap' }}>
					
			<Box sx={{ width:{ xs:'100%', md:'31%'}, height:'auto' }}>

				<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO MECANICO</Typography>

				{
					opcionesMecanicas.map(({ nombre, variable, set, setImagen, comentario, setComentario }, index) => (
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

			<Box sx={{ width:{ xs:'100%', md:'31%'}, height:'auto' }}>

				<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE ADICIONALES</Typography>

				{
					opcionesAdicionales.map(({ nombre, variable, set, setImagen, comentario, setComentario }, index) => (
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

	)

}