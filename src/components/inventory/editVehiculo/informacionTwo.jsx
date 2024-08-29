import { useSelector, useDispatch } from 'react-redux'
import { setEditColor, setEditKilometraje, setEditColorLlavero, setEditSelectedPlace, setEditSerie } from '../../../redux/vehiculosSlices/editarInformacionGeneral.js'
import PlaceSelectDisabled from '../../PlaceSelectDisabled.jsx'
import PlaceSelect from '../../PlaceSelect.jsx'
import { Box, TextField, FormControl } from "@mui/material"
import PropTypes from 'prop-types'

const InformacionTwo = () => {
	const editarInformacionGeneral = useSelector(state => state.editarInformacionGeneral)
	const editarVehiculo = useSelector(state => state.editarVehiculo)
	const dispatch = useDispatch()

	const handlePlaceChange = (event) => {
		dispatch(setEditSelectedPlace(event.target.value))
	}

	return(

		<Box sx={{ width:{ xs:'100%', md:'35%'}, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1.5rem', mb:{ xs:'60px', mb:'0px' } }}>
			
			<TextField
				sx={{ width:'90%' }}
				id="Color"
				label="Color"
				defaultValue={ editarInformacionGeneral.editColor }
				variant="outlined"
				onChange={event => dispatch(setEditColor(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

			<TextField
				sx={{ width:'90%' }}
				id="Color llavero"
				label="Color llavero"
				defaultValue={ editarInformacionGeneral.editColorLlavero }
				variant="outlined"
				onChange={event => dispatch(setEditColorLlavero(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

			<TextField
				sx={{ width:'90%' }}
				id="Kilometraje"
				label="Kilometraje"
				defaultValue={ editarInformacionGeneral.editKilometraje }
				variant="outlined"
				onChange={event => dispatch(setEditKilometraje(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

			<FormControl fullWidth sx={{ width:'90%' }} disabled>
			{
				editarVehiculo.editar ?
					<PlaceSelect      
						selectedPlace={editarInformacionGeneral.editSelectedPlace}
						handlePlaceChange={handlePlaceChange}
					/>
				
				: 	
					<PlaceSelectDisabled      
						selectedPlace={editarInformacionGeneral.editSelectedPlace}
						handlePlaceChange={handlePlaceChange}
					/>
			}
			</FormControl>

			<TextField	
				sx={{ width:'90%' }}
				id="# Serie"
				label="# Serie"
				defaultValue={ editarInformacionGeneral.editSerie }
				variant="outlined"
				onChange={event => dispatch(setEditSerie(event.target.value))}
				disabled={ editarVehiculo.editar ? false : true }
			/>

		</Box>

	)

}

InformacionTwo.propTypes = {
	editar: PropTypes.bool.isRequired,
}

export default InformacionTwo