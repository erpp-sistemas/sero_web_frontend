import { Box, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material"
import PreviewsHeader from "../../components/credict/previews/header"
import PreviewsInfo from "../../components/credict/previews/info"
import PropTypes from "prop-types"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useState } from "react"

export default function Preview ({ preview, setPreview, seleccionFormato }) {
	const [openTerrenoData, setOpenTerrenoData] = useState(false)
	const [openConstruccionData, setOpenConstruccionData] = useState(false)
	const [openAdeudoData, setOpenAdeudoData] = useState(false)

	console.log(preview)
	console.log(seleccionFormato)

	return(

		<Box sx={{ position:'absolute', display: preview ? 'flex' : 'none', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh', background:'rgba(0,0,0,0.5)', top:'0', right:'0', zIndex:'9999' }}>
			
			<Box sx={{ width:'95%', maxWidth:'1000px', height:'auto', maxHeight:'600px', minHeight:'600px', borderRadius:'10px', backgroundColor:'#17212F', border:'2px solid #fff', padding:'20px 30px', overflowX:'hidden', overflowY:'scroll' }}>
				
				<PreviewsHeader setPreview={setPreview}/>

				<PreviewsInfo seleccionFormato={seleccionFormato} />

				<Box sx={{ display:'flex', justifyContent:'center', alingItems:'center', flexDirection:'column', gap:'5px', m:'10px 0px' }}>

					<Button
						sx={{
							width: '100%',
							height: 'auto',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							background: 'rgba(0,0,0,0.5)',
							m: '20px 0px',
							borderRadius: '10px',
							padding: '0px 30px',
							'&:hover': {
								background: 'rgba(0,0,0,0.5)',
								boxShadow: 'none', 
							},
						}}
						onClick={() => setOpenTerrenoData(!openTerrenoData)}
					>
						<Typography sx={{ fontSize:'20px', m:'10px', width:'auto', textAlign:'start', color:'#fff' }}>Terreno</Typography>	
						{
							!openTerrenoData ? 
								<ArrowDropDownIcon sx={{ fontSize:'26px', width:'auto', color:'#fff' }} />
							:
								<ArrowDropUpIcon sx={{ fontSize:'26px', width:'auto', color:'#fff' }} />
						}
					</Button>
				
					<Box sx={{ width:'100%', display:openTerrenoData ? 'flex' : 'none', justifyContent:'center', alignItems:'center', flexDirection:'column', mb:'0px' }}>

						<Typography sx={{ fontSize:'24px', color:'#fff', mb:'25px' }}>
							Caracteristicas del terreno
						</Typography>

						<TableContainer component={Paper}>

							<Table sx={{ minWidth: 650 }} aria-label="simple table">

								<TableHead>
									<TableRow>
										<TableCell align="center">Frente</TableCell>
										<TableCell align="center">Fondo</TableCell>
										<TableCell align="center">Área inscrita</TableCell>
										<TableCell align="center">Posición</TableCell>
										<TableCell align="center">Área aprovechable</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{seleccionFormato && seleccionFormato.terreno ? (
										seleccionFormato.terreno.map((terreno) => (
										<TableRow key={terreno.frente} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
											<TableCell align="center">{terreno.frente}</TableCell>
											<TableCell align="center">{terreno.fondo}</TableCell>
											<TableCell align="center">{terreno.area_inscrita}</TableCell>
											<TableCell align="center">{terreno.posicion}</TableCell>
											<TableCell align="center">{terreno.area_aprovechable}</TableCell>
										</TableRow>
										))
									) : (
										<TableRow>
										<TableCell colSpan={6} align="center">
											No hay información del terreno disponible
										</TableCell>
										</TableRow>
									)}
								</TableBody>

							</Table>

						</TableContainer>

						<Typography sx={{ fontSize:'24px', color:'#fff', mb:'25px', mt:'20px' }}>
							Factores de mérito y demérito aplicables
						</Typography>

						<TableContainer component={Paper}>

							<Table sx={{ minWidth: 650 }} aria-label="simple table">

								<TableHead>
									<TableRow>
										<TableCell align="center">Frente</TableCell>
										<TableCell align="center">Fondo</TableCell>
										<TableCell align="center">Irregularidad</TableCell>
										<TableCell align="center">Área</TableCell>
										<TableCell align="center">Topografía</TableCell>
										<TableCell align="center">Posición</TableCell>
										<TableCell align="center">Restricción</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{seleccionFormato && seleccionFormato.terreno ? (
										seleccionFormato.terreno.map((terreno) => (
										<TableRow key={terreno.frente} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
											<TableCell align="center">{terreno.f_frente}</TableCell>
											<TableCell align="center">{terreno.f_fondo}</TableCell>
											<TableCell align="center">{terreno.f_irregularidad}</TableCell>
											<TableCell align="center">{terreno.f_area}</TableCell>
											<TableCell align="center">{terreno.f_topografia}</TableCell>
											<TableCell align="center">{terreno.f_posicion}</TableCell>
											<TableCell align="center">{terreno.f_restriccion}</TableCell>
										</TableRow>
										))
									) : (
										<TableRow>
										<TableCell colSpan={6} align="center">
											No hay información del terreno disponible
										</TableCell>
										</TableRow>
									)}
								</TableBody>

							</Table>

						</TableContainer>

					</Box>

				</Box>

				<Box sx={{ display:'flex', justifyContent:'center', alingItems:'center', flexDirection:'column', gap:'5px', m:'10px 0px' }}>
					
					<Button
						sx={{
							width: '100%',
							height: 'auto',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							background: 'rgba(0,0,0,0.5)',
							m: '20px 0px',
							borderRadius: '10px',
							padding: '0px 30px',
							'&:hover': {
								background: 'rgba(0,0,0,0.5)',
								boxShadow: 'none', 
							},
						}}
						onClick={() => setOpenConstruccionData(!openConstruccionData)}
					>
						<Typography sx={{ fontSize:'20px', m:'10px', width:'auto', textAlign:'start', color:'#fff' }}>Construcción</Typography>	
						{
							!openConstruccionData ? 
								<ArrowDropDownIcon sx={{ fontSize:'26px', width:'auto', color:'#fff' }} />
							:
								<ArrowDropUpIcon sx={{ fontSize:'26px', width:'auto', color:'#fff' }} />
						}
					</Button>
				
					<Box sx={{ width:'100%', display:openConstruccionData ? 'flex' : 'none', justifyContent:'center', alignItems:'center', flexDirection:'column', mb:'20px' }}>

						<Typography sx={{ fontSize:'24px', color:'#fff', mb:'25px' }}>
							Caracteristicas del las construcciones
						</Typography>

						<TableContainer component={Paper}>

							<Table sx={{ minWidth: 650 }} aria-label="simple table">

								<TableHead>
									<TableRow>
										<TableCell align="center">Tipo</TableCell>
										<TableCell align="center">Superficie de construcción</TableCell>
										<TableCell align="center">Edad</TableCell>
										<TableCell align="center">Grado de Conservación</TableCell>
										<TableCell align="center">Numero de niveles</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{seleccionFormato && seleccionFormato.construccion ? (
										seleccionFormato.construccion.map((constuccion, index) => (
										<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
											<TableCell align="center">{constuccion.tipologia_construccion}</TableCell>
											<TableCell align="center">{constuccion.construccion}</TableCell>
											<TableCell align="center">{constuccion.edad_construccion}</TableCell>
											<TableCell align="center">{constuccion.grado_conservacion}</TableCell>
											<TableCell align="center">{constuccion.niveles}</TableCell>
										</TableRow>
										))
									) : (
										<TableRow>
										<TableCell colSpan={6} align="center">
											No hay información de construcciones disponible
										</TableCell>
										</TableRow>
									)}
								</TableBody>

							</Table>

						</TableContainer>

						<Typography sx={{ fontSize:'24px', color:'#fff', mb:'25px', mt:'20px' }}>
							Factores de mérito y demérito aplicables
						</Typography>

						<TableContainer component={Paper}>

							<Table sx={{ minWidth: 650 }} aria-label="simple table">

								<TableHead>
									<TableRow>
										<TableCell align="center">Edad</TableCell>
										<TableCell align="center">Conservación</TableCell>
										<TableCell align="center">Niveles</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{seleccionFormato && seleccionFormato.construccion ? (
										seleccionFormato.construccion.map((constuccion, index) => (
										<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
											<TableCell align="center">{constuccion.f_edad}</TableCell>
											<TableCell align="center">{constuccion.f_conservacion}</TableCell>
											<TableCell align="center">{constuccion.f_niveles}</TableCell>
										</TableRow>
										))
									) : (
										<TableRow>
										<TableCell colSpan={6} align="center">
											No hay información del terreno disponible
										</TableCell>
										</TableRow>
									)}
								</TableBody>

							</Table>

						</TableContainer>

					</Box>

				</Box>

				<Box sx={{ display:'flex', justifyContent:'center', alingItems:'center', flexDirection:'column', gap:'5px', m:'10px 0px' }}>
					
					<Button
						sx={{
							width: '100%',
							height: 'auto',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							background: 'rgba(0,0,0,0.5)',
							m: '20px 0px',
							borderRadius: '10px',
							padding: '0px 30px',
							'&:hover': {
								background: 'rgba(0,0,0,0.5)',
								boxShadow: 'none', 
							},
						}}
						onClick={() => setOpenAdeudoData(!openAdeudoData)}
					>
						<Typography sx={{ fontSize:'20px', m:'10px', width:'auto', textAlign:'start', color:'#fff' }}>Valor catastral</Typography>	
						{
							!openAdeudoData ? 
								<ArrowDropDownIcon sx={{ fontSize:'26px', width:'auto', color:'#fff' }} />
							:
								<ArrowDropUpIcon sx={{ fontSize:'26px', width:'auto', color:'#fff' }} />
						}
					</Button>
					
					<Box sx={{ width:'100%', display:openAdeudoData ? 'flex' : 'none', justifyContent:'center', alignItems:'center', flexDirection:'column', mb:'20px' }}>

						<TableContainer component={Paper}>

							<Table sx={{ minWidth: 650 }} aria-label="simple table">

								<TableHead>
									<TableRow>
										<TableCell align="center">Ejercicio Fiscal</TableCell>
										<TableCell align="center">Valor catastral</TableCell>
										<TableCell align="center">Tipo de adeudo</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{seleccionFormato && seleccionFormato.adeudo ? (
										seleccionFormato.adeudo.map((constuccion, index) => (
										<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
											<TableCell align="center">{constuccion.año_adeudo}</TableCell>
											<TableCell align="center">{constuccion.adeudo}</TableCell>
											<TableCell align="center">{constuccion.tipo_adeudo}</TableCell>
										</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} align="center">
												No hay información de adeudos disponible
											</TableCell>
										</TableRow>
									)}
								</TableBody>

							</Table>

						</TableContainer>

					</Box>

				</Box>

			</Box>

		</Box>

	)

}	

Preview.propTypes = {
	preview: PropTypes.bool,  
	setPreview: PropTypes.func,
	seleccionFormato: PropTypes.object,
}

