import { Box, FormControl, MenuItem, TextField, Select, Typography } from "@mui/material"
import { useState } from "react"

const InformacionPrincipal = () => {
	const [usuario, setUsuario] = useState('')	
	const [encargado, setEncargado] = useState('Admin Admin')
	const [kilometraje, setKilometraje] = useState(31231)
	const [tarea, setTarea] = useState('')

	return (

		<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'start', alignItems:'start', flexDirection:{xs:'column', md:'row'}, gap:'10px', flexWrap:'wrap', }}>

			<Box sx={{ width:{ xs:'100%', md:'32%' }, height:'auto', padding:{ xs:'0px', md:'0px 0px' } }}>
				<Typography>Encargado</Typography>
				<TextField sx={{ width:'100%', mt:'10px' }} disabled id="filled-basic" value={encargado} variant="filled" onChange={e => setEncargado(e.target.value) }/>
			</Box>	

			<Box sx={{ width:{ xs:'100%', md:'32%' }, height:'auto', padding:{ xs:'0px', md:'0px 0px' }, marginTop:'10px'}}>
				<Typography>Asignado</Typography>
				<FormControl fullWidth>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={usuario}
						onChange={e => setUsuario(e.target.value)}
					>
						<MenuItem value={10}>Ivan Sanchez</MenuItem>
						<MenuItem value={20}>David Paz</MenuItem>
						<MenuItem value={30}>Victor Manuel</MenuItem>
				</Select>
				</FormControl>
			</Box>	

			<Box sx={{ width:{ xs:'100%', md:'32%' }, height:'auto', padding:{ xs:'0px', md:'0px 0px' } }}>
				<Typography>Tarea</Typography>
				<TextField sx={{ width:'100%', mt:'10px' }} id="filled-basic" value={tarea} variant="filled" onChange={e => setTarea(e.target.value) }/>
			</Box>	
			
			<Box sx={{ width:{ xs:'100%', md:'32%' }, height:'auto', padding:{ xs:'0px', md:'0px 0px' } }}>
				<Typography>Kilometraje Inicial</Typography>
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
					type="number"
					value={kilometraje} 
					variant="filled" 
					onChange={e => setKilometraje(e.target.value) }
					disabled
				/>
			</Box>	

		</Box>	
		
	)

}

export default InformacionPrincipal