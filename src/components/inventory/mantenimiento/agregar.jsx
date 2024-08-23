import { Box, Typography, TextField, Button, FormControl, Select, MenuItem } from "@mui/material"
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useState } from "react"
import PropTypes from 'prop-types'

const Agregar = ({ imagenes, setImagenes }) => {
	const [prueba, setPrueba] = useState('')
    const [date, setDate] = useState(null)
	const [tipo, setTipo] = useState('')

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setImagenes((prevImages) => [...prevImages, ...files])
    }

	return (
		
		<Box sx={{ width:{ xs:'100%', md:'40%' }, height: 'auto', minHeight: '500px', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column', margin:{ xs:'0px 0px', md:'0px' } }}>

			<Typography sx={{ width: '100%', textAlign: 'center', fontSize: '24px' }}>Agregar mantenimiento</Typography>

			<FormControl fullWidth variant="filled" sx={{ width:'100%', display: 'flex', justifyContent: 'start', alignItems: 'center', }}>
				<Typography sx={{ width:'100%', maxWidth:'320px', marginTop:'20px' }	}>Tipo</Typography>
				<Select
					labelId="Tipo"
					id="tipo"
					value={tipo}
					label="Tipo"
					onChange={ event => setTipo(event.target.value) }
					sx={{
						border: 'none',
						width:'100%',
						maxWidth:'320px',
					}}
				>
					<MenuItem value='Servicio'>Servicio</MenuItem>
					<MenuItem value='Espejos'>Espejos</MenuItem>
					<MenuItem value='Palancas'>Palancas</MenuItem>
				</Select>
			</FormControl>

			<TextField
				sx={{ width: '100%', maxWidth: '320px', marginTop: '20px' }}
				id="start-date"
				label="Fecha"
				type="date"
				value={date}
				onChange={(e) => setDate(e.target.value)}
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<TextField
				sx={{
					width: '100%',
					maxWidth: '320px',
					marginTop: '20px',
					'& input[type=number]': {
						'-moz-appearance': 'textfield',
					},
					'& input[type=number]::-webkit-outer-spin-button': {
						'-webkit-appearance': 'none',
						margin: 0,
					},
					'& input[type=number]::-webkit-inner-spin-button': {
						'-webkit-appearance': 'none',
						margin: 0,
					},
				}}
				id="Costo"
				label="Costo"
				value={prueba}
				variant="outlined"
				onChange={event => setPrueba(event.target.value)}
				type="number"
			/>

			<Typography sx={{ width: '100%', maxWidth: '320px', textAlign: 'start', fontSize: '14px', padding: '20px 5px' }}>Imagenes</Typography>

			<Box sx={{ width: '100%', maxWidth: '320px', height: '200px', minHeight:'200px', border: '1px solid #ffffff', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', display: 'flex', justifyContent: 'start', flexWrap: 'wrap', alignItems: 'start', alignContent: 'flex-start', gap: '10px', padding: '10px', overflowY: 'scroll', overflowX: 'hidden' }}>
				<Button
					component="label"
					sx={{ 
						width: '70px', 
						height: '70px', 
						borderRadius: '5px'
					}}
				>
					<AddBoxIcon 
						sx={{ 
							fontSize: '70px', 
							color: '#00ff00' 
						}} 
					/>
					<input
						type="file"
						accept="image/*"
						multiple
						hidden
						onChange={handleImageChange}
					/>
				</Button>
				{imagenes.map((imagen, index) => (
					<Box key={index} sx={{ width: '80px', minWidth: '80px', height: '80px', background: '#fff', borderRadius: '5px', overflow: 'hidden', display:'flex', justifyContent:'center', alignItems:'center' }}>
						<img src={URL.createObjectURL(imagen)} alt={`imagen-${index}`} width={'100%'} height={'100%'} />
					</Box>
				))}
			</Box>

			<Typography sx={{ width: '100%', maxWidth: '320px', textAlign: 'start', fontSize: '14px', padding: '20px 5px' }}>Documentos</Typography>

			<Box sx={{ width: '100%', maxWidth: '320px', height: '200px', minHeight:'200px', border: '1px solid #ffffff', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', display: 'flex', justifyContent: 'start', flexWrap: 'wrap', alignItems: 'start', alignContent: 'flex-start', gap: '10px', padding: '10px', overflowY: 'scroll', overflowX: 'hidden' }}>
				<Button
					component="label"
					sx={{ 
						width: '70px', 
						height: '70px', 
						borderRadius: '5px'
					}}
				>
					<AddBoxIcon 
						sx={{ 
							fontSize: '70px', 
							color: '#00ff00' 
						}} 
					/>
					<input
						type="file"
						accept="image/*"
						multiple
						hidden
						onChange={handleImageChange}
					/>
				</Button>
				{imagenes.map((imagen, index) => (
					<Box key={index} sx={{ width: '80px', minWidth: '80px', height: '80px', background: '#fff', borderRadius: '5px', overflow: 'hidden', display:'flex', justifyContent:'center', alignItems:'center' }}>
						<img src={URL.createObjectURL(imagen)} alt={`imagen-${index}`} width={'100%'} height={'100%'} />
					</Box>
				))}
			</Box>

			<Button 
				sx={{ 
					mt: '20px', 
					p: '5px 35px', 
					fontSize: '14px', 
					marginBottom:'30px',
					color:'white',
					bgcolor: 'secondary.main', 
					'&:hover': { bgcolor: 'secondary.dark' }
				}}
			>
				Crear
			</Button>

		</Box>

	)

}

Agregar.propTypes = {
	imagenes: PropTypes.object.isRequired,
	setImagenes: PropTypes.func.isRequired,
}

export default Agregar