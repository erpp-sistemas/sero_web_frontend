import { Box } from "@mui/material"
import Documentos from "./documentos.jsx"
import Perfil from "./perfil.jsx"
import InformacionOne from "./informacionOne.jsx"
import InformacionTwo from "./informacionTwo.jsx"

const Content = () => {

	return (

		<Box sx={{ width:'100%', height:'100%', display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column' }}>

			<Box sx={{ m:'50px', mb:'10px', display:'flex', justifyContent:'start', alignItems:'center', width:'100%', gap:'20px', flexDirection:{ xs:'column', md:'row'} }}>

				<Perfil />

				<InformacionOne />
			
				<InformacionTwo />

			</Box>

			<Documentos />

		</Box>

	)

}

export default Content