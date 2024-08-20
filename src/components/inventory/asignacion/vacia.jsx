import { Box } from "@mui/material"

const Vacia = () => {

	return (
	
		<Box
			sx={{
				width:'100%',
				height:'100%',
				display:'flex',
				justifyContent:'center',
				alignItems:'start'
			}}
		>
			<Box sx={{ width:'250px', height:'auto' }}>
				<img src="./sero_claro.png" alt="" />
			</Box>
		</Box>

	)

}

export default Vacia