import { Box, TextField, Button } from "@mui/material"
import { useState } from "react"

const Content = () => {

	const [prueba, setPrueba] = useState('')

	return(

		<Box sx={{ width:'100%', height:'100%', display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column' }}>

			<Box sx={{ m:'50px', display:'flex', justifyContent:'start', alignItems:'center', width:'100%', gap:'20px' }}>

				<Box sx={{ width:'20%', display:'flex', justifyContent:'center', alignItems:'center' }}>
					<Box sx={{ width:'200px', height:'200px', border:'1px solid grey', borderRadius:'50%', background:'rgba(0,0,0,0.3)' }}>
						<img src="" alt="" width={'100%'} height={'100%'} />
					</Box>
				</Box>

				<Box sx={{ width:'35%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1.5rem' }}>

					<TextField
						sx={{ width:'90%' }}
						id="Placa"
						label="Placa"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Marca"
						label="Marca"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Modelo"
						label="Modelo"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Vehiculo"
						label="Vehiculo"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Tipo de motor"
						label="Tipo de motor"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

				</Box>

				<Box sx={{ width:'35%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1.5rem' }}>

					<TextField
						sx={{ width:'90%' }}
						id="Color"
						label="Color"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Color llavero"
						label="Color llavero"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Kilometraje"
						label="Kilometraje"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="Plaza"
						label="Plaza"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

					<TextField
						sx={{ width:'90%' }}
						id="# Serie"
						label="# Serie"
						defaultValue={prueba}
						variant="outlined"
						onChange={event => setPrueba(event.target.value)}
						disabled
					/>

				</Box>

			</Box>

			<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', gap:'1.5rem' }}>
				<Button sx={{ fontSize:'20px', color:'white', background:'' }}>ficha informativa</Button>
			</Box>

		</Box>

		

	)

}

export default Content