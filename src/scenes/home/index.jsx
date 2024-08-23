import { Box, useTheme, Typography } from "@mui/material"
import ReactPlayer from 'react-player'
import Slider from '../../components/Slider'
import ToolsResume from '../../components/ToolsResume'
import Hero from '../../components/Hero'
import Video from '../../assets/video/sero_space.mp4'
import { tokens } from "../../theme"
import { styles } from '../../styles'

const Index = () => {

	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	return (

		<div className="m-5 rounded-md ">

			<Box sx={{ 
				mb:{
					xs:'0.5rem',
					md:'2.5rem'
				}, 
				margin:'20px',
				borderRadius:'0.375rem', 
				display:'flex', 
				justifyContent:'center', 
				alignItems:'center',
				flexDirection: {
					xs: 'column',
					md: 'row'      
				}, 
			}}>

				<Box sx={{ 
					width:{
						xs: '100%',
						md: '32%'  
					}, 
					display:'flex', 
					justifyContent:'center', 
					alignItems:'center',
				}}>

					<Box sx={{ 
						textAlign:{
							xs:'center',
							md:'start'
						} 
					}}>
						<Typography 
							sx={{ 
                fontSize:'1.125rem', 
                lineHeight:'1.75rem', 
                fontWeight:'800',
                textAlign:{
									xs:'center',
									md:'start'
								}
                }}
            >
              <span className='text-[#5ebfff]'>
                SISTEMA ESTRATÉGICO DE RECAUDACIÓN Y ORDENAMIENTO
              </span>
            </Typography>
						
						<Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ textAlign: 'left', pt: 1 }}
            >
							Todo nuestro equipo en campo, alimentando la plataforma en tiempo real, generando información
							para un soporte documental más robusto y certero.
						</Typography>						
					</Box>
					
				</Box>

				<Box sx={{
					width:{
						xs:'95%',
						md:'60%',
					}
				}}>
					<Hero />
				</Box>

			</Box>


			<Box 
				sx={{ 
					marginTop: '-100px', 
					marginBottom: {
						xs:'80px',
						md:'30px'
					} 
				}}
			>
				<Slider />
			</Box>

			<Box sx={{ backgroundColor: colors.primary[400] }}>
				<ReactPlayer url={Video} playing={true} muted={true} width='100%' height='400px' loop={true} controls={true} style={{ backgroundColor: colors.primary[400] }} />
			</Box>

			<Box sx={{ 
				marginTop: {
					xs:'0px',
					md:'-150px'
				},
				mb:{
					xs:'100px',
					mb:'50px'
				}
			}}>
				<ToolsResume />
			</Box>

		</div>

	)

}

export default Index





