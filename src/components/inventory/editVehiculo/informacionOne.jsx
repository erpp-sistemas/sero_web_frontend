import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { setEditMarca, setEditPlaca, setEditTipoMotor, setEditVehiculo, setEditModelo } from '../../../redux/vehiculosSlices/editarInformacionGeneral.js'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

const InformacionOne = () => {
	const editarInformacionGeneral = useSelector(state => state.editarInformacionGeneral)
	const editarVehiculo = useSelector(state => state.editarVehiculo)
	const dispatch = useDispatch()

	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i)

	const handleChange = (event) => {
		dispatch(setEditModelo(event.target.value))
	}

	return(

		<Box sx={{ width:{ xs:'100%', md:'35%'}, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1.5rem', mb:{ xs:'60px', mb:'0px' }  }}>
		
			<TextField
				sx={{ width:'90%' }}
				id="Placa"
				label="Placa"
				value={ editarInformacionGeneral.editPlaca }
				variant="outlined"
				onChange={event => dispatch(setEditPlaca(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

			<TextField
				sx={{ width:'90%' }}
				id="Marca"
				label="Marca"
				defaultValue={ editarInformacionGeneral.editMarca }
				variant="outlined"
				onChange={event => dispatch(setEditMarca(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

			<FormControl fullWidth variant="filled" sx={{ width:'90%' }}>
				<InputLabel id="modelo">Modelo</InputLabel>
				<Select
					labelId="modelo"
					id="modelo"
					value={ editarInformacionGeneral.editModelo }
					label="Modelo"
					onChange={(handleChange)}
					disabled={ editarVehiculo.editar ? false : true }
				>
				{years.map((year) => (
					<MenuItem key={year} value={year}>{year}</MenuItem>
				))}
				</Select>
			</FormControl>
			
			<TextField
				sx={{ width:'90%' }}
				id="Vehiculo"
				label="Vehiculo"
				defaultValue={ editarInformacionGeneral.editVehiculo }
				variant="outlined"
				onChange={event => dispatch(setEditVehiculo(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

			<TextField
				sx={{ width:'90%' }}
				id="Tipo de motor"
				label="Tipo de motor"
				defaultValue={ editarInformacionGeneral.editTipoMotor }
				variant="outlined"
				onChange={event => dispatch(setEditTipoMotor(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

		</Box>

	)

}

InformacionOne.propTypes = {
	editar: PropTypes.bool.isRequired,
}

export default InformacionOne