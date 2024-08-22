import { Box, Typography, Button } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download'

const Documentos = () => {
	
	return (
		
		<Box sx={{ width:'100%', height:'auto', m:'0px', p:'0px', pb:'100px' }}>

			<Typography sx={{ fontSize:'24px' }}>Documentos / Imagenes</Typography>

			<Box sx={{ width:'100%', height:'auto', mt:'40px', display:'flex', justifyContent:'space-between', alignItems:'start', flexWrap:'wrap' }}>

				<Box sx={{ width:{ xs:'100%', md:'30%' }, height:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', flexDirection:'column', gap:'20px' }}>
					
					<Button 
						variant="outlined"                             
						color="secondary"
						sx={{ 
							width:{ xs:'100%', md:'80%' }, 
							padding:'5px 30px', 
							margin:'0', 
							minWidth:'0', 
							borderRadius:'7px',
							display:'flex', 
							justifyContent:'space-between'
						}}
					>
						Tarjeta de circulacion
						<DownloadIcon sx={{ fontSize:'24px' }} />
					</Button>

					<Button 
						variant="outlined"                             
						color="secondary"
						sx={{ 
							width:{ xs:'100%', md:'80%' }, 
							padding:'5px 30px', 
							margin:'0', 
							minWidth:'0', 
							borderRadius:'7px',
							display:'flex', 
							justifyContent:'space-between'
						}}
					>
						Factura
						<DownloadIcon sx={{ fontSize:'24px' }} />
					</Button>

					<Button 
						variant="outlined"                             
						color="secondary"
						sx={{ 
							width:{ xs:'100%', md:'80%' }, 
							padding:'5px 30px', 
							margin:'0', 
							minWidth:'0', 
							borderRadius:'7px',
							display:'flex', 
							justifyContent:'space-between'
						}}
					>
						Seguro
						<DownloadIcon sx={{ fontSize:'24px' }} />
					</Button>

					<Button 
						variant="outlined"                             
						color="secondary"
						sx={{ 
							width:{ xs:'100%', md:'80%' }, 
							padding:'5px 30px', 
							margin:'0', 
							minWidth:'0', 
							borderRadius:'7px',
							display:'flex', 
							justifyContent:'space-between'
						}}
					>
						Garantía
						<DownloadIcon sx={{ fontSize:'24px' }} />
					</Button>

				</Box>

				<Box sx={{ width:{ xs:'100%', md:'68%' }, height:'auto', display:'flex', justifyContent:{ xs:'center', md:'start' }, alignItems:{ xs:'center', md:'start' }, gap:'10px', mt:{ xs:'30px', md:'0px' }, flexDirection: { xs:'column', md:'row' } }}>

					<Box sx={{ width:'45%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
						<Typography sx={{ fontSize:'20px', width:'100%', textAlign:'center' }}>Frente</Typography>
						<Box sx={{ width:'150px', height:'150px', border:'1px solid grey', borderRadius:'10px', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center', mt:'20px', position:'relative' }}>
							<img src="https://erpp-parque-vehicular.s3.us-east-1.amazonaws.com/palancas/palancas-MOTO.jpeg" alt="" width={'100%'} height={'100%'} />
							<Button 
								sx={{
									position:'absolute',
									top:'50%',
									left:'50%',
									width:'auto',
									height:'auto',
									transform:'translate(-50%,-50%)'
								}}
							>
								<DownloadIcon sx={{ fontSize:'36px', color:'#00ff00' }} />
							</Button>
						</Box>
					</Box>

					<Box sx={{ width:'45%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
						<Typography sx={{ fontSize:'20px', width:'100%', textAlign:'center' }}>Trasera</Typography>
						<Box sx={{ width:'150px', height:'150px', border:'1px solid grey', borderRadius:'10px', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center', mt:'20px', position:'relative' }}>
							<img src="https://erpp-parque-vehicular.s3.us-east-1.amazonaws.com/palancas/palancas-MOTO.jpeg" alt="" width={'100%'} height={'100%'} />
							<Button 
								sx={{
									position:'absolute',
									top:'50%',
									left:'50%',
									width:'auto',
									height:'auto',
									transform:'translate(-50%,-50%)'
								}}
							>
								<DownloadIcon sx={{ fontSize:'36px', color:'#00ff00' }} />
							</Button>
						</Box>
					</Box>

					<Box sx={{ width:'45%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
						<Typography sx={{ fontSize:'20px', width:'100%', textAlign:'center' }}>Lado Izquierdo</Typography>
						<Box sx={{ width:'150px', height:'150px', border:'1px solid grey', borderRadius:'10px', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center', mt:'20px', position:'relative' }}>
							<img src="https://erpp-parque-vehicular.s3.us-east-1.amazonaws.com/palancas/palancas-MOTO.jpeg" alt="" width={'100%'} height={'100%'} />
							<Button 
								sx={{
									position:'absolute',
									top:'50%',
									left:'50%',
									width:'auto',
									height:'auto',
									transform:'translate(-50%,-50%)'
								}}
							>
								<DownloadIcon sx={{ fontSize:'36px', color:'#00ff00' }} />
							</Button>
						</Box>
					</Box>

					<Box sx={{ width:'45%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
						<Typography sx={{ fontSize:'20px', width:'100%', textAlign:'center' }}>Lado Derecho</Typography>
						<Box sx={{ width:'150px', height:'150px', border:'1px solid grey', borderRadius:'10px', background:'rgba(0,0,0,0.3)', overflow:'hidden', display:'flex', justifyContent:'center', mt:'20px', position:'relative' }}>
							<img src="https://erpp-parque-vehicular.s3.us-east-1.amazonaws.com/palancas/palancas-MOTO.jpeg" alt="" width={'100%'} height={'100%'} />
							<Button 
								sx={{
									position:'absolute',
									top:'50%',
									left:'50%',
									width:'auto',
									height:'auto',
									transform:'translate(-50%,-50%)'
								}}
							>
								<DownloadIcon sx={{ fontSize:'36px', color:'#00ff00' }} />
							</Button>
						</Box>
					</Box>
					
				</Box>

			</Box>

		</Box>

	)

}

export default Documentos