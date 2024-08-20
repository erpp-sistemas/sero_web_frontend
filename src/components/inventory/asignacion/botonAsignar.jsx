import { Button, Box } from "@mui/material"

const BotonAsignar = () => {

	return (

		<Box sx={{ width:'100%', height:'auto', padding:{ xs:'0px', md:'0px 20px' }, mt:{ xs:'0px', md:'0px'}, display:'flex', justifyContent:'end', alignItems:'center', mb:'20px' }}>
			<Button 
				variant="contained" 
				color="success" 
				onClick={() => console.log('click')}
				sx={{
					color:'white',
					fontSize:'14px',
					fontWeight:'500'
				}}
			>
				Asignar
			</Button>
		</Box>

	)

}

export default BotonAsignar