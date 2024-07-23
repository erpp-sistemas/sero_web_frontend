import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField } from "@mui/material"
import PropTypes from 'prop-types'

const Estado = ({ 
	combustible, setCombustible, bateria, setBateria, neumaticos, setNeumaticos, observaciones, setObservaciones, aceite, setAceite, fugaCombustible, setFugaCombustible, fugaAceite, setFugaAceite, 
	direccionalesDelanteras, setDireccionalesDelanteras, direccionalesTraseras, setDireccionalesTraseras, lucesTablero, setLucesTablero, luzFreno, setLuzFreno, llantaDelantera, setLlantaDelantera, llantaTrasera, setLlantaTrasera,
	deformaciones, setDeformaciones, encendido, setEncendido, tension, setTension, frenoDelantero, setFrenoDelantero, frenoTrasero, setFrenoTrasero, amortiguadores, setAmortiguadores, direccion, setDireccion, 
	silla, setSilla, espejos, setEspejos, velocimetro, setVelocimetro, claxon, setClaxon, escalapies, setEscalapies
}) => {

	return (

		<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column' }}>
			
			<Typography sx={{ marginTop:'10px', color:'rgb(207, 249, 224)', width:'100%', textAlign:'start' }}>Selecciona cada punto del vehiculo que tenga un detalle y al finalizar especifica en observaciones el detalle</Typography>
			
			<Box sx={{ width:'100%', display:'flex', justifyContent:'start', alignItems:'center' }}>
				
				<Box sx={{ width:'25%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', flexDirection:'column', marginTop:'10px' }}>

					<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth: 150 }}>
						<InputLabel id="combustible">Combustible</InputLabel>
						<Select
							labelId="combustible"
							id="combustible"
							value={combustible}
							label="Combustible"
							onChange={( event => setCombustible(event.target.value))}
							sx={{
								border: 'none'
							}}
						>
							<MenuItem value='1'>Lleno</MenuItem>
							<MenuItem value='0.75'>3/4</MenuItem>
							<MenuItem value='0.50'>1/2</MenuItem>
							<MenuItem value='0.25'>1/4</MenuItem>
							<MenuItem value='0'>Reserva</MenuItem>
						</Select>
					</FormControl>

					<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth: 150 }}>
						<InputLabel id="bateria">Bateria</InputLabel>
						<Select
							labelId="bateria"
							id="bateria"
							value={bateria}
							label="Bateria"
							onChange={( event => setBateria(event.target.value))}
							sx={{
								border: 'none'
							}}
						>
							<MenuItem value={true}>Buen estado</MenuItem>
							<MenuItem value={false}>Mal estado</MenuItem>
						</Select>
					</FormControl>

					<FormControl fullWidth variant="filled" sx={{ mt:'10px', minWidth: 150 }}>
						<InputLabel id="neumaticos">Neumaticos</InputLabel>
						<Select
							labelId="neumaticos"
							id="neumaticos"
							value={neumaticos}
							label="Neumaticos"
							onChange={( event => setNeumaticos(event.target.value))}
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

				<Box sx={{ width:'75%', height:'auto', display:'flex', justifyContent:'start', alignItems:'start', gap:'40px', marginLeft:'40px', marginTop:'10px' }}>

					<Box sx={{ width:'33.3%', height:'auto' }}>

						<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>NIVELES Y PERDIDAS DE LIQUIDOS</Typography>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'40px' }}>
							<Typography sx={{ fontSize:'12px' }}>FUGA DE ACEITE GENERAL</Typography>
							<Button
								onClick={() => setAceite(!aceite)}
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
								{ aceite === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>FUGA DE COMBUSTIBLE</Typography>
							<Button 
							onClick={() => setFugaCombustible(!fugaCombustible)}
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
								{ fugaCombustible === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>FUGA DE ACEITE EN MOTOR</Typography>
							<Button 
								onClick={() => setFugaAceite(!fugaAceite)}
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
								{ fugaAceite === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

					</Box>

					<Box sx={{ width:'33.3%', height:'auto' }}>

						<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE LAS LUCES</Typography>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'40px' }}>
							<Typography sx={{ fontSize:'12px' }}>DICRECCIOALES DELANTERAS</Typography>
							<Button 
								onClick={() => setDireccionalesDelanteras(!direccionalesDelanteras)}
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
								{ direccionalesDelanteras === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>DIRECCIONALES TRASERAS</Typography>
							<Button 
								onClick={() => setDireccionalesTraseras(!direccionalesTraseras)}
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
								{ direccionalesTraseras === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>LUCES DEL TABLERO</Typography>
							<Button 
								onClick={() => setLucesTablero(!lucesTablero)}
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
								{ lucesTablero === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>LUZ DE FRENO</Typography>
							<Button 
								onClick={() => setLuzFreno(!luzFreno)}
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
								{ luzFreno === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

					</Box>

					<Box sx={{ width:'33.3%', height:'auto' }}>

						<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE LAS LLANTAS</Typography>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'40px' }}>
							<Typography sx={{ fontSize:'12px' }}>DELANTERA</Typography>
							<Button 
								onClick={() => setLlantaDelantera(!llantaDelantera)}
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
								{ llantaDelantera === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>TRASERA</Typography>
							<Button 
								onClick={() => setLlantaTrasera(!llantaTrasera)}
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
								{ llantaTrasera === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

						<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
							<Typography sx={{ fontSize:'12px' }}>DEFORMACION EN LLANTAS</Typography>
							<Button 
								onClick={() => setDeformaciones(!deformaciones)}
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
								{ deformaciones === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
							</Button>
						</Box>

					</Box>

				</Box>

			</Box>

			<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', alignItems:'start', gap:'40px', marginLeft:'0px', marginTop:'50px' }}>
				
				<Box sx={{ width:'33.3%', height:'auto' }}>

					<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO MECANICO</Typography>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'40px' }}>
						<Typography sx={{ fontSize:'12px' }}>ENCENDIDO</Typography>
						<Button 
							onClick={() => setEncendido(!encendido)}
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
							{ encendido === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>TENSION EN LA CADENA</Typography>
						<Button 
							onClick={() => setTension(!tension)}
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
							{ tension === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>FRENO DELANTERO</Typography>
						<Button 
							onClick={() => setFrenoDelantero(!frenoDelantero)}
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
							{ frenoDelantero === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>FRENO TRASERO</Typography>
						<Button 
							onClick={() => setFrenoTrasero(!frenoTrasero)}
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
							{ frenoTrasero === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>AMORTIGUAODRES</Typography>
						<Button 
							onClick={() => setAmortiguadores(!amortiguadores)}
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
							{ amortiguadores === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>FUNCIONAMIENTO DIRECCION</Typography>
						<Button 
							onClick={()=> setDireccion(!direccion)}
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
							{ direccion === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

				</Box>

				<Box sx={{ width:'33.3%', height:'auto' }}>

					<Typography sx={{ fontSize:'16px', textAlign:'center', marginBottom:'20px' }}>ESTADO DE ADICIONALES</Typography>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'40px' }}>
						<Typography sx={{ fontSize:'12px' }}>SILLA DE CONDUCTOR</Typography>
						<Button 
							onClick={() => setSilla(!silla)}
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
							{ silla === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>ESPEJOS LATERALES</Typography>
						<Button 
							onClick={() => setEspejos(!espejos)}
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
							{ espejos === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>INDICADOR DE VELOCIDAD</Typography>
						<Button 
							onClick={() => setVelocimetro(!velocimetro)}
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
							{ velocimetro === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>CLAXÓN</Typography>
						<Button 
							onClick={() => setClaxon(!claxon)}
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
							{ claxon === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

					<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', marginTop:'10px' }}>
						<Typography sx={{ fontSize:'12px' }}>ESCALAPIES Y PALANCAS</Typography>
						<Button 
							onClick={() => setEscalapies(!escalapies)}
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
							{ escalapies === true ? <Box sx={{ width:'70%', height:'70%', background:'red' , borderRadius:'50%' }}></Box> : false }
						</Button>
					</Box>

				</Box>
				
				<Box sx={{ width:'33.3%', height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'30px', flexDirection:'column' }}>
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
							defaultValue={observaciones}
							variant="outlined"
							onChange={event => setObservaciones(event.target.value)}
						/>
					</Box>		
				</Box>

			</Box>

		</Box>

	)

}

Estado.propTypes = {
	setNext: PropTypes.func.isRequired,
	setCombustible: PropTypes.func.isRequired,
	setBateria: PropTypes.func.isRequired,
	setNeumaticos: PropTypes.func.isRequired,
	setObservaciones: PropTypes.func.isRequired,
	setAceite: PropTypes.func.isRequired,
	setFugaCombustible: PropTypes.func.isRequired,
	setDireccionalesDelanteras: PropTypes.func.isRequired,
	setFugaAceite: PropTypes.func.isRequired,
	setDireccionalesTraseras: PropTypes.func.isRequired,
	setLuzFreno: PropTypes.func.isRequired,
	setLucesTablero: PropTypes.func.isRequired,
	setLlantaDelantera: PropTypes.func.isRequired,
	setLlantaTrasera: PropTypes.func.isRequired,
	setDeformaciones: PropTypes.func.isRequired,
	setEncendido: PropTypes.func.isRequired,
	setTension: PropTypes.func.isRequired,
	setFrenoTrasero: PropTypes.func.isRequired,
	setFrenoDelantero: PropTypes.func.isRequired,
	setAmortiguadores: PropTypes.func.isRequired,
	setSilla: PropTypes.func.isRequired,
	setDireccion: PropTypes.func.isRequired,
	setEspejos: PropTypes.func.isRequired,
	setVelocimetro: PropTypes.func.isRequired,
	setClaxon: PropTypes.func.isRequired,
	setEscalapies: PropTypes.func.isRequired,
	combustible: PropTypes.bool.isRequired,
	bateria: PropTypes.bool.isRequired,
	neumaticos: PropTypes.bool.isRequired,
	observaciones: PropTypes.bool.isRequired,
	aceite: PropTypes.bool.isRequired,
	fugaCombustible: PropTypes.bool.isRequired,
	fugaAceite: PropTypes.bool.isRequired,
	direccionalesDelanteras: PropTypes.bool.isRequired,
	direccionalesTraseras: PropTypes.bool.isRequired,
	lucesTablero: PropTypes.bool.isRequired,
	luzFreno: PropTypes.bool.isRequired,
	llantaDelantera: PropTypes.bool.isRequired,
	llantaTrasera: PropTypes.bool.isRequired,
	deformaciones: PropTypes.bool.isRequired,
	encendido: PropTypes.bool.isRequired,
	tension: PropTypes.bool.isRequired,
	frenoDelantero: PropTypes.bool.isRequired,
	frenoTrasero: PropTypes.bool.isRequired,
	amortiguadores: PropTypes.bool.isRequired,
	direccion: PropTypes.bool.isRequired,
	silla: PropTypes.bool.isRequired,
	espejos: PropTypes.bool.isRequired,
	velocimetro: PropTypes.bool.isRequired,
	claxon: PropTypes.bool.isRequired,
	escalapies: PropTypes.bool.isRequired,
}

export default Estado