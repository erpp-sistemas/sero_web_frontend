import { Box, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import tool from '../../toolkit/toolkitImpression.js'

const Download = () => {

	const [idPaq, setIdPaq] = useState(0)
	const [paquetes, setPaquetes] = useState([])

	const handlePaqueteChange = async (event) => {
		const selectedId = event.target.value
		setIdPaq(event.target.value)
		const selectedPaquete = paquetes.find(item => item.id === selectedId)
		console.log(selectedPaquete)
	}	

	useEffect(() => {

		const apiPaquetes = async () => {
			try {
				const paquetes = await tool.getPaquetes()
				console.log(paquetes)
				setPaquetes(paquetes.filter(item => item.activate))
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		apiPaquetes()

	}, [])

	return (

		<Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>

			<Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Descarga de Fichas</Typography>

			<Box className='records_impression__grid' sx={{ mt:'1rem', width:'100%', display:'flex', justifyContent:'center', alignItems:'center' }} container spacing={0}>

				<Box sx={{ padding:'20px 20px', width:'auto', height:'auto', backgroundColor:'rgba(255, 255, 255, 0.250)', borderRadius:'10px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
					
					<FormControl sx={{ width:'100%', minWidth:'300px' }} className='inputCustom'>

						<InputLabel id='demo-simple-select-label' color='primary' sx={{ color:'#fff', width:'100%' }}> FICHA </InputLabel>

						<Select
							labelId='demo-simple-select-label'
							id='demo-simple-select'
							value={idPaq}
							label='PAQUETE'
							onChange={handlePaqueteChange}
							sx={{ color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
						>
							{paquetes.map(item => (
								<MenuItem key={item.id} value={item.id}>{item.id} - {item.nombre}</MenuItem>
							))}
						</Select>	

					</FormControl>

				</Box>

			</Box>

		</Box>

	)

}

export default Download

