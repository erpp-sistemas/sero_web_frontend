import { Box, useTheme, Typography } from "@mui/material";
import { useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import Slider from '../../components/Slider'
import ToolsResume from '../../components/ToolsResume'
import Hero from '../../components/Hero'
import Video from '../../assets/video/sero_space.mp4'
import { tokens } from "../../theme";
import { styles } from '../../styles'

const Index = () => {

	const user = useSelector(state => state.user)
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	return (

		<div className="m-5 rounded-md " style={{ backgroundColor: colors.primary[500] }}>

			{/* <Box sx={{ width: '100%', marginBottom: '70px' }}>

				<Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
					<Box sx={{ padding: '0 20px' }}>
						<Typography variant="h4" color={colors.grey[100]} component="div" sx={{ display: 'inline' }}>
							Bienvenido <span className='text-[#5ebfff]'>{user.name}</span>
						</Typography>
					</Box>
				</Box>

			</Box> */}


			<div className="mb-10 rounded-md flex items-center justify-center">

				<div className="w-[32%] flex justify-end">
					<div>
						<h1 className={`${styles.heroHeadText} text-white text-lg`}><span className='text-blue-300'>SISTEMA ESTRATÉGICO DE RECAUDACIÓN Y ORDENAMIENTO</span></h1>
						<p className={`${styles.heroSubText} mt-2 text-white-100`}>
							Todo nuestro equipo en campo, alimentando la plataforma en tiempo real, generando información
							para un soporte documental más robusto y certero. <br className='sm:block hidden' />
						</p>
					</div>
				</div>

				<div className="w-[60%]">
					<Hero />
				</div>

			</div>


			<Box sx={{ marginTop: '-100px', marginBottom: '30px' }}>
				<Slider />
			</Box>

			<Box sx={{ backgroundColor: colors.primary[400] }}>
				<ReactPlayer url={Video} playing={true} muted={true} width='100%' height='400px' loop={true}
					controls={true} style={{ backgroundColor: colors.primary[400] }} />
			</Box>

			<Box sx={{ marginTop: '-150px' }}>
				<ToolsResume />
			</Box>

		</div>

	)

}

export default Index





