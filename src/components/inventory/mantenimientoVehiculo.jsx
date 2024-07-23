import { Box, Typography, Button } from "@mui/material"
import PropTypes from 'prop-types'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useState } from "react"

const MantenimientoVehiculo = ({ setOpenNew, setAlertClean }) => {
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'
	const [animation, setAnimation] = useState(false)

	const slideIn = 
		!animation ?
		keyframes`
			from {
				transform: translateY(110%) scale(0.1);
				opacity: 0;
			}
			to {
				transform: translateY(0) scale(1);
				opacity: 1;
			}
		` : keyframes`
			from {
				transform: translateY(0%) scale(1);
				opacity: 1;
			}
			to {
				transform: translateY(110%) scale(0.1);
				opacity: 0;
			}
		`

		const AnimatedBox = styled(Box)`
			animation: ${slideIn} 510ms ease-out;
		`

	const close = () => {
		setAnimation(true)
		setTimeout(() => {
			setOpenNew(false)
			setAlertClean(true)
		}, 500)
	}

	return (

		<Box 
			sx={{
				width: '100%',
				position: 'fixed',
				top: '0',
				left: '0',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				background: 'rgba(0,0,0,0.3)',
				zIndex: '9999',
			}}
		>
			<AnimatedBox 
				sx={{
				width: '90%',
				height: '90%',
				background: isLightMode ? '#fff' : '#17212F',
				borderRadius: '20px',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'start',
				padding: '30px',
				border: isLightMode ? '1px solid #17212F' : '2px solid #fff',
				}}
			>
				<Typography sx={{ color: isLightMode ? '#000' : '#fff', fontSize: '24px', fontWeight: '500' }}>
					Mantenimiento de vehículo
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
			</AnimatedBox>

		</Box>
	)
}

MantenimientoVehiculo.propTypes = {
	setOpenNew: PropTypes.func.isRequired, 
	setAlertClean: PropTypes.func.isRequired,
	openNew: PropTypes.bool.isRequired, 
}

export default MantenimientoVehiculo