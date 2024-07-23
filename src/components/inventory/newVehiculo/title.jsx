import { Box, Typography, Button } from "@mui/material"
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'

const Title = ({ setAnimation }) => {

	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

	const close = () => {
		setAnimation(true)
	}

	return (

		<Box
			sx={{
				width:'100%',
				height:'auto',
				display:'flex',
				justifyContent:'space-between',
				alignItems:'center',
			}}
		>

			<Typography sx={{ color: isLightMode ? '#000' : '#fff', fontSize: '30px', fontWeight: '500' }}>
				Agregar un nuevo vehículo
			</Typography>

			<Button
				onClick={() => close()}
				sx={{ color: 'black' }}
			>
				<CloseFullscreenIcon 
					sx={{
						color: 'red',
						fontSize: '24px',
						fontWeight: '500'
					}}
				/>
			</Button>

		</Box>

	)
	
} 

Title.propTypes = {
	setAnimation: PropTypes.func.isRequired
}

export default Title